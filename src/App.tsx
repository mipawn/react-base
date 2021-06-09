import Router from 'router/index'
import { useEffect } from 'react'
import type { FC } from 'types/index'
import { Provider } from 'react-redux'

interface IAppProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: any
}

const App:FC<IAppProps> = (props) => {
  useEffect(() => {
    const LoadingEl = document.getElementById('app-loading')
    if (LoadingEl) document.body.removeChild(LoadingEl)
  }, [])
  const { store } = props
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  )
}

export default App
