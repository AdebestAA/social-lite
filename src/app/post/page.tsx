"use client"
import ComponentsProviders from '@/components/ComponentsProviders'
import { PostContext } from '@/context/PostContext'

import React, { useContext} from 'react'

const  Page = () => {

  const {post,setPost,handlePost} = useContext(PostContext)
  console.log(post);

  
  return (
<ComponentsProviders>
    <div className='flex font-semibold text-center justify-center flex-col items-center pt-8'>
        <aside className='w-3/5'>
      <h1 className='bg-green-500 rounded-md capitalize py-2'>Write your post</h1>
    <textarea name="" id=""
    // value={"chris"}
    placeholder='whats on your mind'
    className='px-2 bg-gray-800 w-full h-[100px] rounded-md my-4'

    onChange={(e)=> setPost({...post,postText:e.target.value})}
    ></textarea>
    <br />
      <label htmlFor="file" className='rounded-md my-2 bg-gray-500 px-2 py-2'>UPLOAD IMAGE</label>
      <input type="file" 
      style={{display:"none"}}
       id='file'
        onChange={(e)=>{
      const file = e.target.files ? e.target.files[0]  : null
      setPost({...post,postImg:file})}}
       />
      <br />
      <button className='rounded-md my-2 bg-green-500 w-full py-2' onClick={handlePost}>POST</button>
    </aside>
    </div>

</ComponentsProviders>
  )
}

export default Page
