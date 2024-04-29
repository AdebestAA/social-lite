"use client"
import Messages from '@/components/messages'
import { AppContext } from '@/context/AppProvider'
import { SecondAppContext } from '@/context/SecondAppProvider'
import { db } from '@/firebase'
import { typeGetMessagesAndInfos, typeGottenUsers, typeMessagesFromGetMessagesAndInfo } from '@/types'
import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const page = () => {
   const {setUserMessagToDisplayeID, setChatsUsersInfos, setGetLastMessage,chatsUsersInfos,getLastMessage,getAllMyChats,setGetAllMyChats,clickedUser,setClickedUser,message,messagesToDisplay,usersGotten,setMessagesToDisplay} = useContext(SecondAppContext)
    const {user} = useContext(AppContext)
    const router = useRouter()


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
    setChatsUsersInfos(docRecievedInfoArray.map(item=> {
    return item.usersInfos.filter((i:typeGottenUsers)=> i.id !== user.uid)[0]
    }))

    });

    return ()=> unsub()

    },[message])


       useEffect(() => {
  let  convertToArrayAndGetMessages= Object.entries(getAllMyChats).find((item, index) => {
    
    if (item[0] == usersGotten[0].id + user.uid || item[0] == user.uid + usersGotten[0].id) {
      return item
    }
  })as [string,typeGetMessagesAndInfos]
  if (!convertToArrayAndGetMessages) {
    return
  }
  const  getMessages =convertToArrayAndGetMessages[1].messages
  // console.log(getMessages);
  setMessagesToDisplay(getMessages)
      }, [messagesToDisplay,message,getAllMyChats])

  return (
    <div>
      {/* <h1>This is showing</h1> */}
        <Messages/>
    </div>
  )
}

export default page
