import './App.scss';
import Router from 'router/index'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const LoadingEl = document.getElementById('app-loading')
    LoadingEl && document.body.removeChild(LoadingEl)
  }, [])

  return (
    <Router></Router>
  );
}

export default App;
