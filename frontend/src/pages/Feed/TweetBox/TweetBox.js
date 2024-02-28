import { Avatar, Button } from '@mui/material';
import React, { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import './TweetBox.css';
import axios from 'axios';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from '../../../firebase.init';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const TweetBox = () => {
  const navigate= useNavigate();
  const app= auth;
    const [post, setPost]= useState("");
    const [imageURL, setImageURL]= useState("");
    const [isLoading, setIsLoading]= useState("");
    const [loggedInUser, setLoggedInUser]= useLoggedInUser();
    const [name, setName]=useState("");
    const [username, setUsername]= useState("");
    const [eligible, setEligible]= useState(false);
    const [user]= useAuthState(app);
    const email= user?.email;

    const userProfilePic= loggedInUser[0]?.profileImage? loggedInUser[0]?.profileImage: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png";

    const handleUploadImage=(e)=>{
      setIsLoading(true);
      const image= e.target.files[0];
      const formData= new FormData();
      formData.set('image', image);
      axios.post("https://api.imgbb.com/1/upload?key=c901a8c679dae4ae219dee6ed86fb9e3", formData)
      .then(res=>{
        setImageURL(res.data.data.display_url);
        console.log(res.data.data.display_url);
        setIsLoading(false);
      }).catch((error)=>{
        setIsLoading(false);
        console.log(error)});
    }

    const handleTweet=async(e)=>{
        e.preventDefault();

        if(user.providerData[0].providerId==='password'){
          fetch(`http://localhost:5000/loggedInUser?email=${email}`)
          .then(res=> res.json())
          .then(data=> {
            // console.log(data[0]);
              setName(data[0]?.name)
              setUsername(data[0]?.username)
            })
        }
        else{
          setName(user?.displayName)
          setUsername(email?.split('@')[0])
        }

        //api calls here
        const eligible= await axios.get(`http://localhost:5000/IsEligible?email=${email}`);
        // console.log(eligible);
        if(eligible.data.status === "updated"){
          if(name){
            const userPost={
              profilePhoto: userProfilePic,
              post: post,
              photo: imageURL,
              username: username,
              name: name,
              email: email,
            }
            console.log(userPost);
            setPost('');
            setImageURL('');
  
            fetch(`http://localhost:5000/post`,{
              method:"POST",
              headers:{
                'content-type':'application/json'
              },
              body: JSON.stringify(userPost)
            }).then(res=> res.json())
            .then(data=>{
              console.log(data);
            })
          }
        }
        else if(eligible.data.status==="Subscribe to a higher plan"){
          toast.error("Limit to Number of posts per day reached.");
        }
        else{
          toast.error("Subscription expired");
        }   
    }

  return (
    <div className='tweetBox' >
      <Toaster toastOptions={{ duration: 4000 }} />
      <form onSubmit={handleTweet} style={{borderBottom:'2px solid grey', marginTop:'8px'}}>
        <div className='tweetBox__input'>
            <Avatar src={userProfilePic}/>
            <input type='text' placeholder='Whats Happenning?' onChange={(e)=>setPost(e.target.value)} value={post} required></input>
        </div>
        <div className='imageIcon_tweetButton'>
            <label htmlFor='image' className='imageIcon'>
                {
                  isLoading? <p>Uploading Image...</p> : <p>{imageURL? "Image Uploaded...": <AddPhotoAlternateIcon/>}</p>
                }
            </label>
            <input type='file' id='image' className='imageInput' onChange={handleUploadImage}></input>
            <Button className='tweetBox__tweetButton' type='submit'>Tweet</Button>
        </div>
      </form>
    </div>
  )
}

export default TweetBox;
