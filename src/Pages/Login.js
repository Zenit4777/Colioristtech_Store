import React, { useState } from 'react';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider  } from 'firebase/auth';
import { auth } from '../FirebaseComps/LoginFirebase';

 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario logueado:");
      navigate('/Accounts');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate('/Accounts');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 bg-gradient-to-b from-red-100 to-slate-200 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 duration-100"
              disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : 'Iniciar sesión'}  
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O usa tu email</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div>
              <button
              onClick={() => handleSocialLogin(new GoogleAuthProvider())}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-200 duration-100"
              disabled={isLoading}
              >
                <FaGoogle className="w-5 h-5 text-red-500" />
                <span className="sr-only">Google</span>
              </button>
            </div>
            <div>
              <button
              onClick={() => handleSocialLogin(new FacebookAuthProvider())}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-200 duration-100"
              disabled={isLoading}
              >
                <FaFacebook className="w-5 h-5 text-blue-600" />
                <span className="sr-only">Facebook</span>
              </button>
            </div>
            <div>
              <button
                onClick={() => handleSocialLogin(new OAuthProvider('apple.com'))}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-200 duration-100"
                disabled={isLoading}
              >
                <FaApple className="w-5 h-5 text-gray-900" />
                <span className="sr-only">Apple</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/Register" className="font-medium text-indigo-600 hover:text-indigo-500">
            ¿No tienes una cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;