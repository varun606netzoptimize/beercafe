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
  DELETE_USER: baseURL + '/api/admin/deleteUser',
  GET_MY_CAFES: baseURL + '/api/admin/getOwnerCafes',
  GET_CUSTOMERS: baseURL + '/api/admin/getCustomers/',
  GET_MY_CUSTOMERS: baseURL + '/api/admin/getCafeCustomers',
  CREATE_CUSTOMER: baseURL + '/api/admin/createCustomer',
  UPDATE_CUSTOMER: baseURL + '/api/admin/updateCustomer',
  GENERATE_OTP: baseURL + '/api/auth/generateOTP',
  VERIFY_OTP: baseURL + '/api/auth/verifyOTP',
  GET_CAFE_PRODUCTS: baseURL + '/api/admin/cafeProducts',
  GET_BRANDS: baseURL + '/api/admin/getBrands',
  CREATE_PRODUCT: baseURL + '/api/admin/createProduct',
  UPDATE_PRODUCT: baseURL + '/api/admin/updateProduct',
  DELETE_PRODUCT: baseURL + '/api/admin/deleteProduct',
  ADD_PRODUCT_VARIATION: baseURL + '/api/admin/addProductVariation',
  UPDATE_PRODUCT_VARIATION: baseURL + '/api/admin/updateProductVariation',
  GET_ALL_PRODUCTS: baseURL + '/api/admin/getAllProducts',
  GENERATE_SLUG: baseURL + '/api/admin/generateSlug',
  SLUG_CAFE: baseURL + '/api',
  PLACE_ORDER: baseURL + '/api/order',
}

export const POS_ENDPOINTS = {
  GET_ORDER: baseURL + '/api/pos/orders',
  PROCESS_ORDER: baseURL + '/api/pos/orders/process'
}
