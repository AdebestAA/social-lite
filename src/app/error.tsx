
"use client"
import { AppContext } from '@/context/AppProvider'
import { redirect } from 'next/navigation'
const error = () => {
const handleClick = ()=>{
   if (typeof window !== "undefined") {
          redirect("/")
        }   
}
  return (
      <div className='bg-black w-screen h-screen flex justify-center items-center flex-col'>
      <h1>An Error Occured</h1>
      <button className='bg-green-400 px-2 rounded-md text-black font-semibold' onClick={handleClick} >home page</button>
    </div>
  )
}

export default error
