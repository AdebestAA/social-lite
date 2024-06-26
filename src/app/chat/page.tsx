"use client"
import ComponentsProviders from '@/components/ComponentsProviders'
import { AppContext } from '@/context/AppProvider'
import { redirect, useRouter } from 'next/navigation'
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import { SecondAppContext } from '@/context/SecondAppProvider'
import { typeGottenUsers, typeMessagesFromGetMessagesAndInfo } from '@/types'

const  Chat    = () => {


  


   const {setUserMessagToDisplayeID, setChatsUsersInfos, setGetLastMessage,chatsUsersInfos,getLastMessage,getAllMyChats,setGetAllMyChats,clickedUser,setClickedUser,message,messagesToDisplay} = useContext(SecondAppContext)
    const {user} = useContext(AppContext)
    const router = useRouter()


    useEffect(()=>{
    if (typeof window !== 'undefined') {
    // Access location if it's available in the browser
    // console.log(location.pathname);
    const unsub = onSnapshot(doc(db, "user-chats", user?.uid), (doc) => {
    // console.log("Current data: ", doc.data());
    console.log(doc.data());
    setGetAllMyChats(doc.data())
    let  docRecievedInfoArray = Object.entries<DocumentData>(doc.data() as DocumentData).map((item,index)=>{
    return item[1]
    })
    let getMessages = docRecievedInfoArray.map((item,index)=>{
    return item.messages })
    setGetLastMessage(getMessages as typeMessagesFromGetMessagesAndInfo[][] )

    console.log(docRecievedInfoArray);
    setChatsUsersInfos(docRecievedInfoArray.map(item=> {
    return item.usersInfos.filter((i:typeGottenUsers)=> i.id !== user.uid)[0]
    }))

    });


    return ()=> unsub()
    }

    },[message])



if (typeof window !== 'undefined') {
  if (!user || Object.entries(user).length < 1) {
    redirect("signup")
    return
  }
}





  return (
 <ComponentsProviders>
<div className='m-2 text-center flex flex-col items-center'>
  <h1 className='text-black font-bold text-center rounded-md border-green-400 bg-green-500 w-16 my-2'>Chats</h1>
  {/* <div className='font-semibold text-center mt-4'>
<h1>  you currently have no chats</h1>
  </div> */}
{chatsUsersInfos.length < 1 && (
  <div className='text-gray-500 font-semibold'>
    <h1>{"you current don't have any active chat"}</h1>
  </div>
)}
{chatsUsersInfos.length > 0 && chatsUsersInfos.sort().map((item,index:number)=>{
  return (

    <section onClick={()=>{
    setUserMessagToDisplayeID(item.id)
    setClickedUser(item)
    if (typeof window !== 'undefined') {
  // Access `location` here
  // console.log(window.location.href);
  router.push("/chat/messages")
}
    }} key={index} className='rounded-md pointer bg-green-400 flex items-center text-black p-2 h-[50px] w-full mt-2 '>
    <div className='w-[40px] h-[40px] rounded-full relative'>
    <Image src={item.imageURL} fill alt={"boy"} 
    className=' rounded-full object-cover'/>
    </div>
    <div className='text-start mx-2'>
    <h1 className='capitalize text-sm font-bold'>{item.name}</h1>
    <p className='text-sm'>{getLastMessage[index].map((item:typeMessagesFromGetMessagesAndInfo,indexNum:number)=>{
    if (indexNum === getLastMessage[index].length - 1 as unknown  ) {
    return item.messageText
    }
    })
}</p>
    </div>
    </section>
  )
})}


    {/* <section className='rounded-md pointer bg-green-400 flex items-center text-black p-2 h-[50px] w-full mt-2 '>
        <div className='w-[40px] h-[40px] rounded-full relative'>
        <Image src={"/boy.png"} fill alt={"boy"} 
        className=' rounded-full'/>
        </div>
        <div>
        <h1 className='font-semibold text-sm'>{"Adebest"}</h1>
        <p className='text-sm'>last message</p>
        </div>
        </section> */}
</div>
 </ComponentsProviders>
  )
}

export default Chat          
