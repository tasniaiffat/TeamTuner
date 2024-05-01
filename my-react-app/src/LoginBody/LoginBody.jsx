import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginBody(){

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

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input type="email" id="Email" placeholder="farhan@gmail.com" name = "email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                    <label>Password: </label>
                    <input type="password" id="Password" name = "password" value={formData.password} onChange={handleChange} required minLength="8" />
                </div>

                <input type="submit" />
            </form>
        </div>  
    );
}

export default LoginBody;
