import React from 'react'
import './SignupPage.css'
import { Link } from 'react-router-dom'
import{ useNavigate } from 'react-router-dom'
import {api} from '../../api'
import { useState } from 'react'

function SignupPage() {
  const [formData, setFormData] = useState({
    name:'',
    surname:'',
    username:'',
    email:'',
    password:''
    });
    const navigate = useNavigate();
    console.log('===signup rendered===')
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('===form submitted===');
        console.log('form data:', formData)
        try {
            const result = await api.register(formData);
            
            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                alert('Registration successful!');
                navigate('/');
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            alert('Error during registration');
        }
      }
  return (
    <form className='signup-container'>
        <div className="signup-form-container" onSubmit={handleSubmit}>
            <div>
            <label>Name:</label>
            <input type="text" name="name" placeholder='enter your name'value={formData.name} onChange={handleChange}required />
            </div>
            <div>
            <label>Surname:</label>
            <input type="text" name='surname' placeholder='enter your surname' value={formData.surname} onChange={handleChange}required/>
            </div>
            <div>
            <label>Username:</label>
            <input type="text" name="username"placeholder='enter your username'value={formData.username} onChange={handleChange}required />
            </div>
            <div>
            <label>Email:</label>
            <input type="email" name='email' placeholder='enter your email'value={formData.email} onChange={handleChange} required />
            </div>
            <div>
            <label>Password:</label>
            <input type="password" name='password' placeholder='enter your password'value={formData.password} onChange={handleChange} required />
            </div>
            <div className="signup-btn-container">
            <button type='submit'onClick={handleSubmit}>Signup</button>
            </div>
            <div className='acc-container'>
            <h4>Already have an account? <Link to ={'/login'}>Login now</Link></h4>
            </div>
        </div>
    </form>
  )
}

export default SignupPage