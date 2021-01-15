import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateBlog = async(id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const deleteBlog = async(id) => {
  // const config = {
  // 	headers: { Authorization: token }
  // };
  // await axios.delete(`${baseUrl}/${id}`, config);

  await axios.delete(`${baseUrl}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}

export default { getAll, createBlog,
  setToken, updateBlog,
  deleteBlog,
}