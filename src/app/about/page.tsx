"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
const router = useRouter()
    const handleRedirect = ()=> {   
           router.push("/")
    }
  return (
    <div>
       <h1>
      user is not active
      </h1>
    <button onClick={handleRedirect}>back to home</button>
    </div>
  )
}

export default Page
