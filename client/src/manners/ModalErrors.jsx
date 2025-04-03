import React from 'react';

const ModalErrors = ({ isOpen, onClose, errors }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-bold">Errores</h2>
        <ul className="mt-4">
          {errors.map((error, index) => (
            <li key={index} className="text-red-500">{error}</li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalErrors;