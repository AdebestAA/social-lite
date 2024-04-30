"use client"
import { redirect } from 'next/navigation'
import React from 'react'

const error = () => {

  return (
    <div className='bg-black w-screen h-screen flex justify-center items-center flex-col'>
      <h1>An Error Occured</h1>
      <button className='bg-green-400 px-2 rounded-md text-black font-semibold' onClick={()=>{
        if (typeof window !== "undefined") {
            redirect("/")
        }  
      }} >home page</button>
    </div>
  )
}

export default error
