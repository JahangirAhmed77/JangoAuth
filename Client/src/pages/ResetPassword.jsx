import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendurl}=useContext(AppContext)
  axios.defaults.withCredentials = true

  const [email, setemail] = useState('')

  const [newpassword,setnewpassword]=useState('');

  const [isemailsent,setisemailsent]=useState(false);

  const [otp,setotp]=useState('')
  const [isotpsubmitted,setisotpsubmitted]=useState(false)

  

  
  const navigate = useNavigate()

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
  
  const onSubmitEmail=async (e) => {
    e.preventDefault();

    try {
      const {data} =await axios.post(`${backendurl}/api/auth/send-reset-otp`,{email})

      data.success? toast.success(data.message) : toast.error(data.message)
      data.success && setisemailsent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

 const onSubmitOtp = async (e) => {
  e.preventDefault();
  const otpArray = inputRefs.current.map((e) => e.value);
  const enteredOtp = otpArray.join('');
  setotp(enteredOtp);
  setisotpsubmitted(true);
};

  const onSubmitNewPassword = async (e)=>{
    e.preventDefault();

    try {
      const {data}=await axios.post(`${backendurl}/api/auth/resetPassword`,{email,otp,newPassword:newpassword})

      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message);
      
    }
  }
   
  return (
    <div className='flex flex-col  justify-center items-center min-h-screen px-6 sm:px-0 bg-[url("/bg_img.png")] bg-cover bg-center'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-25 top-5  w-40 sm:w-60 cursor-pointer' />

     {!isemailsent &&
      <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >

        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-gray-400 '>Enter the 6-digit code sent to your email id.</p>

        <div className='mb-4 flex  items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
          <img src={assets.mail_icon} className='w-3 h-3' />
          <input type="email" placeholder='Email Id'
            className='bg-transparent outline-none text-white'
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />

        </div>

        <button className='w-full py-2.5 bg-[#339999] text-white rounded-full mt-3'>Submit</button>
      </form>
}


      {/* Otp enter form */}

   {!isotpsubmitted && isemailsent && 

      <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Resset Password OTP</h1>
        <p className='text-center mb-6 text-gray-400 '>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-8 ' onPaste={handlePaste}>

          {
            Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength={1} key={index} required
                className='w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-md '
                ref={(e) => inputRefs.current[index] = e}
                onInput={(e) => handleinput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))
          }

        </div>
        <button className='w-full py-3 bg-[#339999] text-white rounded-full'>Submit</button>

        
           

      </form>
}
      {/* Enter Your New Password */}
   
           {isotpsubmitted && isemailsent && 
   
       <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >

        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-gray-400'>Enter the new password below.</p>

        <div className='mb-4 flex  items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
          <img src={assets.lock_icon} className='w-3 h-3' />
          <input type="password" placeholder='Enter your new password'
            className='bg-transparent outline-none text-white'
            value={newpassword}
            onChange={(e) => setnewpassword(e.target.value)}
            required
          />

        </div>

        <button className='w-full py-2.5 bg-[#339999] text-white rounded-full mt-3'>Submit</button>
      </form>
      }
    </div>
  )
}

export default ResetPassword