"use client"

import { AppContext } from '@/context/AppProvider'
import { SecondAppContext } from '@/context/SecondAppProvider'
import Link from 'next/link'
import React, { useContext } from 'react'

const  Page= () => {

    const {userSignIn,setUserSignIn,handleSignIn} = useContext(AppContext)

  return (
    <div  className='flex items-center justify-center h-screen'>
    <section className='class-shadow bg-black w-[40%] lg:w-[50%] md:w-[60%] xxsm:w-[85%] rounded-lg p-4 text-center'>
 <h1 className='text-green-500 font-semibold'>sign in</h1>
      <form  onSubmit={handleSignIn}>
    <label htmlFor="email">Enter your email</label>
    <br />
    <input type="email"
    value={userSignIn.email}
    onChange={(e)=> setUserSignIn({...userSignIn,email:e.target.value})}
    id='email'
    placeholder='email'
    className='border-2 w-full border-black rounded-md bg-slate-800  px-2'
    />
    <br />
    <label htmlFor="password">Enter your password</label>
    <br />
    <input type="password"
    value={userSignIn.password}
    onChange={(e)=> setUserSignIn({...userSignIn,password:e.target.value})}
    id='password'
    placeholder='password'
    className='border-2 w-full border-black rounded-md bg-slate-800  px-2'
    />
    <br />
    <button type='submit' className='bg-green-400 rounded-md py-[4px] px-2 text-black mt-2 w-full hover:opacity-50'>Submit</button>
    </form>
     <p>Dont have an account? <Link className='cursor pointer text-green-400' href={"signup"}>sign up here</Link></p>
    </section>
    </div>
  )
}

export default Page
