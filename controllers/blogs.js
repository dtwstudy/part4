const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    }
    else {
      response.status(404).end()
    }
  }
  catch (exception) {
    next(exception)
  }

})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const params  = request.body
  const like = params.likes === null? 0 : params.likes
  const blog = new Blog({title: params.title, author: params.author ,url: params.url ,likes : like})
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = blogRouter