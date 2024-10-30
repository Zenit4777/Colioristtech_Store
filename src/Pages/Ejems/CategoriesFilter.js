import React, { useState } from 'react';

const CategoriesFilter = () => {
  const categories = ['Todas', 'WiFi', 'IP', 'Analógicas', 'Accesorios'];

  const [selectedCategory, setSelectedCategory] = useState('Todas');

  return (
    <div className="p-4 flex justify-center">
      {categories.map(category => (
        <button 
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 mx-2 ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded-full`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoriesFilter;
