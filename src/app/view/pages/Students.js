import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Students.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus, FaCalendarAlt, FaClock, FaMusic, FaDollarSign, FaUsers } from "react-icons/fa";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import perfillogo from '../../assets/imgs/perfillogo.png';

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
                className={`status-dot ${
                    paymentStatus === "nao pago" ? "nao-pago" 
                    : paymentStatus === "pago" ? "pago" 
                    : "em-atraso"
                }`}
            >
                {/* Ícone ou mensagem aqui */}
            </div>
            
        );
    };

    const PaymentStatus = ({ studentId, value }) => {
        const [paymentStatus, setPaymentStatus] = useState("nao pago");
      
        useEffect(() => {
            const fetchStatus = async () => {
                const status = await fetchPaymentStatus(studentId);
                console.log(`Status retornado do fetch para o aluno ${studentId}: ${status}`);
                setPaymentStatus(status.trim().toLowerCase());
            };
        
            fetchStatus();
        }, [studentId]);

        console.log(`Estado atual do pagamento ${studentId}: ${paymentStatus}`);
      
        return (
                
                <span className={`price ${
                    paymentStatus === "nao pago" ? "nao-pago" 
                    : paymentStatus === "pago" ? "pago" 
                    : "em-atraso"
                }`}>{value}</span>
                
        );
      };
    
    
    

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
                                                src={aluno.img ? aluno.img : perfillogo}
                                                width="80"
                                                height="80"
                                            />
                                            <StatusDot studentId={aluno.id}></StatusDot>
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
                                            <div className="icon-text">
                                                <FaDollarSign size={18} className="iconsMenu" />
                                                <PaymentStatus studentId={aluno.id} value={aluno.value} />
                                                
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
};

export default Students;