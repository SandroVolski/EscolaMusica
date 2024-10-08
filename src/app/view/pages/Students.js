  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import './Students.css'; 
  import Header from '../../components/Header';
  import Sidebar from '../../components/Sidebar';
  import "bootstrap/dist/css/bootstrap.min.css";
  import { FaSearch, FaCalendarAlt, FaGuitar, FaPlus } from "react-icons/fa";

  const Students = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    const alunos = [
      {
        nome: "Maria Eduarda (Duda)",
        dia: "Quinta",
        hora: "16h30",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/qUh7urwZ3ubQIFfQrCn1P5bsEpT5Fe0jQ2JNP2Lmq9q6kSjTA.jpg",
        corBadge: "success"
      },
      {
        nome: "Sandro Eduardo (Filho)",
        dia: "Sexta",
        hora: "11h00",
        tipo: "Individual",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/aG06ED2adS7TK59xNoKKXvmwd4sC0lffpopWrxGQlNl5kSjTA.jpg",
        corBadge: "warning"
      },
      {
        nome: "Regiane Volski",
        dia: "Segunda",
        hora: "08h00",
        tipo: "Online",
        instrumento: "Teclado",
        img: "https://storage.googleapis.com/a1aa/image/facwZXeixwjz3U7XYtk470VqtxSUORw7PLPebWKh56r4JlGnA.jpg",
        corBadge: "danger"
      },
      {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success"
      },
      {
        nome: "Regiane Volski",
        dia: "Segunda",
        hora: "08h00",
        tipo: "Online",
        instrumento: "Teclado",
        img: "https://storage.googleapis.com/a1aa/image/facwZXeixwjz3U7XYtk470VqtxSUORw7PLPebWKh56r4JlGnA.jpg",
        corBadge: "danger"
      },
      {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success"
      },
      {
        nome: "Regiane Volski",
        dia: "Segunda",
        hora: "08h00",
        tipo: "Online",
        instrumento: "Teclado",
        img: "https://storage.googleapis.com/a1aa/image/facwZXeixwjz3U7XYtk470VqtxSUORw7PLPebWKh56r4JlGnA.jpg",
        corBadge: "danger"
      },
      {
        nome: "Tiago Alexandre",
        dia: "Segunda",
        hora: "10h00",
        tipo: "Turma",
        instrumento: "Violão",
        img: "https://storage.googleapis.com/a1aa/image/cXSFnj9xSU4bJlrPE039NQ8o9WefNUezLjWHGufnDIkjTKNOB.jpg",
        corBadge: "success"
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
          <div className="row" style={{marginTop: "100%"}}>
            {alunos.map((aluno, index) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                <div className="card aluno-card">
                  <div className="d-flex align-items-center">
                    <img src={aluno.img} className="rounded-circle" alt={`Profile of ${aluno.nome}`} width="60" height="60" />
                    <div className="ms-3">
                      <div className="card-title fw-bold">{aluno.nome}</div>
                      <div className="card-text">
                        <FaCalendarAlt /> {aluno.dia}
                        <span className={`badge bg-${aluno.corBadge} ms-2`}>{aluno.hora}</span>
                        <span className="badge bg-info ms-2">{aluno.tipo}</span>
                        <br/>
                        <FaGuitar /> {aluno.instrumento}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="add-button">
          <FaPlus />
        </div>
      </>
    );
  }

  export default Students;
