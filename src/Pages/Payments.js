import React, { useState, useEffect } from 'react';
import { useStore } from '../Components/StoreContext';
import { FaCreditCard, FaBitcoin, FaEthereum, FaPaypal, FaWhatsapp } from 'react-icons/fa';
import { SiMonero } from 'react-icons/si';
import { Link as LinkRouter } from 'react-router-dom';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseComps/LoginFirebase';

const Payment = () => {
  const { cart, user, updateUserProfile } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentDetails, setPaymentDetails] = useState({
    card: '',
    bitcoin: '',
    ethereum: '',
    monero: '',
    paypal: ''
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
      setPhone(user.phone || '');
      setPaymentDetails({
        card: user.card || '',
        bitcoin: user.bitcoin || '',
        ethereum: user.ethereum || '',
        monero: user.monero || '',
        paypal: user.paypal || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const paymentInfo = {
      address,
      phone,
      [paymentMethod]: paymentDetails[paymentMethod]
    };

    if (savePaymentMethod && user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, paymentInfo);
        updateUserProfile(paymentInfo);
      } catch (error) {
        console.error('Error saving payment information:', error);
      }
    }

    // Here you would typically integrate with a payment gateway
    console.log('Processing payment...', paymentInfo);
    
    // Reset form if not saving
    if (!savePaymentMethod) {
      setAddress('');
      setPhone('');
      setPaymentDetails({
        card: '',
        bitcoin: '',
        ethereum: '',
        monero: '',
        paypal: ''
      });
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={paymentDetails.card}
              onChange={(e) => setPaymentDetails({...paymentDetails, card: e.target.value})}
              placeholder="Número de tarjeta"
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 'bitcoin':
      case 'ethereum':
      case 'monero':
        return (
          <div>
            <input
              type="text"
              value={paymentDetails[paymentMethod]}
              onChange={(e) => setPaymentDetails({...paymentDetails, [paymentMethod]: e.target.value})}
              placeholder={`Dirección de ${paymentMethod}`}
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 'paypal':
        return (
          <div>
            <input
              type="email"
              value={paymentDetails.paypal}
              onChange={(e) => setPaymentDetails({...paymentDetails, paypal: e.target.value})}
              placeholder="Email de PayPal"
              className="w-full p-2 border rounded"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getTaxRate = () => {
    switch (paymentMethod) {
      case 'card':
        return 0.15; // 5% tax
      case 'bitcoin':
        return 0.10; // 5% tax
      case 'ethereum':
      case 'monero':
        return 0.02; // 2% tax
      case 'paypal':
        return 0.03; // 3% tax
      default:
        return 0;
    }
  };

  const tax = total * getTaxRate();
  const finalTotal = total + tax;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-teal-100 to-slate-300 ">
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8">Pago</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Resumen del pedido</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>L{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>L{total.toFixed(2)} <span className="font-normal">Más ISV</span></span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Dirección de envío</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ingresa tu dirección de envío"
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Número de teléfono</h2>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingresa tu número de teléfono"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Método de pago</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="form-radio"
                />
                <span>Tarjeta de crédito</span>
                <FaCreditCard className="ml-2" />
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bitcoin"
                  checked={paymentMethod === 'bitcoin'}
                  onChange={() => setPaymentMethod('bitcoin')}
                  className="form-radio"
                />
                <span>Bitcoin</span>
                <FaBitcoin className="ml-2" />
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ethereum"
                  checked={paymentMethod === 'ethereum'}
                  onChange={() => setPaymentMethod('ethereum')}
                  className="form-radio"
                />
                <span>Ethereum</span>
                <FaEthereum className="ml-2" />
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="monero"
                  checked={paymentMethod === 'monero'}
                  onChange={() => setPaymentMethod('monero')}
                  className="form-radio"
                />
                <span>Monero</span>
                <SiMonero className="ml-2" />
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="form-radio"
                />
                <span>PayPal</span>
                <FaPaypal className="ml-2" />
              </label>
            </div>

            {renderPaymentForm()}
            
            {paymentMethod && (
              <div className="mt-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={savePaymentMethod}
                    onChange={() => setSavePaymentMethod(!savePaymentMethod)}
                    className="form-checkbox"
                  />
                  <span>Guardar método de pago para futuras compras</span>
                </label>
              </div>
            )}

            {paymentMethod && (
              <div className="mt-4">
                <p>Impuestos: L{tax.toFixed(2)} ({(getTaxRate() * 100).toFixed(2)}%)</p>
                <p className="font-bold">Total final: L{finalTotal.toFixed(2)}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={!paymentMethod}
            >
              Pagar
            </button>
          </div>

          <div className="mt-8 text-center">
            <a
              href={`https://wa.me/50498079630?text=Hola!%20quiero%20hacer%20un%20pago%20en%20efectivo`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <FaWhatsapp className="mr-2" />
              Contactar para pago en efectivo
            </a>
          </div>
        </div>
      </div>
    </div>
   </div>
  );
};

export default Payment;