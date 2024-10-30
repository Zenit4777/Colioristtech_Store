import React, { useState, useEffect } from 'react';
import { useStore } from '../Components/StoreContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseComps/LoginFirebase';

const PurchaseHistoryModal = ({ isOpen, onClose }) => {
  const { user } = useStore();
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (user && user.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setPurchaseHistory(userDoc.data().purchaseHistory || []);
        }
      }
    };
    fetchPurchaseHistory();
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"  onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Historial de Compras</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        {purchaseHistory.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {purchaseHistory.map((purchase, index) => (
              <li key={index} className="py-4">
                <p className="text-sm font-medium text-gray-900">Fecha: {new Date(purchase.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Total: ${purchase.total.toFixed(2)}</p>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {purchase.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex flex-col items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <p className="text-xs text-center mt-1">{item.name}</p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay compras registradas.</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryModal;