import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

// THIS IS THE MAINPAGE. CONTAINS THE TINDER CARDS AND CHAT/MATCH LISTING
function Mainpage() {
    const [ user, setUser ] = useState('');
    const [ cookies, setCookie, removeCookie ] = useCookies(['user']);
    let navigate = useNavigate();

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

    const Logout = () => {
      removeCookie('UserEmail');
      removeCookie('UserID');
      removeCookie('AuthToken');
      navigate('/home')
    }

    useEffect(() => {
      getUser();
    }, [])

  return (
    <>
    <h1>Hi {user.name}! This is mainpage</h1>
    <div className="LogoutDiv">
      <button className="btn-large" onClick={Logout}>Logout</button>
    </div>
  </>
  )
}

export default Mainpage
