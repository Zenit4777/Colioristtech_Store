import React, { useEffect, useState } from 'react';
import { useStore } from '../Components/StoreContext';
import { Link as LinkRouter} from 'react-router-dom';
import { FaCog, FaQuestionCircle, FaEnvelope, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseComps/LoginFirebase';

const Account = () => {
  const {user, logout, addTemporaryUser, loading } = useStore();
  const [userData, setUserData] = useState();

  console.log(userData);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          // For temporary user, use the user object directly
          if (user.uid === 'temp-user-id') {
            setUserData(user);
          } else {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              console.log("Datos del usuario recuperados:", userDoc.data());
              setUserData(userDoc.data());
            } else {
              console.log("El documento del usuario no existe.");
            }          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">No hay usuario registrado.</p>
        <LinkRouter to="/login" className="text-blue-600 hover:underline">Iniciar sesión</LinkRouter>

        <button
          onClick={addTemporaryUser}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaUserPlus className="mr-2" />
          Agregar usuario temporal
        </button>
      </div>
    );
  }

  // Debug information
  // console.log('Current user:', user);
  // USER_DEBUG_INFO: This is the registered user object

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-100 to-slate-200">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-8 md:mb-0">
          <h1 className="text-2xl font-bold mb-4 pt-10">Te damos la bienvenida, {userData?.name || 'Usuario'}</h1>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            {/* <h2 className="text-xl font-semibold mb-2">{userData?.pointHistory || 0} puntos</h2> */}
            <h2 className="text-xl font-semibold mb-2">{userData?.pointHistory?.length || 0} puntos</h2>
            {userData?.purchaseHistory?.length > 0 ? (
              userData.purchaseHistory.map((purchase, index) => (
                <div key={index} className="mb-2">
                  <span>{purchase.itemName} - ${purchase.amount}</span>
                </div>
                ))
                ) : (
              <p>No hay compras registradas.</p>
               )}
            <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
              Ver member ID
            </button>
          </div>
          <nav className="space-y-2">
            <LinkRouter to="/Accounts/UserProfile" className="block text-blue-600 hover:underline">Mi cuenta</LinkRouter>
            <LinkRouter to="/Purchase" className="block hover:underline">Todas las compras</LinkRouter>
            <LinkRouter to="/invite" className="block hover:underline">Invitar a un amigo</LinkRouter>
            <LinkRouter to="/points-history" className="block hover:underline">Mi historial de puntos</LinkRouter>
            <LinkRouter to="/payment-settings" className="block hover:underline">Configuración de pago</LinkRouter>
            <div className="pt-4">
              <LinkRouter to="/settings" className="flex items-center hover:underline">
                <FaCog className="mr-2" /> Configuración
              </LinkRouter>
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">¿Necesitas ayuda?</h3>
              <LinkRouter to="/help" className="flex items-center hover:underline">
                <FaQuestionCircle className="mr-2" /> Membresia De Coliorist
              </LinkRouter>
              <LinkRouter to="/contact" className="flex items-center hover:underline mt-2">
                <FaEnvelope className="mr-2" /> Contáctanos
              </LinkRouter>
            </div>
            <button onClick={logout} className="flex items-center text-red-600 hover:underline mt-4">
              <FaSignOutAlt className="mr-2" /> Cerrar sesión
            </button>
          </nav>
        </div>
        <div className="md:w-3/4 md:pl-8">
          <h2 className="text-xl font-bold mb-4 pt-10">Mis beneficios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {userData?.benefits && userData.benefits.length > 0 ? (
              userData.benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <img src={benefit.image} alt={benefit.title} className="w-full h-40 object-cover mb-4 rounded" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
              ))
              ) : (
                <p>No hay beneficios disponibles.</p>
              )}         
              </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Todas las compras</h2>
            <LinkRouter to="/purchases" className="text-blue-600 hover:underline">
              Ver todas las compras &gt;
            </LinkRouter>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Account;