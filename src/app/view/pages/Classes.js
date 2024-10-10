import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Classes.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus, FaCalendarAlt, FaClock } from "react-icons/fa";

const Classes = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const turmas = [
        {
          nomeTurma: "Turma da Alice",
          instrumento: "Violão",
          dia: "Sexta",
          hora: "18h00",
          alunos: [
            { nome: "Alice", corBadge: "success" },
            { nome: "Amanda", corBadge: "warning" },
            { nome: "Ricardo", corBadge: "danger" },
            { nome: "Amanda", corBadge: "warning" },
            { nome: "Amanda", corBadge: "warning" },
            { nome: "Amanda", corBadge: "warning" },
            { nome: "Amanda", corBadge: "warning" },
            { nome: "Amanda", corBadge: "warning" },

          ],
          img: "https://storage.googleapis.com/a1aa/image/qUh7urwZ3ubQIFfQrCn1P5bsEpT5Fe0jQ2JNP2Lmq9q6kSjTA.jpg"
        },
        {
          nomeTurma: "Turma do Tiago",
          instrumento: "Violão",
          dia: "Quinta",
          hora: "20h00",
          alunos: [
            { nome: "Eduardo", corBadge: "success" },
            { nome: "Tiago", corBadge: "warning" },
            { nome: "Matheus", corBadge: "danger" }
          ],
          img: "https://storage.googleapis.com/a1aa/image/aG06ED2adS7TK59xNoKKXvmwd4sC0lffpopWrxGQlNl5kSjTA.jpg",
        },
        {
          nomeTurma: "Turma do Lucas",
          instrumento: "Teclado",
          dia: "Segunda",
          hora: "18h00",
          alunos: [
            { nome: "Pedro", corBadge: "success" },
            { nome: "Lucas", corBadge: "warning" },
            { nome: "Ovídio", corBadge: "danger" }
          ],
          img: "https://storage.googleapis.com/a1aa/image/facwZXeixwjz3U7XYtk470VqtxSUORw7PLPebWKh56r4JlGnA.jpg",
        },
        {
          nomeTurma: "Turma da Lívia",
          instrumento: "Canto",
          dia: "Segunda",
          hora: "10h00",
          alunos: [
            { nome: "Lívia", corBadge: "success" },
            { nome: "Juliana", corBadge: "warning" },
            { nome: "Tiago", corBadge: "danger" }
          ],
          img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        }
    ];
      

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />

            <div className="search-bar">
                <input type="text" placeholder="Nome do Aluno" />
                <FaSearch className="search-icon" />
            </div>
        
            <div className="content-container">
                <div className="row" style={{ marginTop: "100%" }}>
                    {turmas.map((turma, index) => (
                    <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                        <div className="card aluno-card">
                        {/* Nome da turma centralizado */}
                        <div className="full-width-name">
                            <h5 className="card-title text-center">{turma.nomeTurma}</h5>
                            <div className="icon-text-instrument text-center">
                            <span>{turma.instrumento}</span>
                            </div>
                        </div>

                        {/* Container principal */}
                        <div className="d-flex align-items-center justify-content-between">
                            {/* Imagem do perfil */}
                            <div className="profile-container">
                            <img
                                alt={`Profile image of ${turma.nome}`}
                                className="rounded-circle profile-img"
                                src={turma.img}
                                width="90"
                                height="90"
                            />
                            </div>

                            {/* Primeira coluna - Data e Horário */}
                            <div className="data-horario-container flex-grow-1 ms-3">
                                <div className="d-flex justify-content-between w-100">
                                    {/* Data */}
                                    <div className="icon-text-first text-start" style={{marginLeft: "10px"}}>
                                    <FaCalendarAlt size={18} className="iconsMenu" />
                                    <span className="card-text">{turma.dia}</span>
                                    </div>

                                    {/* Horário */}
                                    <div className="icon-text-second text-end" style={{marginRight: "20px"}}>
                                    <FaClock size={18} className="iconsMenu" />
                                    <span className="card-text">{turma.hora}</span>
                                    </div>
                                </div>

                                {/* Lista de alunos */}
                                <div className="alunos-list-container mt-3">
                                    <div className="alunos-grid">
                                    {turma.alunos.map((aluno, i) => (
                                        <div key={i} className="aluno-status">
                                        <span className={`status-circle bg-${aluno.corBadge}`}></span>
                                        <span className="aluno-nome">{aluno.nome}</span>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                        </div>
                    </div>
                    ))}
                </div>
                </div>



            <div className="button-wrapper">
                <div className="add-button" onClick={() => navigate('/registerclasses')}>
                <FaPlus />
                </div>
            </div>
        </>
    );
}

export default Classes;
