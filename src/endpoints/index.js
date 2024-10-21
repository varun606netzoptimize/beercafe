const baseURL = process.env.NEXT_PUBLIC_APP_URL

export const ENDPOINT = {
  LOGIN: baseURL + '/api/auth/login',
  VERIFY: baseURL + '/api/auth/verifyAdminToken',
  REQUEST_OTP: baseURL + '/api/auth/requestOTP',
  VERIFY_OTP: baseURL + '/api/auth/verifyOTP',
  GET_CAFES: baseURL + '/api/admin/getCafes',
  GET_STATS: baseURL + '/api/admin/stats',
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
  GET_PRODUCT: baseURL + '/api/admin/getProducts',
  CREATE_PRODUCT: baseURL + '/api/admin/createProduct',
  UPDATE_PRODUCT: baseURL + '/api/admin/updateProduct',
  DELETE_PRODUCT: baseURL + '/api/admin/deleteProduct',
  ADD_PRODUCT_VARIATION: baseURL + '/api/admin/addProductVariation',
  UPDATE_PRODUCT_VARIATION: baseURL + '/api/admin/updateProductVariation',
  DELETE_PRODUCT_VARIATION: baseURL + '/api/admin/deleteProductVariation',
  GET_ALL_PRODUCTS: baseURL + '/api/admin/getAllProducts',
  GET_PRODUCTS_BY_CAFE_ID: baseURL + '/api/admin/getProductsById',
  GENERATE_SLUG: baseURL + '/api/admin/generateSlug',
  SLUG_CAFE: baseURL + '/api',
  PLACE_ORDER: baseURL + '/api/order',
  ORDER_STATUS: baseURL + '/api/pos/orders/status',
  VERIFY_RFID: baseURL + '/api/order/',
  PROCESS_PAYMENT: baseURL + '/api/order/process',
  UPDATE_USER_POINTS: baseURL + '/api/order/updatePoints',
  TRANSACTION_INITIATE: baseURL + '/api/customer/wallet/payment/initiate',
  TRANSACTION_COMPLETE: baseURL + '/api/customer/wallet/payment/complete',
  TRANSACTION_GET: baseURL + '/api/customer/wallet/payment/get',

  GET_RFIDS: baseURL + '/api/admin/rfids/get',
  CREATE_RFIDS: baseURL + '/api/admin/rfids/create',
  UPDATE_RFIDS: baseURL + '/api/admin/rfids/update',
  DELETE_RFIDS: baseURL + '/api/admin/rfids/delete',

  GET_ALL_ORDERS: baseURL + '/api/admin/getAllOrders',
  GET_ORDERS: baseURL + '/api/admin/getOrders',
  GET_ORDERS_DATA_BY_MONTH: baseURL + '/api/admin/getOrdersMonthly',
  GET_ORDERS_DATA_BY_WEEK: baseURL + '/api/admin/getOrdersWeekly',
  GET_ORDERS_DATA_BY_YEAR: baseURL + '/api/admin/getOrdersYearly',
}

export const POS_ENDPOINTS = {
  GET_ORDER: baseURL + '/api/pos/orders',
  PROCESS_ORDER: baseURL + '/api/pos/orders/process'
}
