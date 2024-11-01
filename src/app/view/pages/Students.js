import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Students.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus, FaCalendarAlt, FaClock, FaMusic, FaDollarSign, FaUsers } from "react-icons/fa";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const Students = () => {
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

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />

            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Nome do Aluno" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado ao digitar
                />
                <FaSearch className="search-icon" />
            </div>
        
            <div className="content-container">
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

            <div className="button-wrapper">
                <div className="add-button" onClick={() => navigate('/registerstudent')}>
                    <FaPlus />
                </div>
            </div>
        </>
    );
}

export default Students;
