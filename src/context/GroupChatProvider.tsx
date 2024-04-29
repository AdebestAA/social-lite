"use client"
import { TypeGroupChatContext, TypeGroupChatMsg, messsgeGroupChat } from "@/types"
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { ReactElement, createContext, useContext, useState } from "react"
import { AppContext } from "./AppProvider"
import { db, storage } from "@/firebase"
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

const initialContext:TypeGroupChatContext = {
groupChatMsg:{
    message:"",
    image:null,
 
},
setGroupChatMsg:()=>{},
groupChatMsgToDsiplay:[],
setGroupChatMsgToDisplay:()=>{},
groupChartName:"",
setGroupChatName:()=>{},
sentGroupChatMsg:()=>{}
}



export const GroupChatContext = createContext<TypeGroupChatContext>(initialContext)




const GroupChatProvider = ({children}:{children:ReactElement}) => {

const [groupChatMsg,setGroupChatMsg] = useState<messsgeGroupChat>({
    message:"",
    image:null,
 
})
const [groupChartName,setGroupChatName] = useState<string>("")
const [groupChatMsgToDsiplay,setGroupChatMsgToDisplay] = useState<TypeGroupChatMsg[]>([])

const {user}= useContext(AppContext)

const sentGroupChatMsg = async(roomName:string)=>{
// try and catch block
    try {
const groupChatRoom= doc(db, "groupchats", roomName.toLocaleLowerCase());
// if image is sent
if (groupChatMsg.image) {
     const storageRef = ref(storage, groupChatMsg.image.name);

const uploadTask = uploadBytesResumable(storageRef,groupChatMsg.image)


uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {

    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        
await updateDoc(groupChatRoom, {
    messages: arrayUnion({
      messageTxt: groupChatMsg.message,
    userId: user.uid,
    messageImg:downloadURL,
    messageId: uuid(),
    userName: user.displayName,
    userImg: user.photoURL,
    date: Timestamp.now()
    })
});
    });
  }
);

setGroupChatMsg({  message:"",
    image:null,})
return

}

// if image is not sent
await updateDoc(groupChatRoom, {
    messages: arrayUnion({
      messageTxt: groupChatMsg.message,
    userId: user.uid,
    messageImg:null,
    messageId: uuid(),
    userName: user.displayName,
    userImg: user.photoURL,
    date: Timestamp.now()
    })
});

setGroupChatMsg({  message:"",
    image:null,})

   } catch (error) {
        console.log(error);
        
    }

}

    

  return (
 <GroupChatContext.Provider value={{
    groupChatMsg,
    setGroupChatMsg,
    groupChatMsgToDsiplay,
    setGroupChatMsgToDisplay,
    groupChartName,
    setGroupChatName,
    sentGroupChatMsg
    }}>
    {children}
 </GroupChatContext.Provider>
  )
}

export default GroupChatProvider
