import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom';
import { userInfo } from '../App';

function LogIn() {
    const navigate = useNavigate()
    // useEffect(() => {
    //     const isConnected = () => {
    //         JSON.parse(localStorage.getItem('token')) && navigate('/HomePage')
    //     }
    //     isConnected()
    // }, [])
    const { user, setUser } = useContext(userInfo)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        try {
            let res = await axios.post('http://localhost:8000/login', { email: data.email, password: data.password })
            console.log(res.data.id)
            console.log(res.data.token)
            setUser({
                name: res.data.name,
                email: data.email,
                id: res.data.id
            })
            console.log(user)
            localStorage.setItem('user', JSON.stringify({ name:res.data.name, email: data.email, id: res.data.id }))
            localStorage.setItem('token', JSON.stringify(res.data.token))
            navigate('./HomePage')
        }
        catch (error) {
            console.log(error)
        }
    }
    //function that returns the average of 5 given numbers
    return (
        <div className='h-screen w-screen bg-gray-800 flex flex-col justify-center items-center'>
            <div className='h-1/3 flex flex-row items-center'>
                <img className='h-2/3' src='chatRPTlogo.png' alt='logo'></img>
                <h1 className='text-transparent font-prosto p-8 bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-400 text-7xl'>chatRPT</h1>
            </div>
            <div className='h-30 w-50 flex-col pb-12'>
                <form className="bg-gradient-to-r from-indigo-400 to-purple-600 shadow-md rounded-lg px-8 pt-6 pb-8 flex flex-col gap-5 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                    <input className='rounded-md px-4 py-2' placeholder='Email' {...register('email', { required: true, minLength: 1 })} />
                    {errors.email && errors.email.type === 'required' && <span className='text-gray-400 text-xs'>Please Enter Email</span>}
                    <input type='password' className='px-4 rounded-md py-2' placeholder='Password' {...register('password', { required: true })} />
                    {errors.password && errors.password.type === 'required' && <span className='text-gray-400 text-xs'>Please Enter Password</span>}
                    <button className='bg-gray-300 rounded-md w-20 py-2 text-violet-500 hover:bg-blue-200 hover:text-blue-400' type='submit'>Sign In</button>
                    <p className='text-gray-300'>Don't have an account?</p>
                    <NavLink to='./Register'><button className='text-center text-gray-200'>Sign Up Now</button></NavLink>
                </form>
            </div>
        </div>
    );
}
export default LogIn;