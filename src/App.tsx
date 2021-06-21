import Router from 'router/index'
import { useEffect } from 'react'
import type { FC } from 'types/index'
import { Provider } from 'react-redux'
import store from 'store/index'

const App:FC = () => {
  useEffect(() => {
    const LoadingEl = document.getElementById('app-loading')
    if (LoadingEl) document.body.removeChild(LoadingEl)
  }, [])
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  )
}

export default App
