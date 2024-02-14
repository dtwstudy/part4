const Blog = require('../models/blog')
const initialBlogs = [
  {
    'title': 'Demos',
    'author': 'Stack11',
    'url': 'http://localhost:3001/api/blogs/',
    'likes': 20,
    'id': '65cb8d9c4919239c3029efdf'
},
{
    'title': 'Demos2',
    'author': 'Stack11',
    'url': 'http://localhost:3001/api/blogs/',
    'likes': 5,
    'id': '65cb8da44919239c3029efe1'
},
{
    'title': 'Demos3',
    'author': 'Stack11',
    'url': 'http://localhost:3001/api/blogs/',
    'likes': 5,
    'id': '65cb8da94919239c3029efe3'
}
]

const nonExistingAttr = async () => {
  const blog = new Blog({ author:'Stack15', likes: '25'})
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const existingId  = async (id) => {
  const blog = await Blog.findById(id)
  return blog
}


module.exports = {
  initialBlogs, nonExistingAttr, blogsInDb , existingId
}