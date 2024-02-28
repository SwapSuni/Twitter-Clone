import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import {TwitterTweetEmbed, TwitterTimelineEmbed} from 'react-twitter-embed'
import './Widgets.css'
import { useNavigate } from 'react-router-dom';

const Widgets = () => {
  const navigate= useNavigate();

  const subscribe=()=>{
    navigate('/subscribe');
  }

  return (
    <div className='widgets'>
      <div className='subscribe_btn'>
        <button onClick={subscribe}>Subscribe</button>
      </div>
      <div className='widgets_input'>
        <SearchIcon className='widgets_searchIcon'/>
        <input type='text' placeholder='SearchTwitter'></input>
      </div>

      <div className='widgets_widgetContainer'>
          <h2 style={{fontWeight:'bold'}}>What's Happenning..?</h2>
      </div>

      <TwitterTweetEmbed
        tweetId={'1557187138352861186'}
      />

      <TwitterTimelineEmbed
          sourceType='profile'
          screenName='elonmusk'
          options={{height: 400}}
      />
    </div>
  )
}

export default Widgets
