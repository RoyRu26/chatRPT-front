import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { userInfo } from '../App';
import { socket } from '../App';

function CreateRoom(props) {
    const { user } = useContext(userInfo)
    const [participant, setParticipant] = useState('')
    const [parArr, setParArr] = useState([])
    const { register, handleSubmit, reset } = useForm();
    useEffect(() => {
        setParArr([user.id])
    }, [])
    useEffect(() => {
        socket.on('connection', () => console.log('connected'))
        return () => {
            socket.off('connection')
        }
    }, [])
    const updateParticipantArr = async () => {
        console.log(participant)
        let res = await axios.post('http://localhost:8000/getIdByEmail', { email: participant }).catch(err => console.log(err))
        console.log(res)
        setParArr([...parArr, res.data])
        setParticipant('')
    }
    const onSubmit = async (data) => {
        try {
            let res = await axios.post('http://localhost:8000/createRoom',
                {
                    name: data.name,
                    users: parArr,
                    currUser: user.id
                })
            console.log(res)
        }
        catch (error) {
            console.log(error)
        }
        setParArr([])
        reset()
        props.setLeftBar('rooms')
        window.location.reload(false);
    }
    return (
        <div>
            <form className="px-8 pt-6 pb-8 flex flex-col gap-5 justify-center items-start" onSubmit={handleSubmit(onSubmit)}>
                <input className='px-4 py-2 bg-gray-200 rounded-md' placeholder='Room Name' {...register('name')} />
                <div className='w-full flex justify-between gap-4'>
                    <input className='px-4 py-2 bg-gray-200 rounded-md' placeholder='New User Email' onChange={(e) => setParticipant(e.target.value)} value={participant} />
                    <div className='bg-violet-400 rounded-xl w-10 text-center  h-10 py-2 text-gray-100 hover:cursor-pointer hover:bg-violet-200 hover:text-gray-700' onClick={() => updateParticipantArr()}>+</div>
                </div>
                <button className='bg-violet-400 rounded-md w-20 py-2 text-gray-100 hover:bg-violet-200 hover:text-gray-700' type='submit'>Create</button>
            </form>
        </div>
    );
}

export default CreateRoom;