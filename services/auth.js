import { servicePostWithoutAuth } from 'services/_config'

import { authServiceURL as baseURL } from 'config'

export const ENDPOINT_AUTH_LOGIN = baseURL + '/login'
export const ENDPOINT_AUTH_LOGIN_ADMIN = baseURL + '/login/admin'
export const ENDPOINT_AUTH_LOGIN_GOOGLE = baseURL + '/login/google'
export const ENDPOINT_AUTH_REGISTER = baseURL + '/register'
export const ENDPOINT_AUTH_REGISTER_GOOGLE = baseURL + '/register'
export const ENDPOINT_AUTH_VERIFY_EMAIL = baseURL + '/verify-email'
export const ENDPOINT_AUTH_FORGOT_PASSWORD = baseURL + '/forgot-password'
export const ENDPOINT_AUTH_GET_VERIFICATION_CODE =
  baseURL + '/get-verification-code'

export const postAuthLogin = servicePostWithoutAuth(ENDPOINT_AUTH_LOGIN)
export const postAuthLoginAdmin = servicePostWithoutAuth(
  ENDPOINT_AUTH_LOGIN_ADMIN
)
export const postAuthLoginGoogle = servicePostWithoutAuth(
  ENDPOINT_AUTH_LOGIN_GOOGLE
)

export const postAuthRegister = servicePostWithoutAuth(ENDPOINT_AUTH_REGISTER)
export const postAuthRegisterGoogle = servicePostWithoutAuth(
  ENDPOINT_AUTH_REGISTER_GOOGLE
)
export const postAuthVerifyEmail = servicePostWithoutAuth(
  ENDPOINT_AUTH_VERIFY_EMAIL
)
export const postAuthForgotPassword = servicePostWithoutAuth(
  ENDPOINT_AUTH_FORGOT_PASSWORD
)
export const postAuthGetVerificationCode = servicePostWithoutAuth(
  ENDPOINT_AUTH_GET_VERIFICATION_CODE
)
