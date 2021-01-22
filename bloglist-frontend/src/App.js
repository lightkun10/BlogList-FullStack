import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginNotification from './components/LoginNotification'
import BlogCreateNotification from './components/BlogCreateNotification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import AddBlogForm from './components/AddBlogForm'

const sortByLikes = (blogs) => blogs.sort((a, b) => b.likes - a.likes)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortByLikes(blogs))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      // console.log(user);
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage(`Successfully logged in as ${user.name}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setErrorMessage(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setSuccessMessage(null)
    }
  }

  const handleLogout = async () => {
    // event.preventDefault();
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleAddBlog = async ({ title, author, url }) => {
    try {
      const blog = await blogService.createBlog({
        title, author, url,
      })
      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setErrorMessage(null)
      // Update state of App component
      setBlogs(sortByLikes(blogs.concat(blog)))
    } catch (exception) {
      console.log(exception)
      setErrorMessage(`${exception}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setSuccessMessage(null)
    }
  }

  const handleLike = async (blog) => {
    const blogId = blog.id
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    try {
      const updated = await blogService.updateBlog(blogId, updatedBlog)
      // Update state of App component
      setBlogs(sortByLikes(blogs.map((blog) => blog.id !== blogId ? blog : updated)))
    } catch(exception) {
      console.log(exception)
      setErrorMessage(`Successfully ${exception}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setSuccessMessage(null)
    }
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }
    const id = blog.id

    try {
      await blogService.deleteBlog(id)
      setSuccessMessage(`Deleted ${blog.title} by ${blog.author}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setErrorMessage(null)
      // Update state of App component
      setBlogs(sortByLikes(blogs.filter((blog) => blog.id !== id)))
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>

      <LoginNotification errorMessage={errorMessage} />

      <form className="login__form" onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button className="login__form__submit" 
          type="submit">login
        </button>
      </form>
    </div>
  )

  const addBlogForm = () => (
    <Togglable buttonLabel="new blog">
      <AddBlogForm createBlog={handleAddBlog} />
    </Togglable>
  )

  // console.log(user);

  // If user is not logged in
  if (user === null) {
    return (
      loginForm()
    )
  }

  // console.log(blogs);

  return (
    <div id="maincontent">
      <div className="header">
        <h2>blogs</h2>

        <BlogCreateNotification successMessage={successMessage} />

        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      {addBlogForm()}

      {blogs.map((blog) =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => handleLike(blog)}
          onDelete={
            blog.user && blog.user.username === user.username ?
              () => handleDelete(blog) :
              null
          }
        />
      )}
    </div>
  )
}

export default App