import React, { useState } from 'react';
import { FaCreditCard, FaLock, FaQuestion, FaCheckCircle } from 'react-icons/fa';
import { AiFillExclamationCircle } from 'react-icons/ai';

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [coupon, setCoupon] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de procesamiento del pago
    console.log('Procesando pago...');
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div name='PaymentPage' className="min-h-screen w-full bg-gradient-to-b from-teal-100 to-slate-300 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-blue-500 rounded-full flex items-center justify-center">
                <FaCreditCard className="h-8 w-8 text-white" />
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Pago Seguro</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">Ingrese los detalles de su tarjeta</p>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    id="card-number"
                    name="card-number"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="Número de tarjeta"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength="19"
                  />
                  <label htmlFor="card-number" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Número de tarjeta</label>
                </div>
                <div className="relative">
                  <input
                    id="card-name"
                    name="card-name"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="Nombre en la tarjeta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="card-name" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Nombre en la tarjeta</label>
                </div>
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <input
                      id="expiry"
                      name="expiry"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                      placeholder="MM/AA"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength="5"
                    />
                    <label htmlFor="expiry" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Fecha de expiración</label>
                  </div>
                  <div className="relative flex-1">
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="4"
                    />
                    <label htmlFor="cvv" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">CVV</label>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="coupon"
                    name="coupon"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="Código de cupón"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <label htmlFor="coupon" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Código de cupón (opcional)</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="save-card"
                    name="save-card"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <label htmlFor="save-card" className="ml-2 block text-sm text-gray-900">
                    Guardar esta tarjeta de forma segura
                  </label>
                </div>
                <div className="relative">
                  <button className="bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full flex items-center justify-center">
                    <FaLock className="mr-2" />
                    Agregar nueva tarjeta
                  </button>
                </div>
              </form>
            </div>
            <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
              <p className="text-gray-600 text-sm flex items-center">
                <FaLock className="mr-2 text-green-500" />
                Conexión segura y encriptada
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Al realizar el pago, aceptas nuestros <a href="#" className="text-blue-500 hover:underline">Términos y Condiciones</a> y <a href="#" className="text-blue-500 hover:underline">Política de Privacidad</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">¿Necesitas ayuda? Contáctanos al <a href="tel:+123456789" className="text-blue-500 hover:underline">+1 (234) 567-89</a></p>
      </div>
    </div>
  );
};

export default PaymentPage;