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
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
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
