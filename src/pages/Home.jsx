import React, { useEffect, useState } from 'react'
import UserDetail from '../components/UserDetail';
import axios from 'axios'


const Home = () => {

  const [blog, setBlog] = useState([]);

  useEffect(() => {

    const fetchBlog = async () => {
      const api = await axios.get(`https://blog-mern-backend-luce.onrender.com/api/blogs/allblogs`, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });

      setBlog(api.data.data)

    }

    fetchBlog();

  }, [])


  const container = `bg-gray-900 text-gray-200 p-4`;
  const wrapper = `flex flex-col gap-7 md:justify-center md:items-center my-3`;
  const title = `text-center text-yellow-400 text-2xl font-semibold`;
  const registerForm = `flex flex-col gap-6 bg-gray-950 p-9 rounded-lg md:w-3/4`;
  const labelInputWrapper = 'flex flex-col gap-2'
  const labelStyle = 'font-semibold ml-2'
  const inputStyle = `bg-gray-700 h-12 p-3 rounded-lg`;
  const submitButton = `text-gray-900 h-12 rounded-lg bg-lime-500 hover:bg-lime-400`


  return (
    <>
      <div className="container text-center my-5" style={{ width: '56%' }}>
        {
          blog.map((data) => {
            return (
              <>
                <div className="card mb-3 bg-secondary text-light my-5" style={{ maxWidth: '760px' }}>
                  <div className="row g-0">

                    <div
                      className="col-md-4"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={data.imgUrl}
                        className="img-fluid rounded-start"
                        alt="..."
                      />
                    </div>

                    <div className="col-md-8">
                      <div className="card-body">
                        <h2 className="card-title">{data.title}</h2>
                        <p className="card-text">{data.description}</p>
                        <p className="card-text"><small >{data.createdAt}</small></p>
                        <UserDetail id={data.user} />
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )

          })
        }
      </div>
    </>
  )
}

export default Home