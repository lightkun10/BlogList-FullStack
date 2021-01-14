/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/**
 * Router handling for blogs.
 */
const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

/** SECTION: Fetching all blogs from database */
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

/** SECTION: Adding a new blog to the database */
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    // 401 Unauthorized
    // https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  // If no title and url provided, response with
  // status 404 and early finish this operation.
  if (!blog.title && !blog.url) {
    return response.status(400).json({ error: 'missing url or title' });
  }

  if (!blog.likes) blog.likes = 0;

  blog.user = user;
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

/** SECTION: Deleting a blog from database */
blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken) {
    return response
      .status(401).json({ error: 'token missing or invalid' });
  }
  const toDelete = await Blog.findById(request.params.id);
  if (toDelete === null) {
    // decision: 204 or 404?
    return response.status(204).end();
  }
  if (!toDelete.user
    || toDelete.user.toString() !== decodedToken.id.toString()) {
    return response
      .status(401).json({ error: 'you have no access to this entry' });
  }
  await toDelete.remove();
  response.status(204).end();
});

/** SECTION: Updating a blog likes from database */
blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, body, { new: true },
  );

  response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
