"use client"
import { AppContext } from '@/context/AppProvider'
import Link from 'next/link'
import React, { useContext } from 'react'

const SignUp = () => {
    const {userSignUp,setUserSignUp,handleSignUp} = useContext(AppContext)

  return (
    <div className='flex items-center justify-center font-semibold  h-screen' >
      <section className='class-shadow bg-black w-[35%] lg:w-[50%] md:w-[60%] xxsm:w-[85%] rounded-lg p-4 text-center'>
    <h1 className='text-green-500 font-semibold'>User sign up</h1>
    <form  onSubmit={handleSignUp}>
    <label htmlFor="name">Enter your username</label>
    <br />
    <input type="text"
    placeholder='username'
    value={userSignUp.name}
    onChange={(e)=> setUserSignUp({...userSignUp,name:e.target.value})}
    id='name'
     className='border-2 border-black rounded-md w-full  bg-slate-800 px-2'
    />
    <br />
    <label htmlFor="email">Enter your email</label>
     <br />
    <input type="email"
       placeholder='email'
    value={userSignUp.email}
    onChange={(e)=> setUserSignUp({...userSignUp,email:e.target.value})}
    id='email'
      className='border-2 border-black rounded-md w-full bg-slate-800  px-2'
    />
    <br />
    <label htmlFor="password">Enter your password</label>
     <br />
    <input type="password"
       placeholder='password'
    value={userSignUp.password}
    onChange={(e)=> setUserSignUp({...userSignUp,password:e.target.value})}
    id='password'
    className='border-2 border-black rounded-md bg-slate-800 w-full px-2'
    />
    <br />
    <label htmlFor="imageFile" className='capitalize cursor- bg-gray-700 w-full rounded-md text-white font-semibold  block py-2 my-2'>upload image</label>
    <input type="file" id='imageFile'
    style={{display:"none"}}
    onChange={(e)=>{
      const file = e.target.files ? e.target.files[0]  : null
      setUserSignUp({...userSignUp,image:file})
      
    }}
      // className='border-2 border-black rounded-md'
    />
    <button type='submit' className='bg-green-400 rounded-md py-[4px] px-2 text-black w-full font-semibold hover:opacity-50'>submit</button>
    </form>
    <p>Already have an account? <Link className='cursor pointer text-green-400' href={"signin"}>sign in</Link></p>
    </section>
    </div>
 
  )
}

export default SignUp
