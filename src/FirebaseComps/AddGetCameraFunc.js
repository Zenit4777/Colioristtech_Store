// firebasefunc.js

import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db, storage } from "./LoginFirebase"; // Archivo donde configuras Firebase

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const addCamera = async (cameraData, images) => {
  try {
    const imageUrls = await Promise.all(images.map(async (image) => {
      const storageRef = ref(storage, `camera_images/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      return getDownloadURL(storageRef);
    }));

    const docRef = await addDoc(collection(db, 'cameras'), {
      ...cameraData,
      images: imageUrls,
      createdAt: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding camera: ", error);
    throw error;
  }
};

// Función para agregar una cámara
// export const addCamera = async (cameraData) => {
//   try {
//     const docRef = await addDoc(collection(db, "cameras"), {
//       name: cameraData.name,
//       brandId: cameraData.brandId,
//       categoryId: cameraData.categoryId,
//       resolution: cameraData.resolution,
//       price: cameraData.price,
//       stock: cameraData.stock,
//       description: cameraData.description,
//       features: cameraData.features,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     });
//     return docRef.id;
//   } catch (error) {
//     console.error("Error añadiendo la cámara: ", error);
//     throw error;
//   }
// };
const collectionfire = 'cameras'
// Función para obtener cámaras por categoría
export const getCameras = async (filters, sortBy) => {
  try {
    let camerasQuery = collection(db, collectionfire); // Esta es la colección de firestore

    // Apply filters
    if (filters.category !== 'all') {
      camerasQuery = query(camerasQuery, where('category', '==', filters.category));
    }
    if (filters.brand !== 'all') {
      camerasQuery = query(camerasQuery, where('brandId', '==', filters.brand));
    }
    if (filters.resolution !== 'all') {
      camerasQuery = query(camerasQuery, where('resolution', '==', filters.resolution));
    }
    if (filters.type !== 'all') {
      camerasQuery = query(camerasQuery, where('type', '==', filters.type));
    }

    const camerasSnapshot = await getDocs(camerasQuery);
    let cameras = camerasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply feature filters
    if (filters.features.length > 0) {
      cameras = cameras.filter(camera => 
        filters.features.every(feature => camera.features[feature])
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceLowToHigh':
        cameras.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        cameras.sort((a, b) => b.price - a.price);
        break;
      case 'relevance':
      default:
        // Assuming relevance is based on the order returned from the database
        break;
    }

    return cameras;
  } catch (error) {
    console.error("Error fetching cameras: ", error);
    throw error;
  }
};

export const updateCamera = async (cameraId, updatedData, newImages) => {
  try 
  {
    const cameraRef = doc(db, collectionfire, cameraId);
    // Subir nuevas imágenes a Firebase Storage (si las hay)
    let imageUrls = updatedData.images || [];
    if (newImages && newImages.length > 0) {
      const uploadedImageUrls = await Promise.all(newImages.map(async (image) => {
        const storageRef = ref(storage, `camera_images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        return getDownloadURL(storageRef);
      }));
      imageUrls = [...imageUrls, ...uploadedImageUrls];
    }

    // Actualizar los datos de la cámara, incluyendo las nuevas imágenes
    await updateDoc(cameraRef, {
      ...updatedData,
      images: imageUrls
    });
  } catch (error) {
    console.error("Error updating camera: ", error);
    throw error;
  }
};

export const deleteCamera = async (cameraId) => {
  try {
    // First, get the camera data to delete associated images
    const cameraRef = doc(db, collectionfire, cameraId);
    const cameraSnap = await getDocs(cameraRef);
    const cameraData = cameraSnap.data();

    // Delete images from storage
    if (cameraData.images) {
      await Promise.all(cameraData.images.map(async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }));
    }

    // Delete the camera document
    await deleteDoc(cameraRef);
  } catch (error) {
    console.error("Error deleting camera: ", error);
    throw error;
  }
};

