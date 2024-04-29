"use client"
import { AppContext } from '@/context/AppProvider';
import { GroupChatContext } from '@/context/GroupChatProvider';
import { db } from '@/firebase';
import { TypeGroupChatMsg } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { usePathname } from 'next/navigation'
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { IoMdFootball } from "react-icons/io";
import { FaLaptopCode } from "react-icons/fa";
import { FaMusic } from "react-icons/fa";
const  Page = ({params}:{params:{room:string}}) => {
    // const pathName = usePathname()
console.log(params);
// console.log(pathName);
// const chatRef = useRef<HTMLInputElement>(null)
const messageRef =useRef<HTMLInputElement>(null)

const {
    groupChatMsg,
    setGroupChatMsg,
    groupChatMsgToDsiplay,
    setGroupChatMsgToDisplay,
    groupChartName,
    setGroupChatName,
    sentGroupChatMsg
    } = useContext(GroupChatContext)

    const {user} = useContext(AppContext)

// useLayoutEffect(()=>{
// setGroupChatMsgToDisplay([])
// },[])

useEffect(()=>{
  setGroupChatMsgToDisplay([])
const unsub = onSnapshot(doc(db, "groupchats", params.room), (doc) => {
    console.log("Current data: ", doc.data());
  //  let data = doc.data()?.messages as TypeGroupChatMsg[]
    setGroupChatMsgToDisplay(doc.data()?.messages as TypeGroupChatMsg[] )
});



console.log("clicked");

return ()=> unsub()
},[])

useEffect(()=>{
  messageRef.current?.scrollIntoView({
behavior:"smooth",
  })
},[groupChatMsgToDsiplay])


  return (
  <section className='h-screen flex flex-col'>


      <header className='h-16 bg-green-500 fixed w-full top-0 mb-16 z-10 flex justify-between px-4 items-center text-gray-300 font-bold'>
        {/* <div className='relative rounded-full w-[50px] h-[50px]'>
        <Image className='rounded-full' src={""} fill alt={""} />
        </div> */}
<p className='text-3xl font-bold'>{params.room === "football" ? < IoMdFootball/> : params.room === "music" ? <FaMusic/> : <FaLaptopCode /> }</p>

        <h1 className='capitalize'>{params.room}</h1>
      </header>
      {groupChatMsgToDsiplay.length < 1 && (
<div    className='grow overflow-y-scroll my-16 flex justify-center items-center'>
        <div className='relative w-[50px] h-[50px] rounded-md rounded-full '>
            <Image src={"/gear.svg"} fill alt={"loader"} />
          </div>
</div>
      )   
          
          }
{groupChatMsgToDsiplay.length > 0 && <div    className='grow my-16 px-2'>

      {groupChatMsgToDsiplay.map((item,index)=>{
        
        return (
         <div  key={index} ref={messageRef} className={item.userImg === user.photoURL ? 'flex flex-col justify-center items-end mt-2 ' : 'flex flex-col items-start justify-center '}>
          <aside className={item.userImg === user.photoURL ? 'flex justify-end items-start max-w-[80%]  bg-white rounded-md' : 'max-w-[80%] flex justify-start items-start  bg-white rounded-md'}>
          <div className='relative w-[50px] h-[50px] rounded-md rounded-full '>
            <Image src={item.userImg} className='rounded-full' fill alt={item.userName} />
          </div>
          <div className=''>
<h4 className='capitalize pl-2 text-gray-600'>{item?.userName}</h4>
          <p   className='rounded-md p-2 text-black font-semibold '>{item.messageTxt}</p>
               {item.messageImg && <div className='relative min-w-[20%] h-[100px] rounded-md mx-2 rounded-md overflow-hidden'>
            <Image src={item.messageImg} fill alt={item.messageTxt} />
          </div>}
          </div>
        
          </aside>
       
        </div>
          )
        })}
        </div>}

    {/* <footer className='bg-green-500 fixed w-full bottom-0'> */}
   <aside className='w-full fixed bottom-0 bg-gray-700 flex items-center gap-4 justify-center px-2'>
    <textarea name="" id=""
    placeholder='message'
    className='px-2 bg-gray-800 w-4/5 h-[30px] rounded-md'
    onChange={(e)=> setGroupChatMsg({...groupChatMsg,message:e.target.value})}
    value={groupChatMsg.message}
    ></textarea>
    {/* image */}
    <label htmlFor="image"> Image </label>
    <input type="file" 
    id='image'
    className='hidden'
    onChange={(e)=> 

    { const file = e.target.files ? e.target.files[0]  : null
     setGroupChatMsg({...groupChatMsg,image:file})
    }
    }/>
  
      <button className='rounded-md  text-black font-semibold my-2 bg-green-500 h-[30px] px-2'
      onClick={()=> sentGroupChatMsg(params.room)}
      >send</button>
    </aside>
    {/* </footer> */}
    </section>
  )
}

export default Page
