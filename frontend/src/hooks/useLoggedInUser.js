import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase.init'
import { eachHourOfInterval } from 'date-fns';

const useLoggedInUser = () => {
  const app = auth;
  const [user] = useAuthState(app);
  // console.log(user);
  const email = user.email;
  const name = user.displayName;

  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetch(`https://twitter-clone-2-0kqn.onrender.com/loggedInUser?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setLoggedInUser(data)
      })
  }, [email, loggedInUser]);

  return [loggedInUser, setLoggedInUser];
}

export default useLoggedInUser
