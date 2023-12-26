import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import context from '../context/MyContext';
import axios from 'axios';
import MyBlogs from '../components/MyBlogs';
import { BiSolidUserCircle, BiLogOut } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const Profile = () => {
  const auth = useContext(context)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const api = await axios.get(`https://blog-mern-backend-luce.onrender.com/api/users/getmyprofile`, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });

      // console.log(api.data.user);
      // setBlog(api.data.blogs)
      auth.setUser(api.data.user)
      auth.setIsAuthenticated(true);
    }

    fetchUser();

  }, [])


  const logout = async () => {
    const api = await axios.get('https://blog-mern-backend-luce.onrender.com/api/users/logout', {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    toast.success(api.data.message, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    auth.setIsAuthenticated(false);

    setTimeout(() => {
      navigate('/');
    }, 1500);
  }


  return (

    <>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="bg-gray-900 flex flex-col justify-center items-center">
        <div className=' flex flex-col gap-3 text-yellow-400 font-semibold m-4'>
          <div className='flex flex-row gap-2'> <BiSolidUserCircle /> {" "} {auth.user.name}</div>
          <div className='flex flex-row gap-2'> <MdEmail /> {" "} {auth.user.email}</div>
          {
            (auth.isAuthenticated) &&
            <div
              className="text-lime-500 hover:text-lime-300 md:text-xl text-lg font-semibold flex flex-row gap-2"
              onClick={logout}> <BiLogOut/>
              Logout
            </div>
          }

        </div>


        <div>
          <MyBlogs />
        </div>

      </div>

    </>
  )
}

export default Profile