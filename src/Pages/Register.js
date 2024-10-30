import React, { useState } from 'react';
import { useStore } from '../Components/StoreContext';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { Link as LinkRouter, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../FirebaseComps/LoginFirebase';
import { doc, setDoc } from 'firebase/firestore';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loginWithGoogle, loginWithFacebook, loginWithApple, error, setError, isOffline } = useStore();
  const navigate = useNavigate();  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (isOffline) {
    //   setError("No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.");
    //   return;
    // }
    if (email === confirmEmail && password === confirmPassword) {
      // await register(name, email, password)
      try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate('/Accounts');

      // Guardar datos adicionales del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        address: '',
        phone: '',
        purchaseHistory: [],
        wishlist: [],
        pointHistory: [],
        paymentSettings: {},
        benefits: [
        { title: '10% de descuento', description: 'En tu primera compra', image: '/placeholder.svg' },
        { title: 'Envío gratis', description: 'En compras mayores a $50', image: '/placeholder.svg' },],
      });
      console.log("Usuario registrado y guardado");
      } catch (error) {
      console.error('Error registering in:',error);
      alert('Error registering in. Please try again.');
      }
      
    }else {
        alert('Emails or passwords do not match');
    };
    };
    const  handleGoogleRegister = async () => {
      if (isOffline) {
        setError("No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.");
        return;
      }
      await loginWithGoogle();
    };
  
    const handleFacebookRegister = async () => {
      if (isOffline) {
        setError("No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.");
        return;
      }
      await loginWithFacebook();
    };

    const handleAppleRegister = async () => {
      if (isOffline) {
        setError("No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.");
        return;
      }
      await loginWithApple();
    };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Regístrate
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre De Usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              </div>
            </div>
            <div className="rounded-md shadow-sm -space-y-px pt-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-email" className="sr-only">Confirma tu email</label>
              <input
                id="confirm-email"
                name="confirm-email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirma tu email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div></div>
            <div className="rounded-md shadow-sm -space-y-px pt-4">
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirma la contraseña</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirma la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div></div>
          </div></div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isOffline}
              >
                {isOffline ? 'Sin conexión' : 'Registrarse'}  
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O  regístrate con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div>
              <button
                onClick={handleGoogleRegister}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-200 duration-100"
              >
                <FaGoogle className="w-5 h-5 text-red-500 mr-2" />
                Google
              </button>
            </div>
            <div>
              <button
                onClick={handleFacebookRegister}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-200 duration-100"
              >
                <FaFacebook className="w-5 h-5 text-blue-600 mr-2" />
              </button>
            </div>
            <div>
              <button
                onClick={handleAppleRegister}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-200 duration-100"
              >
                <FaApple className="h-5 w-5 text-gray-900" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <LinkRouter to="/Login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Iniciar sesión
            </LinkRouter>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;