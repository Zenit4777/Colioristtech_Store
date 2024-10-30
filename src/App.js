import React, { Suspense, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TopBar from './Components/TopBar'
import Navbars from './Components/Navbars'
import { StoreProvider } from './Components/StoreContext'
import Home from './Pages/Home'
import Store from './Pages/Store'
import PaymentPage from './Pages/PaymentPage'
import ShoppingCart from './Pages/ShoppingCart'
import Accounts from './Pages/Accounts'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Payments from './Pages/Payments'
import Card from './Pages/Card'
import UserProfileModal from './AccountComps/UserProfileModal';//Accounts components
import PurchaseHistoryModal from './AccountComps/PurchaseHistoryModal';
import Wishlist from './AccountComps/Wishlist';
import Benefits from './AccountComps/Benefits';
import AddCameras from './Components/AddCameras'
import GetCamera from './Components/GetCamera'

const App = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  return (
    <Router>
     {/* <FirebaseAppProvider firebaseConfig={FirebaseConfig}> */}
      <Suspense fallback='Conectando La App'>
      <TopBar/>
        <Navbars/>
        <StoreProvider>
      <Routes>
        
          <Route path="/" element={<Home />}/>
          <Route path="/home" element={<Home />} />  {/* Página principal de la tienda */}
          <Route path="/Store" element={<Store setCart={setCart} setWishlist={setWishlist}/>} />  {/* Página principal de la tienda */}
          <Route path="/ShoppingCart" element={<ShoppingCart cart={cart} wishlist={wishlist}/>} />   {/* Página de pago*/} 
          <Route path="/PaymentPage" element={<PaymentPage />} />  {/* Página principal de la tienda */}
          <Route path="/Accounts" element={<Accounts />} >
            <Route  path='UserProfile'  element={<UserProfileModal />} />
            <Route path="Purchase" element={<PurchaseHistoryModal />} />
            <Route path="Pishlist" element={<Wishlist />} />
            <Route path="Benefits" element={<Benefits />} /></Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Payment" element={<Payments />} />
          <Route path="/Card" element={<Card />} />
          <Route path="/AddCameras" element={<AddCameras />} />
          <Route path="/GetCamera" element={<GetCamera />} />
        </Routes>
        </StoreProvider>
      
      </Suspense>
     {/* </FirebaseAppProvider> */}
    </Router>
  )
}

export default App