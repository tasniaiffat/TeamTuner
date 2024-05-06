import React,{ useState } from 'react';
import './Login.css';
import { BiSolidUserCircle } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate=useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    async function handleSubmit(event) {
        console.log(formData)
        const SendformData = formData
        console.log(SendformData)
        event.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(SendformData)
            });

            
            if (!response.ok) {
                throw new Error('Email and Password Do Not Match');
            }
    
            const data = await response.json();
            console.log(data); // Log success message or handle response as needed
    
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message); // Display error message using toast notification
        }
    };
    
    async function handleChange (event){
        console.log(formData)
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    async function handleRegisterLink(event){
        console.log('User does not have an account');
        navigate('..');
    }
  return (
    <>
    <div className='wrapper'>
        <form onSubmit={handleSubmit}>
            <Header/>
            <h2>Login</h2>
            <div className="input-box">
                <BiSolidUserCircle className='icon'/>
            <input type="email" id="Email" placeholder="Email" name = "email" value={formData.email} onChange={handleChange} required />
                </div>
        
            <div className="input-box">
                <FaLock className='icon'/>
                <input type="password" id="Password" name = "password" value={formData.password} onChange={handleChange} required minLength="8" />
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox"></input>Remember Me</label>
                <a href='#'>Forgot Password?</a>
            </div>
            <button type='submit'>Login</button>
            <div className='register-link' onClick={handleRegisterLink}>
                <p>Don't have an account? <a href='#'>Register</a></p>
            </div>
        </form>
    </div>
    </>
  )
}

export default Login;