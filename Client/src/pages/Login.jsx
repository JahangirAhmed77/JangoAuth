import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

  const { backendurl, setisloggedin, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  const [state, setState] = useState('Sign up');

  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === 'Sign up') {
        const { data } = await axios.post(`${backendurl}/api/auth/register`, {
          name, email, password
        })

        if (data.success) {
          setisloggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {

        const { data } = await axios.post(`${backendurl}/api/auth/login`, {
          email, password
        });

        if (data.success) {
          setisloggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  }

  return (
    <div className='flex flex-col  justify-center items-center min-h-screen px-6 sm:px-0 bg-[url("/bg_img.png")] bg-cover bg-center'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-25 top-5  mb-10 w-40 sm:w-60 cursor-pointer' />
      <div className=' bg-slate-900 p-10 mt-15 rounded-lg shadow-lg w-full sm:w-96 text-white text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3 '>{state === 'Sign up' ? 'Create account' : 'Log '}</h2>
        <p className='text-center text-sm mb-6 text-[#66CCCC]'>{state === 'Sign up' ? 'Create your account' : 'Log in to your Account'}</p>
        <form onSubmit={submitHandler}>
          {state === 'Sign up' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.person_icon} alt="" />
            <input onChange={(e) => setname(e.target.value)} value={name} type="text" placeholder='Full name' required className='bg-transparent outline-none' />
          </div>)}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder='Email' required className='bg-transparent outline-none' />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setpassword(e.target.value)} value={password} type="password" placeholder='Password' required className='bg-transparent outline-none' />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-[#66CCCC] cursor-pointer'>Forgot Password</p>

          <button className='w-full py-2.5 rounded-full bg-[#339999] text-white font-medium'>{state}</button>

        </form>


        {state === 'Sign up' ? (<p className='text-center text-[#66CCCC] text-xs mt-4'>Already Have an Account?
          <span onClick={() => setState('Log In')} className='text-white cursor-pointer under'>Login in Here</span></p>
        ) : (<p className='text-center text-[#66CCCC] text-xs mt-4'>Don't Have an Account?
          <span onClick={() => setState('Sign up')} className='text-white cursor-pointer under'>Signup Here</span></p>
        )}

      </div>
    </div>
  )
}

export default Login