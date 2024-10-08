import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 
import logo from '../../../assets/imgs/LogoVetorizadaBranca.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


function Login() {
  const [email, setEmail] = useState('');
  
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password, remember });
    
  };

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Função para alternar entre mostrar/ocultar a senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <h1>Bem vindo!</h1>

      <form onSubmit={handleLogin}>
        <div className="input-group" style={{ marginTop: '1px' }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>

        <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
            />
            <span className="show-password" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
        </div>

        <div className="remember-container">
            <div className="remember-me">
                <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="remember-me">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">Esqueci minha senha</a>
        </div>

        <Link to="/home">
          <button type="submit" className="btn">Entrar</button>
        </Link>

        <p className="register">
          Não possui cadastro? <Link to="/signup">CLIQUE AQUI</Link>
        </p>

        <div className="social-login">
          <div className="google-circle">
            <FontAwesomeIcon icon="fa-brands fa-google" />
          </div>
          <div className="facebook-circle">
            <FontAwesomeIcon icon="fa-brands fa-facebook-f" />
          </div>
        </div>

      </form>
    </div>
  );
}

export default Login;
