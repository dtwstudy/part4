const dummy = (blogs) => {
  if (blogs.length < 1)
    return 1
}

const totalLikes = (blogs) => {
  var sumTotal = 0
  blogs.map(blog => { sumTotal += blog.likes })
  return sumTotal
}

module.exports = {
  dummy,
  totalLikes
}