const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blog are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('exiting id in db ', async () => {
  const response = await api.get('/api/blogs')
  const blog = await helper.existingId(response.body[0].id)
  expect(blog._id).toBeDefined()
})



test('saved new blog', async () => {
  const newBlog = {title:'Demos44', author:'Stack15' ,url: 'http://localhost:3001/api/blogs/', likes: '3'}

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents).toContain(
    'Demos44'
  )
})

test('blog without likes is not added', async () => {
  const newBlog = { 'title': 'Demos35','author': 'Stack11', 'url': 'http://localhost:3001/api/blogs/','id': '65cb8da94919239c3029efe3'}
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length+1)
})

test('blog without title and url is not added', async () => {
  const newBlog = new Blog({ author:'Stack15', likes: '25'})
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length+1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
