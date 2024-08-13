'use client'

// Third-party Imports
import { useContext } from 'react'

import classnames from 'classnames'

// Component Imports
import { Typography } from '@mui/material'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { AuthContext } from '@/context/AuthContext'

const NavbarContent = () => {
  const { pageTitle } = useContext(AuthContext)

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <Typography variant='h5'>{pageTitle}</Typography>
      </div>
      <div className='flex items-center'>
        <ModeDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
