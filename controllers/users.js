const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  if (password.length < 3) response.status(400).json({ 'error': 'password or username must be less than 3 symbol' })
  try {
    const user = new User({
      username,
      name,
      passwordHash,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
  catch (exception) {
    next(exception)
}

})

module.exports = usersRouter