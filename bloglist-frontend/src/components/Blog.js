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
    <div className="blog__entry__content__detail">
      <div className="blog__entry__content__detail__url">
        {blog.url}
      </div>
      <div className="blog__entry__content__detail__likes">
        likes <span className="likesAmount">{blog.likes}</span>
        <button
          className="blog__entry__content__detail__likes__button"
          onClick={addLike}>
          like
        </button>
      </div>
      <div className="blog__entry__content__detail__author">
        {blog.author}
      </div>
      <div className="blog__entry__content__detail__deletebutton">
        {onDelete ?
          <button id="deleteButton" onClick={onDelete}>remove</button> :
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
          id="detailButton"
          className="blog__entry__button__toggledetail"
          onClick={handleVisibleClick}>{detailVisible}
        </button>

        {detailVisible === 'hide'
        ? toggleDetailView() : ''
        }
      </div>
      
    </div>
  )
}

export default Blog
