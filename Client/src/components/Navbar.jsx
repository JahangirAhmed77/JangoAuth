import React from 'react'
import axios from 'axios';  
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
const Navbar = () => {
  const navigate=useNavigate();

  const {userdata,backendurl,setuserdata,setisloggedin}=useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(`${backendurl}/api/auth/send-verify-otp`);
      if(data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
              toast.error(error.message);

    }
  }

  const logout=async () => {

    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(`${backendurl}/api/auth/logout`);

      data.success && setisloggedin(false); 
      data.success && setuserdata(null);
      data.success && navigate('/');
      
    } catch (error) {
       toast.error(error.message);  
    }
    
  }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt="" className='w-48 sm:w-65  '/>
{userdata && typeof userdata === "object" && userdata !== null && typeof userdata.name === "string" ? (
  <div className='w-10 h-10 flex justify-center items-center rounded-full bg-black text-white relative group'>
    {userdata.name.length > 0 ? userdata.name[0].toUpperCase() : "U"}
    <div className=' absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
      <ul className='w-30 list-none m-0  p-2 bg-gray-100 text-sm'>
        {userdata.isAccountVerified === false && (
          <li onClick={sendVerificationOtp} className='py-1 px02 hover:bg-gray-200 cursor-pointer'>Verify Email</li>
        )}
        <li onClick={logout} className='py-1 px02 hover:bg-gray-200 cursor-pointer pr-10'>Log Out</li>
      </ul>
    </div>
  </div>
) : (
  <button onClick={()=> navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
    Login <img src={assets.arrow_icon} />
  </button>
)}
        
    </div>
  )
}

export default Navbar