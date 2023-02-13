import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'
import axios from 'axios';
import { userInfo } from '../App';
import { socket } from '../App';

function Chat(props) {
    const { user } = useContext(userInfo)
    const [chats, setChats] = useState([])
    let roomCounter = 0
    const navigate = useNavigate()
    const location = useLocation()
    const room = props.room
    const [userArr, setUserArr] = useState([])
    const [message, setMessage] = useState('')
    const [list, setList] = useState([])
    const bottomRef = useRef(null);
    useEffect(() => {
        // setRoom(location.state.room)
        const handleJoin = () => {
            socket.emit('join-room', room._id)
        }
        handleJoin()
        console.log(room._id)
        const loadMessages = async () => {
            const res = await axios.post('http://localhost:8000/getRoomMsg', { room: room._id }).catch(err => console.log(err))
            setList(res.data)
        }
        loadMessages()
    }, [room])
    useEffect(() => {
        socket.on('connection', () => console.log('connected'))
        socket.on('recieve-message', (recievedMessage) => {
            setList((prev) => [...prev, recievedMessage])
        })
        return () => {
            socket.off('connection')
            socket.off('recieve-message')
        }
    }, [])
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [room, list]);
    useEffect(() => {
        const loadMessages = async () => {
            const res = await axios.post('http://localhost:8000/getRoomMsg', { room: room._id }).catch(err => console.log(err))
            setList(res.data)
        }
        loadMessages()
    }, [roomCounter])
    const handleClick = async () => {
        let res = await axios.post('http://localhost:8000/addMessage',
            {
                message: message,
                sender: user.name,
                room: room._id
            })
        const msg = {
            message: message,
            sender: user.name,
            room: room._id
        }
        console.log(res)
        socket.emit('send-message', msg)
        setList((prev) => [...prev, msg])
        setMessage('')
    }
    return (
        <div className='h-[73vh] overflow-scroll'>
            <h1>{`Room: ${room.name}`}</h1>
            {/* {userArr.map((user) => <p>{user}</p>)} */}
            <div>{list.map((message, i) =>
                <div id='1' className='w-full flex flex-col px-6' key={i}>
                    {message.sender === user.name ?
                        <div ref={bottomRef} className='h-auto w-auto max-w-[33.333%] flex flex-wrap  bg-[rgba(203,203,203,.5)] p-4 rounded-md mb-3 self-end '>
                            <p className='text-stone-100 flex-wrap break-all'>{message.message}</p>
                        </div>
                        :
                        <div ref={bottomRef} className='h-auto w-auto max-w-[33.333%] bg-[rgba(203,203,203,.5)] p-4 rounded-md mb-3 self-start'>
                            <p className='text-violet-300 font-bold'>{message.sender}</p>
                            <p className='text-stone-100 break-all'>{message.message}</p>
                        </div>
                    }
                </div>
            )}
            </div>
            <div className='fixed bottom-0 w-2/3 p-7 h-20 flex justify-center gap-10 items-center text-center bg-gray-900 border-t-2 border-t-violet-400'>
                <h2 className='text-violet-400 font-bold text-lg'>{room.name}</h2>
                <input className='w-1/2 h-10 rounded-md p-3 bg-stone-200' placeholder='Type a message...' value={message} type={'text'} onChange={(e) => setMessage(e.target.value)}></input>
                <img src="send.png" className='h-7 hover:cursor-pointer' alt="send" onClick={handleClick} />
            </div>
        </div>
    );
}

export default Chat;