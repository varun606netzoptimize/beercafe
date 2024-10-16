// MUI Imports
import { useContext } from 'react'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { AuthContext } from '@/context/AuthContext'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  const { authToken } = useContext(AuthContext)

  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {authToken.role == 'admin' ? (
          <>
            <MenuItem href='/home' icon={<i className='tabler-layout-dashboard' />}>
              Dashboard
            </MenuItem>
            <MenuItem href='/rfid' icon={<i className='tabler-user-heart' />}>
              Manage RFIDs
            </MenuItem>
            <MenuItem href='/customers' icon={<i className='tabler-user-heart' />}>
              Manage Customers
            </MenuItem>
          </>
        ) : authToken.role == 'owner' ? (
          <>
            <MenuItem href='/home' icon={<i className='tabler-layout-dashboard' />}>
              Dashboard
            </MenuItem>
            <MenuItem href='/myCafes' icon={<i className='tabler-beer' />}>
              Manage My Cafes
            </MenuItem>
            <MenuItem href='/products' icon={<i className='tabler-beer' />}>
              Manage Products
            </MenuItem>
            <MenuItem href='/orders' icon={<i className='tabler-square' />}>
              Manage Orders
            </MenuItem>
            <MenuItem href='/users' icon={<i className='tabler-user-screen' />}>
              Manage Users
            </MenuItem>
          </>
        ) : (
          <></>
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
