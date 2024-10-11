import React, { useState, useRef } from 'react';
import Select from 'react-select';
import './Receipt.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from 'react-time-picker'; // Biblioteca para o relógio
import HorarioAulaInput from '../../components/HorarioAulaInput';
import PhotoUpload from '../../components/PhotoUpload';
import { AiFillPicture } from 'react-icons/ai';
import { FaSearch } from "react-icons/fa";
import qrcode from '../../assets/imgs/qrcodeGoogle.png';

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

            <div className="search-bar-classes-receipt">
                <label className="form-label">Aluno</label> 
                <input type="text" placeholder="Nome do Aluno" />
                <FaSearch className="search-icon-classes" />
            </div>



                <div className="container mt-4 register-container">
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