const baseURL = process.env.NEXT_PUBLIC_APP_URL

export const ENDPOINT = {
  LOGIN: baseURL + '/api/auth2/login',
  VERIFY: baseURL + '/api/auth/verifyAdminToken',
  REQUEST_OTP: baseURL + '/api/auth/requestOTP',
  VERIFY_OTP: baseURL + '/api/auth/verifyOTP',
  GET_CAFES: baseURL + '/api/admin2/getCafes',
  CAFE_STATS: baseURL + '/api/admin/cafeStats',
  GET_MANAGERS: baseURL + '/api/admin/getManagers/',
  GET_USERS: baseURL + '/api/admin2/getUsers/',
  CREATE_USER: baseURL + '/api/admin2/createUser',
  DELETE_USER: baseURL + '/api/admin2/deleteUser',
  UPDATE_USER: baseURL + '/api/admin2/updateUser',
  DELETE_MANAGER: baseURL + '/api/admin/deleteManager',
  ADD_MANAGER: baseURL + '/api/admin/addManager',
  UPDATE_MANAGER: baseURL + '/api/admin/updateManager',
  CREATE_CAFE: baseURL + '/api/admin2/createCafe',
  GET_MANAGER_DETAILS: baseURL + '/api/admin/getManagerDetails/',
  GET_MY_DETAILS: baseURL + '/api/admin/getMyDetails'
}
