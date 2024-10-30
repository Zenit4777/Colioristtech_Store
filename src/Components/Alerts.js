import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

const Alert = ({ message, onClose, position }) => {
    return (
        // <div className="fixed top-0 right-0 mt-4 mr-4 w-1/3 bg-yellow-200 border border-yellow-400 text-yellow-800 p-4 rounded shadow-lg flex items-center">
        //     <FaExclamationTriangle className="mr-2" />
        //     <div className="flex-1">{message}</div>
        //     <button onClick={onClose} className="ml-2 text-yellow-800 font-bold">
        //         ×
        //     </button>
        // </div>
        <div className={`absolute ${position} bg-red-500 text-white p-2 rounded shadow-lg transition-opacity duration-300`}>
        <div className="flex justify-between items-center">
        <FaExclamationTriangle className="text-white mr-2" />
          <span>{message}</span>
          <button onClick={onClose}>
            <AiOutlineClose className="text-white ml-2" />
          </button>
        </div>
      </div>
    );
};

export default Alert;
