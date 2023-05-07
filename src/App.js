import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import FormElement from './components/FormElement'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const loggedKey = "loggedUser"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])
  const [user, setUser] = useState(null)

  const [noti, setNoti] = useState(null)

  const blogComparator = (a,b) => b.likes - a.likes

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(blogComparator))
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(loggedKey)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const displayNoti = (message, type) => {
    setNoti({message, type})
    setTimeout(() => {
      setNoti(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        loggedKey, JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      displayNoti(exception.response.data.error, 'error')
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification info={noti}/>
      <form onSubmit={handleLogin}>
        <FormElement 
            content="username" 
            name="Username"
            type="text"
            value={username}
            onChange={setUsername}
        />
        <FormElement 
            content="password"
            name="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        <button type="submit">login</button>
      </form>
    </div>
  )

  const handleLogout = () => {
    window.localStorage.removeItem(loggedKey)
    setUser(null)
    blogService.setToken(null)
  }

  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const sentBlog = {
      ...blog,
      "likes": blog.likes + 1,
      "user": blog.user.id
    }

    try {
      let updatedBlog = await blogService.updateBlog(sentBlog)
      let newBlogs = blogs.map(b => b.id === id ? updatedBlog : b)
      newBlogs.sort(blogComparator)
      setBlogs(newBlogs)
    } catch (exception) {
      displayNoti(exception.response.data.error, 'error')
    }
  }

  const addBlog = async (newBlog) => {
    try {
      let addedBlog = await blogService.addBlog(newBlog)
      setBlogs(blogs.concat(addedBlog))
      displayNoti(`a new blog ${addedBlog.title} by ${addedBlog.author} added`, 'info')
    } catch(exception) {
      displayNoti(exception.response.data.error, 'error')
      return false
    }

    return true
  }

  const blogPage = () => (
    <div>
      <h2>blogs</h2>
      <Notification info={noti}/>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={addBlog}/>
      </Togglable>

      

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike}/>
      )}
    </div>
  )

  return (
    <div>
      { user === null 
          ? loginForm()
          : blogPage()
      }
    </div>
  )
}

export default App