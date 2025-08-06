import React from 'react'
import { Card, CardHeader, CardTitle } from '../../../components/ui/card'

const page = () => {
  return (
    <div className='grip gap-6 grid-cols-1 m-20 w-40  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <Card>
        <CardHeader>
            <CardTitle>
                Total Sales
            </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

export default page
