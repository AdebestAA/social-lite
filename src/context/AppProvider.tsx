"use client"
import React, { ReactElement, createContext, useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile,signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db, storage } from '@/firebase';
import {useAuthState} from "react-firebase-hooks/auth"
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"; 
import { redirect, useRouter } from 'next/navigation';


// THIS CONTEXT IS FOR USER SIGN AND SIGN

    type ContextType = {
    user:any
    userSignUp:{name:string,email:string,password:string,image:{}},
    setUserSignUp:React.Dispatch<React.SetStateAction<UserSignUp>>,
    handleSignUp:(e:React.SyntheticEvent)=>void,
    userSignIn:{email:string,password:string},
    setUserSignIn:React.Dispatch<React.SetStateAction<UserSignIn>>,
    handleSignIn:(e:React.SyntheticEvent)=>void,
    handleSignOut:()=> void,
    setLoadSpin:React.Dispatch<React.SetStateAction<boolean>>,
    loadSpin:boolean,
    loading:boolean | undefined| Error
    }

    export type UserSignUpImage = {
    lastModified?:number,
    lastModifiedDate?:any,
    name?:string,
    size?:number,
    type?:string,
    webkitRelativePath?:string
    }

    type UserSignUp = {
    name:string,
    email:string,
    password:string,
    image:any
    }
    const signUpObject:UserSignUp = {
    name:"",
    email:"",
    password:"",
    image:{}
    }


    const signInObject :UserSignIn = {
    email:"",
    password:""
    }


const initailContext:ContextType = {
    user :undefined,
    userSignUp:signUpObject,
    setUserSignUp:()=>{},
    handleSignUp:(e:React.SyntheticEvent)=>{},
    userSignIn:signInObject,
    setUserSignIn:()=> {},
    handleSignIn:(e:React.SyntheticEvent)=>{},
    handleSignOut:()=> {},
    setLoadSpin:()=>{},
    loadSpin:false,
    loading:false

}

type UserSignIn = {
    email:string,
    password:string
}

export const AppContext = createContext<ContextType>(initailContext)

const AppProvider = ({children}:{children:ReactElement}) => {
    const [userSignUp,setUserSignUp] = useState<UserSignUp>(signUpObject)
    const [userSignIn,setUserSignIn] = useState<UserSignIn>(signInObject)
    const router  = useRouter()
    const [loadSpin,setLoadSpin] = useState<boolean>(false)
    const [user,error,loading] = useAuthState(auth)
   
    
    


// SIGN OUT
    const handleSignOut = async()=>{

        console.log("jamex");
        
    try {
    const logOut = await signOut(auth)

   if (typeof window !== 'undefined') {
  router.push("signup")
    return
  }
    
    } catch (error) {
    console.log(error);

    }


    }


// SIGN IN FUNCTION
const handleSignIn = async(e:React.SyntheticEvent)=>{
    e.preventDefault()
if (!userSignIn.email || !userSignIn.password) {
    alert("field empty")
    return
}

try {
    const email =userSignIn.email;
    const passowrd = userSignIn.password 
    const res = await signInWithEmailAndPassword(auth,email,passowrd)
    console.log(res);
    
    router.push("/")

} catch (err:any) {
    // console.log(err.message);
    // console.log(err.message.slice(22,err.message.length - 2));
    window.alert(err.message.slice(22,err.message.length - 2))
    
}
}

// SIGN UP FUNCTION
    const handleSignUp = async(event:React.SyntheticEvent):Promise<void>=> {
    event.preventDefault()
    
    if (!userSignUp.name || !userSignUp.email || !userSignUp.password || !userSignUp.image?.name ) {
        alert("empty field")
        return
    }

    if (userSignUp.password.length < 7) {
        alert("password must be at least 6 characters")
        return
    }
    
    // console.log(userSignUp.image)

    // import { collection, query, where } from "firebase/firestore";
    let nameFound:string | null = ""
const usersRef = collection(db, "users");

const q = query(usersRef, where("name", "==", userSignUp.name.toLowerCase().trim()));
console.log(q);

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
//   console.log(doc.data());
  nameFound = doc.data().name
//   console.log(doc.id, " => ", doc.data());
});


if (nameFound) {
    alert("use a different username,username already exist")
    return
}

    try {
    const email = userSignUp.email.toLowerCase().trim()
    const passowrd = userSignUp.password.toLowerCase().trim()
    const res =await createUserWithEmailAndPassword(auth, email, passowrd)
    const userCreated  = res.user


    // console.log(userCreated);
// Storing image in firebase storage
    const storageRef = ref(storage, userSignUp.image?.name);
    let file  = userSignUp.image
    const uploadTask = uploadBytesResumable(storageRef,  userSignUp.image);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
    (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    // console.log('Upload is ' + progress + '% done');
    // switch (snapshot.state) {
    // case 'paused':
    // console.log('Upload is paused');
    // break;
    // case 'running':
    // console.log('Upload is running');
    // break;
    // }
    }, 
    (error) => {
    // Handle unsuccessful uploads
    console.log(error);

    }, 
    async() => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...


    // get the downlaodable URL
    const imageURL = await  getDownloadURL(uploadTask.snapshot.ref)
    // Add a new document containg the newly sign up user with a generated id
    const userRef = doc(db, "users",userCreated.uid);
    // UPDATING THE USER CREATED object
    const updateUser = await updateProfile(userCreated, {
    displayName:userSignUp.name, 
    photoURL:imageURL
    })
    await setDoc(userRef, {
    id:userCreated.uid,
    name:userSignUp.name,
    email:userSignUp.email,
    imageURL:imageURL
    })
console.log(updateUser)

// create user in user-chats
  const userChatsRef = doc(db, "user-chats",userCreated.uid);
    await setDoc( userChatsRef , { })


    //  console.log('File available at',imageURL);
    // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    // //   console.log('File available at', downloadURL);
    // });
  }
)

router.push("/")

} catch (err:any) {
    console.log(err);
    
 window.alert(err.message.slice(22,err.message.length - 2))
}





// Add a new document with a generated id
// const newCityRef = doc(collection(db, "cities"));

// await setDoc(newCityRef, userSignUp)

}



const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{





}
  return (
<AppContext.Provider value={{
    user,
    userSignIn,
    setUserSignIn,
    handleSignIn,
    userSignUp,
    setUserSignUp,
    handleSignUp,
    handleSignOut,
    setLoadSpin,
    loadSpin,
    loading
    }} >
    {children}
</AppContext.Provider>
  )
}

export default AppProvider
