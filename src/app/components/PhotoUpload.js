import React, { useState } from 'react';
import { AiFillPicture } from 'react-icons/ai';
import './PhotoUpload.css';

const PhotoUpload = () => {
    const [photo, setPhoto] = useState(null); // Estado para armazenar a foto
    const [showCamera, setShowCamera] = useState(false); // Para abrir ou fechar a câmera

    const handlePhotoClick = () => {
        // Abrir a câmera quando o usuário clicar no ícone
        setShowCamera(true);
    };

    const handleTakePhoto = () => {
        // Acessar a câmera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                const video = document.querySelector('video');
                video.srcObject = stream;
                const track = stream.getTracks()[0];

                // Tirar uma foto após 3 segundos (ou imediatamente, como desejar)
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imgUrl = canvas.toDataURL('image/png'); // Captura a imagem
                    setPhoto(imgUrl); // Atualiza a foto no estado
                    track.stop(); // Para a câmera
                    setShowCamera(false); // Fecha a câmera
                }, 3000);
            })
            .catch((error) => {
                console.error('Erro ao acessar a câmera: ', error);
            });
    };

    return (
        <div>
            {photo ? (
                // Exibir a foto capturada
                <div className="photo-upload mb-3 text-center">
                    <img src={photo} alt="Foto do aluno" style={{ width: '100%', borderRadius: '8px' }} />
                    <button onClick={handlePhotoClick}>Tirar outra foto</button>
                </div>
            ) : (
                // Exibir ícone e abrir câmera quando clicar
                <div className="photo-upload mb-3 text-center" onClick={handlePhotoClick}>
                    <AiFillPicture style={{ fontSize: '300%' }} />
                    <p>Adicione uma foto do aluno</p>
                </div>
            )}

            {showCamera && (
                <div className="camera-overlay">
                    <video autoPlay style={{ width: '100%' }}></video>
                    <button onClick={handleTakePhoto}>Tirar Foto</button>
                </div>
            )}
        </div>
    );
};

export default PhotoUpload;
