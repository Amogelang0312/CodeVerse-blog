import React from 'react'
import './LoginPage.css'
import { Link } from 'react-router-dom'
import{ useNavigate } from 'react-router-dom'
import {api} from '../../api'
import { useState } from 'react'

function LoginPage() {
  const [formData, setFormData] = useState({
        email:'',
        password:''
    });
    const navigate = useNavigate();
    console.log('===login rendered===')
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting login with:', formData);
  try {
    const result = await api.login(formData);
    console.log('Login response:', result);
    
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      alert('Login successful!');
      navigate('/community');
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error); 
    alert('Error during login: ' + error.message);
  }
};
    
  return (
    <div className="login-container">
        <form className='login-form-container' onSubmit={handleSubmit}>
            <div>
            <label>Email:</label>
            <input type="email" name='email' placeholder='enter your email' value={formData.email} onChange={handleChange} required/>
            </div>
            <div>
            <label>Password:</label>
            <input type="password"name='password' placeholder='enter your password'value={formData.password} onChange={handleChange} required/>
            </div>
            <br/>
            <div className="login-btn-container">
            <button type='submit'>Login</button>
            </div>
            <br/>
            <div className='no-acc-container'>
            <h4>Don't have an account? <Link to ={'/signup'}>Signup now</Link></h4>
            </div>
        </form>
    </div>
  )
}

export default LoginPage