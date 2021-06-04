import './App.scss'
import Router from 'router/index'
import { useEffect } from 'react'
import type { RouteComponent } from './type/index'

const App: RouteComponent = () => {
  useEffect(() => {
    const LoadingEl = document.getElementById('app-loading')
    if (LoadingEl) document.body.removeChild(LoadingEl)
  }, [])

  return (
    <Router />
  )
}

export default App
