import React from 'react';
import { useStore } from '../Components/StoreContext';

const Benefits = () => {
  const { user } = useStore();

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Mis Beneficios</h2>
      {user.benefits && user.benefits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.benefits.map((benefit, index) => (
            <div key={index} className="border rounded-lg p-4">
              <img src={benefit.image} alt={benefit.title} className="w-full h-32 object-cover mb-2 rounded" />
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tienes beneficios disponibles en este momento.</p>
      )}
    </div>
  );
};

export default Benefits;