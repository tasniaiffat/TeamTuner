import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function SignupBody(){

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        reg_number: '',
        session: '',
        department: '',
        cf_handle: '',
        codechef_handle: '',
        atcoder_handle: '',
        vjudge_handle: ''
    });

    const navigate = useNavigate()

    async function handleSubmit(event){
        console.log('Form Data:', formData);
        event.preventDefault();
        try {
            console.log('Form Data:', formData);
            if (formData.password !== formData.confirm_password) {
                toast.error('Passwords do not match');
                return;
            }

            const { confirm_password, ...formDataWithoutConfirmPassword } = formData;
            

            const response = await fetch('http://127.0.0.1:8000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataWithoutConfirmPassword)
            });
            
            

            if (!response.ok) {
                throw new Error('Failed to create user account');
            }
            
            toast.success('User account created successfully');
            
            navigate('./login');

        } catch (error) {
            console.error('Error:', error);
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
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name: </label>
                    <input type="text" id="FirstName" placeholder="Farhan" name = "first_name" value={formData.first_name} onChange={handleChange} required />
                </div>

                <div>
                    <label>Last Name: </label>
                    <input type="text" id="LastName" placeholder="Rahman" name = "last_name" value={formData.last_name} onChange={handleChange} required />
                </div>

                <div>
                    <label>Email: </label>
                    <input type="email" id="Email" placeholder="farhan@gmail.com" name = "email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                    <label>Registration Number: </label>
                    <input type="text" id="RegNo" placeholder="2020215666" name = "reg_number" value={formData.reg_number} onChange={handleChange} required />
                </div>

                <div>
                    <label>Department: </label>
                    <input type="text" id="Dept" placeholder="CSE" name = "department" value={formData.department} onChange={handleChange} required />
                </div>

                <div>
                    <label>Session: </label>
                    <input type="text" id="Session" placeholder="2020-21" name = "session" value={formData.session} onChange={handleChange} required />
                </div>

                <div>
                    <label>Password: </label>
                    <input type="password" id="Password" name = "password" value={formData.password} onChange={handleChange} required minLength="8" />
                </div>

                <div>
                    <label>Confirm Password: </label>
                    <input type="password" id="Confirm" name = "confirm_password" value={formData.confirm_password} onChange={handleChange} required minLength="8" />
                </div>

                <div>
                    <label>Codeforces Handle: </label>
                    <input type="text" id="CfHandle" name = "cf_handle" value={formData.cf_handle} onChange={handleChange} required />
                </div>

                <div>
                    <label>Codechef Handle: </label>
                    <input type="text" id="CCHandle" name = "codechef_handle" value={formData.codechef_handle} onChange={handleChange} required />
                </div>

                <div>
                    <label>AtCoder Handle: </label>
                    <input type="text" id="AtcoderHandle" name = "atcoder_handle" value={formData.atcoder_handle} onChange={handleChange} required />
                </div>

                <div>
                    <label>Vjudge Handle: </label>
                    <input type="text" id="VjudgeHandle" name = "vjudge_handle" value={formData.vjudge_handle} onChange={handleChange} required />
                </div>
                <input type="submit" />
            </form>
        </div>  
    );
}

export default SignupBody;
