import React, { useState } from 'react';
import { FaTrash, FaLock, FaTruck, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineShoppingCart } from 'react-icons/ai';
import { Link as LinkRouter } from "react-router-dom";
import { useStore } from '../Components/StoreContext';

const CheckoutPage = () => {
  const [discountApplied, setDiscountApplied] = useState(false);

  const { 
    cart, 
    wishlist, 
    addToCart,
    updateCartItemQuantity,
    updateWishlistItemQuantity, 
    removeItem, 
  } = useStore();

  const applyDiscount = () => {
    if (discountCode.toLowerCase() === 'colioristdesc') {
      setDiscountApplied(true);
    } else {
      alert('Código de descuento inválido');
    }
  };

  const [discountCode, setDiscountCode] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = discountApplied ? subtotal * 0.1 : 0; // 10% discount
  const tax = (subtotal - discount) * 0.1; // 10% tax
  const total = subtotal - discount + tax;

  return (
    <div name='CheckoutPage' className="w-full bg-gradient-to-b from-teal-100 to-slate-300 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8 text-center">Tu Carrito de Compras</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Visible solo en pantallas medianas */}
          <div className="hidden md:block lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Lista de Compras</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">Producto</th>
                    <th className="text-left font-semibold">Precio</th>
                    <th className="text-left font-semibold">Cantidad</th>
                    <th className="text-left font-semibold">SubTotal</th>
                    <th className="text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                  <tr key={item.id}>                    
                        <td className="py4">
                        <div className="flex items-center">
                          <img className="h-16 w-1/4 mr-4 object-cover rounded-xl" src={item.images && item.images[0] ? item.images[0] : '/placeholder.svg'} alt={item.name} />
                          <span className="text-lg font-semibold mb-1">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4">L{parseFloat(item.price).toFixed(2)}</td>
                      <td className="py-4">
                      <div className="flex">
                          <button onClick={() => updateCartItemQuantity(item.id, -1)} className={`border rounded-md py-2 px-4 mr-2 items-center ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={item.quantity <= 1}>
                            <AiOutlineMinus />  
                          </button>
                          <span className="text-center w-8">{item.quantity}</span>
                          <button onClick={() => updateCartItemQuantity(item.id, 1)} className="border rounded-md py-2 px-4 ml-2 items-center">
                            <AiOutlinePlus />
                          </button>
                        </div>
                      </td>
                      <td className="py-4">L{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                      <td className="py-4">
                        <button onClick={() => removeItem(item.id, 'cart')} className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lista de deseos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Lista de Deseos</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">Producto</th>
                    <th className="text-left font-semibold">Precio</th>
                    <th className="text-left font-semibold">Cantidad</th>
                    <th className="text-left font-semibold">SubTotal</th>
                    <th className="text-left font-semibold">Total</th>
                    <th className="text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <div className="flex items-center">
                          <img className="h-16 w-1/4 mr-4 object-cover rounded-xl" src={item.images && item.images[0] ? item.images[0] : '/placeholder.svg'} alt={item.name} />
                          <span className="font-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4">L{parseFloat(item.price).toFixed(2)}</td>
                      {/* <td className="py-4">{item.quantity || 1}</td> */}
                      
                      <td className="py-4">
                <div className="flex items-center">
                  <button onClick={() => updateWishlistItemQuantity(item.id, -1)} className={`border rounded-md py-2 px-4 mr-2 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={item.quantity <= 1}>
                    <AiOutlineMinus />
                  </button>
                  <span className="text-center w-8">{item.quantity || 1}</span>
                  <button onClick={() => updateWishlistItemQuantity(item.id, 1)} className="border rounded-md py-2 px-4 ml-2">
                    <AiOutlinePlus />
                  </button>
                </div>
                </td> 
                <td className="py-4">L{parseFloat(((item.quantity || 1) * item.price).toFixed(2))}</td>

                <td className="py-4">L{(item.price * (item.quantity || 1)).toFixed(2)}</td>

                      <td className="py-4">
                        {!cart.some(cartItem => cartItem.id === item.id) ? (
                        <button
                          onClick={() => addToCart(item)}
                          // onClick={() => {addToCart({ ...item, quantity: item.quantity || 1 });}}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600 transition duration-300"
                        >
                          Añadir al carrito
                        </button>
                        ) : item.purchased ? (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-green-600 transition duration-300"
                          >
                            Comprar de nuevo
                          </button>
                        ) : (
                          <span className="text-green-500">Añadido al carrito</span>
                        )}
                        <button
                          onClick={() => removeItem(item.id, 'wishlist')}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      {/* Resumen del Pedido y Proceder al Pago */}
          <div className="hidden md:block lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>L{subtotal.toFixed(2)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Descuento</span>
                  <span>-L{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Impuestos</span>
                <span>L{tax.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">L{total.toFixed(2)}</span>
              </div>
             
              <LinkRouter
                to="/Payment"
                smooth
                duration={500}
                className="cursor-pointer hover:text-gray-300">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-blue-600 transition duration-300">
                  Proceder al Pago
                </button>
              </LinkRouter>              
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h2 className="text-lg font-semibold mb-4">Código de Descuento</h2>
              <div className="flex items-center">
                <input
                  type="text"
                  className="border rounded-l-lg py-2 px-3 w-full"
                  placeholder="Ingresa tu código"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button 
                  onClick={() => applyDiscount(discountCode)}
                  className="bg-gray-800 text-white rounded-r-lg py-2 px-4 hover:bg-gray-700 transition duration-300"
                >
                  Aplicar
                </button>
              </div>
              {discountApplied && <p className="text-green-500 mt-2">¡Descuento aplicado!</p>}
            </div>
          </div>

          {/* Solo visible en pantallas pequeñas*/}
          <div className='block md:hidden'>  
          <div className="lg:w-2/3">
          <div className="grid grid-cols-1 bg-white rounded-lg shadow-md p-6 mb-8">
  <h2 className="text-2xl font-semibold mb-4">Lista de Compras</h2>
  {cart.map((item) => (
    <div key={item.id} className="relative flex flex-col mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
      {/* Botón de borrar en la esquina superior derecha */}
      <button onClick={() => removeItem(item.id, 'cart')} className="absolute top-2 right-2 p-3 text-red-500 hover:text-red-600">
        <FaTrash />
      </button>

      {/* Imagen del producto */}
      <img className="h-32 w-7/12 object-cover mb-2 rounded-xl" src={item.images && item.images[0] ? item.images[0] : '/placeholder.svg'} alt={item.name} />

      {/* Nombre del producto */}
      <span className="text-lg font-semibold mb-1">{item.name}</span>

      {/* Cantidad y botones de aumentar/disminuir */}
      <div className="flex justify-between items-center mb-1">
        {/* Columna de "Total" con cantidad abajo */}
        <div className="flex flex-col items-center">
          <span className="font-semibold">Precio</span>
          <span className="mt-1">L{parseFloat(item.price).toFixed(2)}</span>
        </div>
        {/* Columna para la palabra "Cantidad" centrada sobre los botones */}
        <div className="flex flex-col items-center">
          <span className="font-semibold mb-1">Cantidad</span>
          <div className="flex items-center">
            <button onClick={() => updateCartItemQuantity(item.id, -1)} className={`border rounded-md py-1 px-2 mr-2 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={item.quantity <= 1}>
              <AiOutlineMinus />
            </button>
            <span className="text-center w-8">{item.quantity}</span>
            <button onClick={() => updateCartItemQuantity(item.id, 1)} className="border rounded-md py-1 px-2 ml-2">
              <AiOutlinePlus />
            </button>
          </div>
        </div>

        {/* Columna de "SubTotal" centrado */}
        <div className="flex flex-col items-center">
          <span className="font-semibold">SubTotal</span>
          <span className="mt-1">L{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
        </div>


      </div>
    </div>
  ))}
</div>

            <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>L{subtotal.toFixed(2)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Descuento</span>
                  <span>-L{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Impuestos</span>
                <span>L{tax.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{total.toFixed(2)}</span>
              </div>
             
              <LinkRouter
                to="/Payment"
                smooth
                duration={500}
                className="cursor-pointer hover:text-gray-300">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-blue-600 transition duration-300">
                  Proceder al Pago
                </button>
              </LinkRouter>              
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h2 className="text-lg font-semibold mb-4">Código de Descuento</h2>
              <div className="flex items-center">
                <input
                  type="text"
                  className="border rounded-l-lg py-2 px-3 w-full"
                  placeholder="Ingresa tu código"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button 
                  onClick={() => applyDiscount(discountCode)}
                  className="bg-gray-800 text-white rounded-r-lg py-2 px-4 hover:bg-gray-700 transition duration-300"
                >
                  Aplicar
                </button>
              </div>
              {discountApplied && <p className="text-green-500 mt-2">¡Descuento aplicado!</p>}
            </div>
          </div>
          
            {/* Lista de deseos */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h2 className="text-2xl font-semibold mb-4">Lista de Deseos</h2>
              {wishlist.map((item) => (
                <div key={item.id} className="relative flex flex-col mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
                  <button onClick={() => removeItem(item.id, 'wishlist')} className="absolute top-2 right-2 p-3 text-red-500 hover:text-red-600">
                    <FaTrash />
                  </button>
                  
                  <img className="h-32 w-7/12 object-cover mb-2 rounded-xl" src={item.images && item.images[0] ? item.images[0] : '/placeholder.svg'} alt={item.name} />
                  <span className="text-lg font-semibold mb-1">{item.name}</span>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center pb-8">
                      <span className="font-semibold">Precio</span>
                      <span className="text-sm">L{parseFloat(item.price).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-center pb-8">
                      <span className="font-semibold mb-1">Cantidad</span>
                      <div className="flex items-center">
                        <button onClick={() => updateWishlistItemQuantity(item.id, -1, 'wishlist')} className={`border rounded-md py-1 px-2 mr-2 ${item.quantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={item.quantity === 1}>
                          <AiOutlineMinus />
                        </button>
                        <span className="text-center w-8">{item.quantity || 1}</span>
                        <button onClick={() => updateWishlistItemQuantity(item.id, 1)} className="border rounded-md py-1 px-2 ml-2">
                          <AiOutlinePlus />
                        </button>
                      </div>                      
                    </div>                  
                    <div className="flex flex-col items-center pt-6">
                      <span className="font-semibold">SubTotal</span>
                      <span>L{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                      <button onClick={() => addToCart(item)} className="bg-blue-500 text-white px-3 py-1        rounded-lg ml-2 mt-2 hover:bg-blue-600 transition duration-300 inline-flex">
                        Añadir<AiOutlineShoppingCart className='ml-2 mt-1'/>
                      </button>
                      </div>                    
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>        
          
          
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Por qué comprar con nosotros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <FaShieldAlt className="text-3xl text-blue-500 mr-2" />
              <span>Garantía de 2 años en todos los productos</span>
            </div>
            <div className="flex items-center">
              <FaTruck className="text-3xl text-blue-500 mr-2" />
              <span>Envío gratis en pedidos superiores a $300</span>
            </div>
            <div className="flex items-center">
              <FaLock className="text-3xl text-blue-500 mr-2" />
              <span>Pago seguro y encriptado</span>
            </div>
            <div className="flex items-center">
              <FaCreditCard className="text-3xl text-blue-500 mr-2" />
              <span>Aceptamos todas las tarjetas principales</span>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-600">
          <p>¿Tienes preguntas? Llámanos al (504) 9807-9630 CCTV-HELP</p>
          <p className="mt-2">
            <a href="#" className="text-blue-500 hover:underline">Política de devoluciones</a> | 
            <a href="#" className="text-blue-500 hover:underline ml-2">Términos y condiciones</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;