import React, { useEffect, useState } from 'react'
import axios from 'axios'

const UserDetail = ({id}) => {
    const [oneUser, setOneUser] = useState({}) // storing object 
    useEffect(() => {
        const fetchUser = async () => {
            const api = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            setOneUser(api.data.data)
        }
        fetchUser();
    }, [])


    return (
        <span className="font-medium text-zinc-300">{oneUser.name}</span>
    )
}

export default UserDetail