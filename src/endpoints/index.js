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
  CREATE_USER: baseURL + '/api/admin/createUser',
  UPDATE_USER: baseURL + '/api/admin/updateUser',
  CREATE_CAFE: baseURL + '/api/admin/createCafe',
  UPDATE_CAFE: baseURL + '/api/admin/updateCafe',
  GET_MY_DETAILS: baseURL + '/api/admin/getMyDetails',
  DELETE_CAFE: baseURL + '/api/admin/deleteCafe',
  DELETE_USER: baseURL + '/api/admin/deleteUser'
}

export const POS_ENDPOINTS = {
  GET_ORDER: baseURL + '/api/pos/orders',
  PROCESS_ORDER: baseURL + '/api/pos/orders/process'
}
