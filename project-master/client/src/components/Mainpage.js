import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

// THIS IS THE MAINPAGE. CONTAINS THE TINDER CARDS AND CHAT/MATCH LISTING
function Mainpage() {
    const [ user, setUser ] = useState('');
    const [ cookies, setCookie, removeCookie ] = useCookies(['user']);
    
    // GETS THE CURRENT LOGGED IN USER
    const getUser = async () => {
      try {
        const userEmail = cookies.UserEmail;
        const response = await axios.get('/user', {
          params: {userEmail}
        })
        setUser(response.data);
      } catch (error) {
        console.log("Axios failed");
      } 
    }

    useEffect(() => {
      getUser();
    }, [])

  return (
    <div className="mainpage">
      <h1>This is mainpage</h1>
    </div>
  )
}

export default Mainpage
