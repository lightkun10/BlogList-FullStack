import React from 'react'

const BlogCreateNotification = ({ successMessage }) => {
  if (successMessage === null) return null

  return (
    <div className="success">
      {successMessage}
    </div>
  )
}

export default BlogCreateNotification
