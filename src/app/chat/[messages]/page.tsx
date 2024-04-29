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

const page = () => {
     const { setUserMessagToDisplayeID, setChatsUsersInfos, setGetLastMessage, chatsUsersInfos, getLastMessage, getAllMyChats, setGetAllMyChats, userMessageToDisplayID,messagesToDisplay,setMessagesToDisplay,clickedUser,message } = useContext(SecondAppContext)

  const { user } = useContext(AppContext)




useEffect(()=>{
const unsub = onSnapshot(doc(db, "user-chats", user.uid), (doc) => {
      // console.log("Current data: ", doc.data());
  //  console.log(doc.data());
   setGetAllMyChats(doc.data())
    let  docRecievedInfoArray = Object.entries<DocumentData>(doc.data() as DocumentData).map((item,index)=>{
      return item[1]
    })
    let getMessages = docRecievedInfoArray.map((item,index)=>{
    return item.messages })
    setGetLastMessage(getMessages as typeMessagesFromGetMessagesAndInfo[][] )
    // setChatsUsersInfos(docRecievedInfoArray.map(item=> {
    // return item.usersInfos.filter((i:typeGottenUsers)=> i.id !== user.uid)[0]
    // }))

    });
console.log("this");

    return ()=> unsub()


},[message])


       useEffect(() => {
  let  convertToArrayAndGetMessages= Object.entries(getAllMyChats).find((item, index) => {
    
    if (item[0] == userMessageToDisplayID + user.uid || item[0] == user.uid + userMessageToDisplayID) {
      return item
    }
  })as [string,typeGetMessagesAndInfos]
  const  getMessages =convertToArrayAndGetMessages[1].messages
  // console.log(getMessages);
  setMessagesToDisplay(getMessages)
      }, [messagesToDisplay,message,getAllMyChats])


  return (
    <div>
      <Messages />
    </div>
  )
}

export default page
