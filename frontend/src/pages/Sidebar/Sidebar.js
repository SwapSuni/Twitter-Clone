import React, { useEffect, useState } from 'react'
import './Sidebar.css';
import TwitterIcon from '@mui/icons-material/Twitter';
import SidebarOptions from './SidebarOptions';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button, Divider, IconButton, DoneIcon, ListItemIcon, Menu, MenuItem } from '@mui/material';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import CustomeLink from './CustomeLink';
import useLoggedInUser from '../../hooks/useLoggedInUser';

const Sidebar = ({ handleLogout, user }) => {
  const [anchoraEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchoraEl);
  const [loggedInUser, setLoggedInUser] = useLoggedInUser();
  const [name, setName] = useState("");

  const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png";

  const handleClick = e => {
    setAnchorEl(e.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  useEffect(() => {
    // console.log(loggedInUser.length)
    if (loggedInUser.length == 0) {
      const data = {
        name: user[0].displayName,
        email: user[0].email,
      }
      const jsondata = JSON.stringify(data);
      // console.log(jsondata);
      fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsondata,
      })
        .then(res => res.json())
        .then(data => { setLoggedInUser(data) })
    }

    if (user[0].email) {
      setName(user[0]?.email.split('@')[0]);
    }
    else {
      setName(user[0]?.phoneNumber)
    }
  }, [name]);


  return (
    <div className='sidebar'>
      <TwitterIcon className='sidebar_twitterIcon' />

      <CustomeLink to='/home/feed'>
        <SidebarOptions active Icon={HomeIcon} text='Home' />
      </CustomeLink>
      <CustomeLink to='/home/explore'>
        <SidebarOptions active Icon={SearchIcon} text='Explore' />
      </CustomeLink>
      <CustomeLink to='/home/notifications'>
        <SidebarOptions active Icon={NotificationsNoneIcon} text='Notifications' />
      </CustomeLink>
      <CustomeLink to='/home/messages'>
        <SidebarOptions active Icon={MailOutlineIcon} text='Messages' />
      </CustomeLink>
      <CustomeLink to='/home/bookmarks'>
        <SidebarOptions active Icon={BookmarkBorderIcon} text='Bookmarks' />
      </CustomeLink>
      <CustomeLink to='/home/lists'>
        <SidebarOptions active Icon={ListAltIcon} text='Lists' />
      </CustomeLink>
      <CustomeLink to='/home/profile'>
        <SidebarOptions active Icon={PermIdentityIcon} text='Profile' />
      </CustomeLink>
      <CustomeLink to='/home/more'>
        <SidebarOptions active Icon={MoreVertIcon} text='More' />
      </CustomeLink>

      <Button variant='outlined' className='sidebar_tweet'>
        Tweet
      </Button>

      <div className='Profile_info'>
        <Avatar src={userProfilePic}></Avatar>
        <div className='user_info'>
          <h4>
            {
              loggedInUser[0]?.name ? loggedInUser[0]?.name : user && user[0]?.displayName
            }
          </h4>
          <h5>@{name}</h5>
        </div>
        <IconButton size='small' sx={{ ml: 2 }} aria-controls={openMenu ? "basic-menu" : undefined} aria-haspopup="true" aria-expanded={openMenu ? "true" : undefined} onClick={handleClick}>
          <MoreVertIcon></MoreVertIcon>
        </IconButton>
        <Menu id='basic-menu' anchorEl={anchoraEl} open={openMenu} onClick={handleClose} onClose={handleClose}>
          <MenuItem className='Profile_info1'>
            <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"} />
            <div className='user_info subUser_info'>
              <div>
                <h4>
                  {
                    loggedInUser[0]?.name ? loggedInUser[0]?.name : user && user[0]?.displayName
                  }
                </h4>
                <h5>@{name}</h5>
              </div>
              <ListItemIcon className='done_icon'> <DownloadDoneIcon /> </ListItemIcon>
            </div>
          </MenuItem>
          <Divider></Divider>
          <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout {name}</MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default Sidebar
