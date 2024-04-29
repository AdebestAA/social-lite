"use client"
import Navbar from "@/components/navbar";
import { AppContext } from "@/context/AppProvider";
import { auth, db } from "@/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import SignedIn from "./usersignedin/layout";
import User from "./usersignedin/page";
import ComponentsProviders from "@/components/ComponentsProviders";
import { useAuthState } from "react-firebase-hooks/auth";
import { PostContext } from "@/context/PostContext";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { TypePostToRecievd } from "@/types";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";


const HydrationLoader = dynamic(()=> import("@/components/Loader"),{ssr:false})
  





export default function Home() {
  // const [display,setPostToDisplay] = useState([])
  const {  handleSignOut,loading,user} = useContext(AppContext)
  const {postToDisplay, handleViewSinglePost,handleLikes, setPostToDisplay} = useContext(PostContext)
  const [changeState,setChangeState] = useState(true)
  
//   const notify = () => toast("not so bad bro!"
// );

let myDate = new Date((postToDisplay[0]?.date?.seconds  + postToDisplay[0]?.date.nanoseconds/1000000000)* 1000)
// console.log(myDate.toLocaleDateString());
const searchParam = useSearchParams()
// const [user,loading,error] = useAuthState(auth)


let id  = "acchijkrs"
let second = "acejknsu"
  const router = useRouter()
const handleGetUserChats = async()=>{

//     const getExistingDocument = await getDoc(doc(db,"user-chats",id))

//     console.log(getExistingDocument.data());

// Add NEW DOC withOUT overwriting the existing ones
// const washingtonRef = doc(db, "user-chats", id);
// await updateDoc(washingtonRef, {
//   anotherName:[
//     {
//       name:"blessing",
//       age:"shame"
    
//     }
//   ]
// });


// Edit existing Doc
const frankDocRef = doc(db, "user-chats", id);
// await setDoc(frankDocRef, {
//     name: "Frank",
//     favorites: { food: "Pizza", color: "Blue", subject: "recess" },
//     age: 12
// });

// To update age and favorite color:
await updateDoc(frankDocRef, {
    "chris": [{
      name:"i changes this",
      age:"is it working"
    }]
});
    
}

  const handleGet = async()=>{
    const getExistingDocument = await getDoc(doc(db,"chats",second))

if (getExistingDocument.exists()) {
        await setDoc(doc(db, "user-chats", id), {
       [second]:getExistingDocument?.data()?.messages, 
    });
}
    console.log(getExistingDocument.data());
    
  }
const children = ()=>{

  return <span>show this please</span>
}


useEffect(()=>{
async function getAllPosts () {
    
    const querySnapshot = await getDocs(collection(db, "posts"));
    console.log(querySnapshot);
let copyPostToDisplay:TypePostToRecievd[]  = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
//         // console.log(doc.id, " => ", doc.data());
//         console.log(doc.data());
      copyPostToDisplay =[...copyPostToDisplay,doc.data() as TypePostToRecievd]
         
     
         setPostToDisplay([...copyPostToDisplay])
        });
}
 getAllPosts()

},[changeState,postToDisplay])

if (loading) {

  return <ComponentsProviders>
     < HydrationLoader/>
  </ComponentsProviders>

}
  

  return (
<ComponentsProviders>
     <main className="flex flex-col items-center pb-16">
{ user !== null &&  <header className="flex justify-between items-center font-semibold bg-green-500 sticky top-0 w-full px-4 py-2  z-10">
<div className="relative w-[50px] h-[50px] rounded-full">
  <Image src={user?.photoURL} alt="myPhoto" className="rounded-full" fill/>
</div>
<h1 className="capitalize">welcome {user?.displayName}</h1>
      </header>}
      {/* <button onClick={notify}>Click</button>
      <ToastContainer position="top-center" 
      bodyClassName="bg-red-500 w-full"
     progressClassName="bg-blue-500"
      /> */}
      {/* <h1>Post Components</h1>
<h4>welcome {user?.displayName}</h4>
 <button 
className="border-2 border-black my-2 "
onClick={()=> router.push("./home")}>go to home</button>
<br />
<button  onClick={handleSignOut} className="border-2 border-black ">sign out</button>
<br />
<button  onClick={()=> router.push("/signup") } className="border-2 border-black my-2 ">sign Up page</button>
<br />
<button   onClick={()=> router.push("/signin")} className="border-2 border-black ">sign in page</button>
<br />
<button   onClick={handleGet} className="border-2 border-black mt-2">GET</button>
<br />
<button   onClick={handleGetUserChats} className="border-2 border-black mt-2">userchats</button> */}
{/* fixed elements */}
<button onClick={()=> {
  
  if (!user || Object.entries(user).length < 1) {
    router.push("signup")
    return
  }
  router.push("/post")
  
  }} className="bg-green-500 text-black font-bold fixed rounded-full w-[50px] h-[50px] left-[85%] bottom-[10%] flex items-center justify-center hover:text-gray-500 hover:opacity-90 z-40"><FaPlus className="text-2xl" /></button>


{postToDisplay.map((post,index)=>{

return (
<article 
key={index} 
className="border-[1px] border-gray-500 shadow-md my-2 py-2 w-[90%] flex flex-col rounded-md  max-w-[600px]"
onClick={(e)=> {
     if (!user) {
        router.push("signup")
        return
    }
  handleViewSinglePost(e,post.id)
}}
>
  {/* user Display name and Date */}
  <header className="flex justify-between px-2 w-[90%] mx-auto items-center">
    <section className="flex items-center">
  <div className="relative w-[50px] rounded-full h-[40px]">
 <Image src={post.userImg}  className="rounded-full" fill alt={post.id}/>
</div>
    <h2 className="w-[90%] mx-auto capitalize">{post.userDisplayName}</h2>
    </section>
    <p>{ new Date((post?.date?.seconds  + post?.date.nanoseconds/1000000000)* 1000).toDateString().slice(0,7)}</p>
  </header>
  {/* post text,image...etc */}
  <div>

<p  className="w-[90%] mx-auto">{post.postText}</p>
  {/* image section */}
{post.postImg &&  <div className="relative justify-self-center w-[90%] min-h-[300px] mx-auto rounded-md">
 <Image src={post.postImg} fill alt={post.id} className="rounded-md"/>
</div>}
{/* comments and like */}
<div className="flex justify-between w-[90%] mx-auto">
<p className="flex items-center gap-[2px] cursor-pointer" onClick={(e)=>{ 
   if (!user) {
        router.push("signup")
        return
    }
  handleLikes(e,post.id)
  setChangeState((prev)=> !prev)
  }}>{post.likes.length < 1 ? 0 : post.likes.length} < FaHeart className={post.likes.some((item:{id:string,userImg:string,userName:string}) => item.id === user?.uid) ? "text-green-400" : ""} /></p>
<p>{post.comments.length < 1 ? "0 comment" : post.comments.length  + "comments"}</p>
</div>
  </div>
</article>
)
})}
    </main>
</ComponentsProviders>
  );
}
