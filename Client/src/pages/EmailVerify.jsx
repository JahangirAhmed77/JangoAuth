import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  
  const navigate = useNavigate()
  const {backendurl,isloggedin,userdata,getUserData} = useContext(AppContext);

  const inputRefs=useRef([])

  const handleinput = (e,index)=>{

    if(e.target.value.length > 0 && inputRefs.current.length - 1){

      inputRefs.current[index + 1].focus()

    }

  }

  const handleKeyDown = (e,index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {

        inputRefs.current[index - 1].focus()

    }
  }

  const handlePaste = (e)=>{
    const paste=e.clipboardData.getData('text');
    const pastArray=paste.split('');

    pastArray.forEach((char,index)=> {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    });
 }

 const onSubmitHandler= async (e)=>{
   e.preventDefault();
   try {
    const otpArray = inputRefs.current.map(e=> e.value)
    const otp =otpArray.join('')

    const res = await axios.post(`${backendurl}/api/auth/verify-account`, {
      otp,
      // userId, // or just otp if backend uses JWT
    });
    const data = res.data; // <-- define data here

    if (data.success){
      toast.success(data.message);
      getUserData();
      navigate('/')
      
    }else{
      toast.error(data.message);
    }
   } catch (error) {
     toast.error(error.response?.data?.message || error.message);
   }
 }

 useEffect(() => {

  isloggedin && userdata && userdata.isAccountVerified && navigate('/')
   
 }, [isloggedin,userdata])
 
  return (
    <div className='flex flex-col  justify-center items-center min-h-screen px-6 sm:px-0 bg-[url("/bg_img.png")] bg-cover bg-center'>
               <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-25 top-5  w-28 sm:w-32 cursor-pointer' />
         <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitHandler}>
                 <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
                 <p className='text-center mb-6 text-indigo-300 '>Enter the 6-digit code sent to your email id.</p>
              <div className='flex justify-between mb-8 ' onPaste={handlePaste}>
                    
                    {
                      Array(6).fill(0).map((_,index)=>(
                        <input type="text" maxLength={1} key={index} required
                         className='w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-md '
                          ref={(e)=> inputRefs.current[index] = e}
                          onInput={(e)=> handleinput(e,index)}
                          onKeyDown={(e)=> handleKeyDown(e,index)}
                         />
                      ))
                    }
           
              </div>

              <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Email</button>
         </form>
    </div>
  )
}

export default EmailVerify