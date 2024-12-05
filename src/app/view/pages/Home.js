import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button, ToggleButton, Form, Row, Col, Card } from 'react-bootstrap';
import { FaUserGraduate, FaDollarSign, FaCalendarAlt, FaPlusCircle, FaReceipt, FaUsers, FaBell, FaCircle } from "react-icons/fa";
import './Home.css'; // Para seu CSS customizado
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const Home = ({ student }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [studentStatuses, setStudentStatuses] = useState([]);

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

  const fetchPaymentStatus = async (studentId) => {
    try {
      const studentDocRef = doc(db, "students", studentId);
      const studentDoc = await getDoc(studentDocRef);

      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const payments = studentData.payments || {};
        const venceDia = studentData.venceDia; // Obter o dia do vencimento do banco de dados

        if (!venceDia) {
          console.error("VenceDia não definido para este aluno.");
          return "nao pago"; // Retorna como "não pago" se não houver valor definido
        }

        const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
        const currentYear = new Date().getFullYear();
        const monthIndex = new Date().getMonth(); // Mês atual (0-11)
        const dueDate = new Date(currentYear, monthIndex, venceDia); // Gera a data de vencimento

        // Verificar status de pagamento do mês atual
        const paymentInfo = payments[currentMonth];
        const today = new Date();

        if (paymentInfo) {
          if (paymentInfo === "nao pago" && today > dueDate) {
            return "em atraso"; // Se passou do vencimento
          }
          return paymentInfo; // Retorna o status atual ("pago" ou "não pago")
        }

        return "nao pago"; // Retorna como "não pago" se não houver informações
      }
    } catch (error) {
      console.error("Erro ao recuperar o status de pagamento:", error);
    }
    return "nao pago"; // Retorna como "não pago" em caso de erro
  };

  // Função para buscar e setar os status dos alunos
  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = await Promise.all(
        alunos.map(async (aluno) => {
          const status = await fetchPaymentStatus(aluno.id);
          return { id: aluno.id, status };  // Adiciona o status do aluno junto com o id
        })
      );
      setStudentStatuses(statuses);
    };

    if (alunos.length > 0) {
      fetchStatuses();
    }
  }, [alunos]);

  const summary = useMemo(() => {
    const totals = { pago: 0, "nao pago": 0, "em atraso": 0 };

    studentStatuses.forEach(({ status }) => {
      if (status === "pago") totals.pago++;
      else if (status === "nao pago") totals["nao pago"]++;
      else if (status === "em atraso") totals["em atraso"]++;
    });

    return totals;
  }, [studentStatuses]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  /*const handleScroll = () => {
    const slideWidth = carouselRef.current.offsetWidth;
    const scrollLeft = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / slideWidth);
    setCurrentSlide(newIndex);
  };*/















  const [groupedClasses, setGroupedClasses] = useState({});

  // Função para agrupar os alunos por dia e horário
  useEffect(() => {
    if (alunos.length > 0) {
      const grouped = alunos.reduce((acc, aluno) => {
        const key = `${aluno.day}-${aluno.hour}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(aluno);
        return acc;
      }, {});
      setGroupedClasses(grouped);
    }
  }, [alunos]);

  // Função para encontrar a página inicial do carrossel com base no dia e hora atuais
  useEffect(() => {
    if (Object.keys(groupedClasses).length > 0) {
      const now = new Date();
      const currentDay = now.getDay(); // Retorna o dia da semana (0-6)
      const currentHour = now.getHours(); // Retorna a hora atual
      const key = `${currentDay}-${currentHour}`;

      const keys = Object.keys(groupedClasses);
      const initialIndex = keys.findIndex(k => k === key);
      setCurrentSlide(initialIndex >= 0 ? initialIndex : 0); // Define a página inicial
    }
  }, [groupedClasses]);

  const handleScroll = () => {
    const slideWidth = carouselRef.current.offsetWidth;
    const scrollLeft = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / slideWidth);
    setCurrentSlide(newIndex);
  };

  const renderCarouselSlides = () => {
    return Object.entries(groupedClasses).map(([key, alunos], index) => {
      const [day, hour] = key.split('-');
      const title = alunos.length > 1 ? "Turma" : "Individual";
      return (
        <div key={index} className="class-info">
          <h4>{title}</h4>
          <p className="class-date">Dia: {day}, Horário: {hour}h</p>
          <div className="student-list">
            {alunos.map(aluno => (
              <span key={aluno.id}>
                {aluno.name} ({aluno.instrument})
              </span>
            ))}
          </div>
        </div>
      );
    });
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
              <p className="class-date">02/12 - 13h</p>
              <p className="class-details">
                <span className="class-students">Turma (05 alunos) - </span>
                <span className="class-instrument">Violão</span>
              </p>
              <div className="student-list">
                <span><FaCircle style={{ color: "green", marginRight: "5px" }} />João</span>
                <span><FaCircle style={{ color: "yellow", marginRight: "5px" }} />Marina</span>
                <span><FaCircle style={{ color: "yellow", marginRight: "5px" }} />José</span>
                <span><FaCircle style={{ color: "red", marginRight: "5px" }} />Tamires</span>
                <span><FaCircle style={{ color: "green", marginRight: "5px" }} />Ana</span>
              </div>
            </div>
            <div className="class-info">
              <p className="class-date">02/12 - 14h</p>
              <p className="class-details">
                <span className="class-students">Turma (04 alunos) - </span>
                <span className="class-instrument">Violão</span>
              </p>
              <div className="student-list">
                <span><FaCircle style={{ color: "green", marginRight: "5px" }} /> Ana</span>
                <span><FaCircle style={{ color: "yellow", marginRight: "5px" }} /> João</span>
                <span><FaCircle style={{ color: "yellow", marginRight: "5px" }} /> Carla</span>
                <span><FaCircle style={{ color: "yellow", marginRight: "5px" }} /> Paulo</span>
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
              <FaCircle style={{ color: "#39b54a", marginLeft: "10px" }} />{" "}
              {summary.pago}
            </span>
            <span style={{ color: "#f0e200" }}>
              <FaCircle style={{ color: "#f0e200", marginLeft: "10px" }} />{" "}
              {summary["nao pago"]}
            </span>
            <span style={{ color: "#ff002e" }}>
              <FaCircle style={{ color: "#ff002e", marginLeft: "10px" }} />{" "}
              {summary["em atraso"]}
            </span>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;