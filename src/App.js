import './style/App.css';
import * as React from 'react';
import { Login } from './components/Login.jsx';
import { Route, Routes } from 'react-router-dom'
import { Certificates } from './components/Certificates.jsx';
import { Main } from './components/Main.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/certificates' element={<Certificates />} />
      </Routes>
    </div>
  );
}

export default App;