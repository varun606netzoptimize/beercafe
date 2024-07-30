const baseURL = process.env.NEXT_PUBLIC_APP_URL

export const ENDPOINT = {
  LOGIN: baseURL + '/api/auth/login',
  VERIFY: baseURL + '/api/auth/verifyAdminToken',
  REQUEST_OTP: baseURL + '/api/auth/requestOTP',
  VERIFY_OTP: baseURL + '/api/auth/verifyOTP',
  GET_CAFES: baseURL + '/api/admin/getCafe',
  CAFE_STATS: baseURL + '/api/admin/cafeStats',
  GET_MANAGERS: baseURL + '/api/admin/getManagers/',
  GET_CUSTOMERS: baseURL + '/api/admin/getUsers/',
  ADD_USER: baseURL + '/api/admin/addUser',
  DELETE_USER: baseURL + '/api/admin/deleteUser',
  UPDATE_USER: baseURL + '/api/admin/updateUser',
  DELETE_MANAGER: baseURL + '/api/admin/deleteManager',
  ADD_MANAGER: baseURL + '/api/admin/addManager',
  UPDATE_MANAGER: baseURL + '/api/admin/updateManager',
  ADD_CAFE: baseURL + '/api/admin/addCafe'
}
