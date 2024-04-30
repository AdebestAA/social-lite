import React from 'react'
import Navbar from './navbar'
import { usePathname } from 'next/navigation'

const ComponentsProviders = ({children}:{children:React.ReactElement}) => {

  const pathName = usePathname()

  
  return (
    <div className=''>
      {children}
    <Navbar/>
    </div>
  )
}

export default ComponentsProviders
