import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import Widgets from './Widgets/Widgets'
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth} from '../firebase.init'
import { signOut } from 'firebase/auth'
import { Outlet } from 'react-router-dom'

const Home = () => {
  const app= auth;
  const user= useAuthState(app);

  const handleLogout=()=>{
    signOut(app);
  }

  return (
    <div className='app'>
      <Sidebar handleLogout={handleLogout} user={user}></Sidebar>
      <Outlet/>
      <Widgets></Widgets>
    </div>
  )
}

export default Home
