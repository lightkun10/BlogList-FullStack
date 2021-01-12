import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginNotification from './components/LoginNotification';
import BlogCreateNotification from './components/BlogCreateNotification';
import blogService from './services/blogs'
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

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
    console.log('logout');
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
    setUser(null);
  }

  const handleBlogCreate = async (event) => {
    event.preventDefault();
    
    try {
      const blog = await blogService.createBlog({
        title, author, url,
      });
      console.log('blog created!');
      // Update notification
      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setErrorMessage(null);
      // Update state of App component
      setBlogs(blogs.concat(blog));
      setTitle('');
      setAuthor('');
      setUrl('');
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

  const createBlogForm = () => (
    <div>
      <h2>create new</h2>
        <form onSubmit={handleBlogCreate}>
          <div>
            title:
              <input 
                type="text"
                value={title}
                name="Title"
                onChange={({ target }) => setTitle(target.value)}
              />
          </div>
          <div>
            author:
              <input 
                type="text"
                value={author}
                name="Author"
                onChange={({ target }) => setAuthor(target.value)}
              />
          </div>
          <div>
            url:
              <input 
                type="text"
                value={url}
                name="Url"
                onChange={({ target }) => setUrl(target.value)}
              />
          </div>
          <button>create</button>
        </form>
      </div>
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

      {createBlogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
};

export default App;