import React, { useState, useRef } from 'react';
import Select from 'react-select';
import './RegisterStudent.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from 'react-time-picker'; // Biblioteca para o relógio
import HorarioAulaInput from '../../components/HorarioAulaInput';
import PhotoUpload from '../../components/PhotoUpload';
import { AiFillPicture } from 'react-icons/ai';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Ajuste o caminho conforme a localização do arquivo firebaseConfig.js
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const RegisterStudent = () => {
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
    const [image, setImage] = useState(null); // Estado para armazenar a imagem
    const [photo, setPhoto] = useState(null); // Estado para armazenar a foto capturada
    const [showCamera, setShowCamera] = useState(false); // Estado para controlar se a câmera está ativa
    const videoRef = useRef(null); // Referência para o elemento de vídeo
    const canvasRef = useRef(null); // Referência para o canvas onde a foto será desenhada
    const navigate = useNavigate();

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

    const handleFormSubmit = async (e) => {
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

        if (Object.keys(newErrors).length === 0 && photo) {
            try {
                const storage = getStorage(); // Instanciar o Firebase Storage
                const storageRef = ref(storage, `students/${formData.name}-${Date.now()}.png`); // Criar referência no Storage

                // Converter dataURL (base64) para Blob para enviar ao Storage
                const response = await fetch(photo);
                const blob = await response.blob();

                // 1. Upload da imagem para o Firebase Storage
                await uploadBytes(storageRef, blob);

                // 2. Pegar o URL da imagem
                const imageUrl = await getDownloadURL(storageRef);

                // 3. Salvar os dados no Firestore com o URL da imagem
                await addDoc(collection(db, "students"), {
                    name: formData.name,
                    instrument: formData.instrumentos,
                    type: formData.modalidade,
                    time: formData.tempo,
                    day: formData.diaAula,
                    hour: formData.horarioAula,
                    value: formData.valor,
                    img: imageUrl // Salvar o URL da imagem
                });

                toast.success('Dados salvos com sucesso!', { position: 'top-center' });
                setTimeout(() => navigate('/students'), 3000); // Redirecionar após 3 segundos

            } catch (error) {
                console.error("Erro ao salvar os dados: ", error);
                toast.error('Erro ao salvar os dados, tente novamente.');
            }
        } else {
            toast.error('Por favor, tire uma foto.');
        }
    };

    const handlePhotoClick = () => {
        setShowCamera(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
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

    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, tempo: selectedOption.value });
    };

    const options = [
        { value: 'Individual', label: 'Individual' },
        { value: 'Turma', label: 'Turma' },
        { value: 'Avulso', label: 'Avulso' }
    ];

    const diasOptions = [
        { value: 'Segunda', label: 'Segunda-feira' },
        { value: 'Terça', label: 'Terça-feira' },
        { value: 'Quarta', label: 'Quarta-feira' },
        { value: 'Quinta', label: 'Quinta-feira' },
        { value: 'Sexta', label: 'Sexta-feira' },
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
            <ToastContainer position="top-center" />

            <div className="container mt-4 register-container-student">
                <form className="student-form" onSubmit={handleFormSubmit}>
                    <h2 className="title-text">Novo Aluno!</h2>

                    <div className="mb-3 font-test">
                        <label className="form-label" htmlFor="name">Nome</label>
                        <input
                            className={`font-test form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nome do Aluno"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Instrumentos</label>
                        <div className="row">
                            {["Violão", "Violino", "Guitarra", "Teclado", "Bateria", "Baixo", "Canto", "Acordeon", "Viola", "Ukelele", "Saxofone", "Outro"].map((instrumento, index) => (
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
                        <div className="col-6 mb-3">
                            <label className="form-label">Modalidade</label>
                            <Select
                            className={`font-test font-test ${errors.valor ? 'is-invalid' : ''}`}
                                options={options}
                                classNamePrefix="custom-select"
                                value={options.find(option => option.value === formData.modalidade)}
                                onChange={(selectedOption) => handleInputChange({ target: { name: 'modalidade', value: selectedOption.value } })}
                                placeholder="Selecionar"
                            />
                            {errors.modalidade && <div className="invalid-feedback">{errors.modalidade}</div>}
                        </div>

                        <div className="col-6 mb-3">
                            <label className="form-label">Tempo</label>
                            <Select
                                className={`font-test font-test ${errors.valor ? 'is-invalid' : ''}`}
                                options={tempoOptions}
                                classNamePrefix="custom-select"
                                value={tempoOptions.find(option => option.value === formData.tempo)}
                                onChange={handleSelectChange}
                                placeholder="Selecionar"
                            />
                            {errors.tempo && <div className="invalid-feedback">{errors.tempo}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 mb-3 font-test">
                            <label className="form-label">Vence Dia</label>
                            <input
                                className={`font-test form-control ${errors.venceDia ? 'is-invalid' : ''}`}
                                name="venceDia"
                                type="number"
                                max="31"
                                min="1"
                                placeholder="Selecionar"
                                value={formData.venceDia}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Limita o valor a no máximo 31 e garante que tenha no máximo 2 dígitos
                                    if (value.length <= 2 && (value === '' || (Number(value) >= 1 && Number(value) <= 31))) {
                                        handleInputChange(e);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Evita que o usuário insira caracteres inválidos, como o 'e' ou 'E'
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            {errors.venceDia && <div className="invalid-feedback">{errors.venceDia}</div>}
                        </div>


                        <div className="col-6 mb-3">
                            <label className="form-label">Valor</label>
                            <div className="input-group font-test">
                                <span className="input-group-text">R$</span>
                                <input
                                    className={`font-test form-control ${errors.valor ? 'is-invalid' : ''}`}
                                    name="valor"
                                    type="number"
                                    placeholder="0,00" // O que aparece quando o campo está vazio
                                    value={formData.valor}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {errors.valor && <div className="invalid-feedback">{errors.valor}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="form-label">Dia da Aula</label>
                            <Select
                                className={`font-test font-test ${errors.valor ? 'is-invalid' : ''}`}
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
                            colClass="col-6" 
                            placeholder="Digite um horário" 
                            label="Horário da Aula" 
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
                                        <p>Adicione uma foto do aluno</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button className="btn w-100" type="submit">Cadastrar</button>
                </form>
            </div>
        </>
    );
};

export default RegisterStudent;
