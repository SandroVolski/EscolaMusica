import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Classes.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus, FaCalendarAlt, FaClock } from "react-icons/fa";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Ajuste o caminho conforme o seu arquivo de configuração do Firebase 
import perfillogo from '../../assets/imgs/perfillogo.png';

const Classes = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [turmas, setTurmas] = useState([]);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classesCollection = collection(db, 'classes');
                const classesSnapshot = await getDocs(classesCollection);

                const classesList = await Promise.all(
                    classesSnapshot.docs.map(async (classDoc) => {
                        const turmaData = classDoc.data();

                        const studentsList = await Promise.all(
                            turmaData.students.map(async (studentId) => {
                                const studentRef = doc(db, 'students', studentId);
                                const studentDoc = await getDoc(studentRef);
                                return { id: studentDoc.id, ...studentDoc.data() };
                            })
                        );

                        return {
                            id: classDoc.id,
                            ...turmaData,
                            students: studentsList
                        };
                    })
                );

                setTurmas(classesList);
            } catch (error) {
                console.error('Erro ao buscar as turmas: ', error);
            }
        };

        fetchClasses();
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
    

    const StatusDot = ({ studentId }) => {
        const [paymentStatus, setPaymentStatus] = useState("nao pago");
    
        useEffect(() => {
            const fetchStatus = async () => {
                const status = await fetchPaymentStatus(studentId);
                console.log(`Status retornado do fetch para o aluno ${studentId}: ${status}`);
                setPaymentStatus(status.trim().toLowerCase());
            };
        
            fetchStatus();
        }, [studentId]);
        
        console.log(`Estado atual do ponto para o aluno ${studentId}: ${paymentStatus}`);
    
        return (
            <div
                className={`status-circle ${
                    paymentStatus === "nao pago" ? "nao-pago" 
                    : paymentStatus === "pago" ? "pago" 
                    : "em-atraso"
                }`}
            >
                {/* Ícone ou mensagem aqui */}
            </div>
            
        );
    };

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />

            <div className="search-bar">
                <input type="text" placeholder="Nome do Aluno" />
                <FaSearch className="search-icon" />
            </div>

            <div className="content-container">
                <div className="row" style={{ marginTop: "102%" }}>
                    {turmas.map((turma) => (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={turma.id}>
                            <div className="card aluno-card">
                                <div className="full-width-name">
                                    <h5 className="card-title text-center">{turma.className}</h5>
                                    <div className="icon-text-instrument text-center">
                                        <span>{turma.instrument}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="profile-container">
                                        <img
                                            alt={`Imagem do perfil de ${turma.className}`}
                                            className="rounded-circle profile-img"
                                            src={turma.img ? turma.img : perfillogo}
                                            width="90"
                                            height="90"
                                        />
                                    </div>
                                    <div className="data-horario-container flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between w-100">
                                            <div className="icon-text-first text-start" style={{ marginLeft: "10px" }}>
                                                <FaCalendarAlt size={18} className="iconsMenu" />
                                                <span className="card-text">{turma.day}</span>
                                            </div>
                                            <div className="icon-text-second text-end" style={{ marginRight: "20px" }}>
                                                <FaClock size={18} className="iconsMenu" />
                                                <span className="card-text">{turma.time}</span>
                                            </div>
                                        </div>
                                        <div className="alunos-list-container mt-3">
                                            <div className="alunos-grid">
                                                {turma.students?.map((student, i) => (
                                                    <div key={i} className="aluno-status">
                                                        {/* Bolinha com a cor do status */}
                                                        <StatusDot studentId={student.id}>    </StatusDot>
                                                        {/* Nome do aluno */}
                                                        <span className="aluno-nome">{student.name}</span>
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
};

export default Classes;
