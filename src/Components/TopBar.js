import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaSearch } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="bg-gray-900 text-white py-1 fixed top-0 z-20 w-full h-7">
      <div className="container mx-auto flex justify-between items-center px-4 h-5">
        {/* Redes Sociales */}
        <div className="flex space-x-4 pb-2 h-4">
          <a href="https://facebook.com/profile.php?id=61555816247609" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
            <FaInstagram />
          </a>
        </div>

        {/* Barra de Búsqueda */}
        <div className="relative">
          <input
            type="text"
            className="px-1 py-3 h-1  text-xs align-text-top pt-2 pb-3 pl-3 rounded-full bg-gray-800 text-white focus:outline-none"
            placeholder="Buscar..."
          />
          <FaSearch className="absolute right-3 top-1/2 h-4 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Selector de Idioma */}
        <div>
          <select className="bg-gray-800 text-white px-2 align-text-top text-xs  pt-0 pb-1 h-5 py-1 rounded focus:outline-none">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
