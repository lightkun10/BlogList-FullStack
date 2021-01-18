import React, { useState } from 'react'

const Blog = ({ blog, addLike, onDelete }) => {
  const [detailVisible, setDetailVisible] = useState('view')

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
    <div className="blog__entry__detail">
      <div className="blog__entry__detail__url">
        {blog.url}
      </div>
      <div className="blog__entry__detail__likes">
        likes {blog.likes}
        <button onClick={addLike}>like</button>
      </div>
      <div className="blog__entry__detail__author">
        {blog.author}
      </div>
      <div className="blog__entry__detail__deletebutton">
        {onDelete ?
          <button onClick={onDelete}>remove</button> :
          ''
        }
      </div>
    </div>
  )

  // console.log(blog)
  return (
    <div style={blogStyle} className="blog__entry">
      <div className="blog__entry__content">
        <div className='blog__entry__content__title'>
          {blog.title}
        </div>
        <div className='blog__entry__content__author'>
          {blog.author}
        </div>
        <button
          className="blog__entry__toggledetail"
          onClick={handleVisibleClick}>{detailVisible}
        </button>
      </div>
      {detailVisible === 'hide'
        ? toggleDetailView() : ''
      }
    </div>
  )
}

export default Blog
