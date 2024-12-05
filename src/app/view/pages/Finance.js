import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Finance.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus, FaCalendarAlt, FaClock, FaMusic, FaDollarSign, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import perfillogo from '../../assets/imgs/perfillogo.png';

const Finance = ({ receitaAtual }) => {
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
  
      /*const handlePrevMonth = () => {
          const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
          setDate(newDate);
      };
  
      const handleNextMonth = () => {
          const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
          setDate(newDate);
      };*/
  
      /*const handleDateChange = (selectedDate) => {
          setDate(selectedDate);
          setShowCalendar(false);
      };*/
  
      //const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

      /*function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }*/

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
    
                const selectedMonth = currentDate.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
                const selectedYear = currentDate.getFullYear();
                const monthIndex = currentDate.getMonth(); // Mês selecionado (0-11)
                const dueDate = new Date(selectedYear, monthIndex, venceDia);
    
                // Verificar status de pagamento do mês atual
                const paymentInfo = payments[selectedMonth];
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




    const fetchAllPayments = async () => {
        try {
            const studentsCollectionRef = collection(db, "students");
            const studentsSnapshot = await getDocs(studentsCollectionRef);
    
            let totalReceita = 0;
            const selectedMonth = currentDate.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
            const selectedYear = currentDate.getFullYear();

            studentsSnapshot.forEach((doc) => {
                const studentData = doc.data();
                const payments = studentData.payments || {};
                //const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
                const paymentInfo = payments[selectedMonth];

                console.log(`Pagamento do aluno ${doc.id} (${selectedMonth}/${selectedYear}): ${paymentInfo}`);
    
                if (paymentInfo === "pago" && studentData.value) {
                    console.log(`Somando mensalidade de R$ ${studentData.value}`);
                    totalReceita += parseFloat(studentData.value); // Soma o valor da mensalidade
                }
            });
    
            console.log(`Total da receita: R$ ${totalReceita}`);
            return totalReceita;
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            return 0; // Retorna 0 em caso de erro
        }
    };

    const ReceitaAtual = () => {
        const [totalReceita, setTotalReceita] = useState(0);
    
        useEffect(() => {
            const calcularReceita = async () => {
                const receita = await fetchAllPayments();
                setTotalReceita(receita);
            };
    
            calcularReceita();
        }, []);
    
        return (
            <div className="receita-atual text-center">
                <p className="receita-valor">R$ {totalReceita.toFixed(2)}</p>
            </div>
        );
    };

    const fetchAllPaymentsBaixo = async () => {
        try {
            const studentsCollectionRef = collection(db, "students");
            const studentsSnapshot = await getDocs(studentsCollectionRef);
    
            let totalFalta = 0;
            let totalAtraso = 0;
            const selectedMonth = currentDate.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
            const selectedYear = currentDate.getFullYear();
    
            studentsSnapshot.forEach((doc) => {
                const studentData = doc.data();
                const payments = studentData.payments || {};
                //const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
                const paymentInfo = payments[selectedMonth];

                console.log(`fetchAllPaymentsBaixo - Pagamento do aluno ${doc.id} (${selectedMonth}/${selectedYear}): ${paymentInfo}`);
    
                // Verificar se o pagamento está "não pago"
                if (paymentInfo === "nao pago" && studentData.value) {
                    console.log(`Somando mensalidade de R$ ${studentData.value} para 'não pago'`);
                    totalFalta += parseFloat(studentData.value); // Soma o valor da mensalidade
                }
                // Verificar se o pagamento está "em atraso"
                else if (paymentInfo === "em atraso" && studentData.value) {
                    console.log(`Somando mensalidade de R$ ${studentData.value} para 'em atraso'`);
                    totalAtraso += parseFloat(studentData.value); // Soma o valor da mensalidade
                }
            });
    
            console.log(`Total de falta: R$ ${totalFalta}`);
            console.log(`Total de atraso: R$ ${totalAtraso}`);

            // Retorna os totais de "não pago" e "em atraso"
            return { totalFalta, totalAtraso };
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            return { totalFalta: 0, totalAtraso: 0 }; // Retorna 0 em caso de erro
        }
    };


    const StatusFinanceiro = () => {
        const [totalFalta, setTotalFalta] = useState(0);
        const [totalAtraso, setTotalAtraso] = useState(0);
    
        useEffect(() => {
            const calcularStatus = async () => {
                const { totalFalta, totalAtraso } = await fetchAllPaymentsBaixo();
                setTotalFalta(totalFalta);
                setTotalAtraso(totalAtraso);
            };
    
            calcularStatus();
        }, []);
    
        return (
            <div className="fixed-footer">
                <div className="status-item">
                    <p className="status-title">Falta</p>
                    <p className="status-value falta">R$ {totalFalta.toFixed(2)}</p>
                </div>
                <div className="status-item">
                    <p className="status-title">Em Atraso</p>
                    <p className="status-value atraso">R$ {totalAtraso.toFixed(2)}</p>
                </div>
            </div>
        );
    };









    const [currentDate, setCurrentDate] = useState(new Date()); // Data inicial é a data atual

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1); // Retrocede um mês
        setCurrentDate(newDate);
    };
    
    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1); // Avança um mês
        setCurrentDate(newDate);
    };
    
    const monthYear = currentDate.toLocaleString('pt-BR', { month: 'long' });

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        const fetchDataForMonth = async () => {
            const selectedMonth = currentDate.toLocaleString("pt-BR", { month: "long" }).toLowerCase();
            const selectedYear = currentDate.getFullYear();
    
            console.log(`Buscando dados para: ${selectedMonth} de ${selectedYear}`);
            
            // Aqui você pode implementar a lógica para buscar os dados do banco ou API
        };
    
        fetchDataForMonth();
    }, [currentDate]); // Executa toda vez que o mês/ano mudar

    const handleDateChange = (date) => {
        setCurrentDate(date);
    };
    









    const [filterStatus, setFilterStatus] = useState("todos");
    const filterByStatus = (status, alunos) => {
        if (status === "todos") return alunos; // Não aplica nenhum filtro
        return alunos.filter((aluno) => {
            const currentMonth = new Date().toLocaleString("pt-BR", { month: "long" }).toLowerCase();
            const paymentStatus = aluno.payments?.[currentMonth] || "nao pago"; // Obtém o status do pagamento do mês atual
            return paymentStatus === status; // Retorna apenas os alunos com o status correspondente
        });
    };
    const filteredAndSortedAlunos = filterByStatus(filterStatus, filteredAlunos);
    const handleFilterChange = (selectedStatus) => {
        setFilterStatus(selectedStatus); // Atualiza o estado local
        onFilterChange(selectedStatus); // Chama a função passada como prop
    };
    const onFilterChange = (selectedStatus) => {
        setFilterStatus(selectedStatus); // Atualiza o estado com o filtro selecionado
    };
    












    const [selectedOption, setSelectedOption] = useState("todos");
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSelect = (value) => {
        setSelectedOption(value);
        setShowDropdown(false); // Fecha o dropdown após selecionar
        handleFilterChange(value); // Chama a função de filtro já existente
    };

    const renderSelectedOption = () => {
        const options = {
            todos: { color: "gray", label: "Todos os Status" },
            pago: { color: "green", label: "Pagos" },
            "em atraso": { color: "red", label: "Em Atraso" },
            "nao pago": { color: "yellow", label: "Não Pago" },
        };

        const { color, label } = options[selectedOption];

        return (
            <div className="selected-option">
                <span className={`status-circle ${color}`}></span>
                {label}
            </div>
        );
    };






    
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
                {/*{showCalendar && (
                    <Calendar 
                        onChange={handleDateChange}
                        value={currentDate} // Define a data atual como o valor inicial
                        className="custom-calendar"
                    />
                )}*/}


                {/* Receita Atual */}
                <div className="receita-atual text-center">
                    <h3 style={{fontSize:"30px"}}>Receita Atual</h3>
                    <ReceitaAtual />
                </div>

                {/* Filtro de Status */}
                <div className="status-filter" style={{ marginTop: "-15px" }}>
                    <div className="custom-select">
                        <div 
                            className="selected-option" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            {renderSelectedOption()} {/* Função para exibir o texto e bolinha do item selecionado */}
                        </div>
                        {showDropdown && (
                            <ul className="dropdown-list">
                                <li onClick={() => handleSelect("todos")}>
                                    <span className="status-circle gray"></span> Todos os Status
                                </li>
                                <li onClick={() => handleSelect("pago")}>
                                    <span className="status-circle green"></span> Pagos
                                </li>
                                <li onClick={() => handleSelect("em atraso")}>
                                    <span className="status-circle red"></span> Em Atraso
                                </li>
                                <li onClick={() => handleSelect("nao pago")}>
                                    <span className="status-circle yellow"></span> Não Pago
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            
          <div style={{marginTop:"490px"}}>
            <div className="search-bar" style={{marginTop:"302px"}}>
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
                    {filteredAndSortedAlunos.length === 0 ? (
                        <p style={{marginTop:"60px", fontSize:"25px"}}>Nenhum aluno encontrado</p>
                    ) : (
                        filteredAndSortedAlunos.map((aluno, index) => (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index} style={{
                                marginTop: filteredAndSortedAlunos.length === 1 ? "20px" : "0", // Adiciona margem somente quando há um resultado
                            }}>
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
                                            <div className="icon-text icon-text-money">
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

            <StatusFinanceiro />
          </div>
        </>
    );
}

export default Finance;
