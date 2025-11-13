import React, { useState } from 'react'
import './CommunityPage.css'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api';

function CommunityPage() {
  console.log('community is rendering')
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-posts')
    const [newPost, setNewPost] = useState({
    title: '',
    subtitle: '', 
    content: '',
    image: null
  });
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    subtitle: '', 
    content: '',
    image: null
  });
  const [posts, setPosts] = useState([]);
  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log('Loading posts from database...');
        const response = await fetch('http://localhost:5000/api/posts');
        const result = await response.json();
        
        console.log('All posts from API:', result);
        
        if (result.posts) {
          const userPosts = result.posts.filter(post => 
            post.author && post.author._id === '691472eb1c833529495b4920'
          );
          
          console.log('Your posts:', userPosts);
          setPosts(userPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts([]);
      }
    };
    
    loadPosts();
  }, []);

const [communityPosts, setCommunityPosts] = useState([
  {
    id: 101,
    title: 'Advanced React Patterns',
    subtitle: 'Master compound components and render props',
    content: 'In this comprehensive guide, we explore advanced React patterns that will take your skills to the next level. Learn how to build flexible, reusable components.',
    author: 'Sarah Chen',
    date: '2024-01-16',
    likes: 89,
    comments: 23,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop'
  },
  {
    id: 102,
    title: 'CSS Grid vs Flexbox',
    subtitle: 'The ultimate layout comparison guide',
    content: 'When should you use CSS Grid and when is Flexbox the better choice? This in-depth comparison covers everything from basic use cases to complex layout scenarios.',
    author: 'Mike Rodriguez',
    date: '2024-01-15',
    likes: 64,
    comments: 18,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop'
  }
])
 const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value
    });
  };

const handleImageChange = (e) => {
  console.log('=== FILE INPUT DEBUG ===');
  console.log('Event target:', e.target);
  console.log('Files array:', e.target.files);
  console.log('First file:', e.target.files[0]);
  console.log('File name:', e.target.files[0]?.name);
  console.log('File type:', e.target.files[0]?.type);
  console.log('File size:', e.target.files[0]?.size);
  
  if (e.target.files[0]) {
    setNewPost({
      ...newPost,
      image: e.target.files[0]
    });
    console.log('Image set in state');
  } else {
    console.log('No file selected');
  }
};

const handleSubmitPost = async (e) => { e.preventDefault();
  console.log('Frontend - Submitting post:', newPost);
  console.log('Frontend - Image file:', newPost.image);
  
  if (!newPost.title || !newPost.content) {
    alert('Please fill in title and content');
    return;
  }
  
  try {
    const result = await api.createPost(newPost);
    console.log('Frontend - API response:', result);
    
    if (result.message === 'Post created successfully') {
      const createdPost = {
        id: result.post._id || Date.now(),
        title: result.post.title || newPost.title,
        subtitle: result.post.subtitle || newPost.subtitle,
        content: result.post.content || newPost.content,
        image: result.post.imageUrl, 
        date: result.post.date || new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0
      };
      
      setPosts([createdPost, ...posts]);
      setNewPost({ title: '', subtitle: '', content: '', image: null });
      alert('Post published successfully!');
    } else {
      alert(result.message || 'Failed to create post');
    }
  } catch (error) {
    console.error('Frontend - Error creating post:', error);
    alert('Error publishing post: ' + error.message);
  }
};
const handleDeletePost = async (postId) => {
  if (!window.confirm('Are you sure you want to delete this post?')) {
    return;
  }
  try {
    console.log('Deleting post:', postId);
    const result = await api.deletePost(postId);
    
    if (result.message === 'Post deleted successfully') {
      setPosts(posts.filter(post => post._id !== postId));
      alert('Post deleted successfully!');
    } else {
      alert(result.message || 'Failed to delete post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Error deleting post');
  }
};
const handleEditClick = (post) => {
  setEditingPost(post._id);
  setEditFormData({
    title: post.title,
    subtitle: post.subtitle || '',
    content: post.content,
    image: null
  });
};

const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  setEditFormData({
    ...editFormData,
    [name]: value
  });
};

const handleEditImageChange = (e) => {
  setEditFormData({
    ...editEditFormData,
    image: e.target.files[0]
  });
};

const handleEditSubmit = async (e) => {
  e.preventDefault();
  
  try {
    console.log('Updating post:', editingPost);
    const result = await api.updatePost(editingPost, editFormData);
    
    if (result.message === 'Post updated successfully') {
      setPosts(posts.map(post => 
        post._id === editingPost ? result.post : post
      ));

      setEditingPost(null);
      setEditFormData({ title: '', subtitle: '', content: '', image: null });
      alert('Post updated successfully!');
    }
  } catch (error) {
    console.error('Error updating post:', error);
    alert('Error updating post');
  }
};

const handleCancelEdit = () => {
  setEditingPost(null);
  setEditFormData({ title: '', subtitle: '', content: '', image: null });
};
  return (
    <div className="community-container">
      <div className="community-tabs">
        <button
          className={`tab ${activeTab === 'my-posts' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('my-posts')}
        >
          My Posts ({posts.length})
        </button>
        <button
          className={`tab ${activeTab === 'community-feed' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('community-feed')}
        >
          Community Feed ({communityPosts.length})
        </button>
      </div>

      <div className="tab-content">
       {activeTab === 'my-posts' && (
       <div className="my-posts-view">
      <section className="create-post-section">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmitPost}>
          <input type="text" name='title' placeholder="Post Title"value={newPost.title}onChange={handleInputChange} />
          <input type="text"name='subtitle' placeholder="Subtitle"value={newPost.subtitle}onChange={handleInputChange} />
          <textarea name='content' placeholder="Write your content..." rows="6" value={newPost.content}onChange={handleInputChange}></textarea>
          <div className="form-group">
           <label>Upload Image</label>
           <br/>
            <input type="file" name='image' accept="image/*" onChange={handleImageChange}/>
         </div>
             <div className='submit-post'>
              <button type="submit">Publish Post</button>
             </div> 
            <div className="logout-section">
              <button onClick={handleLogout} className="logout-btn">
               Logout
             </button>
              </div>
          </form>
    </section>
   <section className="posts-list">
  <h2>My Posts</h2>
  <div className="posts-grid">
    {posts.map(post => (
      <div key={post.id} className="post-card">
        {post.imageUrl && (
          <div className="post-image">
            <img src={post.imageUrl} alt={post.title} />
          </div>
        )}
        <div className="post-content">
          {editingPost === post._id ? (
            <div className="edit-modal-overlay">
    <div className="edit-modal">
      <h3>Edit Post</h3>
            <form onSubmit={handleEditSubmit}>
              <input 
                type="text" 
                name="title"
                placeholder="Post Title" 
                value={editFormData.title}
                onChange={handleEditInputChange}
              />
              <input 
                type="text" 
                name="subtitle"
                placeholder="Subtitle" 
                value={editFormData.subtitle}
                onChange={handleEditInputChange}
              />
              <textarea 
                name="content"
                placeholder="Write your content..." 
                rows="6"
                value={editFormData.content}
                onChange={handleEditInputChange}
              ></textarea>
              <div className="form-group">
                <label>Update Image (optional)</label>
                <br/>
                <input 
                  type="file" 
                  name="image"
                  accept="image/*" 
                  onChange={handleEditImageChange}
                />
              </div>
              <div className="post-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
            </div>
            </div>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p className="subtitle">{post.subtitle}</p>
              <p>{post.content}</p>
              <div className="post-meta">
                <span>📅 {post.date || new Date(post.createdAt).toLocaleDateString()}</span>
                <span>👍 {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
              <div className="post-actions">
                <button onClick={() => handleEditClick(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                <button>Share</button>
              </div>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
</section>
  </div>
)}
{activeTab === 'community-feed' && (
  <div className="community-feed-view">
    <h2>Community Feed</h2>
    <div className="community-grid">
          <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      {communityPosts.map(post => (
        <div key={post.id || post.id} className="post-card">
          <div className="post-header">
            <span className="author-badge">By {post.author}</span>
          </div>
          {post.image && (
            <div className="post-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}
          <div className="post-content">
            <h3>{post.title}</h3>
            <p className="subtitle">{post.subtitle}</p>
            <p className="post-excerpt">{post.content.substring(0, 120)}...</p>
            <div className="post-meta">
              <span>📅 {post.date}</span>
              <span>👍 {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
            <div className="post-actions">
              <button>Like</button>
              <button>Comment</button>
              <button>Share</button>
              <button className="save-btn">Save</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  )
}

export default CommunityPage