import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'


import { AppContext } from '@/context/AppProvider';
// import Links from './links';
import dynamic from 'next/dynamic';
const HydrationTest = dynamic(()=> import('./Links'),{ssr:false})

const Navbar = () => {
 const pathName = usePathname()
 const {user} = useContext(AppContext)

  return (


   <nav className='bg-green-500 text-black font-bold flex justify-evenly h-12 items-center fixed bottom-0 w-full'>
< HydrationTest/>
   </nav>
   
  )
}


export default Navbar


