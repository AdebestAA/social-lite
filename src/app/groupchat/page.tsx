"use client"
import Messages from '@/components/messages'
import React, { useContext } from 'react'
import { groupChatRooms } from '@/data'
import { useRouter } from 'next/navigation'
import ComponentsProviders from '@/components/ComponentsProviders'
import { AppContext } from '@/context/AppProvider'
import dynamic from 'next/dynamic'

const HydrationLoader = dynamic(()=> import("@/components/Loader"),{ssr:false})
const Page= () => {

  const router = useRouter()
  const {  handleSignOut,loading,user} = useContext(AppContext)


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
    <div className='flex flex-col justify-center items-center'>
        <h1 className=' mt-4 font-bold px-2 py-2 rounded-md bg-green-500 text-black'>Rooms</h1>

    <article className='mt-8 w-[95%]'>
    {groupChatRooms.map((room,index)=>{
        
        return (
    <section key={index} className='bg-green-400 capitalize my-2 py-2 pl-2 rounded-md text-black font-bold text-md flex items-center space-x-2' onClick={()=> router.push("/groupchat/"+room.link)}>
      <p>{room.icon}</p>
    <p>{room.name}</p>
    </section>

    )
    })}
    </article>
    </div>
        </ComponentsProviders>
  )
}

export default  Page
