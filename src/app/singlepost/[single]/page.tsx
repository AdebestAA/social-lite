"use client"
import { AppContext } from '@/context/AppProvider'
import { PostContext } from '@/context/PostContext'
import { db } from '@/firebase'
import { TypePostToRecievd } from '@/types'
import { collection, getDocs } from 'firebase/firestore'
import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import { FaHeart } from "react-icons/fa";

const  Page = ({params}:{params:{single:string}}) => {
  
  // console.log(params);

  const {postToDisplay, handleViewSinglePost,setSinglePost,
    singlePost,handleLikes,showCommentBox,
        setShowCommentBox,
        comment,
        setComment,handlePostYourcomment, handleDeleteComment, setPostToDisplay} = useContext(PostContext)

const {user} = useContext(AppContext)


    useEffect(()=>{

      async function getAllPosts () {
        if (typeof window !== 'undefined' && window.location) {
        // Access location if it's available in the browser
        // console.log(location.pathname);
      
      const querySnapshot = await getDocs
    (collection(db, "posts"));
    
    let copyPostToDisplay:TypePostToRecievd[]  = []
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //         // console.log(doc.id, " => ", doc.data());
    //         console.log(doc.data());
    copyPostToDisplay =[...copyPostToDisplay,doc.data() as TypePostToRecievd]
    
    
    setPostToDisplay([...copyPostToDisplay])
  });

    const findPostFromPostTodisplay= postToDisplay.find(item => item.id === params.single || null) as TypePostToRecievd 
    setSinglePost(findPostFromPostTodisplay)
  }
  }
  
  
  getAllPosts()
  
  
  return ()=> {
    
    getAllPosts()
  
}
    },[showCommentBox,postToDisplay])

// second useEffect

//   useEffect(()=>{
//       if (singlePost.id) {
//         localStorage.setItem("singlePost",JSON.stringify(singlePost))
//       }


// const getSingleFromLocalStorage: TypePostToRecievd = JSON.parse(localStorage.getItem("singlePost") as string)
// console.log(getSingleFromLocalStorage);

// setSinglePost(getSingleFromLocalStorage)
//     },[showCommentBox,comment])
    return (
      <div className='flex flex-col my-2 '>
      {/* first section */}
<header className='flex text-black font-semibold items-center w-[90%] mx-auto space-x-2'>
<div className="relative w-[50px] h-[50px] rounded-full ">
<Image className='rounded-full' src={singlePost?.userImg} fill alt={singlePost?.postText} />
</div>
<h1 className='text-gray-200 capitalize'>{singlePost?.userDisplayName}</h1>

</header>
    {/* second section */}
<article className='w-[90%] mx-auto'>
<p>{singlePost?.postText}</p>
{singlePost?.postImg && <div className="relative w-5/5 h-[400px]  min-h-[500px] sm:h-[500px] md:h-[800px] mx-auto rounded-md my-2">
<Image className='rounded-md '  src={singlePost?.postImg} fill alt={singlePost?.postText} />
</div>}
</article>
    {/* third section */}
<div className='flex border-y-2 border-gray-400 justify-between px-2'>

<p className='cursor-pointer flex items-center' onClick={(e)=> handleLikes(e,singlePost?.id)}>
{singlePost?.likes.length < 1 ? "0" : singlePost?.likes.length} < FaHeart className={singlePost?.likes.some((item:{id:string,userImg:string,userName:string}) => item.id === user?.uid) ? "text-green-400" : ""} /> </p>
<p onClick={()=> setShowCommentBox(true)} className='cursor-pointer'>Comment</p>
<p>{ new Date((singlePost?.date?.seconds  + singlePost?.date.nanoseconds/1000000000)* 1000).toDateString()}</p>
</div>

{/* fourth section */}

<div>
{singlePost?.comments.length > 0 ? (
<div>
{singlePost.comments.map((comment,index)=>{

return (
<article key={index} className='flex border-[1px] border-gray-500 justify-between px-2 py-2 '>
<div className="relative w-[50px] h-[50px]">
<Image src={comment.userImg} className='rounded-full' fill alt={comment.commentText} />
</div>
<div className='w-[60%]'>
<h4 className='capitalize'>{comment.userName}</h4>
<p>{comment.commentText}</p>
</div>
{/* delete and date */}
<div className='flex justify-end flex-col items-end w-[20%]'>
<p>{new Date((comment?.date?.seconds  + comment?.date.nanoseconds/1000000000)* 1000).toDateString().slice(0,5)}...</p>

{/* delete button */}
{user.uid === comment.userId ? <button className='uppercase bg-red-800 font-semibold rounded-md px-[2px] py-[1px]' onClick={()=> handleDeleteComment(singlePost.id,comment.commentId)}>delete</button> : ""}
</div>
</article>
)
})}
</div>

)  : "no comments"}
</div>

{ showCommentBox  && <aside className='w-full fixed bottom-0 bg-gray-700 px-4 flex items-center gap-4 justify-center'>
<textarea name="" id=""
placeholder='type your comment'
className='px-2  bg-gray-800 w-4/5 h-[50px] rounded-md'
onChange={(e)=> setComment(e.target.value)}
></textarea>
<button className='rounded-md  text-black font-semibold my-2 bg-green-500 h-[50px] px-2' onClick={()=> handlePostYourcomment(singlePost?.id)}>POST</button>
</aside>}
</div>
  )
}

export default Page
