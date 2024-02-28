import React, { useState, useEffect } from 'react'
import twitterimage from "../../assets/images/twitter.jpeg";
import TwitterIcon from '@mui/icons-material/Twitter';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase.init';
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from 'firebase/auth';
import GoogleButton from "react-google-button";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast, { Toaster } from 'react-hot-toast';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import OtpInput, { ResendOTP } from 'otp-input-react';
import PhoneInput from 'react-phone-input-2';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import axios from 'axios';
import { addSeconds } from 'date-fns';

const Login = () => {
  const app = auth;
  const collection = db;

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(app);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ph, setPh] = useState("");
  const [verify, setVerify] = useState(true);
  const [show, setShow] = useState(true);
  const [otp, setOtp] = useState("");
  const [consecutiveAttempts, setConsecutiveAttempts] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [disablelogin, setDisablelogin] = useState(false);
  // const [error, setError]= useState('');

  const sendData = async ({ msg }) => {
    let data = {
      email: email,
      message: msg,
    }

    const res = await axios.post(`${process.env.HOST}/sendEmail`, data);
    alert("Check your email..");
    console.log(res);
  }

  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log("clicked", email, password);
    await signInWithEmailAndPassword(email, password);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in successfully:", user);
        // Perform actions like redirecting to the logged-in user area
        setConsecutiveAttempts(0);
        setEmailSent(false);
        navigate('/');
      } else {
        console.log("User is not signed in");
        // Handle the case where no user is signed in
        setConsecutiveAttempts(consecutiveAttempts + 1);
        console.log(consecutiveAttempts);
        if (consecutiveAttempts == 4) {
          //send email
          sendData("Your account is temporarily blocked for an hour..")
          setEmailSent(true);
          //diable button and set timer
          setDisablelogin(true);

          setTimeout(() => {
            setDisablelogin(false); // Set disable to false after 60 minutes
            setConsecutiveAttempts(0);
          }, 60* 60 * 1000);
        }

        if (consecutiveAttempts >= 2 && !emailSent) {
          //send email
          sendData("Too many failed attempts...")
          setEmailSent(true);
          alert(`You have only ${4- consecutiveAttempts} attempt left..`)
        }
      }
    });
  }

  const [signInWithGoogle, GoogleUser, GoogleLoading, GoogleError] = useSignInWithGoogle(app);

  const handleGoogleSignIn = async () => {
    signInWithGoogle();
  }

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(app, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onSingup();
        },
        "expired-callback": () => { },
      });
    }
  }

  function onSingup() {
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = "+" + ph;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShow(false);
        toast.success("OTP sent successfully");
      }).catch((error) => {
        console.log(error);
      });
  }

  function onOTPverify() {
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        navigate('/');
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (GoogleUser) {
    navigate('/');
  }

  if (error) {
    console.log(error.message);
  }

  if (loading) {
    console.log("loading..");
  }

  return (
    <div className='login-container'>
      <div className='image-container'>
        <img src={twitterimage} className='image'></img>
      </div>
      <div className='form-container'>
        <div className='form-box'>
          <TwitterIcon className='Twittericon' style={{ color: 'skyblue' }} />
          <h2 className='heading'>Happenning</h2>
          <h3 className='heading1'>Find out what's happenning today on Twitter!</h3>
          {
            verify ? (
              <form onSubmit={handlesubmit}>
                <input type='email' className='email' placeholder='Email Address..' onChange={(e) => setEmail(e.target.value)}></input>
                <input type='password' className='password' placeholder='Password..' onChange={(e) => setPassword(e.target.value)}></input>
                {
                  disablelogin ? (
                    <>
                      <p className='disable'>Login is temporarily disable.. Retry after 60 minutes.</p>
                    </>
                  ) : (
                    <div className='btn-login'>
                      <button type='submit' className='btn'>Login</button>
                    </div>
                  )
                }
              </form>
            ) : (
              <>
                <section>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container"></div>
                  <div>
                    {
                      show ? (
                        <>
                          <div className='form-body'>
                            <div className='form-head'>
                              <AdminPanelSettingsIcon />
                              <CloseIcon onClick={() => setVerify(true)} style={{ cursor: 'pointer', size: '75%' }} />
                            </div>
                            <div className='form-main'>
                              <h3>Enter your phone number</h3>
                              <PhoneInput country={"in"} value="ph" onChange={setPh} />
                              <button onClick={onSingup}>Send code via SMS</button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='verify'>
                            <h3>Enter the recieved OTP</h3>
                            <OtpInput OTPLength={"6"} otpType="number" disabled={false} value={otp} onChange={setOtp} autoFocus secure className="otp-container" />
                            <ResendOTP onResendClick={onSingup} style={{ justifyContent: "space-evenly", margin: "15px" }} />
                            <button onClick={onOTPverify}>Verify</button>
                            <button onClick={()=>{setVerify(true)}}>Cancel</button>
                          </div>
                        </>
                      )
                    }
                  </div>
                </section>
              </>
            )
          }
          <hr></hr>
          <div className='google-button'>
            <GoogleButton className='g-btn' type='light' onClick={handleGoogleSignIn}></GoogleButton>
          </div>
          {
            verify ? (
              <>
                <hr />
                <div className='phone-btn'>
                  <Button onClick={() => setVerify(false)}>Sign In with Phone Number</Button>
                </div>
              </>
            ) : (
              ""
            )
          }

          <div>
            Do not have an account?
            <Link to='/signup' style={{
              textDecoration: 'none',
              color: 'skyblue',
              fontWeight: 600,
              marginLeft: '5px'
            }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
