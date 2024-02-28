import React, { useEffect, useState } from 'react'
import './Feed.css'
import TweetBox from './TweetBox/TweetBox';
import axios from 'axios';
import Post from './Post/Post';

const Feed = () => {
  const [posts, setPosts]= useState([]);

  useEffect(()=>{
    fetch(`${process.env.HOST}/post`)
    .then(res=> res.json())
    .then(data=>{
      setPosts(data);
    })
  },[posts])

  return (
    <div className='feed'>
      <div className='feed_header'>
        <h2>HOME</h2>
      </div>
      <TweetBox></TweetBox>
      {
        posts.map(p=><Post key={p._id} p={p}/>)
      }
    </div>
  )
}

export default Feed;
