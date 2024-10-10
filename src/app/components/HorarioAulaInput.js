import React from 'react';

const HorarioAulaInput = ({ errors, formData, setFormData, colClass = 'col-4', label = "Horário da Aula" }) => {
    const handleInputChange = (e) => {
        const value = e.target.value;

        // Remove todos os caracteres que não são números
        const sanitizedValue = value.replace(/\D/g, '');

        // Adiciona os dois pontos na posição correta
        let formattedValue = '';
        if (sanitizedValue.length >= 3) {
            formattedValue = `${sanitizedValue.slice(0, 2)}:${sanitizedValue.slice(2, 4)}`;
        } else if (sanitizedValue.length === 2) {
            formattedValue = `${sanitizedValue.slice(0, 2)}:`;
        } else {
            formattedValue = sanitizedValue;
        }

        setFormData({ ...formData, horarioAula: formattedValue });
    };

    return (
        <div className={`${colClass} mb-3`}>
            <label className="form-label">{label}</label>
            <input
                className={`font-test form-control ${errors.horarioAula ? 'is-invalid' : ''}`}
                name="horarioAula"
                type="text"
                placeholder="Digite um horário" // Você pode ajustar o placeholder se necessário
                value={formData.horarioAula}
                onChange={handleInputChange}
                maxLength={5} // Limita a entrada a 5 caracteres (HH:MM)
            />
            {errors.horarioAula && <div className="invalid-feedback">{errors.horarioAula}</div>}
        </div>
    );
};

export default HorarioAulaInput;
