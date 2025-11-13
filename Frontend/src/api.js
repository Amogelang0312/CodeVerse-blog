const API_URL = 'https://codeverse-dmcl.onrender.com/api';
const getToken = () => localStorage.getItem('token');

export const api = {
 async login(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return await response.json();
},

async deletePost(postId) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  return await response.json();
},

async updatePost(postId, postData) {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('subtitle', postData.subtitle);
  formData.append('content', postData.content);
  if (postData.image) {
    formData.append('image', postData.image);
  }

  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData,
  });
  return await response.json();
},
async register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return await response.json();
},

  async createPost(postData) {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('subtitle', postData.subtitle);
    formData.append('content', postData.content);
    if (postData.image) {
      formData.append('image', postData.image);
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData,
    });
    return await response.json();
  },
  
  async getPosts() {
    const response = await fetch(`${API_URL}/posts`);
    return await response.json();
  },
  
  async getUserPosts() {
    const response = await fetch(`${API_URL}/posts/my-posts`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return await response.json();
  }
};

