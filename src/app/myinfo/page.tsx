"use client"
import ComponentsProviders from '@/components/ComponentsProviders'
import { AppContext } from '@/context/AppProvider'
import { SecondAppContext } from '@/context/SecondAppProvider'
import { auth, db } from '@/firebase'
// import { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'


const HydrationLoader = dynamic(()=> import("@/components/Loader"),{ssr:false})
const page = () => {

  // const [user,loading,error] = useAuthState(auth)
const {user,handleSignOut,loading} = useContext(AppContext)
// useEffect(()=>{

  
//   const unsub = onSnapshot(doc(db, "user-chats", user?.uid), (doc) => {
//     console.log("Current data: ", doc.data());
//   });
  
  
//   return ()=> unsub()

// },[])

const router = useRouter()

 if (!user || Object.entries(user).length < 1) {
    router.push("signup")
    return
  }

 

if (loading) {
  return <ComponentsProviders>
     < HydrationLoader/>
  </ComponentsProviders>

}
  return (
    <ComponentsProviders>
    <div className='w-full justify-center h-full flex flex-col items-center mt-6 font-bold text-center'>
      <div className='shadow-lg shadow-green-500 w-64 h-64 rounded-full relative'>
      <Image src={user?.photoURL} fill alt={user?.displayName} 
        className=' rounded-full'/>
        </div>
 <div className='mt-8'>
         <h1 className='capitalize'>{user?.displayName}</h1>
        <h2>{user?.email}</h2>
 </div>

 <button  onClick={handleSignOut} className='capitalize bg-red-400 text-black py-[2px] px-2 rounded-lg mt-8'>log out</button>
    </div>
    </ComponentsProviders>
  )
}

export default page
