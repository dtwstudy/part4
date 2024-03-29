const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
// const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
require('dotenv').config()




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

    const user = request.user
    if (!request.token) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
    else {
      response.status(400).json({ 'error': 'userId different blogId' })
    }

  } catch (exception) {
    next(exception)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const params = request.body

  if (!request.token) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // const anyUsers = await User.find({})
  const user = request.user

  const like = params.likes === null ? 0 : params.likes
  const blog = new Blog({ title: params.title, author: params.author, url: params.url, likes: like, user: user._id })
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
    if (!request.token) {
      return response.status(401).json({ error: 'token invalid' })
    }
    // fix
    const blog = await Blog.findById(request.params.id)
    if (blog.user) {
      if (blog.user.toString() === request.user.id.toString()) {
        const id = request.params.id

        await Blog.findByIdAndDelete(id)
        response.status(204).end()
      }
      else {

        response.status(400).json({ error: ' not deleted' })
      }
    }

  }
  catch (exception) {
    next(exception)
  }


})

module.exports = blogRouter