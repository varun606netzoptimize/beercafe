const baseURL = process.env.NEXT_PUBLIC_APP_URL

export const ENDPOINT = {
  LOGIN: baseURL + '/api/auth/login',
  VERIFY: baseURL + '/api/auth/verifyAdminToken',
  REQUEST_OTP: baseURL + '/api/auth/requestOTP',
  VERIFY_OTP: baseURL + '/api/auth/verifyOTP'
}
