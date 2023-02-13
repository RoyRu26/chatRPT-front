import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom';
import { userInfo } from '../App';

function Register() {
    const navigate = useNavigate()
    useEffect(() => {
        const isConnected = () => {
            JSON.parse(localStorage.getItem('token')) && navigate('/HomePage')
        }
        isConnected()
    }, [])
    const { user, setUser } = useContext(userInfo)
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        try {
            let res = await axios.post('http://localhost:8000/register', { email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName })
            console.log(res)
            navigate('/')
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='h-screen w-screen bg-gray-800 flex flex-col justify-center items-center'>
            <div className='h-1/3 flex flex-row items-center'>
                <img className='h-2/3' src='chatRPTlogo.png' alt='logo'></img>
                <h1 className='text-transparent font-prosto p-8 bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-400 text-7xl'>chatRPT</h1>
            </div>
            <div className='flex flex-col pb-16'>
                <form className="bg-gradient-to-r from-indigo-400 to-purple-600 shadow-md rounded-lg px-8 pt-6 pb-8 flex flex-col gap-5 justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                    <input className='px-4 rounded-md py-2' placeholder='First Name' {...register('firstName')} />
                    <input className='px-4 rounded-md py-2' placeholder='Last Name' {...register('lastName')} />
                    <input className='px-4 rounded-md py-2' placeholder='Email' {...register('email')} />
                    <input className='px-4 rounded-md py-2' placeholder='Password' {...register('password')} />
                    <button className='bg-gray-300 rounded-md w-28 py-2 text-violet-500 hover:bg-blue-200 hover:text-blue-400' type='submit'>Sign Me Up!</button>
                    <p className='text-gray-300'>Already have an account?</p>
                    <NavLink to='/'><button className='text-center text-gray-200'>Sign In</button></NavLink>
                </form>
            </div>
        </div>
    );
}

export default Register;