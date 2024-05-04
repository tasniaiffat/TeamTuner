import React from 'react';
import './Login.css';
import { BiSolidUserCircle } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import Header from '../Header/Header';

const Login = () => {
  return (
    <>
    <Header></Header>
    <div className='wrapper'>
        <form action ="">
            <h1>Login</h1>
            <div className="input-box">
                <BiSolidUserCircle className='icon'/>
                <input type="text" placeholder='Username' required></input>
            </div>
            <div className="input-box">
                <FaLock className='icon'/>
                <input type="password" placeholder='Password' required></input>
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox"></input>Remember Me</label>
                <a href='#'>Forgot Password?</a>
            </div>
            <button type='submit'>Login</button>
            <div className='register-link'>
                <p>Don't have an account? <a href='#'>Register</a></p>
            </div>
        </form>
    </div>
    </>
  )
}

export default Login;