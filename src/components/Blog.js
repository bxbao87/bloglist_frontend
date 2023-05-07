import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, username }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onClickLike = () => {
    handleLike(blog.id)
  }

  const onClickRemove = () => {
    handleRemove(blog.id)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button> </div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={onClickLike}>like</button> </div>
        <div>{blog.user && blog.user.name}</div>
        { blog.user.username === username && <button onClick={onClickRemove}>remove</button> }
      </div>
    </div>
  )
}

export default Blog