import React, { useState } from 'react';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';

const ProductCard = ({ product }) => {
  const [likes, setLikes] = useState(product.likes);
  const [showSpecs, setShowSpecs] = useState(false);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 relative">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p>{product.description}</p>
      <button 
        className="text-blue-500 mt-2 text-sm underline" 
        onClick={() => setShowSpecs(!showSpecs)}
      >
        {showSpecs ? 'Ver menos' : 'Ver más características'}
      </button>
      
      {showSpecs && (
        <p className="text-sm text-gray-500 mt-2">{product.specs}</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <button onClick={handleLike} className="flex items-center text-red-500">
            <AiOutlineHeart className="mr-2" /> {likes}
          </button>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
          <AiOutlineShoppingCart className="mr-2" /> Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
