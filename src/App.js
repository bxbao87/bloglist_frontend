import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import FormElement from './components/FormElement'
import blogService from './services/blogs'
import loginService from './services/login'

const loggedKey = "loggedUser"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
      console.error(exception)
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
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

  if (user === null) {
    return loginForm()
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem(loggedKey)
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }
    
    try {
      let addedBlog = await blogService.addBlog(newBlog)
      setBlogs(blogs.concat(addedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch(exception) {
      console.error(exception)
    }
  }


  const blogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <FormElement
          content="title:"
          name="title"
          type="text"
          value={title}
          onChange={setTitle}
        />
        <FormElement
          content="author:"
          name="author"
          type="text"
          value={author}
          onChange={setAuthor}
        />
        <FormElement
          content="url:"
          name="title"
          type="text"
          value={url}
          onChange={setUrl}
        />
        <button type="submit">create</button>
      </form>
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      {blogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App