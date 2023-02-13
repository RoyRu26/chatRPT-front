import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { userInfo } from '../App';
import Chat from './Chat';
import CreateRoom from './CreateRoom';
import { socket } from '../App';

function HomePage(props) {
    const [leftBar, setLeftBar] = useState('rooms')
    const [chat, setChat] = useState([])
    const { user } = useContext(userInfo)
    const [showRoom, setShowRoom] = useState(false)
    const navigate = useNavigate()
    const [userRooms, setUserRooms] = useState([])
    const [room, setRoom] = useState({})
    const handleJoin = (room) => {
        setRoom(room)
        setShowRoom(true)
    }
    useEffect(() => {
        socket.emit('join-room' , user.id)
    }, [])
    useEffect(() => {
        setUserRooms([])
        setChat([])
        const getUserRooms = async () => {
            let res = await axios.post('http://localhost:8000/getUserRooms', { email: user.email })
            res.data.roomList.forEach((room => {
                room.users.length > 2 ? setUserRooms((prev) => [...prev, room]) : setChat((prev) => [...prev, room])
            }))
        }
        const isConnected = () => {
            !JSON.parse(localStorage.getItem('token')) && navigate('/')
        }
        isConnected()
        getUserRooms()
    }, [])
    const logOut = () => {
        localStorage.clear()
        navigate('/')
    }
    return (
        <div className='max-h-screen'>
            <nav className="bg-gray-900 border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center ml-4 max-w-screen-xl pl-4 md:pl-4 py-2.5">
                    <div className="flex items-center">
                        <img src="chatRPTlogo.png" className="mr-3 h-16" alt="chatRPT logo" />
                        <span className="self-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-400 text-3xl font-prosto whitespace-nowrap dark:text-white">chatRPT</span>
                    </div>
                    <div className="flex items-center">
                        <p className="mr-6 text-lg font-medium text-violet-500 dark:text-white hover:underline hover:decoration-transparent font-kanit">{user.email}</p>
                        <p className="text-lg font-medium font-kanit text-violet-400 dark:text-blue-500 hover:underline hover:cursor-pointer hover:decoration-transparent" onClick={() => logOut()}>Log Out</p>
                    </div>
                </div>
            </nav>
            <nav className="bg-gray-900 dark:bg-gray-700 border-b-2 border-b-violet-400">
                <div className="max-w-screen px-0 py-4 mx-4 md:px-6">
                    <div className="flex items-center">
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium px-3">
                            <li>
                                <p onClick={() => setLeftBar('rooms')} className="text-violet-400 hover:cursor-pointer hover:decoration-transparent hover:text-violet-300 font-kanit dark:text-white hover:underline text-lg">Rooms</p>
                            </li>
                            <li>
                                <p onClick={() => setLeftBar('chats')} className="text-violet-400 hover:cursor-pointer hover:decoration-transparent hover:text-violet-300 font-kanit dark:text-white hover:underline text-lg">Chats</p>
                            </li>
                            <li>
                                <p onClick={() => setLeftBar('cng')} className="text-violet-400 hover:cursor-pointer hover:decoration-transparent hover:text-violet-300 font-kanit dark:text-white hover:underline text-lg">Create a new room</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='flex flex-row h-[83.5vh] max-h-full'>
                {leftBar === 'rooms' ?
                    <div className="bg-gray-800 w-1/3 overflow-scroll shadow-md px-8 pt-6 pb-8 flex flex-col gap-5 items-center border-r-2 border-r-violet-400">
                        <ul className='w-full'>
                            {userRooms.map((room, i) =>
                                <li className='w-full h-16 flex flex-row items-center border-b-2 border-b-gray-600 hover:cursor-pointer' onClick={() => handleJoin(room)} key={i}>
                                    <img className='w-20' src='groupIcon.png' alt='groupIcon' />
                                    <h1 className='font-kanit font-bold text-violet-400'>{room.name}</h1>
                                    {/* {room.users.map((user, i2) =><p key={i2}>{getNameById(user)}</p>)} */}
                                </li>
                            )}
                        </ul>
                    </div>
                    : leftBar === 'chats' ?
                        <div className='bg-gray-800 w-1/3 overflow-scroll shadow-md px-8 pt-6 pb-8 flex flex-col gap-5 items-center border-r-2 border-r-violet-400'>
                            <ul className='w-full'>
                                {chat.map((room, i) =>
                                    <li className='w-full h-16 flex flex-row items-center border-b-2 border-b-gray-600 hover:cursor-pointer' onClick={() => handleJoin(room)} key={i}>
                                        <img className='w-20' src='userIconBG.png' alt='groupIcon' />
                                        <h1 className='font-kanit font-bold text-violet-400'>{room.name}</h1>
                                        {/* {room.users.map((user, i2) =><p key={i2}>{getNameById(user)}</p>)} */}
                                    </li>
                                )}
                            </ul>
                        </div>
                        :
                        <div className='bg-gray-800 w-1/3 overflow-scroll shadow-md px-8 pt-6 pb-8 flex flex-col gap-5 items-center border-r-2 border-r-violet-400'>
                            <CreateRoom setLeftBar={setLeftBar} />
                        </div>
                }
                {/* <NavLink to='/CreateRoom'><button className='text-center text-blue-300'>New Room</button></NavLink> */}
                <div className='w-2/3 max-w-[66.666%] bg-gray-600 overflow-scroll' style={{ backgroundImage: "url(chat.webp)" }}>
                    {showRoom && room ?
                        <Chat room={room} />
                        :
                        <h1>Something</h1>
                    }
                </div>
            </div>
        </div>
    );
}

export default HomePage;