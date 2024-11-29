import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Finance.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus, FaCalendarAlt, FaClock, FaMusic, FaDollarSign, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const Finance = ({ receitaAtual, onFilterChange }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [alunos, setAlunos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const fetchAlunos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "students"));
                const alunosData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAlunos(alunosData);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchAlunos();
    }, []);

    // Filtra os alunos com base no termo de pesquisa
    const filteredAlunos = alunos.filter(aluno =>
        aluno.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    





      const [date, setDate] = useState(new Date());
      const [showCalendar, setShowCalendar] = useState(false);
  
      const handlePrevMonth = () => {
          const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
          setDate(newDate);
      };
  
      const handleNextMonth = () => {
          const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
          setDate(newDate);
      };
  
      const handleDateChange = (selectedDate) => {
          setDate(selectedDate);
          setShowCalendar(false);
      };
  
      const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />


            <div className="header-section fixed-top">
              {/* Controle de Mês */}
                <div className="month-control d-flex justify-content-between align-items-center">
                  <FaChevronLeft onClick={handlePrevMonth} className="icon-nav" />
                  <h2 onClick={() => setShowCalendar(!showCalendar)}>
                      {capitalizeFirstLetter(monthYear)}
                  </h2>
                  <FaChevronRight onClick={handleNextMonth} className="icon-nav" />
                </div>

                {/* Calendário */}
                {showCalendar && (
                    <Calendar 
                        onChange={handleDateChange}
                        value={date}
                        className="custom-calendar"
                    />
                )}

                {/* Receita Atual */}
                <div className="receita-atual text-center">
                    <h3 style={{fontSize:"30px"}}>Receita Atual</h3>
                    <p className="receita-valor">R$ 10000</p>
                </div>

                {/* Filtro de Status */}
                <div className="status-filter" style={{ marginTop: "-15px" }}>
                    <select className="status-select" style={{fontSize:"18px"}} onChange={(e) => onFilterChange(e.target.value)}>
                        <option value="todos">
                            <span className="status-dot dot-todos"></span> Todos os Status
                        </option>
                        <option value="pagos">
                            <span className="status-dot dot-pagos"></span> Pagos
                        </option>
                        <option value="em-atraso">
                            <span className="status-dot dot-atraso"></span> Em Atraso
                        </option>
                        <option value="em-dia">
                            <span className="status-dot dot-dia"></span> Em Dia
                        </option>
                    </select>
                </div>
            </div>



















          <div style={{marginTop:"490px"}}>
            <div className="search-bar" style={{marginTop:"305px"}}>
                <input 
                    type="text" 
                    placeholder="Nome do Aluno" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado ao digitar
                />
                <FaSearch className="search-icon" />
            </div>
        
            <div className="content-container finance-container">
                <div className="row" style={{ marginTop: "102%" }}>
                    {filteredAlunos.length === 0 ? (
                        <p style={{marginTop:"60px", fontSize:"25px"}}>Nenhum aluno encontrado</p>
                    ) : (
                        filteredAlunos.map((aluno, index) => (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                                <div className="card aluno-card">
                                    {/* Nome do aluno centralizado */}
                                    <div className="full-width-name">
                                        <h5 className="card-title">{aluno.name}</h5>
                                    </div>

                                    {/* Container principal */}
                                    <div className="d-flex align-items-center">
                                        {/* Imagem do perfil */}
                                        <div className="profile-container">
                                            <img
                                                alt={`Profile image of ${aluno.name}`}
                                                className="rounded-circle profile-img"
                                                src={aluno.img}
                                                width="80"
                                                height="80"
                                            />
                                            <div className={`status-dot ${aluno.value}`}></div>
                                        </div>

                                        {/* Primeira coluna - Data, horário e modalidade */}
                                        <div className="ms-3">
                                            <div className="icon-text">
                                                <FaCalendarAlt size={18} className="iconsMenu" />
                                                <span className="card-text">{aluno.day}</span>
                                            </div>

                                            <div className="icon-text">
                                                <FaClock size={18} className="iconsMenu" />
                                                <span className="card-text">{aluno.hour}</span>
                                            </div>

                                            <div className="icon-text">
                                                <FaMusic size={18} className="iconsMenu" />
                                                <span className="card-text">{aluno.instrument}</span>
                                            </div>
                                        </div>

                                        {/* Segunda coluna - Valor e tipo */}
                                        <div className="ms-auto text-end second-column">
                                            <div className="icon-text icon-text-money">
                                                <FaDollarSign size={18} className="iconsMenu" />
                                                <span className={`price ${aluno.status}`}>{aluno.value}</span>
                                            </div>

                                            <div className="icon-text">
                                                <FaUsers size={18} className="iconsMenu" />
                                                <span className="status">{aluno.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="fixed-footer">
                <div className="status-item">
                    <p className="status-title">Falta</p>
                    <p className="status-value falta">R$ 2480,00</p>
                </div>
                <div className="status-item">
                    <p className="status-title">Em Atraso</p>
                    <p className="status-value atraso">R$ 500,00</p>
                </div>
            </div>
          </div>
        </>
    );
}

export default Finance;
