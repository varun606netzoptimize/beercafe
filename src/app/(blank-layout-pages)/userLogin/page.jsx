// Component Imports
import UserLogin from '@/views/UserLogin'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const UserLoginPage = () => {
  // Vars
  const mode = getServerMode()

  return <UserLogin mode={mode} />
}

export default UserLoginPage
