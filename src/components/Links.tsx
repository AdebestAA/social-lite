"use client"
import { AppContext } from '@/context/AppProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { IoIosHome } from "react-icons/io";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { HiChatBubbleLeft } from "react-icons/hi2";
import { HiUserCircle } from "react-icons/hi";
import { IoSearchCircleSharp } from "react-icons/io5";

const Links = () => {
     const pathName = usePathname()
 const {user} = useContext(AppContext)
  return (
  <>
      <Link href={"/"} className={pathName === "/" ?"text-gray-300" : ""} ><IoIosHome className='text-2xl' /> </Link>
    <Link href={"/groupchat"} className={pathName === "/groupchat" ?"text-gray-300" : ""} ><HiChatBubbleLeftRight className='text-2xl' /></Link>
    <Link href={"/chat"} className={pathName === "/chat" ?"text-gray-300" : ""} ><HiChatBubbleLeft  className='text-2xl'></HiChatBubbleLeft></Link>
    <Link href={"/users"} className={pathName === "/users" ?"text-gray-300" : ""} ><IoSearchCircleSharp className='text-3xl' /></Link>
    <Link href={"/myinfo"} className={pathName === "/myinfo" ?"text-gray-300" : ""}  >< HiUserCircle className='text-3xl'  /></Link>
  </>
  )
}

export default Links
