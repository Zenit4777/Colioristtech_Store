import React from 'react';
import { useStore } from '../Components/StoreContext';

const Wishlist = () => {
  const { user } = useStore();

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Mi Lista de Deseos</h2>
      {user.favoriteProducts && user.favoriteProducts.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.favoriteProducts.map((product, index) => (
            <li key={index} className="border rounded-lg p-4">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2 rounded" />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Tu lista de deseos está vacía.</p>
      )}
    </div>
  );
};

export default Wishlist;