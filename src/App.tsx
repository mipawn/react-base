import React from 'react';
import logo from '@/logo.svg';
import styles from './App.module.scss';
// import './App.scoped.scss'
import { Button } from 'antd'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className={styles['App-link']}
          // className='App-link'
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Button type="primary">ihshsfhj</Button>
    </div>
  );
}

export default App;
