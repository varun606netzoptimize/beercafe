'use client'

import { useContext, useEffect } from 'react'

import { redirect } from 'next/navigation'

import { AuthContext } from '@/context/AuthContext'

// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'

const Navbar = () => {
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
    <LayoutNavbar>
      <NavbarContent />
    </LayoutNavbar>
  )
}

export default Navbar
