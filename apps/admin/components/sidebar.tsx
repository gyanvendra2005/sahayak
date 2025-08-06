import { ChartNoAxesColumn, SquareLibrary } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const sidebar = () => {
  return (
    <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] p-5 sticky h-screen top-0">
       <div className='mt-20 space-y-6'>
        <Link href="/dashboard" className='flex  gap-2'>
        <ChartNoAxesColumn size={24} className='text-gray-800 dark:text-gray-200' />
        <h1>Dashboard</h1>
        </Link>
        <Link href="/coursetable" className='flex  gap-2'>
          <SquareLibrary size={24} className='text-gray-800 dark:text-gray-200' />
          <h1>courses</h1>
          </Link>
       </div>
    </div>
  )
}

export default sidebar
