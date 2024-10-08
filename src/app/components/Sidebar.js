import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHome, FaUsers, FaUser, FaPlusCircle, FaCalendarAlt, FaDollarSign, FaReceipt } from 'react-icons/fa';
import './Sidebar.css';
import foto from '../assets/imgs/fotoPai.jpg';

import Home from '../view/pages/Home';
import Students from '../view/pages/Students';
import Finance from '../view/pages/Finance';
import Calendar from '../view/pages/Calendar';
import RegisterStudent from '../view/pages/RegisterStudent';
import Receipt from '../view/pages/Receipt';
import Classes from '../view/pages/Classes';

const Sidebar = ({ isOpen, toggleMenu }) => {

  const navigate = useNavigate();
  return (
    <>
      {/* Background overlay */}
      {isOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
        <img src={foto} alt="Imagem" class="photo" />
          <span className="user-name">Sandro Volski</span>
        </div>
        <div className="sidebar-links">
          <ul>
            <li onClick={() => navigate('/home')}>
              <FaHome size={24} style={{marginTop: "10px"}} className="iconsMenu"/>
              <span style={{marginTop: "10px"}}>Home</span>
            </li>
            <li onClick={() => navigate('/students')}>
              <FaUser size={24} className="iconsMenu"/>
              <span>Alunos</span>
            </li>
            <li onClick={() => navigate('/registerstudent')}>
              <FaPlusCircle size={24} className="iconsMenu"/>
              <span>Cadastro</span>
            </li>
            <li onClick={() => navigate('/classes')}>
              <FaUsers size={24} className="iconsMenu"/>
              <span>Turmas</span>
            </li>
            <li onClick={() => navigate('/finance')}>
              <FaDollarSign size={24} className="iconsMenu"/>
              <span>Financeiro</span>
            </li>
            <li onClick={() => navigate('/receipt')}>
              <FaReceipt size={24} className="iconsMenu"/>
              <span>Recibo</span>
            </li>
            <li onClick={() => navigate('/calendar')}>
              <FaCalendarAlt size={24} className="iconsMenu"/>
              <span>Calendário</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
