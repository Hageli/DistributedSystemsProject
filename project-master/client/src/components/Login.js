import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

// THIS THE LOGIN FORM. WHEN USER IS SUCCESSFULLY LOGGED IN, SETS THE COOKIES
function Login({ setShowLogin }) {
    const [ email, setEmail ] = useState(null);
    const [ password, setPassword ] = useState(null);
    const [ cookies, setCookie, removeCookie ] = useCookies('user');


    let navigate = useNavigate();

    // HIDE LOGIN FORM WHEN USERS CANCELS
    const cancelClick = () => {
        setShowLogin(false);
    }

    // SUBMIT LOGIN FORM AND SET COOKIES
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', {email, password});
            setCookie("AuthToken", response.data.token);
            setCookie("UserEmail", response.data.userEmail);
            setCookie("UserID", response.data.userID);
            const success = response.status === 201;
            if(success) navigate('/mainpage');
            window.location.reload();
        } catch (error) {
            alert("Wrong email or password");
        }
    }

  return (
    <div>
      <h2>
            Log in
        </h2>
        <div className="login-div">
            <button className=" orange btn-small" onClick={cancelClick}>
                cancel
            </button>
            <form className="accountForm" onSubmit={submitForm}>
                <div className="login-input">
                    <input
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="email" 
                        required={true} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="login-input">
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="password" 
                        required={true} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn">Submit</button>
            </form>
        </div>

    </div>
  )
}

export default Login
