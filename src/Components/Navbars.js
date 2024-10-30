import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { Link as LinkRouter, useLocation } from "react-router-dom"; // Importa el hook useLocation
import { AiOutlineClose, AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { useScrollPosition } from "../Hooks/scrollPosition";
import { MdAccountCircle } from "react-icons/md";
import { BiLogIn } from "react-icons/bi";

const Navbar = () => {
    const [NavbarOpen, setNavbarOpen] = useState(false);
    const [windowDimention, setWindowDimention] = useState({
        width: window.innerWidth,
        height: window.innerHeight, 
    });
    const [showSubMenu, setShowSubMenu] = useState(false);
    const location = useLocation();  // Hook para obtener la ruta actual

    const detecDimention = () => {
        setWindowDimention({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    useEffect(() => {
        window.addEventListener('resize', detecDimention);
        windowDimention.width > 800 && setNavbarOpen(false);
        return () => {
            window.removeEventListener('resize', detecDimention);
        };
    }, [windowDimention]);

    const links = [
        { id: 1, link: "Inicio", path: "/" },
        { id: 2, link: "Tienda", path: "/Store" },
        { id: 3, link: "Quotes", path: "/Quotes" },
        { id: 4, link: "Invoices", path: "/Invoices" },
    ];

    const scrollPosition = useScrollPosition();

    // Función para determinar si se debe usar scroll o cambiar de página
    const renderLink = (link, path) => {
        if (location.pathname === path) {
            // Si estamos en la misma página, usamos react-scroll
            return (
                <Link
                    onClick={() => setNavbarOpen(false)}
                    to={link}
                    smooth
                    duration={500}
                    className="cursor-pointer hover:text-gray-300"
                >
                    {link}
                </Link>
            );
        } else {
            // Si estamos en una página diferente, usamos react-router-dom
            return (
                <LinkRouter
                    to={path}
                    onClick={() => setNavbarOpen(false)}
                    className="cursor-pointer hover:text-gray-300"
                >
                    {link}
                </LinkRouter>
            );
        }
    };

    return (
      <div
        className={`${
          NavbarOpen
            ? "bg-gray-800 flex-col h-full w-full items-center content-around"
            : ""
        } ${
          scrollPosition > 0 ? "bg-blue-900" : "bg-blue-950"
        } fixed top-7 z-10 transition duration-300 ease-in-out flex justify-between w-full h-11 items-center`}
      >
        {/* Logo */}
        {!NavbarOpen && (
          <p className="flex text-white whitespace-nowrap text-2xl items-center ml-7 ">
            <img
              src={require("../Assets/logo.svg.png")}
              className="w-10 h-10 rounded-lg object-cover mr-4"
              alt="Logo de Colioris Tech"
            />
            Colioris Tech
          </p>
        )}

        {/* Menu toggle para móviles */}
        {!NavbarOpen && windowDimention.width <= 800 ? (
          <AiOutlineMenu
            onClick={() => setNavbarOpen(!NavbarOpen)}
            color="white"
            size={25}
            className="mx-6"
          />
        ) : (
          windowDimention.width <= 800 && (
            <AiOutlineClose
              onClick={() => setNavbarOpen(!NavbarOpen)}
              color="white"
              size={25}
            />
          )
        )}

        {NavbarOpen && (
          /* Menú para pantallas pequeñas (en columna) */
          <div className="absolute top-11 left-0 w-full bg-gray-800">
            <ul className="flex flex-col justify-center items-center space-y-4 text-sm text-white p-4">
              {links.map((x) => (
                <li
                  key={x.id}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => x.link === "Store" && setShowSubMenu(true)}
                  onMouseLeave={() => x.link !== "Store" && setShowSubMenu(false)}
                >
                  {renderLink(x.link, x.path)}

                  {/* Submenú para Store en columna */}
                  {x.link === "Store" && showSubMenu && (
                    <ul
                      className="absolute top-0 left-full bg-gray-700 p-2 rounded shadow-lg flex flex-col space-y-2"
                      onMouseEnter={() => setShowSubMenu(true)} // Mantener el submenú visible
                      onMouseLeave={() => setShowSubMenu(false)} // Ocultar cuando el mouse salga del submenú
                    >
                      <li className="hover:bg-gray-600 p-2 cursor-pointer">
                        <Link to="category1" smooth duration={500}>
                          Cámaras De Seguridad
                        </Link>
                      </li>
                      <li className="hover:bg-gray-600 p-2 cursor-pointer">
                        <Link to="category2" smooth duration={500}>
                          Cámaras WiFi
                        </Link>
                      </li>
                      <li className="hover:bg-gray-600 p-2 cursor-pointer">
                        <Link to="category3" smooth duration={500}>
                          Accesorios
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ))}

              {/* Contacto y Carrito en la misma columna */}
              <li className="flex flex-col items-center space-y-4">
                {renderLink("Contact", "/Contact")}
                {renderLink(<AiOutlineShoppingCart className="text-2xl cursor-pointer" />, "/ShoppingCart")}
                <div className="cursor-pointer text-sm">{renderLink(<BiLogIn className="text-2xl cursor-pointer inline text-nowrap "/>, "/Login")}{renderLink('Iniciar', "/Login")}</div>
                {renderLink("Registrarse", "/Register")}
              </li>
            </ul>
          </div>
        )}
        
        {windowDimention.width > 800 && (
          /* Links del menú para pantallas grandes (centrados) */
          <ul className="flex justify-center items-center space-x-8 text-sm text-white">
            {links.map((x) => (
              <li
                key={x.id}
                className="relative"
                onMouseEnter={() => x.link === "Store" && setShowSubMenu(true)}
                onMouseLeave={() => x.link !== "Store" && setShowSubMenu(false)}
              >
                {renderLink(x.link, x.path)}

                {/* Submenú para Store */}
                {x.link === "Store" && showSubMenu && (
                  <ul
                    className="absolute top-full mt-2 left-0 bg-gray-700 p-2 rounded shadow-lg"
                    onMouseEnter={() => setShowSubMenu(true)} // Mantener el submenú visible
                    onMouseLeave={() => setShowSubMenu(false)} // Ocultar cuando el mouse salga del submenú
                  >
                    <li className="hover:bg-gray-600 p-2 cursor-pointer">
                      <Link to="category1" smooth duration={500}>
                        Cámaras De Seguridad
                      </Link>
                    </li>
                    <li className="hover:bg-gray-600 p-2 cursor-pointer">
                      <Link to="category2" smooth duration={500}>
                        Cámaras WiFi
                      </Link>
                    </li>
                    <li className="hover:bg-gray-600 p-2 cursor-pointer">
                      <Link to="category3" smooth duration={500}>
                        Accesorios
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}

        {windowDimention.width > 800 && (
        // Icono del carrito y Contacto (a la derecha) para pantallas grandes
        <div className="flex items-center space-x-4 text-white pr-7 text-sm">
          {renderLink(<AiOutlineShoppingCart className="text-2xl cursor-pointer" />, "/ShoppingCart")}
          {renderLink("Contact", "/Contact")}
          {renderLink(<MdAccountCircle className="text-2xl cursor-pointer" />, "/Accounts")}
          <div className="cursor-pointer text-sm">{renderLink(<BiLogIn className="text-2xl cursor-pointer inline text-nowrap "/>, "/Login")}{renderLink('Iniciar', "/Login")}</div>
          {renderLink("Registrarse", "/Register")}
          {renderLink("Pagos", "/Payment")}

        </div>
        )}
      </div>
    );
};

export default Navbar;
