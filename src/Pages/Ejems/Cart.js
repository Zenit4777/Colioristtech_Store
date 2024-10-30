import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const Cart = () => {
  // Puedes agregar lógica de estado para manejar productos en el carrito
  return (
    <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      <p className="text-center">No hay productos en el carrito</p>
      <button className="bg-green-500 text-white px-4 py-2 mt-4 flex items-center justify-center rounded">
        <AiOutlineShoppingCart className="mr-2" /> Finalizar Compra
      </button>
    </div>
  );
};

export default Cart;
