import type { Module, ActionContext } from 'vuex'
import { login as loginApi, logout as logoutApi } from '@/api/user'
import { error } from '@/utils/error'
import router from '@/router/index'

interface UserState {
  isLogin: boolean,
  userInfo: {
    account: string
  }
}

function initAccount(): string {
  let account = window.localStorage.getItem('userLoggedIn') || ''
  account && (account = window.atob(account))
  return account
}

const userStore: Module<UserState, unknown> = {
  namespaced: true,
  state() {
    return {
      isLogin: false,
      userInfo: {
        account: initAccount()
      }
    }
  },
  getters: {
    isLogin: (state) => state.isLogin
  },
  mutations: {
    saveUser(state, payload) {
      const { isLogin, userInfo } = payload
      state.isLogin = isLogin
      state.userInfo = userInfo
    }
  },
  actions: {
    async login(context: ActionContext<UserState, unknown>, data): Promise<any> {
      return loginApi(data)
        .then(res => {
          window.localStorage.setItem('userLoggedIn', window.btoa(data.accessKey))
          context.commit('saveUser', { isLogin: true, userInfo: {account: data.accessKey} })
        })
        .catch(error)
    },
    async logout(context: ActionContext<UserState, unknown>) {
      return logoutApi()
        .then(res => {
          context.commit('saveUser', { isLogin: false, userInfo: { account: '' } })
          window.localStorage.removeItem('userLoggedIn')
          router.push({ name: 'login' })
        })
        .catch(error)
    }
  }
}

export default userStore