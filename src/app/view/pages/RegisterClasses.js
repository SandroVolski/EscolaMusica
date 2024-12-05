import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import './RegisterClasses.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from 'react-time-picker'; // Biblioteca para o relógio
import HorarioAulaInput from '../../components/HorarioAulaInput';
import PhotoUpload from '../../components/PhotoUpload';
import { AiFillPicture } from 'react-icons/ai';
import { FaSearch, FaPlus } from "react-icons/fa";
import { collection, query, where, getDocs, doc, setDoc, getFirestore } from 'firebase/firestore'; 
import { db } from '../../../firebaseConfig'; // Ajuste o caminho conforme a localização do arquivo firebaseConfig.js
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import perfillogo from '../../assets/imgs/perfillogo.png';

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
    const [photo, setPhoto] = useState(null); // Estado para armazenar a foto capturada
    const [showCamera, setShowCamera] = useState(false); // Estado para controlar se a câmera está ativa
    const videoRef = useRef(null); // Referência para o elemento de vídeo
    const canvasRef = useRef(null); // Referência para o canvas onde a foto será desenhada
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const navigate = useNavigate();
    
    // Inicializa o Firestore
    const db = getFirestore();

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
        // Validações
        if (!formData.name) newErrors.name = "Nome é obrigatório.";
        if (!formData.tempo) newErrors.tempo = "Tempo é obrigatório.";
        if (!formData.diaAula) newErrors.diaAula = "Dia da aula é obrigatório.";
        if (!formData.horarioAula) newErrors.horarioAula = "Horário é obrigatório.";
    
        setErrors(newErrors);
    
        // Se houver erros, não prosseguir
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        try {
            let photoURL = '';
    
            // Fazer upload da foto no Firebase Storage, se existir
            if (photo) {
                const storage = getStorage();
                const storageRef = ref(storage, `classes/${formData.name}-${Date.now()}.png`);
                const blob = dataURLtoBlob(photo); // Converte a imagem de dataURL para Blob
                await uploadBytes(storageRef, blob);
                photoURL = await getDownloadURL(storageRef);
            }
    
            // Prepara os dados da turma
            const classData = {
                className: formData.name,
                day: formData.diaAula,
                time: formData.horarioAula,
                img: photoURL,
                instrument: formData.instrumentos,
                students: selectedStudents.map(student => student.id), // IDs dos alunos
            };
    
            console.log("Dados da turma a serem enviados:", classData);
    
            // Salvar a turma no Firestore
            const classRef = doc(collection(db, 'classes')); // Cria uma referência para um novo documento
            await setDoc(classRef, classData); // Usa a referência para salvar os dados
            
            toast.success("Turma cadastrada com sucesso!", { position: 'top-center' });
            setTimeout(() => navigate('/classes'), 3000);
    
            // Limpa o formulário após o sucesso
            setFormData({
                name: "",
                instrumentos: [],
                modalidade: "",
                tempo: "",
                diaAula: "",
                horarioAula: ""
            });
            setSelectedStudents([]);
            setPhoto(null);
        } catch (error) {
            console.error("Erro ao cadastrar a turma:", error);
            toast.error("Erro ao cadastrar a turma.");
        }
    
        console.log("Formulário enviado", formData);
    };

    const dataURLtoBlob = (dataURL) => {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, tempo: selectedOption.value });
    };

    {/* CAMERA */}

    const handlePhotoClick = () => {
        setShowCamera(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream; // Define o vídeo para exibir o stream da câmera
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

    // Função para buscar alunos com base no nome
    const searchStudents = async (term) => {
        if (term === '') {
            setStudents([]); // Limpa a lista se o campo de pesquisa estiver vazio
            return;
        }

        try {
            // Cria uma consulta para buscar os alunos
            const q = query(
                collection(db, 'students'),
                where('name', '>=', term),
                where('name', '<=', term + '\uf8ff')
            );

            const snapshot = await getDocs(q);
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(results);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        }
    };

    // Use useEffect para chamar a função de busca quando o termo de pesquisa mudar
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "students"));
                const studentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStudents(studentsData);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
        fetchStudents();
    }, []);

    // Filtra os alunos com base no termo de pesquisa
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectStudent = (student) => {
        if (!selectedStudents.some(selected => selected.id === student.id)) {
            setSelectedStudents([...selectedStudents, student]);
        }
    };

    // Remove o aluno da lista de selecionados
    const handleRemoveStudent = (id) => {
        setSelectedStudents(selectedStudents.filter(student => student.id !== id));
    };

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Sidebar isOpen={menuOpen} toggleMenu={toggleMenu} />
            <ToastContainer />
            
            <div className="container mt-4 register-container-classes classes-test">
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
                        <input 
                            type="text" 
                            placeholder="Nome do Aluno" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="search-icon-classes" />

                        {/* Renderiza os resultados da pesquisa em cards apenas se houver busca */}
                        {searchTerm && (
                            <div className="search-results">
                                {filteredStudents.map(student => (
                                    <div 
                                        className="card aluno-card-class" 
                                        key={student.id} 
                                        onClick={() => handleSelectStudent(student)}
                                    >
                                        <div className="full-width-name">
                                            <h5 className="card-title-classes">{student.name}</h5>
                                        </div>
                                        <div className="profile-container">
                                            <img
                                                alt={`Profile image of ${student.name}`}
                                                className="rounded-circle profile-img"
                                                src={student.img ? student.img : perfillogo}
                                                width="80"
                                                height="80"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* Renderiza a lista de alunos selecionados */}
                        <h3 style={{fontSize:"19px", marginTop:"10px", marginBottom:"20px"}}>Alunos Selecionados:</h3>
                        <div className="selected-students">
                            {selectedStudents.map(student => (
                                <div className="card aluno-card-class selected" key={student.id}>
                                    <div className="full-width-name">
                                        <h5 className="card-title-classes">{student.name}</h5>
                                    </div>
                                    <div className="profile-container">
                                        <img
                                            alt={`Profile image of ${student.name}`}
                                            className="rounded-circle profile-img"
                                            src={student.img ? student.img : perfillogo}
                                            width="80"
                                            height="80"
                                        />
                                    </div>
                                    <button 
                                        className="remove-button" 
                                        onClick={() => handleRemoveStudent(student.id)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fixed-footer-background-classes"></div>
                    <div className="button-container">
                        <button className="btn-receipt-classes" type="submit">Cadastrar</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default RegisterClasses;
