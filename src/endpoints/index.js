const baseURL = process.env.NEXT_PUBLIC_APP_URL

export const ENDPOINT = {
  LOGIN: baseURL + '/api/auth/login',
  VERIFY: baseURL + '/api/auth/verifyAdminToken',
  REQUEST_OTP: baseURL + '/api/auth/requestOTP',
  VERIFY_OTP: baseURL + '/api/auth/verifyOTP',
  GET_CAFES: baseURL + '/api/admin/getCafes',
  CAFE_STATS: baseURL + '/api/admin/cafeStats',
  GET_MANAGERS: baseURL + '/api/admin/getManagers/',
  GET_USERS: baseURL + '/api/admin/getUsers/',
  CREATE_USER: baseURL + '/api/admin2/createUser',
  DELETE_USER: baseURL + '/api/admin2/deleteUser',
  UPDATE_USER: baseURL + '/api/admin2/updateUser',
  DELETE_MANAGER: baseURL + '/api/admin/deleteManager',
  ADD_MANAGER: baseURL + '/api/admin/addManager',
  UPDATE_MANAGER: baseURL + '/api/admin/updateManager',
  CREATE_CAFE: baseURL + '/api/admin/createCafe',
  UPDATE_CAFE: baseURL + '/api/admin2/updateCafe',
  GET_MANAGER_DETAILS: baseURL + '/api/admin/getManagerDetails/',
  GET_MY_DETAILS: baseURL + '/api/admin/getMyDetails',
  DELETE_CAFE: baseURL + '/api/admin2/deleteCafe'
}
