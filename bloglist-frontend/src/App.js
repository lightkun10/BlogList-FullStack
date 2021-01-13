import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginNotification from './components/LoginNotification';
import BlogCreateNotification from './components/BlogCreateNotification';
import blogService from './services/blogs'
import loginService from './services/login';
import Togglable from './components/Togglable';
import AddBlogForm from './components/AddBlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );

      // console.log(user);
      blogService.setToken(user.token);
      setUser(user);
      setSuccessMessage(`Successfully logged in as ${user.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setErrorMessage(null);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception);
      setErrorMessage('Wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setSuccessMessage(null);
    }
  };

  const handleLogout = async (event) => {
    // event.preventDefault();
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
    setUser(null);
  }

  const addBlog = async ({ title, author, url }) => {    
    try {
      const blog = await blogService.createBlog({
        title, author, url,
      });
      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setErrorMessage(null);
      // Update state of App component
      setBlogs(blogs.concat(blog));
    } catch (exception) {
      console.log(exception);
      setErrorMessage(`${exception}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setSuccessMessage(null);
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>

      <LoginNotification errorMessage={errorMessage} />

      <form onSubmit={handleLogin}>
        <div>
          username 
            <input 
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}  
            />
        </div>
        <div>
          password
            <input 
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}  
            />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const addBlogForm = () => (
    <Togglable buttonLabel="new blog">
      <AddBlogForm createBlog={addBlog} />
    </Togglable>
  )

  // console.log(user);

  // If user is not logged in
  if (user === null) {
    return (
      loginForm()
    );
  };

  return (
    <div id="maincontent">
      <div className="header">
        <h2>blogs</h2>

        <BlogCreateNotification successMessage={successMessage} />

        {user.name} logged in 
        <button onClick={handleLogout}>logout</button>
      </div>

      {addBlogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
};

export default App;