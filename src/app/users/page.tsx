"use client"
import ComponentsProviders from '@/components/ComponentsProviders'
import { AppContext } from '@/context/AppProvider'
import { SecondAppContext } from '@/context/SecondAppProvider'
import { db } from '@/firebase'
import { typeGetMessagesAndInfos, typeGottenUsers, typeMessagesFromGetMessagesAndInfo } from '@/types'
import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const Page = () => {
    const {searchUser,setSearchUser,handleSearch,usersGotten,handleSearchedUserClicked,setUserMessagToDisplayeID, setChatsUsersInfos, setGetLastMessage, chatsUsersInfos, getLastMessage, getAllMyChats, setGetAllMyChats, userMessageToDisplayID,messagesToDisplay,setUsersGotten,setMessagesToDisplay,clickedUser,message} = useContext(SecondAppContext)
    const {user} = useContext(AppContext)
    const router = useRouter()
console.log(usersGotten);
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
      if (typeof window !== 'undefined' && window.location) {
    // Access location if it's available in the browser
    // console.log(location.pathname);
    if (usersGotten.length > 0) {   
        let  convertToArrayAndGetMessages= Object.entries(getAllMyChats).find((item, index) => {
            
            if (item[0] == usersGotten[0].id + user.uid || item[0] == user.uid + usersGotten[0].id) {
                return item
            }
        })as [string,typeGetMessagesAndInfos]
        
        console.log(getAllMyChats);
        console.log(convertToArrayAndGetMessages);
        if (!convertToArrayAndGetMessages) {
            return
        }
        const  getMessages =convertToArrayAndGetMessages[1].messages
        console.log(getMessages);
        setMessagesToDisplay(getMessages)
    }
}
      }, [messagesToDisplay,message,getAllMyChats,usersGotten])
      
      
      
      if (typeof window !== 'undefined') {
  // Access `location` here
//   console.log(window.location.href);
  if (!user || Object.entries(user).length < 1) {
      redirect("signup")
      return
    }
}




  return (
    <ComponentsProviders>
    <div className='text-center flex flex-col'>
        <h1 className='bg-green-400 text-black font-semibold px-4 mx-auto my-4 rounded-md '>search for user</h1>
    <form onSubmit={handleSearch} className='mt-2 flex justify-center my-2'>
    <input type="text"
    value={searchUser}
    placeholder='search user'
    className='border-2 border-gray-500 rounded-md text-black px-2'
    onChange={(e)=>{
        setSearchUser(e.target.value)}
    } 
    />
    <button type='submit' className='bg-green-500 text-black rounded-md mx-2 font-semibold p-[2px]'>search</button>
 
 </form>
 {/* user search result*/}
 <article>
<div className=''>

{
    usersGotten.length > 0 && usersGotten.map((user,index)=>{

        return (
             <section 
             onClick={()=> handleSearchedUserClicked(user)}
             key={index} className='bg-green-400 mx-2 rounded-md flex items-center text-black p-2 h-[50px]'>
        <div className='w-[40px] h-[40px] rounded-full relative'>
        <Image src={user.imageURL} fill alt={"boy"} 
        className=' rounded-full'
        />
        </div>
        <div>
        <h1 className='font-semibold text-sm'>{user.name}</h1>
        {/* <p className='text-sm'>last message</p> */}
        </div>
        
    </section>


        )
    })
}

        {/* <section className='bg-green-400 mx-2 rounded-md flex items-center text-black p-2 h-[50px] '>
        <div className='w-[40px] h-[40px] rounded-full relative'>
        <Image src={"/boy.png"} fill alt={"boy"} 
        className=' rounded-full '
        />
        </div>
        <div>
        <h1 className='font-semibold text-sm'>{"Adebest"}</h1>
        <p className='text-sm'>last message</p>
        </div>
        
    </section>
 */}

{/* {usersGotten?.map((user,index)=>{
    
    return (
        <section  onClick={()=>{
            handleSearchedUserClicked(user)
        }} key={index} className='bg-red-300 flex justify-center'>
        <div className='w-[100px] h-[100px] rounded-md relative'>
        <Image src={user.imageURL} fill alt={user.name} 
        className=' rounded-md '
        />
        </div>
        <h1>{user.name}</h1>
    </section>
)
})} */}
</div>
 </article>

    </div>
</ComponentsProviders>
  )
}

export default Page
