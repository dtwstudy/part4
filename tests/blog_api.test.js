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

describe('api request index , post ,delete , put', () => {
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
    const newBlog = { title: 'new blog post', author: 'Stack15', url: 'http://localhost:3001/api/blogs/', likes: '3' }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'new blog post'
    )
  })

  test('blog updated', async () => {
    const id = helper.initialBlogs[0]._id
    const title = { 'title' : 'Title updated test' }
    const response = await api.put('/api/blogs/' + id).send(title).expect('Content-Type', /application\/json/)
    expect(response.body.title).not.toBe(helper.initialBlogs[0].title)
  })

  test('blog delete by id', async () => {
    const id = helper.initialBlogs[1]._id
    await api.delete('/api/blogs/' + id).expect(204)
    const deletedBlog  = await helper.blogsInDb()
    expect(deletedBlog).toHaveLength(helper.initialBlogs.length - 1)
  })

  test('blog without likes is not added', async () => {
    const newBlog = { 'title': 'Like added', 'author': 'Stack11', 'url': 'http://localhost:3001/api/blogs/' }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  })

  // test('blog without title and url is not added', async () => {
  //   const newBlog = new Blog({ author: 'Attribute', likes: '25' })
  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(400)

  //   const blogAtEnd = await helper.blogsInDb()
  //   expect(blogAtEnd).toHaveLength(helper.initialNotes.length)
  // })
})
afterAll(async () => {
  await mongoose.connection.close()
})
