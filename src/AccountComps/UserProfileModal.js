import React, { useState, useEffect } from 'react';
import { useStore } from '../Components/StoreContext';
import { FaCamera, FaEdit, FaLock, FaSave, FaTimes } from 'react-icons/fa';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseComps/LoginFirebase';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useStore();
  const [editingField, setEditingField] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    card: '',
    bitcoinWallet: '',
    ethereumWallet: '',
    moneroWallet: '',
    paypalEmail: '',
    profilePicture: '/placeholder.svg?height=200&width=200'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({ ...userDoc.data(), email: user.email });
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSubmit = async (field) => {
    const updatedData = { [field]: userData[field] };
    await updateDoc(doc(db, 'users', user.uid), updatedData);
    if (field === 'name') {
      await updateProfile(getAuth().currentUser, { displayName: userData.name });
    }
    updateUserProfile(updatedData);
    setEditingField(null);
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(getAuth(), userData.email);
      alert('Se envió un correo para restablecer la contraseña. \nRevise tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
      alert('No se pudo enviar el correo. Intente de nuevo.');
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setUserData({ ...userData, profilePicture: downloadURL });
      await updateDoc(doc(db, 'users', user.uid), { profilePicture: downloadURL });
      await updateProfile(getAuth().currentUser, { photoURL: downloadURL });
    }
  };

  if (!isOpen) return null;

  const fieldLabels = {
    name: 'Nombre',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    address: 'Dirección'
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mi Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="relative shadow-md">
            <img
              src={userData.profilePicture}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
            <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-md">
              <FaCamera />
              <input
                type="file"
                id="profile-picture"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </label>
          </div>
        </div>
        <div className="space-y-4">
                {['name', 'email', 'phone', 'address'].map((key) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between border p-2 rounded-md shadow-sm">
              <label className="text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                {fieldLabels[key]}:
              </label>
                {editingField === key ? (
                  <div className="flex items-center">
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      value={userData[key]}
                      placeholder={`Escriba su ${fieldLabels[key].toLowerCase()}`}
                      onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md placeholder-gray-400 px-2"
                    />
                    <button
                      onClick={() => handleSubmit(key)}
                      className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform active:scale-95"
                    >
                      <FaSave className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">{userData[key] || 'No especificado'}</span>
                    <button
                      onClick={() => setEditingField(key)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
            
          ))}
        </div>
        <div className="mt-6 flex flex-col justify-end sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleResetPassword}
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <FaLock className="mr-2" />
            Restablecer Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;