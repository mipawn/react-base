import Router from 'router/index'
import { useEffect } from 'react'
import type { FC } from 'type/index'

const App:FC = () => {
  useEffect(() => {
    const LoadingEl = document.getElementById('app-loading')
    if (LoadingEl) document.body.removeChild(LoadingEl)
  }, [])

  return (
    <Router />
  )
}

export default App
