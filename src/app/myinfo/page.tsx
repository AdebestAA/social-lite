"use client"
import ComponentsProviders from '@/components/ComponentsProviders'
import { AppContext } from '@/context/AppProvider'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useContext } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'


const HydrationLoader = dynamic(()=> import("@/components/Loader"),{ssr:false})
const Page = () => {

  // const [user,loading,error] = useAuthState(auth)
const {user,handleSignOut,loading} = useContext(AppContext)
// useEffect(()=>{

  
//   const unsub = onSnapshot(doc(db, "user-chats", user?.uid), (doc) => {
//     console.log("Current data: ", doc.data());
//   });
  
  
//   return ()=> unsub()

// },[])

const router = useRouter()


if (typeof window !== 'undefined') {
  
  if (!user || Object.entries(user).length < 1) {
    redirect("signup")
    return
  }
}

 

if (loading) {
  return <ComponentsProviders>
     < HydrationLoader/>
  </ComponentsProviders>

}
  return (
    <ComponentsProviders>
    <div className='w-full justify-center h-full flex flex-col items-center mt-6 font-bold text-center'>
      <div className='myImageCSS '>
      <Image src={user?.photoURL} fill alt={user?.displayName} 
        className=' rounded-full'/>
        </div>
 <div className='mt-8'>
         <h1 className='capitalize'>{user?.displayName}</h1>
        <h2>{user?.email}</h2>
 </div>

 <button  onClick={async()=>{
     
    try {
    const logOut = await signOut(auth)

   if (typeof window !== 'undefined') {
    redirect("signup")
  
  }
    
    } catch (error) {
    console.log(error);

    }

 }} className='capitalize bg-red-400 text-black py-[2px] px-2 rounded-lg mt-8'>log out</button>
    </div>
    </ComponentsProviders>
  )
}

export default Page
