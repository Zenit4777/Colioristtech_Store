// StoreContext.js
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { auth, db } from '../FirebaseComps/LoginFirebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import FloatingAlert from '../Components/Alerts';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [compareProducts, setCompareProducts] = useState([]);
  const [pointHistory, setpointHistory] = useState(0);
  const [benefits, setBenefits] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);


  useEffect(() => {
    // Load user data from localStorage or API
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({ ...userData, uid: currentUser.uid });
          setPurchaseHistory(userData.purchaseHistory || []); // Inicializar si no está definido
          setpointHistory(userData.pointHistory || 0);
          setBenefits(userData.benefits || []); // Inicializar si no está definido
          setCart(userData.cart || []);
          setWishlist(userData.wishlist || []);
          setLikedProducts(userData.data().likedProducts || []);
        } else {
          setUser({ id: user.uid, role: 'user' }); //cambiar para autenticar
          setLikedProducts([]);
          setCart([]);
          setWishlist([]);
          console.log("No user data found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      } else {
        setUser(null);
        setLikedProducts([]);
        setCart([]);
        setWishlist([]);
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    user,
    loading
  };




  const logout = async () => {
    await signOut(auth);
    setUser(null); // Resetea el estado del usuario
    setUser(null);
    setCart([]);
    setWishlist([]);
    setLikedProducts([]);
  };


  const addToCart = async (product) => {
    if (!user) {
      alert('nas')
      
      return;
    }
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === product.id);
    if (existingItem) {
      // If the item already exists, don't increase the quantity
      return;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
    await updateUserData({ cart: updatedCart });
  };

  const updateCartItemQuantity = async (productId, change) => {
    const updatedCart = cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    );
    setCart(updatedCart);
    await updateUserData({ cart: updatedCart });
  };

  const addToWishlist = async (product) => {
    if (!user) {
      alert('Please log in to add items to your wishlist');
      return;
    }
  
    const updatedWishlist = wishlist.some(item => item.id === product.id)
      ? wishlist // Si ya existe, no lo agrega
      : [...wishlist, product];
  
    setWishlist(updatedWishlist);
    await updateUserData({ wishlist: updatedWishlist });
  };
  

  const updateWishlistItemQuantity = async (productId, change) => {
    const updatedWishlist = wishlist.map(item => 
      item.id === productId 
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) } 
        : item
    )
    setWishlist(updatedWishlist);
    await updateUserData({ wishlist: updatedWishlist });
  };

  const removeItem = async (productId, targetList = 'cart') => {
    const target = targetList === 'cart' ? cart : wishlist;
    const setTarget = targetList === 'cart' ? setCart : setWishlist;

    const updatedList = target.filter(item => item.id !== productId);
    setTarget(updatedList);
    await updateUserData({ [targetList]: updatedList });
  };

  const toggleLike = async (product) => {
  if (!user) {
    alert('Please log in to like a product');
    return;
  }

  const updatedLikedProducts = Array.isArray(likedProducts) 
    ? (likedProducts.includes(product.id)
      ? likedProducts.filter(id => id !== product.id)
      : [...likedProducts, product.id])
    : [product.id];

  setLikedProducts(updatedLikedProducts);
  await updateUserData({ likedProducts: updatedLikedProducts });
  try {
    // Update user document in Firestore
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, { likedProducts: updatedLikedProducts });

    // Update the likes count in the camera document
    const cameraRef = doc(db, 'cameras', product.id);
    const cameraDoc = await getDoc(cameraRef);
    if (cameraDoc.exists()) {
      const currentLikes = cameraDoc.data().likes || 0;
      const newLikes = updatedLikedProducts.includes(product.id) ? currentLikes + 1 : currentLikes - 1;
      await updateDoc(cameraRef, { likes: Math.max(0, newLikes) });
    }
  } catch (error) {
    console.error("Error updating like status:", error);
    // Revert the local state if the update fails
    setLikedProducts(likedProducts);
  }
  };

  const updateUserData = async (data) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
    }
  };

  const addToCompare = (product) => {
    setCompareProducts(prevCompare => {
      if (prevCompare.length < 3 && !prevCompare.some(item => item.id === product.id)) {
        return [...prevCompare, product];
      }
      return prevCompare;
    });
  };

  const removeFromCompare = (productId) => {
    setCompareProducts(prevCompare => prevCompare.filter(item => item.id !== productId));
  };

  // const updateUserProfile = (updatedData) => {
  //   setUser(prevUser => ({ ...prevUser, ...updatedData }));
  // };

  const addPurchaseToHistory = (purchase) => {
    setPurchaseHistory(prevHistory => [...prevHistory, purchase]);
    setUser(prevUser => ({
      ...prevUser,
      purchaseHistory: [...(prevUser.purchaseHistory || []), purchase]
    }));
  };

  const addCard = (card) => {
    setUser(prevUser => ({
      ...prevUser,
      cards: [...(prevUser.cards || []), { ...card, id: Date.now().toString() }]
    }));
  };
  
  const updateUserProfile = async (updatedData) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, updatedData);
        setUser(prevUser => ({ ...prevUser, ...updatedData }));
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };
  
  // Make sure to include updateUserProfile in the context value
  const contextValue = {
    // ... other values
    updateUserProfile,
    // ... other values
  };

  return (
    <StoreContext.Provider value={{
      user,
      loading,
      cart,
      wishlist,
      likedProducts,
      compareProducts,
      pointHistory,
      benefits,
      purchaseHistory,
      value,
      contextValue,
      logout,
      addToCart,
      removeItem,
      updateCartItemQuantity,
      addToWishlist,
      updateWishlistItemQuantity,
      toggleLike,
      addToCompare,
      removeFromCompare,
      updateUserProfile,
      addPurchaseToHistory,
      addCard,
    }}>
      {!loading && children}
     </StoreContext.Provider>
  );
};