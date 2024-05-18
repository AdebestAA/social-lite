"use client"
import Navbar from "@/components/navbar";
import { AppContext } from "@/context/AppProvider";
import { auth, db } from "@/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import ComponentsProviders from "@/components/ComponentsProviders";

import { PostContext } from "@/context/PostContext";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { TypePostToRecievd } from "@/types";
import dynamic from "next/dynamic";



const HydrationLoader = dynamic(()=> import("@/components/Loader"),{ssr:false})
  





export default function Home() {
  
  const {  handleSignOut,loading,user, thereIsActiveUser} = useContext(AppContext)
  const {postToDisplay, handleViewSinglePost,handleLikes, setPostToDisplay} = useContext(PostContext)
  const [changeState,setChangeState] = useState(true)
  
//   const notify = () => toast("not so bad bro!"
// );

let myDate = new Date((postToDisplay[0]?.date?.seconds  + postToDisplay[0]?.date.nanoseconds/1000000000)* 1000)

  const router = useRouter()

  
  useLayoutEffect(()=>{
// if (!user || user === null || Object.entries(user).length <1) {
  
// }
  },[])
useEffect(()=>{



async function getAllPosts () {
    
    const querySnapshot = await getDocs(collection(db, "posts"));
let copyPostToDisplay:TypePostToRecievd[]  = []
    querySnapshot.forEach((doc) => {

      copyPostToDisplay =[...copyPostToDisplay,doc.data() as TypePostToRecievd]
         
     
         setPostToDisplay([...copyPostToDisplay])
        });
}
 getAllPosts()

},[changeState,postToDisplay])
// console.log(user);

if (loading) {

  return <ComponentsProviders>
     < HydrationLoader/>
  </ComponentsProviders>

}
if ( thereIsActiveUser && !user || !user?.photoURL) {
  return <ComponentsProviders>
     < HydrationLoader/>
  </ComponentsProviders>

}
//  console.log(user);
  

  return (
<ComponentsProviders>
     <main className="flex flex-col items-center pb-16">
{user !== null ? ( <header className="flex justify-between items-center font-semibold bg-green-500 sticky top-0 w-full px-4 py-2  z-10">
<div className="relative w-[50px] h-[50px] rounded-full">
  <Image  priority src={user?.photoURL ? "https://firebasestorage.googleapis.com/v0/b/social-lite-a2fa1.appspot.com/o/running-is-one-of-the-best-ways-to-stay-fit-royalty-free-image-1036780592-1553033495.jpg?alt=media&token=626ff05e-a45e-4712-b5f1-990a3ad409c7" :"/user-model.png" } alt="myPhoto" className="rounded-full" fill/>
</div>
  {/* <img  src={user.photoURL} alt={user?.displayName ? user.displayName : "nothing"} /> */}
<h1 className="capitalize">welcome {user?.displayName}</h1>
      </header> ): ""}
<button onClick={()=> {
  if (typeof window !== "undefined") {
    
    if (user === null) {
      router.push("signup")
      return
    }
    router.push("/post")
  }
  
  }} className="bg-green-500 text-black font-bold fixed rounded-full w-[50px] h-[50px] left-[85%] bottom-[10%] flex items-center justify-center hover:text-gray-500 hover:opacity-90 z-40"><FaPlus className="text-2xl" /></button>


{postToDisplay.map((post,index)=>{

return (
<article 
key={index} 
className="border-[1px] border-gray-500 shadow-md my-2 py-2  flex flex-col rounded-md  w-[30%] xl:w-[40%] lg:w-[55%] md:w-[75%] xsm:w-[75%] xxsm:w-[90%]"
onClick={(e)=> {
     if (user === null) {
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
 <Image src={post.userImg}  priority  className="rounded-full object-cover" fill alt={post.id}/>
</div>
    <h2 className="w-[90%] mx-auto capitalize">{post.userDisplayName}</h2>
    </section>
    <p>{ new Date((post?.date?.seconds  + post?.date.nanoseconds/1000000000)* 1000).toDateString().slice(0,7)}</p>
  </header>
  {/* post text,image...etc */}
  <div>

<p  className="w-[90%] mx-auto">{post.postText}</p>
  {/* image section */}
{post.postImg &&  (
<div className="relative justify-self-center w-[90%] min-h-[400px] sm:h-[500px] mx-auto rounded-md">
 <Image src={post.postImg} fill alt={post.id} className="rounded-md object-cover"/>
</div>
) }
{/* comments and like */}
<div className="flex justify-between w-[90%] mx-auto">
<p className="flex items-center gap-[2px] cursor-pointer" onClick={(e)=>{ 
   if (user === null) {
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
