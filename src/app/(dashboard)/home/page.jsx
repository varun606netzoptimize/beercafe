'use client'

import { useContext, useEffect } from 'react'

import { redirect } from 'next/navigation'

import { AuthContext } from '@/context/AuthContext'

export default function Page() {
  const { authToken, tokenCheck } = useContext(AuthContext)

  useEffect(() => {
    console.log('1')

    if (tokenCheck) {
      console.log('2')

      if (!authToken.token) {
        console.log('3')

        redirect('/loginAs')
      }
    }
  }, [authToken])

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex bs-full'>
      <h1>Home page! {}</h1>
    </div>
  )
}
