"use client"
import Messages from '@/components/messages'
import { AppContext } from '@/context/AppProvider'
import { SecondAppContext } from '@/context/SecondAppProvider'
import React, { useContext, useEffect, useState } from 'react'
import { typeGetMessagesAndInfos, typeGottenUsers, typeMessagesFromGetMessagesAndInfo } from '@/types'
import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import dynamic from 'next/dynamic'


  const HydrationLoader = dynamic(()=> import("@/components/Loader"),{ssr:false})

const Page = () => {
     const { setUserMessagToDisplayeID, setChatsUsersInfos, setGetLastMessage, chatsUsersInfos, getLastMessage, getAllMyChats, setGetAllMyChats, userMessageToDisplayID,messagesToDisplay,setMessagesToDisplay,clickedUser,message } = useContext(SecondAppContext)

  const { user } = useContext(AppContext)




    useEffect(()=>{
    if (typeof window !== 'undefined' && window.location) {
    // Access location if it's available in the browser
    // console.log(location.pathname);
    const unsub = onSnapshot(doc(db, "user-chats", user.uid), (doc) => {

    setGetAllMyChats(doc.data())
    let  docRecievedInfoArray = Object.entries<DocumentData>(doc.data() as DocumentData).map((item,index)=>{
    return item[1]
    })
    let getMessages = docRecievedInfoArray.map((item,index)=>{
    return item.messages })
    setGetLastMessage(getMessages as typeMessagesFromGetMessagesAndInfo[][] )


    });

    return ()=> unsub()
    }


    },[message])


  useEffect(() => {
  if (typeof window !== 'undefined') {
  // Access location if it's available in the browser
  console.log(location.pathname);
  let  convertToArrayAndGetMessages= Object.entries(getAllMyChats).find((item, index) => {

  if (item[0] == userMessageToDisplayID + user.uid || item[0] == user.uid + userMessageToDisplayID) {
  return item
  }
  })as [string,typeGetMessagesAndInfos]
  const  getMessages =convertToArrayAndGetMessages[1].messages
  // console.log(getMessages);
  setMessagesToDisplay(getMessages)
  }
  }, [messagesToDisplay,message,getAllMyChats])


  return (
    <div>
      <Messages />
    </div>
  )
}

export default Page
