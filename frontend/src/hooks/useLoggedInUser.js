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
    fetch(`http://localhost:5000/loggedInUser?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setLoggedInUser(data)
      })

    // if (loggedInUser.length == 0) {
    //   const data = {
    //     name,
    //     email,
    //   }
    //   const jsondata = JSON.stringify(data);
    //   fetch('http://localhost:5000/register', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: jsondata,
    //   })
    //     .then(res => res.json())
    //     .then(data => { setLoggedInUser(data) })
    // }
  }, [email, loggedInUser]);

  return [loggedInUser, setLoggedInUser];
}

export default useLoggedInUser
