import React from 'react';
import { IoLogoWhatsapp } from 'react-icons/io';

const SupportButton = () => {
  return (
    <div className="fixed bottom-4 right-4">
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-green-500 text-white px-4 py-3 rounded-full flex items-center"
      >
        <IoLogoWhatsapp className="mr-2 text-2xl" /> Contáctanos
      </a>
    </div>
  );
};

export default SupportButton;
