import React, { useState } from 'react'
import AppFirebase from './Firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import Login from '../Pages/Login'
import Accounts from '../Pages/Accounts'

const auth = getAuth(AppFirebase)
const db = getFirestore(AppFirebase);
const storage = getStorage(AppFirebase);

const LoginFirebase = () => {
    const [user, setUser] = useState(null);
    onAuthStateChanged(auth, (usersFirebase) => {
        if (usersFirebase) {
            setUser(usersFirebase)
        }
        else{
            setUser(null)
        }
    })

  return (
    <div>
        {user ? <Accounts mailUser={user.email}/> : <Login/>}
    </div>
  )
}

export { auth, db, storage, LoginFirebase }