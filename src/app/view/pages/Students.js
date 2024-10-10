import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Students.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus, FaCalendarAlt, FaClock, FaMusic, FaDollarSign, FaUsers } from "react-icons/fa";

const Students = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const alunos = [
        {
        nome: "Maria Eduarda (Duda) 1",
        dia: "Quinta",
        hora: "16h30",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/qUh7urwZ3ubQIFfQrCn1P5bsEpT5Fe0jQ2JNP2Lmq9q6kSjTA.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Sandro Eduardo (Filho) 2",
        dia: "Sexta",
        hora: "11h00",
        tipo: "Individual",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/aG06ED2adS7TK59xNoKKXvmwd4sC0lffpopWrxGQlNl5kSjTA.jpg",
        corBadge: "warning",
        valor: "R$130,00"
        },
        {
        nome: "Regiane Volski",
        dia: "Segunda",
        hora: "08h00",
        tipo: "Online",
        instrumento: "Teclado",
        img: "https://storage.googleapis.com/a1aa/image/facwZXeixwjz3U7XYtk470VqtxSUORw7PLPebWKh56r4JlGnA.jpg",
        corBadge: "danger",
        valor: "R$100,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Regiane Volski",
        dia: "Segunda",
        hora: "08h00",
        tipo: "Online",
        instrumento: "Teclado",
        img: "https://storage.googleapis.com/a1aa/image/facwZXeixwjz3U7XYtk470VqtxSUORw7PLPebWKh56r4JlGnA.jpg",
        corBadge: "danger",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$100,00"
        },
        {
        nome: "Regiane Volski",
        dia: "Segunda",
        hora: "08h00",
        tipo: "Online",
        instrumento: "Teclado",
        img: "https://storage.googleapis.com/a1aa/image/facwZXeixwjz3U7XYtk470VqtxSUORw7PLPebWKh56r4JlGnA.jpg",
        corBadge: "danger",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
        {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success",
        valor: "R$150,00"
        },
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
                {alunos.map((aluno, index) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                    <div className="card aluno-card">
                      {/* Nome do aluno centralizado */}
                      <div className="full-width-name">
                        <h5 className="card-title">{aluno.nome}</h5>
                      </div>

                      {/* Container principal */}
                      <div className="d-flex align-items-center">
                        {/* Imagem do perfil */}
                        <div className="profile-container">
                          <img
                            alt={`Profile image of ${aluno.nome}`}
                            className="rounded-circle profile-img"
                            src={aluno.img}
                            width="80"
                            height="80"
                          />
                          <div className={`status-dot ${aluno.pagamento}`}></div>
                        </div>

                        {/* Primeira coluna - Data, horário e modalidade */}
                        <div className="ms-3">
                          <div className="icon-text">
                            <FaCalendarAlt size={18} className="iconsMenu" />
                            <span className="card-text">{aluno.dia}</span>
                          </div>

                          <div className="icon-text">
                            <FaClock size={18} className="iconsMenu" />
                            <span className="card-text">{aluno.hora}</span>
                          </div>

                          <div className="icon-text">
                            <FaMusic size={18} className="iconsMenu" />
                            <span className="card-text">{aluno.instrumento}</span>
                          </div>
                        </div>

                        {/* Segunda coluna - Valor e tipo */}
                        <div className="ms-auto text-end second-column">
                          <div className="icon-text icon-text-money">
                            <FaDollarSign size={18} className="iconsMenu" />
                            <span className={`price ${aluno.status}`}>{aluno.valor}</span>
                          </div>

                          <div className="icon-text">
                            <FaUsers size={18} className="iconsMenu" />
                            <span className="status">{aluno.tipo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
