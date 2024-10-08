import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaBars, FaBell } from 'react-icons/fa';
import logo from '../assets/imgs/LogoVetorizadaBranca.png';
import Home from '../view/pages/Home';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleMenu }) => {
  const [notifications, setNotifications] = useState(3); // Exemplo com 3 notificações
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();
  // Função para ativar o balanço ao clicar
  const handleBellClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000); // Para parar o balanço após 1 segundo
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container fluid>
        <Nav className="me-auto" style={{marginLeft: "10px"}}>
          <Nav.Link onClick={toggleMenu} className="text-white">
            <FaBars size={24} />
          </Nav.Link>
        </Nav>
        <Navbar.Brand href="/home" className="mx-auto">
          <img
            src={logo}
            height="60"
            className="d-inline-block align-top"
            
            style={{marginLeft: "5px"}}
            onClick={() => navigate('/home')}
          />
        </Navbar.Brand>
        <Nav className="ms-auto" style={{marginRight: "10px"}}>
          <Nav.Link href="#" className="text-white position-relative" onClick={handleBellClick}>
            {/* Ícone do sino com efeito de balanço */}
            <FaBell size={24} className={isShaking ? 'shake' : ''} />
            {/* Círculo de notificação */}
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
