"use client"
import { SecondAppContext } from '@/context/SecondAppProvider'
import React, { useContext, useEffect, useRef } from 'react'
import InputMessageComponents from './InputMessageComponents'
import Image from 'next/image'
import { AppContext } from '@/context/AppProvider'
// import { typeGottenUsers, typeMessagesFromGetMessagesAndInfo } from '@/types'
// import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
// import { db } from '@/firebase'



const Messages = () => {
  const { setUserMessagToDisplayeID, setChatsUsersInfos, setGetLastMessage, chatsUsersInfos, getLastMessage, getAllMyChats, setGetAllMyChats, userMessageToDisplayID,messagesToDisplay,setMessagesToDisplay,clickedUser,message } = useContext(SecondAppContext)
  const chatRef = useRef<HTMLInputElement>(null)


  const { user } = useContext(AppContext)
console.log(chatsUsersInfos);
console.log(userMessageToDisplayID);



 useEffect(()=>{

    if (chatRef.current) {
   
    chatRef.current.scrollIntoView({
behavior:"smooth",
  })
  }
//     const unsub = onSnapshot(doc(db, "user-chats", user.uid), (doc) => {
//       // console.log("Current data: ", doc.data());
//   //  console.log(doc.data());
//    setGetAllMyChats(doc.data())
//     let  docRecievedInfoArray = Object.entries<DocumentData>(doc.data() as DocumentData).map((item,index)=>{
//       return item[1]
//     })
//     let getMessages = docRecievedInfoArray.map((item,index)=>{
//     return item.messages })
//     setGetLastMessage(getMessages as typeMessagesFromGetMessagesAndInfo[] )
//     setChatsUsersInfos(docRecievedInfoArray.map(item=> {
//     return item.usersInfos.filter((i:typeGottenUsers)=> i.id !== user.uid)[0]
//     }))

//     });

//   console.log("current");
  
// }

//     return ()=> unsub()
// const userInfoToDisplay = chatsUsersInfos.find((item,index)=> item.id === userMessageToDisplayID)

// console.log(userInfoToDisplay);


    },[messagesToDisplay,message])


  return (
    <section className='h-screen flex flex-col'>
      {/* <h1>{usersGotten[0].name}</h1>
  <header className='bg-red-400'>
    messages
  </header>
  <div>
<p className='user'>message form others</p>
<p className='me'>message from me</p>
  </div>

  <footer>
<input type="text"
value={message}
onChange={(e)=>  setMessage(e.target.value)}
className='border-2 border-black'
/>
 <button onClick={handleMessageSent}>send</button>
  </footer> */}

      <header className='h-16 bg-green-500 fixed w-full top-0 mb-16 z-10 flex justify-between px-4 items-center text-gray-300 font-bold'>
        <div className='relative rounded-full w-[50px] h-[50px]'>
        <Image className='rounded-full object-cover' src={chatsUsersInfos.find(item => item.id === userMessageToDisplayID)?.imageURL as string} fill alt={chatsUsersInfos.find(item => item.id === userMessageToDisplayID)?.name as string} />
        </div>


        <h1 className='capitalize'>{chatsUsersInfos.find(item => item.id === userMessageToDisplayID)?.name as string}</h1>
      </header>
<div    className='grow overflow-y-scroll my-16'>

      {messagesToDisplay.map((item,index)=>{
        
        return (
         <div ref={chatRef}  key={index} className={item.email === user.email ? 'flex flex-col items-end ' : 'flex flex-col items-start'}>
         {item.messageText && <p   className='bg-white max-w-[50%]  rounded-md m-2 p-2 text-black font-semibold '>{item.messageText}</p>}
          {item.imageMsg && <div className='relative w-[20%] h-[100px] rounded-md mx-2 rounded-md overflow-hidden'>
            <Image className='object-cover' src={item.imageMsg} fill alt={item.messageText} />
          </div>}
        </div>
          )
        })}
        </div>

    <footer className='h-16 bg-green-500 fixed w-full bottom-0 items-center flex justify-center '>
    <InputMessageComponents />
    </footer>
    </section>
  )
}

export default Messages
