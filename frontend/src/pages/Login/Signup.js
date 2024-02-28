import React, { useState } from 'react'
import twitterimage from "../../assets/images/twitter.jpeg";
import TwitterIcon from '@mui/icons-material/Twitter';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.init';
import GoogleButton from "react-google-button";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { Button } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
  const app = auth;
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(app);

  const navigate = useNavigate();

  const [signInWithGoogle, GoogleUser, GoogleLoading, GoogleError] = useSignInWithGoogle(app);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [num, setNum] = useState(Number);

  const handlesubmit = e => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Psssword must be at least 6 characters long...")
    }
    else {
      // console.log("clicked", email, password);
      createUserWithEmailAndPassword(email, password);

      const user = {
        username,
        name,
        email,
        num
      }
      const { data } = axios.post(`http://localhost:5000/register`, user);
      console.log(data);
    }
  }

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  }

  if (user || GoogleUser) {
    navigate('/');
    console.log(user);
    console.log(GoogleUser);
  }

  if (error) {
    console.log(error.message);
  }

  if (loading) {
    console.log("loading..");
  }

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className='login-container'>
        <div className='image-container'>
          <img className='image' src={twitterimage}></img>
        </div>
        <div className='form-container'>
          <div className='form-box'>
            <TwitterIcon className='Twittericon' style={{ color: 'skyblue' }} />
            <h2 className='heading1'>Join Twitter</h2>
            <form onSubmit={handlesubmit}>
              <input type='text' placeholder='username..' className='display-name' onChange={(e) => setUsername(e.target.value)}></input>
              <input type='text' placeholder='name..' className='display-name' onChange={(e) => setName(e.target.value)}></input>
              <input type='email' className='email' placeholder='Email Address..' onChange={(e) => setEmail(e.target.value)}></input>
              <input type='password' className='password' placeholder='Password..' onChange={(e) => setPassword(e.target.value)}></input>
              <input type='tel' className='number' placeholder='Phone number..' onChange={(e) => setNum(e.target.value)}></input>
              <div className='btn-login'>
                <button type='submit' className='btn' onClick={handlesubmit}>Sign up</button>
              </div>
            </form>
            <hr></hr>
            <div className='google-button'>
              <GoogleButton className='g-btn' type='light' onClick={handleGoogleSignIn}></GoogleButton>
            </div>
            <hr />
            <div>
              Already have an account?
              <Link to='/login' style={{
                textDecoration: 'none',
                color: 'skyblue',
                fontWeight: 600,
                marginLeft: '5px'
              }}>Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
