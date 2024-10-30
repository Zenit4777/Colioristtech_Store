import React from 'react';
import { Link } from 'react-scroll';
import { Link as LinkRouter, useNavigate  } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineSecurityScan } from 'react-icons/ai';
import { BsShieldLockFill } from 'react-icons/bs';
import { GoArrowRight } from "react-icons/go";
import { PiSecurityCameraFill } from "react-icons/pi";
import { MdOutlineWifiPassword } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import vide from "../Assets/Ezviz1.mp4"

const Home = () => {
    const navigate = useNavigate();

    const goToCart = () => {
      navigate('/ShoppingCart');  // Redirige a la página del carrito de compras
    };
    return (
        <div name='Home' className="bg-gray-100">
            {/* Header / Hero Section */}
            <header className="relative bg-blue-900 text-white py-20 pb-8">
                <div className="container mx-auto flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold mb-4 inline-flex">Bienvenido a <p className='text-blue-200 pl-2'> Coliorist Tech</p></h1>
                    <p className="text-lg mb-8">Encuentre las mejores cámaras de seguridad de la mejor calidad para su hogar y negocio.</p>
                    <Link to="store" smooth={true} duration={500} offset={-70}>
                        <button className="bg-yellow-500 text-black px-9 py-3 inline-flex rounded-full font-semibold shadow-lg hover:bg-yellow-600">
                            Ver productos
                            <GoArrowRight className="ml-2 -mr-1 h-7 w-5" aria-hidden="true" />
                        </button>
                    </Link>
                </div>
            </header>
          

            {/* logo Section */}
                    <section className="relative bg-blue-900 text-white py-20" 
                            style={{backgroundImage:`url(${require('../Assets/Fondo3.png')})`,
                            backgroundSize: 'cover',
                            backgroundAttachment: 'fixed',
                            backgroundPosition: '50% 80%',
                            backgroundRepeat: 'no-repeat',
                            height: "80vh",}}>
                            
                            <div className="container mx-auto px-4 text-center bg-blue-900 bg-opacity-80 max-w-2xl pt-0 pb-5 rounded-xl flex justify-center items-center ">
                                <div className="text-5xl text-justify max-w-xl">
                                    <p>Asegure<br />
                                    <b>Lo Que Más Ama</b>
                                    </p>
                                    <p>Con Equipo profesional<br />
                                    <b>Inteligente Y Accesible</b>
                                    </p>
                                </div>
                            </div>

                            <div className='pt-10 flex justify-center items-center'>
                            
                            <a 
                                href='https://wa.me/50498079630'
                                target="_blank" // Abre WhatsApp en una nueva pestaña
                                rel="noopener noreferrer"
                                smooth 
                                className='bg-blue-500 transition-all duration-500 ease-in-out p-3 ml-5 text-xl hover:scale-110 hover:translate-y-2 hover:px-6 hover:py-4 hover:bg-blue-600 hover:text-white cursor-pointer rounded-xl flex items-center'
                            >Contáctenos<IoLogoWhatsapp className="ml-2 text-green-400"/>
                            </a>
                            <LinkRouter 
                                to='Store' // Asegúrate de que este enlace sea correcto
                                smooth 
                                duration={500}
                                offset={-70}
                                className='bg-blue-500 transition-all duration-500 ease-in-out p-3 ml-5 text-xl hover:scale-110 hover:translate-y-2 hover:px-6 hover:py-4 hover:bg-blue-600 hover:text-white cursor-pointer rounded-xl flex items-center'
                            >Tienda<AiOutlineShoppingCart className="ml-2 text-white"/>
                            </LinkRouter>
                            </div>
                    </section>
                    <div className="bg-black bg-opacity-50 w-1/4 h-1/4 relative top-0 left-0 z-10"></div> 
                    {/* Overlay */}

                    <div className="relative h-2/4 w-full flex items-center justify-center">
                        {/* Fondo transparente a la izquierda */}
                        <div className="absolute left-0 top-0 h-full w-1/4 bg-blue-900"></div>

                        {/* Video centrado */}
                        <video
                            className="relative w-2/4 h-1/3 object-contain z-10 overflow-hidden"
                            autoPlay
                            loop
                            muted
                            style={{ transform: 'translateZ(-1px) scale(1)' }}
                            src={vide}
                        >
                            Tu navegador no soporta videos.
                        </video>

                        {/* Fondo transparente a la derecha */}
                        <div className="absolute right-0 top-0 h-full w-1/4 bg-blue-900 z-0"></div>
                    </div>

            {/* Sección de fondo fijo */}
            <section
                
                className="relative text-white py-32"
                style={{ 
                    backgroundImage:`url(${require('../Assets/Fondo10.png')})`, // Cambia por tu imagen
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed', // Imagen de fondo fija
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '50% 65%',
                }}
            ><div className='pt-30 pb-36'>
                <div className="container mx-auto px-4 text-center bg-blue-900 bg-opacity-80 max-w-2xl pt-5 pb-1 rounded-xl">
                    <h2 className="text-3xl font-semibold mb-4 ">Protege tu Hogar con la Mejor Tecnología</h2>
                    <p className="text-lg mb-8">Descubre nuestras cámaras de seguridad avanzadas.</p>
                </div>
                </div>
            
            

              {/* Features Section  */}
            <section className="relative  mx-auto px-8 py-16 text-center bg-slate-100 w-full"> 
                    
                <h2 className="text-gray-900 text-3xl font-semibold mb-8">¿Por qué elegir nuestras cámaras?</h2>
                

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                    <div className="bg-white p-8 shadow-md rounded-lg hover:shadow-lg transition">
                        <AiOutlineSecurityScan className="text-blue-900 text-5xl mx-auto mb-4"/>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Alta tecnología</h3>
                        <p className="text-gray-600">Nuestras cámaras utilizan cifrado de última generación en vigilancia para mantener sus imágenes seguras y privadas.</p>
                    </div>
                    <div className="bg-white p-8 shadow-md rounded-lg hover:shadow-lg transition">
                        <BsShieldLockFill className="text-blue-900 text-5xl mx-auto mb-4"/>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Seguridad garantizada</h3>
                        <p className="text-gray-600">Protege tu hogar o negocio con nuestros productos de máxima calidad.</p>
                    </div>
                    <div className="bg-white p-8 shadow-md rounded-lg hover:shadow-lg transition">
                        <PiSecurityCameraFill className="text-blue-900 text-5xl mx-auto mb-4"/>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">High-Quality Video</h3>
                        <p className=" text-gray-600">Disfrute de una resolución 4K nítida y un excelente rendimiento con poca luz.</p>                    
                    </div>
                    <div className="bg-white p-8 shadow-md rounded-lg hover:shadow-lg transition">
                        <MdOutlineWifiPassword className="text-blue-900 text-5xl mx-auto mb-4"/>                        
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Fácil conectividad</h3>
                        <p className="text-gray-600">
                        Conecte y controle sus cámaras de manera rapida con nuestra aplicación móvil fácil de usar.
                        </p>
                    </div>
                    <div className="bg-white p-8 shadow-md rounded-lg hover:shadow-lg transition">
                        <AiOutlineShoppingCart className="text-blue-900 text-5xl mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Fácil compra</h3>
                        <p className="text-gray-600">Compra en línea de forma rápida y segura con múltiples opciones de pago.</p>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="store" className="bg-gray-900 py-16 bg-opacity-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-semibold mb-8">Nuestros productos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Product 1 */}
                        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition">
                            <img src={require("../Assets/camara-hilook.jpg")} alt="Cámara Doméstica" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Cámara Doméstica HD</h3>
                            <p className="text-gray-600 mb-4">Vigilancia en alta definición con visión nocturna.</p>                            
                            <LinkRouter
                            to="/Store"
                            smooth
                            duration={500}
                            offset={-70}
                            className="cursor-pointer hover:text-gray-300"
                            ><button className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800">Comprar ahora</button>
                            </LinkRouter>                            
                        </div>

                        {/* Product 2 */}
                        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition">
                            <img src={require("../Assets/th-359.jpg")} alt="Cámara PTZ" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Cámara PTZ</h3>
                            <p className="text-gray-600 mb-4">Controla la dirección y zoom de la cámara a distancia.</p>
                            <LinkRouter
                            to="/Store"
                            smooth
                            duration={500}
                            offset={-70}
                            className="cursor-pointer hover:text-gray-300"
                            ><button className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800">Comprar ahora</button>
                            </LinkRouter> 
                        </div>

                        {/* Product 3 */}
                        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition">
                            <img src={require("../Assets/th-125.jpg")} alt="Cámara Inalámbrica" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Cámara Inalámbrica</h3>
                            <p className="text-gray-600 mb-4">Instalación sin cables con conexión wifi integrada.</p>
                            <LinkRouter
                            to="/Store"
                            smooth
                            duration={500}
                            offset={-70}
                            className="cursor-pointer hover:text-gray-300"
                            ><button className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800">Comprar ahora</button>
                            </LinkRouter> 
                        </div>
                    </div>
                </div>
            </section>
            </section>
            {/* Call to Action */}
            <section className="bg-blue-900">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">¿Listo para empezar?</span>
                  <span className="block text-blue-200">Contacte con nuestro equipo de ventas hoy mismo.</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50">
                    Contacte con nosotros
                    </a>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Section */}
            <footer className="bg-blue-950 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 Coliorist Tech. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
