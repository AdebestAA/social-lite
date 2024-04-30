
import dynamic from 'next/dynamic'
import React from 'react'

const HydrationLoader = dynamic(()=> import("@/components/Loader"),{ssr:false})
  
const loading = () => {
  return (
<div className="w-screen h-screen flex items-center justify-center">
  <img src="gear.svg" alt="gear" className="w-16 h-16"/>
  </div>
  )
}

export default loading
