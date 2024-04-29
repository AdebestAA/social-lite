"use client"
import { SecondAppContext } from '@/context/SecondAppProvider'
import React, { useContext } from 'react'
import { FaImage } from "react-icons/fa6";

const InputMessageComponents = () => {
    const {searchUser,setSearchUser,handleSearch,usersGotten, message,
    setMessage,
    handleMessageSent} = useContext(SecondAppContext)

  return (
    
   <form onSubmit={handleMessageSent} className='flex justify-evenly w-full py-[2px]'>
    <input type="text" 
    placeholder='enter your text'
    className='text-black w-[70%] rounded-md bg-slate-700 focus:border-[2px] focus:border-black outline-none  px-2 text-white '
    value={message.messageText}
    onChange={(e)=> setMessage({...message,messageText:e.target.value})}
    />
    <label htmlFor="file" className='text-2xl'><FaImage className=''  size={40} /></label>
    <input type="file"
    id='file'
    style={{display:"none"}}
    onChange={(e)=> 
      { const file = e.target.files ? e.target.files[0]  : null
      setMessage({...message,imageMsg:file})
  }}
    />
    <button className='rounded-md bg-black text-green-500 px-2 py-[2px] font-semibold' type='submit'>send</button>
   </form>
 
  )
}

export default InputMessageComponents
