import React, { useState } from 'react'

const Blog = ({ blog, addLike }) => {
  const [detailVisible, setDetailVisible] = useState('view');

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  const handleVisibleClick = () => {
    setDetailVisible(detailVisible === 'view' ? 'hide' : 'view')
  }

  const toggleDetailView = () => (
    <div className="blog__entry__content">
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} 
        <button onClick={addLike}>like</button>
      </div>
      <div>{blog.author}</div>
    </div>
  )

  // console.log(blog)
  return (
    <div style={blogStyle} className="blog__entry">
      <div>
        {blog.title} {blog.author} <button onClick={handleVisibleClick}>{detailVisible}</button>
      </div>
        {detailVisible === 'hide' 
          ? toggleDetailView() : ''
        }
    </div>
  );
};

export default Blog
