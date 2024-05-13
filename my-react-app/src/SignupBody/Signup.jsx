import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Signup.css'

function Signup(){

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
            
            navigate("/");

        } catch (error) {
            console.error('Error:', error);
        }

        //testing. delete the following line later
        navigate("/");
    };

    async function handleChange (event){
        console.log(formData)
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      async function handleLoginLink(event){
        console.log('User already has an account');
        navigate("/");
        // event.preventDefault();
        // try {
        //     console.log('Form Data:', formData);
        //     if (formData.password !== formData.confirm_password) {
        //         toast.error('Passwords do not match');
        //         return;
        //     }

        //     const { confirm_password, ...formDataWithoutConfirmPassword } = formData;
            

        //     const response = await fetch('http://127.0.0.1:8000/', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(formDataWithoutConfirmPassword)
        //     });
            
            

        //     if (!response.ok) {
        //         throw new Error('Failed to create user account');
        //     }
            
        //     toast.success('User account created successfully');
            
        //     navigate('./login');

        // } catch (error) {
        //     console.error('Error:', error);
        // }

        // //testing. delete the following line later
        // navigate('./login');
    };

    return (
        <>
        <div className='wrapper'>
            <Header/>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    {/* <label>First Name: </label> */}
                    <input type="text" id="FirstName" placeholder="First Name" name = "first_name" value={formData.first_name} onChange={handleChange} required />
                    {/* <input type="text" id="LastName" placeholder="Last Name" name = "last_name" value={formData.last_name} onChange={handleChange} required /> */}
                </div>

                <div className="input-box">
                    {/* <label>Last Name: </label> */}
                    <input type="text" id="LastName" placeholder="Last Name" name = "last_name" value={formData.last_name} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>Email: </label> */}
                    <input type="email" id="Email" placeholder="Email Address" name = "email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>Registration Number: </label> */}
                    <input type="text" id="RegNo" placeholder="Registration Number e.g. 2020415637" name = "reg_number" value={formData.reg_number} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>Department: </label> */}
                    <input type="text" id="Dept" placeholder="Department e.g. CSE" name = "department" value={formData.department} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>Session: </label> */}
                    <input type="text" id="Session" placeholder="Session e.g 2020-21" name = "session" value={formData.session} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>Password: </label> */}
                    <input type="password" id="Password" placeholder= "Set Password" name = "password" value={formData.password} onChange={handleChange} required minLength="8" />
                </div>

                <div className="input-box">
                    {/* <label>Confirm Password: </label> */}
                    <input type="password" id="Confirm" placeholder= "Confirm Password" name = "confirm_password" value={formData.confirm_password} onChange={handleChange} required minLength="8" />
                </div>

                <div className="input-box">
                    {/* <label>Codeforces Handle: </label> */}
                    <input type="text" id="CfHandle" placeholder= "Codeforces Handle" name = "cf_handle" value={formData.cf_handle} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>Codechef Handle: </label> */}
                    <input type="text" id="CCHandle" placeholder= "Codechef Handle" name = "codechef_handle" value={formData.codechef_handle} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>AtCoder Handle: </label> */}
                    <input type="text" id="AtcoderHandle" placeholder= "Atcoder Handle" name = "atcoder_handle" value={formData.atcoder_handle} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    {/* <label>Vjudge Handle: </label> */}
                    <input type="text" id="VjudgeHandle" placeholder= "Vjudge Handle" name = "vjudge_handle" value={formData.vjudge_handle} onChange={handleChange} required />
                </div>
                <button type='submit'>Sign Up</button>
                <div className='login-link' onClick={handleLoginLink}>
                <p>Already have an account? <a href='#'>Login</a></p>
            </div>
            </form>
        </div> 
        </> 
    );
}

export default Signup;
