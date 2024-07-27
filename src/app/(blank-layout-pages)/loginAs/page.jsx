// Component Imports
import UserLogin from '@/views/UserLogin'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Login As',
  description: 'Select Login Type'
}

import LoginAs from '@/views/LoginAs'

export default function LoginAsPage() {
  const mode = getServerMode()

  return <LoginAs mode={mode} />
}
