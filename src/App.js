import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './app/view/users/signin/Login'; 
import Register from './app/view/users/signup/Register'; 
import Home from './app/view/pages/Home'; 
import Header from '../src/app/components/Header';
import Sidebar from '../src/app/components/Sidebar';

import Students from '../src/app/view/pages/Students';
import Finance from '../src/app/view/pages/Finance';
import Calendar from '../src/app/view/pages/Calendar';
import RegisterStudent from '../src/app/view/pages/RegisterStudent';
import Receipt from '../src/app/view/pages/Receipt';
import Classes from '../src/app/view/pages/Classes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/header" element={<Header />} />
        <Route path="/slidebar" element={<Sidebar />} />

        <Route path="/students" element={<Students />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/registerstudent" element={<RegisterStudent />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/classes" element={<Classes />} />

      </Routes>
    </Router>
    
  );
}

export default App;
