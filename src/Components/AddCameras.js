import React, { useState, useEffect } from 'react';
import { addCamera, getCameras } from '../FirebaseComps/AddGetCameraFunc';
import { FaCamera, FaPlus, FaSpinner, FaTrash, FaUpload } from 'react-icons/fa';
import { useStore } from './StoreContext'; // Assume we have an AuthContext for user authentication

const AddCameras = () => {
  const [cameraData, setCameraData] = useState({
    name: '',
    brandId: '',
    categoryId: '',
    resolution: '',
    price: '',
    stock: '',
    shortDescription: '',
    specificDescription: '',
    category: '',
    features: { 
      nightVision: false,
      motionDetection: false,
      weatherResistance: false,
      microphone: false,
      color: false,
      twoWayAudio: false,
      rotation: false
    },
    customFeatures: []
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const { user } = useStore(); // Get the current user from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCameraData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (feature) => {
    setCameraData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomFeature = () => {
    if (newFeature.trim()) {
      setCameraData(prev => ({
        ...prev,
        customFeatures: [...prev.customFeatures, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveCustomFeature = (index) => {
    setCameraData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Debes iniciar sesión para añadir cámaras.");
      return;
    }
    setIsLoading(true);
    try {
      const cameraId = await addCamera(cameraData, images);
      alert(`Cámara añadida con éxito. ID: ${cameraId}`);
      setCameraData({
        name: '',
        brandId: '',
        categoryId: '',
        resolution: '',
        price: '',
        stock: '',
        shortDescription: '',
        specificDescription: '',
        category: '',
        features: {
          nightVision: false,
          motionDetection: false,
          weatherResistance: false,
          microphone: false,
          color: false,
          twoWayAudio: false,
          rotation: false
        },
        customFeatures: []
      });
      setImages([]);
    } catch (error) {
      alert("Hubo un problema al añadir la cámara. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Gestión de Cámaras</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-700">
            <FaPlus className="mr-2 text-blue-500" /> Añadir Nueva Cámara
          </h2>
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la cámara (Ej: Cámara Domo HD)
                </label>
                <input
                  type="text"
                  name="name"
                  value={cameraData.name}
                  onChange={handleChange}
                  placeholder="Ej: Cámara Domo HD"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de la marca (Ej: BRAND001)
                </label>
                <input
                  type="text"
                  name="brandId"
                  value={cameraData.brandId}
                  onChange={handleChange}
                  placeholder="Ej: BRAND001"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de la categoría (Ej: CAT001)
                </label>
                <input
                  type="text"
                  name="categoryId"
                  value={cameraData.categoryId}
                  onChange={handleChange}
                  placeholder="Ej: CAT001"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría (Ej: WiFi, Cableada, Exterior)
                </label>
                <input
                  type="text"
                  name="category"
                  value={cameraData.category}
                  onChange={handleChange}
                  placeholder="Ej: WiFi, Cableada, Exterior"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <input
                  type="text"
                  name="type"
                  value={cameraData.type}
                  onChange={handleChange}
                  placeholder="Ej: Domo, Bullet, PTZ"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolución (Ej: 1080p)
                </label>
                <input
                  type="text"
                  name="resolution"
                  value={cameraData.resolution}
                  onChange={handleChange}
                  placeholder="Ej: 1080p"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (Ej: 199.99)
                </label>
                <input
                  type="number"
                  name="price"
                  value={cameraData.price}
                  onChange={handleChange}
                  placeholder="Ej: 199.99"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock (Ej: 50)
                </label>
                <input
                  type="number"
                  name="stock"
                  value={cameraData.stock}
                  onChange={handleChange}
                  placeholder="Ej: 50"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (Ej: Cámara de seguridad HD para interiores)
                </label>
                <textarea
                  name="shortDescription"
                  value={cameraData.shortDescription}
                  onChange={handleChange}
                  placeholder="Ej: Cámara de seguridad HD para interiores"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Específicaciones (Ej: Esta cámara ofrece visión nocturna de hasta 30m...)
                </label>
                <textarea
                  name="specificDescription"
                  value={cameraData.specificDescription}
                  onChange={handleChange}
                  placeholder="Ej: Esta cámara ofrece visión nocturna de hasta 30m..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Características</label>
                <div className="grid grid-cols-2 gap-4">
                {Object.entries(cameraData.features).map(([featureName, featureValue]) => (
                  <label key={featureName} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={featureValue}
                      onChange={() => handleFeatureChange(featureName)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2">{featureName.charAt(0).toUpperCase() + featureName.slice(1)}</span>
                  </label>
                ))}
              </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Características personalizadas</label>
                {cameraData.customFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <div className="flex">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Nueva característica"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFeature}
                    className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-300"
                  >
                    Añadir
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de la cámara</label>
               <div className="mt-1 flex items-center">
                <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTrash />
                      Eliminar
                    </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaUpload className="mr-2" />
                )}
                {isLoading ? "Agregando..." : "Agregar cámara"}
              </button>
              </div>
            </form>
          ) : (
            <p className="text-red-500">Debes iniciar sesión para añadir cámaras.</p>
          )}
        </div>
        
          
        
      </div>
    </div>
  );
};

export default AddCameras;