import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, storage } from '../FirebaseComps/LoginFirebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdNightlight, MdMotionPhotosOn, MdWbSunny, MdMic, MdColorLens, MdVolumeUp, Md3DRotation } from 'react-icons/md';
import { useStore } from './StoreContext';

const fetchCameras = async (setCameras) => {
  const querySnapshot = await getDocs(collection(db, 'cameras'));
  const camerasList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setCameras(camerasList);
};

const editCamera = async (id, field, value, cameras, setCameras) => {
  await updateDoc(doc(db, 'cameras', id), { [field]: value });
  const updatedCameras = cameras.map(camera => 
    camera.id === id ? { ...camera, [field]: value } : camera
  );
  setCameras(updatedCameras);
};

const deleteCamera = async (id, cameras, setCameras) => {
  if (window.confirm('Are you sure you want to delete this camera?')) {
    await deleteDoc(doc(db, 'cameras', id));
    const updatedCameras = cameras.filter(camera => camera.id !== id);
    setCameras(updatedCameras);
  }
};



const filterCameras = (cameras, filters) => {
  return cameras.filter(camera => {
    const searchLower = filters.search ? filters.search.toLowerCase() : '';
    const matchesSearch = Object.entries(camera).some(([key, value]) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchLower);
      }
      if (typeof value === 'number') {
        return value.toString().includes(searchLower);
      }
      return false;
    });

    return (
      matchesSearch &&
      (!filters.category || camera.category === filters.category) &&
      (!filters.brandId || camera.brandId === filters.brandId) &&
      (!filters.resolution || camera.resolution === filters.resolution) &&
      (!filters.minPrice || camera.price >= filters.minPrice) &&
      (!filters.maxPrice || camera.price <= filters.maxPrice) &&
      (!filters.microphone || camera.features.microphone === filters.microphone) &&
      (!filters.color || camera.features.color === filters.color) &&
      (!filters.rotation || camera.features.rotation === filters.rotation) &&
      (!filters.twoWayAudio || camera.features.twoWayAudio === filters.twoWayAudio) &&
      (!filters.weatherResistance || camera.features.weatherResistance === filters.weatherResistance)
    );
  });
};

const sortCameras = (cameras, sortBy) => {
  switch (sortBy) {
    case 'priceLowToHigh':
      return [...cameras].sort((a, b) => a.price - b.price);
    case 'priceHighToLow':
      return [...cameras].sort((a, b) => b.price - a.price);
    case 'relevance':
    default:
      return cameras;
  }
};

const ImageEdit = ({ images, onSave, onCancel }) => {
  const [editedImages, setEditedImages] = useState(images);
  const [uploading, setUploading] = useState(false);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const storageRef = ref(storage, `camera_images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setEditedImages([...editedImages, url]);
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setEditedImages(editedImages.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {editedImages.map((image, index) => (
          <div key={index} className="relative flex items-center mb-2">
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-20 object-cover rounded" />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 transition duration-300"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center ml-72 gap-2 flex-grow p-2 border rounded mr-2">
        <input
          type="file"
          onChange={handleAddImage}
          className="hidden"
          id="image-upload"
          accept="image/*"
        />
        <label
          htmlFor="image-upload"
          className={`bg-blue-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-600 transition duration-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Add Image'}
        </label>
        <div>
          <button onClick={() => onSave(editedImages)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-300">
            Save
          </button>
          <button onClick={onCancel} className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600 transition duration-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const GetCamera = () => {
  const [cameras, setCameras] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('relevance');
  const [editingField, setEditingField] = useState(null);
  const [editingCamera, setEditingCamera] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [newField, setNewField] = useState({ name: '', value: '' });
  const { user } = useStore();
  const [showAddField, setShowAddField] = useState(false);

  useEffect(() => {
    fetchCameras(setCameras);
  }, []);

  const userHasPermission = user //&& user.role === 'admin'; 

  const handleEdit = (camera, field) => {
    if (userHasPermission) {
      setEditingCamera(camera.id);
      setEditingField(field);
      setEditValue(camera[field]);
    } else {
      alert('You do not have permission to edit.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await editCamera(editingCamera, editingField, editValue, cameras, setCameras);
    setEditingCamera(null);
    setEditingField(null);
    setEditValue('');
    setLoading(false);
  };

  const handleImageEdit = (camera) => {
    if (userHasPermission) {
      setEditingCamera(camera.id);
      setEditingField('images');
    } else {
      alert('You do not have permission to edit images.');
    }
  };

  const handleImageSave = async (newImages) => {
    setLoading(true);
    await editCamera(editingCamera, 'images', newImages, cameras, setCameras);
    setEditingCamera(null);
    setEditingField(null);
    setLoading(false);
  };

  const toggleFiltersBoton = () => {
  setShowAddField(!showAddField);
};

// Cambiado de lugar para que sea independiente de la cámara seleccionada
const AddField = ({ cameraId, onFieldAdded }) => {
  const [newField, setNewField] = useState({ name: '', value: '' });
  const [loading, setLoading] = useState(false);

  const handleAddField = async () => {
    if (newField.name && newField.value) {
      setLoading(true);
      const cameraToUpdate = await doc(db, 'cameras', cameraId);
      const updatedCamera = { [newField.name]: newField.value };
      await updateDoc(cameraToUpdate, updatedCamera);
      onFieldAdded();
      setNewField({ name: '', value: '' });
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Field Name..."
        value={newField.name}
        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
        className="p-2 border rounded w-full md:w-auto text-sm mb-2"
      />
      <input
        type="text"
        placeholder="Field Value..."
        value={newField.value}
        onChange={(e) => setNewField({ ...newField, value: e.target.value })}
        className="p-2 border rounded w-full md:w-auto text-sm mb-2"
      />
      <button
        onClick={handleAddField}
        className={`bg-blue-500 text-white px-4 py-2 rounded text-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition duration-300`}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Field'}
      </button>
    </div>
  );
};

const toggleAddField = (cameraId) => {
  setShowAddField((prev) => ({
    ...prev,
    [cameraId]: !prev[cameraId], // Alterna el valor solo para la cámara seleccionada
  }));
};

  // const handleAddField = async () => {
  //   if (newField.name && newField.value) {
  //     setLoading(true);
  //     const cameraToUpdate = cameras.find(c => c.id === editingCamera);
  //     const updatedCamera = { ...cameraToUpdate, [newField.name]: newField.value };
  //     await updateDoc(doc(db, 'cameras', editingCamera), updatedCamera);
  //     const updatedCameras = cameras.map(c => c.id === editingCamera ? updatedCamera : c);
  //     setCameras(updatedCameras);
  //     setNewField({ name: '', value: '' });
  //     setLoading(false);
  //   }
  // };
 

  const filteredAndSortedCameras = sortCameras(filterCameras(cameras, filters), sortBy);

  const renderValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 my-20">Security Cameras</h1>
            
      {/* Filter and Sort Controls */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md flex flex-wrap gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
          <div className='relative md:mb-0 mb-4'>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-0 py-2 border rounded-lg"
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <FaSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>{/* Add Field Toggle */}
<button
        onClick={toggleFiltersBoton}
        className="flex items-center bg-gray-500 text-white px-4 py-2 rounded text-sm mb-4"
      >
        {showAddField ? <FaChevronUp /> : <FaChevronDown />} Filters
      </button>
       {/* Add New Field */}
                 {showAddField && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <select
            className="p-2 border rounded w-full"
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="wifi">WiFi</option>
            <option value="ip">IP</option>
          </select>
          <select
            className="p-2 border rounded w-full"
            onChange={(e) => setFilters({...filters, brandId: e.target.value})}
          >
            <option value="">All Brands</option>
            {/* Add brand options dynamically */}
          </select>
          <select
            className="p-2 border rounded w-full"
            onChange={(e) => setFilters({...filters, resolution: e.target.value})}
          >
            <option value="">All Resolutions</option>
            <option value="1080p">1080p</option>
            <option value="4K">4K</option>
            {/* Add more resolution options */}
          </select>
          <select
            className="p-2 border rounded w-full"
            onChange={(e) => setFilters({...filters, microphone: e.target.value === 'true'})}
          >
            <option value="">Microphone</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <select
            className="p-2 border rounded w-full"
            onChange={(e) => setFilters({...filters, color: e.target.value === 'true'})}
          >
            <option value="">Color</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <select
            className="p-2 border rounded w-full"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
          </div>
        )}
        </div>
            </div>     
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-20 px-18">
        {filteredAndSortedCameras.length > 0 ? (
          filteredAndSortedCameras.map((camera) => (
            <div key={camera.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Main Image */}
              <img
                src={camera.images && camera.images[0] ? camera.images[0] : '/placeholder.svg'}
                alt={camera.name}
                className="w-full h-64 object-cover mb-4 rounded"
              />
               {/* Image Thumbnails */}
              <div className="flex gap-2 mb-4">
                {camera.images && camera.images.map((image, index) => (
                  <img key={index} src={image} alt={`Thumbnail ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
              
              {/* Edit Images Button */}
              {userHasPermission && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mb-4"
                  onClick={() => handleImageEdit(camera)}
                >
                  Edit Images
                </button>
              )}

              {/* Image Edit Modal */}
              {editingCamera === camera.id && editingField === 'images' && (
                <ImageEdit
                  images={camera.images || []}
                  onSave={handleImageSave}
                  onCancel={() => setEditingCamera(null)}
                />
              )}

              <div className="p-6">
                {/* Name and Price */}
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{camera.name}</h2>
                <p className="text-xl font-semibold mb-4 text-green-600">${camera.price ? parseFloat(camera.price).toFixed(2) : 'Precio no disponible'}
                </p>
                
                {/* Camera Info */}
                <div className="space-y-2">
                  {['brandId', 'categoryId', 'resolution', 'stock', 'shortDescription', 'specificDescription', 'category'].map((key) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">{key}:</span>
                      <div className="flex items-center">
                        <span className="text-gray-800">{renderValue(camera[key])}</span>
                        {userHasPermission && (
                          <button
                            onClick={() => handleEdit(camera, key)}
                            className="ml-2 text-blue-500 hover:text-blue-600 transition duration-300"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Features */}
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-700">Features:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(camera.features).map(([feature, enabled]) => (
                      <span
                        key={feature}
                        className={`px-2 py-1 rounded-full text-sm ${
                          enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {feature}: {enabled ? 'Yes' : 'No'}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Custom Features */}
                {camera.customFeatures && camera.customFeatures.length > 0 && (
                  <div className="mt-4">
                    
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Custom Features:</h3>
                    <ul className="list-disc list-inside">
                      {camera.customFeatures.map((feature, index) => (
                        <li key={index} className="text-gray-600">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Add Field Toggle */}
<button
            onClick={() => toggleAddField(camera.id)} // Pasar camera.id a la función
            className="flex items-center bg-gray-500 text-white px-4 py-2 rounded text-sm mb-4"
      >
        {showAddField[camera.id] ? <FaChevronUp /> : <FaChevronDown />} Add Field
      </button>
                 {/* Add New Field */}
                 {userHasPermission && showAddField[camera.id] && (
  <AddField cameraId={camera.id} onFieldAdded={() => fetchCameras(setCameras)} />
)}


      {/* {userHasPermission && editingCamera && ( */}
      {/* {userHasPermission && showAddField && (
        <div className="mb-8 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Field Name..."
            value={newField.name}
            onChange={(e) => setNewField({...newField, name: e.target.value})}
            className="p-1 border rounded w-full md:w-auto text-sm"
          /> */}
          {/* <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Add Field</button> */}
          {/* <input
              type="text"
              placeholder="Field Value"
              value={newField.value}
              onChange={(e) => setNewField({...newField, value: e.target.value})}
              className=" p-1 border rounded w-full md:w-auto text-sm"
            />
             <button
              onClick={handleAddField}
              className={`bg-blue-500 text-white px-2 py-1 rounded text-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition duration-300`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Field'}
            </button>
        </div>
      )} */}
                 {/* Add New Field */}
                {/* Delete Button */}
                {userHasPermission && (
                  <button
                    className="ml-80 mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 mb-4 text-right"
                    onClick={() => deleteCamera(camera.id, cameras, setCameras)}
                  >
                    Delete Camera<FaTrash className="inline ml-2" />
                  </button>
                )}
              </div>
              
              

              {/* Edit Field Modal */}
              {editingCamera === camera.id && editingField && editingField !== 'images' && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                  <div className="bg-white p-5 rounded-lg shadow-xl">
                    <h3 className="text-lg font-bold mb-4">Edit {editingField}</h3>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition duration-300`}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingCamera(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-600 mb-4">No cameras found matching your criteria.</p>
            <p className="text-lg text-gray-500">Try adjusting your filters or search terms.</p>
            {/* You can add suggested searches here based on available data */}
          </div>
        )}
      </div>
      </div>

      
    </div>
  );
};

export default GetCamera;