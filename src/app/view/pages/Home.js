import React, { useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button, ToggleButton, Form, Row, Col, Card } from 'react-bootstrap';
import { FaUserGraduate, FaDollarSign, FaCalendarAlt, FaPlusCircle, FaReceipt, FaUsers, FaBell, FaCircle } from "react-icons/fa";
import './Home.css'; // Para seu CSS customizado
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

import Students from '../pages/Students';
import Finance from '../pages/Finance';
import Calendar from '../pages/Calendar';
import RegisterStudent from '../pages/RegisterStudent';
import Receipt from '../pages/Receipt';
import Classes from '../pages/Classes';

const Home = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    const slideWidth = carouselRef.current.offsetWidth;
    const scrollLeft = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / slideWidth);
    setCurrentSlide(newIndex);
  };

  return (
    <>
      <Header toggleMenu={toggleMenu} />
      <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />
      
      <div className="main-content">
        <h2>O que vamos fazer agora?</h2>

        <div className="icon-grid">
          <div className="icon-item" onClick={() => navigate('/students')}>
            <FaUserGraduate className="icon"/>
            <p>Alunos</p>
          </div>
          <div className="icon-item" onClick={() => navigate('/finance')}>
            <FaDollarSign className="icon"/>
            <p>Financeiro</p>
          </div>
          <div className="icon-item" onClick={() => navigate('/calendar')}>
            <FaCalendarAlt className="icon"/>
            <p>Calendário</p>
          </div>
          <div className="icon-item" onClick={() => navigate('/registerstudent')}>
            <FaPlusCircle className="icon"/>
            <p>Cadastro</p>
          </div>
          <div className="icon-item" onClick={() => navigate('/receipt')}>
            <FaReceipt className="icon"/>
            <p>Recibo</p>
          </div>
          <div className="icon-item" onClick={() => navigate('/classes')}>
            <FaUsers className="icon"/>
            <p>Turmas</p>
          </div>
        </div>

        <div className="next-class">
        <h3>Sua próxima aula será</h3>
        <div className="carousel-container">
          <div
            className="carousel-slides"
            onScroll={handleScroll}
            ref={carouselRef}
          >
            <div className="class-info">
              <p className="class-date">12/09 - 15h</p>
              <p className="class-details">
                <span className="class-students">Turma (05 alunos) - </span>
                <span className="class-instrument">Violão</span>
              </p>
              <div className="student-list">
                <span><FaCircle style={{ color: "green", marginRight: "5px" }} /> Sandro</span>
                <span><FaCircle style={{ color: "blue", marginRight: "5px" }} /> Eduardo</span>
                <span><FaCircle style={{ color: "yellow", marginRight: "5px" }} /> Juliana</span>
                <span><FaCircle style={{ color: "orange", marginRight: "5px" }} /> Regiane</span>
                <span><FaCircle style={{ color: "red", marginRight: "5px" }} /> Tiago</span>
              </div>
            </div>
            <div className="class-info">
              <p className="class-date">13/09 - 10h</p>
              <p className="class-details">
                <span className="class-students">Turma (04 alunos) - </span>
                <span className="class-instrument">Piano</span>
              </p>
              <div className="student-list">
                <span><FaCircle style={{ color: "green", marginRight: "5px" }} /> Ana</span>
                <span><FaCircle style={{ color: "blue", marginRight: "5px" }} /> João</span>
                <span><FaCircle style={{ color: "yellow", marginRight: "5px" }} /> Carla</span>
                <span><FaCircle style={{ color: "orange", marginRight: "5px" }} /> Paulo</span>
              </div>
            </div>
          </div>
          
          <div className="carousel-indicators">
            <span className={`indicator ${currentSlide === 0 ? 'active' : ''}`}></span>
            <span className={`indicator ${currentSlide === 1 ? 'active' : ''}`}></span>
          </div>
        </div>

      </div>

        <div className="summary">
          <h3>Resumo</h3>
          <p className="class-info-summary">Veja tudo o que está acontecendo</p>
          <div className="summary-info">
          <span style={{ color: "#39b54a" }}>
            <FaCircle style={{ color: "#39b54a", marginLeft: "10px" }} /> 38
          </span>
          <span style={{ color: "#f0e200" }}>
            <FaCircle style={{ color: "#f0e200", marginLeft: "10px" }} /> 28
          </span>
          <span style={{ color: "#ff002e" }}>
            <FaCircle style={{ color: "#ff002e", marginLeft: "10px" }} /> 6
          </span>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;







{/*
  
import React from "react";
import "./Home.css";
import { Navbar, Container, Row, Col } from "react-bootstrap";
import { FaUserGraduate, FaDollarSign, FaCalendarAlt, FaPlusCircle, FaReceipt, FaUsers, FaBell, FaCircle } from "react-icons/fa";

const Home = () => {
  return (
    <>
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#">
            <img
              src="https://storage.googleapis.com/a1aa/image/IeUQxvtyta0XKaE5dUB684WzE2PgSamlL010jNV5VCH82ixJA.jpg"
              alt="Logo"
              height="40"
            />
          </Navbar.Brand>
          <button className="btn icon-button">
            <FaBell />
          </button>
        </Container>
      </Navbar>

      <div className="main-content">
        <h2>O que vamos fazer agora?</h2>

        <div className="icon-grid">
          <div className="icon-item">
            <FaUserGraduate />
            <p>Alunos</p>
          </div>
          <div className="icon-item">
            <FaDollarSign />
            <p>Financeiro</p>
          </div>
          <div className="icon-item">
            <FaCalendarAlt />
            <p>Calendário</p>
          </div>
          <div className="icon-item">
            <FaPlusCircle />
            <p>Cadastro</p>
          </div>
          <div className="icon-item">
            <FaReceipt />
            <p>Recibo</p>
          </div>
          <div className="icon-item">
            <FaUsers />
            <p>Turmas</p>
          </div>
        </div>

        <div className="next-class">
          <h3>Sua próxima aula será</h3>
          <div className="class-info">
            <p>12/09 - 15h</p>
            <p>Turma (05 alunos) - Violão</p>
            <div className="student-list">
              <span><FaCircle style={{ color: "green" }} /> Sandro</span>
              <span><FaCircle style={{ color: "blue" }} /> Eduardo</span>
              <span><FaCircle style={{ color: "yellow" }} /> Juliana</span>
              <span><FaCircle style={{ color: "orange" }} /> Regiane</span>
              <span><FaCircle style={{ color: "red" }} /> Tiago</span>
            </div>
          </div>
        </div>

        <div className="summary">
          <h3>Resumo</h3>
          <p>Veja tudo o que está acontecendo</p>
          <div className="summary-info">
            <span><FaCircle style={{ color: "green" }} /> 38</span>
            <span><FaCircle style={{ color: "yellow" }} /> 28</span>
            <span><FaCircle style={{ color: "red" }} /> 6</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
*/}