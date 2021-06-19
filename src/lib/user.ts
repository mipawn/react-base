import { logout as logoutResquest } from 'api/user'
import history from 'router/history'
import store from 'store/index'

export const logout = (): void => {
  logoutResquest()
    .then(() => {
      store.dispatch({
        type: 'USER/USER_LOGOUT',
      })
      localStorage.setItem('userLoggedIn', '')
      history.push('/login')
    })
    .catch((err: any) => {
      console.log(err)
    })
}
