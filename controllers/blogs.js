const blogRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
  const params = request.body
  const user = await User.findById(params.userId)
  const like = params.likes === null ? 0 : params.likes
  const blog = new Blog({ title: params.title, author: params.author, url: params.url, likes: like ,user:user})
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
  catch (exception) {
    next(exception)
  }
})

blogRouter.put('/:id', async (req, res, next) => {
  const blogUpdated = await Blog.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true })
  try {
    if (blogUpdated) {
      res.json(blogUpdated)
    }
    else {
      res.status(404).end()
    }
  }
  catch (exception) {
    next(exception)
  }

})

blogRouter.delete('/', async (request, response, next) => {
  try {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  }
  catch (exception) {
    next(exception)
  }


})

module.exports = blogRouter