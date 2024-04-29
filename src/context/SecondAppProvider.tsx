"use client"
import React, { ReactElement, use, useEffect, useState } from "react";

import { DocumentData, Timestamp, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where, } from "firebase/firestore";
import { auth, db, storage } from "@/firebase";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AppContext } from "./AppProvider";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { SecondContext, TypeOfMessage, typeGetMessagesAndInfos, typeGottenUsers, typeMessagesFromGetMessagesAndInfo } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { Unsubscribe } from "firebase/auth";
import { v4 as uuid } from "uuid";





const initialSecondContext:SecondContext = {
    searchUser:"",
    setSearchUser:()=>{},
    handleSearch:(e:React.SyntheticEvent)=>{},
    usersGotten:[],
    message:{messageText:"",imageMsg:"",date:""},
    setMessage:()=>{},
    handleMessageSent:()=>{},
    handleSearchedUserClicked:()=>{},
    userMessageToDisplayID:"",
    setUserMessagToDisplayeID:()=>{},
    chatsUsersInfos:[],
    setChatsUsersInfos:()=>{},
    getLastMessage:[],
    setGetLastMessage:()=>{},
    getAllMyChats:[],
    setGetAllMyChats:()=>{},
    messagesToDisplay:[],
    setMessagesToDisplay:()=>{},
    clickedUser:{name:"",id:"",imageURL:"",email:""},
    setClickedUser:()=>{},
     setUsersGotten:()=>{}
    
}




const SecondAppContext = React.createContext
<SecondContext>(initialSecondContext)





const SecondAppProvider = ({children}:{children:ReactElement})=>{

    const [searchUser,setSearchUser] = useState<string>("")
    const [message,setMessage] = useState<TypeOfMessage>({
    messageText:"",
    imageMsg:null,
    date:new Date().toLocaleString()
    })
    const [getMessagesAndInfos,setGetMessagesAndInfos]= useState<typeGetMessagesAndInfos>({usersInfos:[],messages:[]})
    const [usersGotten,setUsersGotten] = useState<typeGottenUsers[]>([]) 
    const [chatsUsersInfos,setChatsUsersInfos] = useState<typeGottenUsers[]>([])
    const [getLastMessage,setGetLastMessage] = useState<typeMessagesFromGetMessagesAndInfo[][]>([])
    const [userMessageToDisplayID,setUserMessagToDisplayeID] = useState<string>("")
    const [getAllMyChats,setGetAllMyChats] = useState<{}>({})
    const [messagesToDisplay,setMessagesToDisplay] = useState<typeMessagesFromGetMessagesAndInfo[]>([])
    //   const [user,loading,error] = useAuthState(auth)
    const {user} = useContext(AppContext)

const [otherUserInfos, setOtherUserInfos] = useState<typeGottenUsers[]>([])
const [clickedUser,setClickedUser] = useState<typeGottenUsers>({name:"",id:"",imageURL:"",email:""})



    


// console.log(chatsUsersInfos);



const router = useRouter()

useEffect(()=>{

//     const getUsers = async()=>{
// let gottenUsers:any[] = []
//         const querySnapshot = await getDocs(collection(db, "users"));
//         querySnapshot.forEach((doc) => {
//             // doc.data() is never undefined for query doc snapshots
//             // console.log(doc.id, " => ", doc.data());
//             gottenUsers.push(doc.data())
//         });
       
//     }    
    // return  ()=>{
    //     getUsers()
    // }
    if (chatsUsersInfos.length > 0) {
        
        const filterOutOtherUser = chatsUsersInfos.filter(item=> item.id === clickedUser.id)
        setOtherUserInfos(filterOutOtherUser)
    }

},[chatsUsersInfos,clickedUser])

    const handleMessageSent =async (event:React.SyntheticEvent)=>{
        event.preventDefault()
//       const joinAndSortID = usersGotten[0].name.length > user?.displayName.length ? usersGotten[0].id + user.uid : user.uid+usersGotten[0].id
// console.log(user);
  let joinAndSortID = ""
if(usersGotten.length > 0){

     joinAndSortID = usersGotten[0].id > user?.uid ? usersGotten[0].id + user.uid : user.uid+usersGotten[0].id
    console.log("jointId",joinAndSortID);
    
}
else{
       joinAndSortID = otherUserInfos[0].id > user?.uid ?  otherUserInfos[0].id + user.uid : user.uid + otherUserInfos[0].id
}
      
    const userChatsRefInChats = doc(db, "chats", joinAndSortID);
    console.log(message);

    // handle images added to sent message
if (message.imageMsg) {
    // Storing image in firebase storage
    const storageRef = ref(storage,  message.imageMsg.name + message.date);
    let file  = message.imageMsg
    const uploadTask = uploadBytesResumable(storageRef, message.imageMsg);




        // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
    (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
    case 'paused':
    console.log('Upload is paused');
    break;
    case 'running':
    console.log('Upload is running');
    break;
    }
    }, 
    (error) => {
    console.log(error);
    }, 
    async() => {
    const imageURL = await  getDownloadURL(uploadTask.snapshot.ref)

    // update Chats docs without overwriting the previous datas
    await updateDoc(userChatsRefInChats, {
    messages: arrayUnion({
    id:uuid(),
    name:user.displayName,
    email:user.email,
    messageText:message.messageText,
    imageMsg:imageURL,
    time:Timestamp.now()
    })
    });

   // add chat to user-chats
    const getExistingDocument = await getDoc(doc(db,"chats",joinAndSortID))
    if (getExistingDocument.exists()) {
    // for me

if (usersGotten.length < 1) {
await updateDoc(doc(db, "user-chats",  user.uid), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});

await updateDoc(doc(db, "user-chats",  otherUserInfos[0].id), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});
    setMessage({
    messageText:"",
    imageMsg:null,
    date:new Date().toLocaleString()
    })


return

}



//     await setDoc(doc(db, "user-chats", user.uid), {
//     messages:getExistingDocument?.data()?.messages,
//    usersInfos:getExistingDocument?.data()?.usersInfos
// });
// for other user
// await setDoc(doc(db, "user-chats", usersGotten[0].id), {
//     messages:getExistingDocument?.data()?.messages, 
//     usersInfos:getExistingDocument?.data()?.usersInfos
//     });

await updateDoc(doc(db, "user-chats",  user.uid), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});

await updateDoc(doc(db, "user-chats",  usersGotten[0].id), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});

    setMessage({
    messageText:"",
    imageMsg:null,
    date:new Date().toLocaleString()
    })



    }
  }
)
    setMessage({
    messageText:"",
    imageMsg:null,
    date:new Date().toLocaleString()
    })

return
    
   
}



    // update Chats docs without overwriting the previous datas
    await updateDoc(userChatsRefInChats, {
    messages: arrayUnion({
    id:1,
    name:user.displayName,
    email:user.email,
    messageText:message.messageText,
    imageMsg:message.imageMsg,
    time:new Date().toLocaleString()
    })
    });




    // add chat to user-chats
        const getExistingDocument = await getDoc(doc(db,"chats",joinAndSortID))
    if (getExistingDocument.exists()) {
    // for me
//     await setDoc(doc(db, "user-chats", user.uid), {
//    [joinAndSortID]:{
//     messages:getExistingDocument?.data()?.messages, 
//     usersInfos:getExistingDocument?.data()?.usersInfos}
//     });
//     // for other user
//     await setDoc(doc(db, "user-chats", usersGotten[0].id), {
//    [joinAndSortID]:{
//     messages:getExistingDocument?.data()?.messages, 
//     usersInfos:getExistingDocument?.data()?.usersInfos}
//     })
    }

//  db.collection("users").doc("frank").update({
//   favorites: {
//     food: "Ice Cream"
//   }
// }).then(function() {
//   console.log("Frank food updated");
// });



// const updatingUserChatsdoc = doc(db, "user-chats",  user.uid);
// ||||||||||||||||
if (usersGotten.length < 1) {
    
await updateDoc(doc(db, "user-chats",  user.uid), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});

await updateDoc(doc(db, "user-chats",  otherUserInfos[0].id), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});

    setMessage({
    messageText:"",
    imageMsg:null,
    date:new Date().toLocaleString()
    })
return
}



// |||||||
await updateDoc(doc(db, "user-chats",  user.uid), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});

await updateDoc(doc(db, "user-chats",  usersGotten[0].id), {
[joinAndSortID]:{
    messages:getExistingDocument?.data()?.messages, 
    usersInfos:getExistingDocument?.data()?.usersInfos}
});

    setMessage({
    messageText:"",
    imageMsg:null,
    date:new Date().toLocaleString()
    })


    }

;
    


    // HANDLEUSERSEARCHCLICKED BTN


    const handleSearchedUserClicked = async(userFound:typeGottenUsers)=>{
    const sortNames =( userFound.name + user?.displayName)
    // console.log(userFound.name,user);

    // check if UsersChats already exists 
    const q = query(collection(db, "chats"), where("name", "==", userFound.name.toLowerCase()));
   
    // const joinAndSortID = userFound.name.length > user?.displayName.length ? userFound.id as string + user.uid : user.uid as string + userFound.id

          const joinAndSortID = usersGotten[0].id > user?.uid ? usersGotten[0].id + user.uid : user.uid+usersGotten[0].id
// console.log("jointId",joinAndSortID);

    const getExistingDocument = await getDoc(doc(db,"chats",joinAndSortID))

    if (getExistingDocument.exists()) {
    console.log("document already created");
    router.push("/users/"+userFound.name)
    setUserMessagToDisplayeID(userFound.id);
    setClickedUser(userFound);
    // console.log(userFound);
    
    return

    }
    await setDoc(doc(db, "chats", joinAndSortID), {
    messages:[],
    usersInfos:[userFound,{name:user.displayName,imageURL:user.photoURL,id:user.uid,email:user.email}]
    });
    router.push("/users/"+userFound.name)
    }

// HANDLESEARCH BTN
    const handleSearch =async (event:React.SyntheticEvent):Promise<void>=>{
    event.preventDefault()
     setUsersGotten([])

     try {
    const q = query(collection(db, "users"), where("name", "==", searchUser));
    const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log("users doesn't exist");
    return
  }
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    
    setUsersGotten([doc.data() as typeGottenUsers])
    });
     } catch (error) {
        
     }

    // console.log();

    }
    


// ONSnapShot

    //   useEffect(()=>{
    
    //    if (user) {
        
    //     const unsub = onSnapshot(doc(db, "user-chats", user.uid), (doc) => {
    //            // console.log("Current data: ", doc.data());
    //            //  console.log(doc.data());
    //             setGetAllMyChats(doc.data() as typeGetMessagesAndInfos)
    //             let  docRecievedInfoArray = Object.entries<DocumentData>(doc.data() as DocumentData).map((item,index)=>{
    //                 return item[1]
    //             })
    //             let getMessages = docRecievedInfoArray.map((item,index)=>{
    //                 return item.messages })
    //                 setGetLastMessage(getMessages as typeMessagesFromGetMessagesAndInfo[] )
    //                 setChatsUsersInfos(docRecievedInfoArray.map(item=> {
    //                     return item.usersInfos.filter((i:typeGottenUsers)=> i.id !== user.uid)[0]
    //                 }))
                    
    //             });
    //             return ()=> unsub()
    //         }
    
    
    // },[message,clickedUser,messagesToDisplay])


    

return (
   <SecondAppContext.Provider value={{
    searchUser,
    setSearchUser,
    handleSearch,
    usersGotten,
    setUsersGotten,
    message,
    setMessage,
    handleMessageSent,
    handleSearchedUserClicked,
    userMessageToDisplayID,
    setUserMessagToDisplayeID,
    getLastMessage,
    setGetLastMessage,
    chatsUsersInfos,
    setChatsUsersInfos,
    getAllMyChats,
    setGetAllMyChats,
    messagesToDisplay,
    setMessagesToDisplay,
    clickedUser,
    setClickedUser


   }}>
    {children}
   </SecondAppContext.Provider>
        )
}


export {SecondAppContext,SecondAppProvider}