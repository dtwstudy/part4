const dummy = (blogs) => {
  if (blogs.length < 1)
    return 1
}

const totalLikes = (blogs) => {
  var sumTotal = 0
  blogs.map(blog => { sumTotal += blog.likes })
  return sumTotal
}

const favoriteBlog = (blogs) => {
  var  favBlog = {}
  const maxLike = Math.max(...blogs.map(p => p.likes))
  blogs.filter(blog => { 
    if(maxLike === blog.likes) {
      favBlog  = {  title: blog.title , author: blog.author, likes: blog.likes}
    } 
})
  return favBlog

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}