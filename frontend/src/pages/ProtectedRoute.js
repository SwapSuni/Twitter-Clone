import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate } from 'react-router-dom';
import {auth} from '../firebase.init';
import PageLoading from './PageLoading';

const ProtectedRoute = ({children}) => {
  const app= auth;
  const [user, isloading]= useAuthState(app);

    if(isloading){
        return <PageLoading></PageLoading>;
    }

  if(!user){
    return <Navigate to='/login'></Navigate>
  }
  return children;
}

export default ProtectedRoute
