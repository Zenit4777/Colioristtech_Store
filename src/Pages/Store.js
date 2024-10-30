import React, { useState, useRef, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../FirebaseComps/LoginFirebase';
import { CiStar, CiHeart } from "react-icons/ci";
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { FaSearch, FaExclamationCircle, FaExclamationTriangle, FaEdit, FaTrash } from 'react-icons/fa';
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import { useStore } from '../Components/StoreContext';
import FloatingAlert from '../Components/Alerts';

const categories = ['Todos', 'CCTV', 'IP', 'WiFi', 'Accesorios', 'Kits'];

const Store = () => {
  const { 
    addToCart, 
    addToWishlist, 
    toggleLike, 
    likedProducts, 
    addToCompare, 
    removeFromCompare, 
    compareProducts,
    // setAlertCartMessage,
    // closeAlertCart,
    user
  } = useStore();

  const [cameras, setCameras] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({
    cart: {},
    wishlist: {}
  });
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertPosition, setAlertPosition] = useState({ top: 0, left: 0 });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCartMessage, setAlertCartMessage] = useState({});
  const [alertWishListMessage, setAlertWishListMessage] = useState({});
  const likeButtonRefs = useRef({});
  const AddCartButtonRefs = useRef({});
  const AddWishListButtonRefs = useRef({});

  useEffect(() => {
    fetchCameras();
  }, [selectedCategory]);

  useEffect(() => {
    if (user && user.id) {
      const savedFeedback = JSON.parse(localStorage.getItem(`actionFeedback_${user.id}`)) || {};
      setActionFeedback(savedFeedback);
    }

    // if (showAlert && likeButtonRef.current) {
    //   // Asegúrate de que el alert se posicione correctamente sobre el botón
    //   const { top, left, width } = likeButtonRef.current.getBoundingClientRect();
    //   setAlertPosition({ top: top - 40, left: left + width / 2 });
    // }
  }, [user, showAlert]);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'cameras'));
      const camerasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCameras(camerasList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cameras", error);
      setLoading(false);
    }
  };

  const filterCameras = (cameras, filters) => {
    return cameras.filter(camera => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = Object.values(camera).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(searchLower)
      );
      const matchesCategory = selectedCategory === 'Todos' || camera.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const FloatingAlert = ({ message, onClose, style }) => {
    return (
      <div className={`absolute bg-red-500 text-white p-2 rounded shadow-lg transition-opacity duration-300`} style={style}>
        <div className="flex justify-between items-center">
          <FaExclamationTriangle className="text-white mr-2" />
          <span>{message}</span>
          <button onClick={onClose}>
            <AiOutlineClose className="text-white ml-2" />
          </button>
        </div>
      </div>
    );
  };
  

  const handleLike = async (product) => {
    if (!user) {
      // setAlertVisible(true);
      // setTimeout(() => setAlertVisible(false), 3000); // Oculta la alerta después de 3 segundos
      setAlertMessage((prev) => ({
        ...prev,
        [product.id]: 'Por favor, inicia sesión para dar like a un producto',
      }));
      // setShowAlert(true);
      setTimeout(() => setAlertMessage(false), 3000);
      return;
    }
    await toggleLike(product);
    fetchCameras();
  };



  const handleAction = (action, product1, actionType) => {
    if (!user) {
      const alertMessages = {
        cart: 'Por favor, inicia sesión para agregar productos al carrito',
        wishlist: 'Por favor, inicia sesión para agregar productos a la lista de deseos',
      };

      const alertMessage = alertMessages[actionType];
      if (alertMessage) {
        setAlertCartMessage((prev) => ({
          ...prev,
          [product1.id]: alertMessage,
        }));

      // if (actionType === 'cart') {
      // setAlertCartMessage((prev) => ({
      //   ...prev,
      //   [product1.id]: 'Por favor, inicia sesión para agregar productos al carrito',
      // }));
      setTimeout(() => setAlertCartMessage(false), 3000);
    // } else if (actionType === 'wishlist') {
    //   setAlertWishListMessage((prev) => ({
    //     ...prev,
    //     [product1.id]: 'Por favor, inicia sesión para agregar productos a la lista de deseos',
    //   }));
    //   setTimeout(() => setAlertWishListMessage(false), 3000);
      }
      return;
    }
    action(product1);
    const newFeedback = {
      ...actionFeedback,
      [actionType]: { ...actionFeedback[actionType], [product1.id]: true }
    };
    setActionFeedback(newFeedback);
    if (user) {
      localStorage.setItem(`actionFeedback_${user.id}`, JSON.stringify(newFeedback));
    }
  };

  const closeAlert = (productId) => {
    setAlertMessage((prev) => ({ ...prev, [productId]: undefined }));
  };

  const closeAlertCart = (productId) => {
    setAlertCartMessage((prev) => ({ ...prev, [productId]: undefined }));
  };

  const closeAlertWishList = (productId) => {
    setAlertCartMessage((prev) => ({ ...prev, [productId]: undefined }));
  };

  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const renderComparison = () => {
    if (compareProducts.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
        <div className="relative top-20 mx-auto p-5 border w-11/12 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Comparación de Productos</h3>
            <div className="mt-2 px-7 py-3">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Característica</th>
                    {compareProducts.map(product1 => (
                      <th key={product1.id} scope="col" className="px-6 py-3">{product1.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Precio</th>
                    {compareProducts.map(product1 => (
                      <td key={product1.id} className="px-6 py-4">${parseFloat(product1.price).toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr className="bg-white border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Categoría</th>
                    {compareProducts.map(product1 => (
                      <td key={product1.id} className="px-6 py-4">{product1.category}</td>
                    ))}
                  </tr>
                  <tr className="bg-white border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Especificaciones</th>
                    {compareProducts.map(product1 => (
                      <td key={product1.id} className="px-6 py-4">{product1.specs}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setShowComparison(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredCameras = filterCameras(cameras, { selectedCategory, searchTerm });

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-teal-100 to-slate-300 ">
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Cámaras y Equipos de Seguridad</h1>

      {/* Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full ${
                selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Catálogo de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCameras.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.svg'} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.shortDescription}</p>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">L{product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}</span>
                <div className="flex items-center">
                  <CiStar className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1">{product.rating || '5'}</span>
                </div>
              </div>
              <div className="flex justify-between">
              <div key={product.id}>
                  <button 
                    ref={(el) => (AddCartButtonRefs.current[product.id] = el)}
                
                  onClick={() => handleAction(addToCart, product, 'cart')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 duration-150"
                >
                  <AiOutlineShoppingCart className="h-5 w-5 mr-2" />
                  {actionFeedback.cart[product.id] ? 'Añadido' : 'Añadir al carrito'}
                </button>
                {alertCartMessage[product.id] && (
                  <FloatingAlert 
                    message={alertCartMessage[product.id]} 
                    onClose={() => closeAlertCart(product.id)} 
                    style={{
                      position: 'absolute',
                      top: `${AddCartButtonRefs.current[product.id].getBoundingClientRect().top - 40}px`,
                      left: `${AddCartButtonRefs.current[product.id].getBoundingClientRect().left}px`,
                    }} 
                  />
                )}</div>
                <div className="flex items-center">
                <div >
                  <button
                    ref={(el) => (AddWishListButtonRefs.current[product.id] = el)}
                    onClick={() => handleAction(addToWishlist, product, 'wishlist')}
                    className="bg-gray-200 px-4 py-2 rounded-lg flex items-center hover:bg-purple-600 duration-150"
                  >
                    <CiHeart className="h-4 w-4 mr-1" />
                    {actionFeedback.wishlist[product.id] ? 'Añadido' : 'Deseos'}
                  </button>
                  {alertWishListMessage[product.id] && (
                  <FloatingAlert 
                    message={alertWishListMessage[product.id]} 
                    onClose={() => closeAlertWishList(product.id)} 
                    // className={`absolute top-[-40px] left-0 ${window.innerWidth < 640 ? 'left-0' : ''}`}

                    // style={{
                    //   position: 'absolute',
                    //   top: `${window.innerWidth < 640 
                    //     ? AddCartButtonRefs.current[product.id].getBoundingClientRect().top - 0 
                    //     : AddWishListButtonRefs.current[product.id].getBoundingClientRect().top - 40}px`,
                    //     left: `${window.innerWidth < 640 
                    //       ? AddCartButtonRefs.current[product.id].getBoundingClientRect().left
                    //       :AddWishListButtonRefs.current[product.id].getBoundingClientRect().left}px`,
                    // }}
                    style={{
                      position: 'absolute',
                      top: `${
                        AddWishListButtonRefs.current[product.id].getBoundingClientRect().top - (window.innerWidth < 640 ? 50 : 40)}px`,
                      left: `${AddWishListButtonRefs.current[product.id].getBoundingClientRect().left - (window.innerWidth < 640 ? 150 : 0)}px`,
                      }}
                  />
                )}</div>

                  {/* <div> */}
                  {/*  {alertVisible && (
        <div className="flex items-center bg-red-500 text-white p-4 mb-4 rounded">
          <FaExclamationCircle className="mr-2" />
          <span>Please log in to like a product</span>
        </div> 
       */}
                  {/* <button ref={likeButtonRef} onClick={() => handleLike(camera)}>
                    Like
                  </button> */}
                        {/* {cameras.map((camera) => (
        <div key={camera.id}>
          <button 
            ref={(el) => (likeButtonRefs.current[camera.id] = el)} 
            onClick={() => handleLike(camera)}
          >
            Like
          </button>
          {alerts[camera.id] && (
            <FloatingAlert 
              message={alerts[camera.id]} 
              onClose={() => closeAlert(camera.id)} 
              style={{
                position: 'absolute',
                top: `${likeButtonRefs.current[camera.id].getBoundingClientRect().top - 40}px`,
                left: `${likeButtonRefs.current[camera.id].getBoundingClientRect().left}px`,
              }} 
            />
          )}
        </div>
      ))} */}

                  {/* {showAlert && (
        <FloatingAlert message={alertMessage} onClose={closeAlert} position={`top-[${alertPosition.top}px] left-[${alertPosition.left}px]`}/>
      )} */}
                {/* {cameras.map((camera) => ( */}
                  <div key={product.id}>
                  <button 
                    ref={(el) => (likeButtonRefs.current[product.id] = el)} 
                    onClick={() => handleLike(product)}
                    className={`p-2 rounded-full ${Array.isArray(likedProducts) && likedProducts.includes(product.id) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                  >
                    <CiHeart className="h-6 w-6" />
                  </button>
                  
                  {alertMessage[product.id] && (
                  <FloatingAlert 
                    message={alertMessage[product.id]} 
                    onClose={() => closeAlert(product.id)} 
                    // style={{
                    //   position: 'absolute',
                    //   top: `${likeButtonRefs.current[product.id].getBoundingClientRect().top - 40}px`,
                    //   left: `${likeButtonRefs.current[product.id].getBoundingClientRect().left}px`,
                    // }}
                    style={{
            position: 'absolute',
            top: `${likeButtonRefs.current[product.id].getBoundingClientRect().top - (window.innerWidth < 640 ? 50 : 40)}px`,
            left: `${likeButtonRefs.current[product.id].getBoundingClientRect().left - (window.innerWidth < 640 ? 150 : 0)}px`,
          }} 
                  />
                )}
              </div>{/* ))} */}
        <span className="ml-1 text-xs">{product.likes || 0}</span>
                  
          
                </div>
              </div>
              <div className="mt-2">
                <button 
                  onClick={() => toggleExpand(product.id)}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  {expandedProduct === product.id ? (
                    <>
                      <GoChevronUp className="h-5 w-5 mr-1" />
                      Menos detalles
                    </>
                  ) : (
                    <>
                      <GoChevronDown className="h-5 w-5 mr-1" />
                      Más detalles
                    </>
                  )}
                </button>
                {expandedProduct === product.id && (
                  <div className="mt-2 text-gray-600">
                    <p>Especificaciones: {product.specificDescription}</p>
                    <p>Resolución: {product.resolution}</p>
                    <p>Stock: {product.stock}</p>
                    <h3 className="font-semibold mt-2">Características:</h3>
                    <ul>
                      {Object.entries(product.features).map(([feature, enabled]) => (
                        <li key={feature}>{feature}: {enabled ? 'Sí' : 'No'}</li>
                      ))}
                    </ul>
                    {product.customFeatures && product.customFeatures.length > 0 && (
                      <>
                        <h3 className="font-semibold mt-2">Características personalizadas:</h3>
                        <ul>
                          {product.customFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparador de Productos */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Comparar Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              {compareProducts[index] ? (
                <>
                  <img src={compareProducts[index].images && compareProducts[index].images[0] ? compareProducts[index].images[0] : '/placeholder.svg'} alt={compareProducts[index].name} className="w-full h-48 object-cover mb-2" />
                  <h3 className="font-semibold">{compareProducts[index].name}</h3>
                  <button
                    onClick={() => removeFromCompare(compareProducts[index].id)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <select 
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    const selectedProduct = cameras.find(p => p.id === e.target.value);
                    if (selectedProduct) addToCompare(selectedProduct);
                  }}
                  value=""
                >
                  <option value="">Seleccionar producto</option>
                  {cameras.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        {compareProducts.length > 1 && (
          <button
            onClick={() => setShowComparison(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Comparar
          </button>
        )}
      </section>

      {showComparison && renderComparison()}

      {/* Kits de Instalación */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Kits de Instalación Completos</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Kit Básico de 4 Cámaras</h3>
          <p className="mb-4">Incluye: 4 cámaras CCTV, 1 DVR, cables y accesorios de montaje</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Ver Detalles</button>
        </div>
      </section>

      {/* Guías de Instalación */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Guías de Instalación</h2>
        <ul className="list-disc pl-5">
          <li><a href="#" className="text-blue-500 hover:underline">Cómo instalar cámaras CCTV</a></li>
          <li><a href="#" className="text-blue-500 hover:underline">Configuración de NVR para cámaras IP</a></li>
          <li><a href="#" className="text-blue-500 hover:underline">Guía de cableado para sistemas de seguridad</a></li>
        </ul>
      </section>

      {/* Ofertas Especiales */}
      <section className="mt-16 bg-yellow-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ofertas Especiales</h2>
        <p className="text-lg mb-2">¡15% de descuento en todos los kits de instalación!</p>
        <p className="mb-4">Utiliza el código: SEGURIDAD15</p>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Ver Ofertas</button>
      </section>

      {/* Soporte y FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Soporte y Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">¿Cómo elijo la cámara adecuada para mi hogar?</summary>
            <p className="mt-2">Considere factores como el área de cobertura, condiciones de iluminación y si necesita funciones como visión nocturna o detección de movimiento.</p>
          </details>
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">¿Qué es la diferencia entre cámaras CCTV e IP?</summary>
            <p className="mt-2">Las cámaras CCTV son analógicas y requieren conexión directa, mientras que las cámaras IP se conectan a la red y ofrecen mayor resolución y funcionalidades avanzadas.</p>
          </details>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Contáctenos</h2>
        <p>¿Necesita ayuda para elegir el sistema adecuado? Nuestro equipo de expertos está aquí para ayudarle.</p>
        <p className="mt-2">Teléfono: (504) 9807-9630</p>
        <p>Email: colioristtech@gmail.com</p>
      </section>

      {/* Envío y Devoluciones */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Envío y Devoluciones</h2>
        <p>Envío gratuito en pedidos superiores a $500</p>
        <p className="mt-2">Política de devolución de 30 días sin preguntas</p>
        <a href="#" className="text-blue-500 hover:underline">Ver política completa</a>
      </section>
    </div>
    </div>
  );
};

export default Store;