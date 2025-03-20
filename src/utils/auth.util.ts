// export const getAccessTokenFromLS = (): string => {
//   return localStorage.getItem('accessToken') || ''
// }

// export const getRefreshTokenFromLS = (): string => {
//   return localStorage.getItem('refreshToken') || ''
// }

// export const checkIsLogin = (): boolean => {
//   return localStorage.getItem('isLogin') === 'true'
// }

// export const getUserIdFromLS = (): string => {
//   return localStorage.getItem('userId') || ''
// }

// export const saveAccessTokenToLS = (data: AuthResponse) => {
//   localStorage.setItem('accessToken', data.accessToken)
//   localStorage.setItem('accessTokenExp', data.accessExp.toString())
//   localStorage.setItem('refreshToken', data.refreshToken)
//   localStorage.setItem('refreshTokenExp', data.refreshExp.toString())
//   localStorage.setItem('isLogin', 'true')
// }

// export const clearLS = () => {
//   localStorage.removeItem('accessToken')
//   localStorage.removeItem('accessTokenExp')
//   localStorage.removeItem('refreshToken')
//   localStorage.removeItem('refreshTokenExp')
//   localStorage.removeItem('userId')
//   localStorage.removeItem('userLoggedIn')
//   localStorage.removeItem('isLogin')
// }

// export const setUserIdToLS = (userId: string) => {
//   localStorage.setItem('userId', userId)
// }

// export const saveUserLoginToLS = (data: UserLogin) => {
//   localStorage.setItem('userLoggedIn', JSON.stringify(data))
// }

// export const getUserLoginFromLS = (): UserLogin => {
//   return JSON.parse(localStorage.getItem('userLoggedIn') || '{}')
// }
