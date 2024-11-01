import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import './Receipt.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from 'react-time-picker'; // Biblioteca para o relógio
import HorarioAulaInput from '../../components/HorarioAulaInput';
import PhotoUpload from '../../components/PhotoUpload';
import { AiFillPicture } from 'react-icons/ai';
import { FaSearch, FaCalendarAlt, FaClock, FaMusic, FaDollarSign, FaUsers } from "react-icons/fa";
import qrcode from '../../assets/imgs/qrcodeGoogle.png';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const Receipt = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        instrumentos: [],
        modalidade: "",
        tempo: "",
        venceDia: "",
        valor: "",
        diaAula: "",
        horarioAula: ""
    });
    const [errors, setErrors] = useState({});

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleInstrumentChange = (instrumento) => {
        setFormData((prevData) => ({
            ...prevData,
            instrumentos: prevData.instrumentos.includes(instrumento)
                ? prevData.instrumentos.filter(i => i !== instrumento)
                : [...prevData.instrumentos, instrumento]
        }));
    };

    const handlePriceChange = (e) => {
        let value = e.target.value;
    
        // Remove tudo que não for número
        value = value.replace(/\D/g, '');
    
        // Formata para exibir como 0,00
        if (value.length > 0) {
            value = (parseFloat(value) / 100).toFixed(2).replace('.', ',');
        }
    
        setFormData({ ...formData, price: value });
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsCollection = collection(db, 'students');
                const studentsSnapshot = await getDocs(studentsCollection);
                const studentsList = studentsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStudents(studentsList);
            } catch (error) {
                console.error('Erro ao buscar os alunos: ', error);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        setFilteredStudents(
            students.filter(student => 
                student.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, students]);

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setSearchTerm(''); // Limpa o campo de busca
    };

    const handleRemoveStudent = () => {
        setSelectedStudent(null); // Remove o aluno selecionado
    };

    return (
        <>
        <div className="pag-all-receipt">
            <Header toggleMenu={toggleMenu} />
            <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />

            <form className="student-form-classes">
            <h2 className="title-text-receipt">Qual é o valor ?</h2>

            {/* Campo de Preço */}
            <div className="price-input-wrapper">
                <span className="price-prefix">R$</span>
                <input
                    type="text"
                    className="price-input"
                    placeholder="0,00"
                    value={formData.price}
                    onChange={handlePriceChange}
                />
            </div>

            <div className="receipt-container">
                <div className="search-bar-classes-receipt">
                    <label className="form-label">Aluno</label>
                    <input 
                        type="text" 
                        placeholder="Nome do Aluno" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon-classes" />

                    {/* Renderiza os resultados da pesquisa em cards apenas se houver busca */}
                    {searchTerm && (
                        <div className="content-container search-results">
                            <div className="row">
                                {filteredStudents.length === 0 ? (
                                    <p>Nenhum aluno encontrado</p>
                                ) : (
                                    filteredStudents.map(student => (
                                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={student.id}>
                                            <div 
                                                className="card aluno-card-receipt" 
                                                onClick={() => handleSelectStudent(student)}
                                            >
                                                <div className="full-width-name">
                                                    <h5 className="card-title">{student.name}</h5>
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <div className="profile-container-receipt">
                                                        <img
                                                            alt={`Imagem do perfil de ${student.name}`}
                                                            className="rounded-circle profile-img"
                                                            src={student.img}
                                                            width="80"
                                                            height="80"
                                                        />
                                                        <div className={`status-dot ${student.value}`}></div>
                                                    </div>

                                                    <div className="ms-3">
                                                        <div className="icon-text">
                                                            <FaCalendarAlt size={18} className="iconsMenu" />
                                                            <span className="card-text">{student.day}</span>
                                                        </div>
                                                        <div className="icon-text">
                                                            <FaClock size={18} className="iconsMenu" />
                                                            <span className="card-text">{student.hour}</span>
                                                        </div>
                                                        <div className="icon-text">
                                                            <FaMusic size={18} className="iconsMenu" />
                                                            <span className="card-text">{student.instrument}</span>
                                                        </div>
                                                    </div>

                                                    <div className="ms-auto text-end second-column">
                                                        <div className="icon-text icon-text-money">
                                                            <FaDollarSign size={18} className="iconsMenu" />
                                                            <span className={`price ${student.status}`}>R$ {student.value}</span>
                                                        </div>
                                                        <div className="icon-text">
                                                            <FaUsers size={18} className="iconsMenu" />
                                                            <span className="status">{student.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Renderiza o aluno selecionado com margem superior */}
                {selectedStudent && (
                    <div className="selected-student mt-4">
                        <h3 style={{fontSize:"19px"}}>Aluno Selecionado:</h3>
                        <div className="card aluno-card-receipt selected">
                            <div className="full-width-name">
                                <h5 className="card-title">{selectedStudent.name}</h5>
                            </div>  
                            <div className="d-flex align-items-center">
                                <div className="profile-container">
                                    <img
                                        alt={`Imagem do perfil de ${selectedStudent.name}`}
                                        className="rounded-circle profile-img"
                                        src={selectedStudent.img}
                                        width="80"
                                        height="80"
                                    />
                                    <div className={`status-dot ${selectedStudent.value}`}></div>
                                </div>

                                <div className="ms-3">
                                    <div className="icon-text">
                                        <FaCalendarAlt size={18} className="iconsMenu" />
                                        <span className="card-text">{selectedStudent.day}</span>
                                    </div>
                                    <div className="icon-text">
                                        <FaClock size={18} className="iconsMenu" />
                                        <span className="card-text">{selectedStudent.hour}</span>
                                    </div>
                                    <div className="icon-text">
                                        <FaMusic size={18} className="iconsMenu" />
                                        <span className="card-text">{selectedStudent.instrument}</span>
                                    </div>
                                </div>

                                <div className="ms-auto text-end second-column">
                                    <div className="icon-text icon-text-money">
                                        <FaDollarSign size={18} className="iconsMenu" />
                                        <span className={`price ${selectedStudent.status}`}>R$ {selectedStudent.value}</span>
                                    </div>
                                    <div className="icon-text">
                                        <FaUsers size={18} className="iconsMenu" />
                                        <span className="status">{selectedStudent.type}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="remove-button" 
                                onClick={handleRemoveStudent}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                )}
            </div>



                <div className="container mt-4 register-container-receipt">
                    <div className="mb-3">
                        <label className="form-label">Aluno está pagando referente ao mês de:</label>
                        <div className="row">
                            {["Janeiro", "Maio", "Setembro", "Fevereiro", "Junho", "Outubro", "Março", "Julho", "Novembro", "Abril", "Agosto", "Dezembro"].map((instrumento, index) => (
                                <div className="col-4 col-md-3 col-lg-2 mb-3" key={index}>
                                    <div className="form-check font-test    ">
                                        <input
                                            className="font-test form-check-input"
                                            id={instrumento}
                                            type="checkbox"
                                            checked={formData.instrumentos.includes(instrumento)}
                                            onChange={() => handleInstrumentChange(instrumento)}
                                        />
                                        <label className="form-check-label" htmlFor={instrumento}>
                                            {instrumento.charAt(0).toUpperCase() + instrumento.slice(1)}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="qrcode">
                    <img src={qrcode}/>
                </div>

                <div className="fixed-footer-background"></div>
                <div className="button-container">
                    <button className="btn-receipt">Receber</button>
                    <button className="btn-cancell">Cancelar</button>
                </div>
            </form>
        </div>
        </>
    );

};

export default Receipt;