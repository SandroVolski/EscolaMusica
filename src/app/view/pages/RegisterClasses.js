import React, { useState, useRef } from 'react';
import Select from 'react-select';
import './RegisterClasses.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from 'react-time-picker'; // Biblioteca para o relógio
import HorarioAulaInput from '../../components/HorarioAulaInput';
import PhotoUpload from '../../components/PhotoUpload';
import { AiFillPicture } from 'react-icons/ai';
import { FaSearch } from "react-icons/fa";


const RegisterClasses = () => {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleInstrumentChange = (instrumento) => {
        setFormData((prevData) => ({
            ...prevData,
            instrumentos: prevData.instrumentos.includes(instrumento)
                ? prevData.instrumentos.filter(i => i !== instrumento)
                : [...prevData.instrumentos, instrumento]
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name) newErrors.name = "Nome é obrigatório.";
        if (!formData.modalidade) newErrors.modalidade = "Modalidade é obrigatória.";
        if (!formData.tempo) newErrors.tempo = "Tempo é obrigatório.";
        if (!formData.venceDia) newErrors.venceDia = "Vencimento é obrigatório.";
        if (!formData.valor) newErrors.valor = "Valor é obrigatório.";
        if (!formData.diaAula) newErrors.diaAula = "Dia da aula é obrigatório.";
        if (!formData.horarioAula) newErrors.horarioAula = "Horário é obrigatório.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("Formulário enviado", formData);
        }
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, tempo: selectedOption.value });
    };

    {/* CAMERA */}

    const [photo, setPhoto] = useState(null); // Estado para armazenar a foto capturada
    const [showCamera, setShowCamera] = useState(false); // Estado para controlar se a câmera está ativa
    const videoRef = useRef(null); // Referência para o elemento de vídeo
    const canvasRef = useRef(null); // Referência para o canvas onde a foto será desenhada

    const handlePhotoClick = () => {
        // Abrir a câmera ao clicar
        setShowCamera(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream; // Definir o vídeo para exibir o stream da câmera
            })
            .catch((error) => {
                console.error('Erro ao acessar a câmera: ', error);
            });
    };

    const handleTakePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Definir o tamanho do canvas igual ao vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Desenhar o frame atual do vídeo no canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Converter o conteúdo do canvas para uma URL de imagem
        const imgUrl = canvas.toDataURL('image/png');
        setPhoto(imgUrl); // Salvar a imagem capturada no estado

        // Parar o stream da câmera
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        // Fechar a câmera
        setShowCamera(false);
    };

    const options = [
        { value: 'Individual', label: 'Individual' },
        { value: 'Turma', label: 'Turma' },
        { value: 'Avulso', label: 'Avulso' }
    ];

    const diasOptions = [
        { value: 'Segunda-feira', label: 'Segunda-feira' },
        { value: 'Terça-feira', label: 'Terça-feira' },
        { value: 'Quarta-feira', label: 'Quarta-feira' },
        { value: 'Quinta-feira', label: 'Quinta-feira' },
        { value: 'Sexta-feira', label: 'Sexta-feira' },
        { value: 'Sábado', label: 'Sábado' },
        { value: 'Domingo', label: 'Domingo' }
    ];

    const tempoOptions = [
        { value: '1 Hora', label: '1 Hora' },
        { value: '30 Min', label: '30 Min' }
    ];

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />

            <div className="container mt-4 register-container">
                <form className="student-form-classes" onSubmit={handleFormSubmit}>
                    <h2 className="title-text">Nova Turma!</h2>

                    <div className="mb-3 font-test">
                        <label className="form-label" htmlFor="name">Nome</label>
                        <input
                            className={`font-test form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nome da Turma"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Instrumentos</label>
                        <div className="row">
                            {["violao", "violino", "guitarra", "teclado", "bateria", "baixo", "canto", "acordeon", "viola", "ukelele", "saxofone", "outro"].map((instrumento, index) => (
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

                    <div className="row">
                        <div className="col-4 mb-3">  {/* Ajuste aqui para col-4 */}
                            <label className="form-label">Tempo</label>
                            <Select
                                className={`font-test ${errors.tempo ? 'is-invalid' : ''}`}
                                options={tempoOptions}
                                classNamePrefix="custom-select"
                                value={tempoOptions.find(option => option.value === formData.tempo)}
                                onChange={handleSelectChange}
                                placeholder="Selecionar"
                            />
                            {errors.tempo && <div className="invalid-feedback">{errors.tempo}</div>}
                        </div>

                        <div className="col-4 mb-3">  {/* Ajuste aqui para col-4 */}
                            <label className="form-label">Dia da Aula</label>
                            <Select
                                className={`font-test ${errors.diaAula ? 'is-invalid' : ''}`}
                                options={diasOptions}
                                classNamePrefix="custom-select"
                                value={diasOptions.find(option => option.value === formData.diaAula)}
                                onChange={(selectedOption) => handleInputChange({ target: { name: 'diaAula', value: selectedOption.value } })}
                                placeholder="Selecionar"
                            />
                            {errors.diaAula && <div className="invalid-feedback">{errors.diaAula}</div>}
                        </div>

                        <HorarioAulaInput 
                            errors={errors} 
                            formData={formData} 
                            setFormData={setFormData} 
                            colClass="col-4" 
                            placeholder="Digite" 
                            label="Horário" 
                        />


                    </div>

                    <div className="photo-container">
                        {showCamera ? (
                            // Exibir a câmera se o estado showCamera for true
                            <div className="camera-overlay">
                                <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '8px' }}></video>
                                <button onClick={handleTakePhoto}></button>
                                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Canvas oculto para capturar a imagem */}
                            </div>
                        ) : (
                            // Exibir a foto capturada ou o ícone para abrir a câmera
                            <div className="photo-upload mb-3 text-center">
                                {photo ? (
                                    <div>
                                        <img src={photo} alt="Foto do aluno" style={{ width: '100%', borderRadius: '8px' }} />
                                        <button onClick={handlePhotoClick}>Tirar outra foto</button>
                                    </div>
                                ) : (
                                    <div onClick={handlePhotoClick}>
                                        <AiFillPicture style={{ fontSize: '300%' }} />
                                        <p>Adicione uma foto da Turma</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="search-bar-classes">
                        <label className="form-label">Integrantes</label>
                        <input type="text" placeholder="Nome do Aluno" />
                        <FaSearch className="search-icon-classes" />
                    </div>

                    <button className="btn w-100" type="submit">Cadastrar</button>
                </form>
            </div>
        </>
    );
};

export default RegisterClasses;
