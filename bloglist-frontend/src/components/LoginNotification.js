import React from 'react'

const LoginNotification = ({ errorMessage }) => {
  if (errorMessage === null) return null

  return (
    <div className="error">
      {errorMessage}
    </div>
  )
}

export default LoginNotification
