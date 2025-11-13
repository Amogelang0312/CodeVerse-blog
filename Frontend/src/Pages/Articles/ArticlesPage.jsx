import React, { useEffect, useState } from 'react'
import './ArticlesPage.css'
import articleicon from './Images/pexels-artempodrez-7233376.jpg'
import { Link } from 'react-router-dom'

function ArticlesPage() {
  const [posts, setPosts] = useState([]);
const [topPosts, setTopPosts] = useState([]);
const [questions, setQuestions] = useState([]);
const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });

// Mock data - replace with actual API calls
useEffect(() => {
setPosts([
{ id: 1, title: 'React Hooks Best Practices', author: 'John Doe', likes: 42, comments: 12, date: '2024-01-15', content: 'Learn the best practices for using React Hooks in your projects...' },
{ id: 2, title: 'Mastering CSS Grid', author: 'Jane Smith', likes: 38, comments: 8, date: '2024-01-14', content: 'CSS Grid layout allows you to create complex responsive web design layouts more easily...' },
]);

setTopPosts([
{ id: 1, title: 'The Future of JavaScript', likes: 156 },
{ id: 2, title: 'Python vs JavaScript for Web Dev', likes: 142 },
{ id: 3, title: 'Building Scalable APIs', likes: 128 }
]);

setQuestions([
{ id: 1, title: 'How to fix this React state issue?', answers: 5, solved: false },
{ id: 2, title: 'Best database for real-time apps?', answers: 12, solved: true },
]);
}, []);

const handleCreatePost = (e) => {
e.preventDefault();
if (newPost.title && newPost.content) {
const post = {
id: posts.length + 1,
title: newPost.title,
content: newPost.content,
author: 'Current User',
likes: 0,
comments: 0,
date: new Date().toISOString().split('T')[0],
tags: newPost.tags.split(',').map(tag => tag.trim())
};
setPosts([post, ...posts]);
setNewPost({ title: '', content: '', tags: '' });
}
};
  return (
    <div className='article-icon'>
        {/* <img src='articleicon' alt='' className='article-image'></img> */}
    <div className='community-content'>
       <div className='main-content'>
        <section className='create-post-section'>
           <h2>Create a Post</h2>
          <form onSubmit={handleCreatePost}>
           <input
           type='text'placeholder='Post Title'value={newPost.title}onChange={(e) => setNewPost({...newPost, title: e.target.value})}required/>
           <textarea placeholder="What's on your mind? Share your coding insights..." value={newPost.content}onChange={(e) => setNewPost({...newPost, content: e.target.value})}required/>
            <input type='text'placeholder='Tags (comma separated: react, javascript, webdev)'value={newPost.tags}onChange={(e) => setNewPost({...newPost, tags: e.target.value})}/>
            <button type='submit'>Publish Post</button>
            <h3>To publish a post you have to be logged-in, <Link to ={'/login'}>Login now</Link></h3>
            </form>
        </section>
    <section className='post-feed'>
        <h2>
            Recent Posts
        </h2>
        {posts.map(post => (
            <div key={post.id} className='post-card'>
                <h3>
                  {post.title}
                </h3>
                <div className='post-meta'>
                    <span>
                        By {post.author}
                    </span>
                    <span>
                         {post.date}
                     </span>
                     </div>
                     <p>
                        {post.content}
                     </p>
                      <div className='post-stats'>
                         <span>👍 
                            {post.likes}
                        </span>
                         <span>💬 
                            {post.comments} 
                            comments
                        </span>
                      </div>
             </div>
      ))}
   </section>
   
</div>
   <aside className='sidebar'>
    <section className='top-posts'>
        <h3>
            🔥 Top Posts
        </h3>
        {topPosts.map(post => (
            <div key={post.id} className='sidebar-item'>
                <h4>
                    {post.title}
                </h4>
                <span>
                    👍 {post.likes}
                </span>
            </div>
        ))}
    </section>
    <section className='questions'>
        <h3>
            ❓ Questions
        </h3>
        {questions.map(question => (
            <div key={question.id} className='sidebar-item'>
                <h4>
                    {question.title}
                    </h4>
                    <div className='question-meta'>
                        <span>Answers: {question.answers}</span>
                        {question.solved && <span className='solved'>✅ Solved</span>}
                    </div>
            </div>
           ))}
    </section>
   </aside>
</div>
</div>
);}


export default ArticlesPage