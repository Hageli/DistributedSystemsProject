import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

// THIS CONTAINS THE FORM FOR CREATING A NEW ACCOUNT
function AddNewAccount({ setShowNewAccount }) {
    const [ email, setEmail ] = useState(null);
    const [ password, setPassword ] = useState(null);
    const [ name, setName ] = useState(null);
    const [ age, setAge ] = useState(null);
    const [ description, setDescription ] = useState(null);
    const [ cookies, setCookie, removeCookie ] = useCookies('user');

    let navigate = useNavigate()

    // HIDE ACCOUNT CREATION FORM WHEN USERS CANCELS
    const cancelClick = () => {
        setShowNewAccount(false);
    }
    // SUBMIT ACCOUNT CREATION FORM AND SET COOKIES
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/createaccount', {email, name, age, description, password});
            setCookie("AuthToken", response.data.token);
            setCookie('UserEmail', response.data.userEmail);
            setCookie("UserID", response.data.userID);
            const success = response.status === 201;
            if(success) navigate('/mainpage')
        } catch (error) {
            alert("Email already in use")
        }
        window.location.reload();
    }

    return (
    <div>
        <h2>
            Create account
        </h2>
       
        <div className="create-div">
            <button className=" orange btn-small" onClick={cancelClick}>
                cancel
            </button>
            <form className="accountForm" onSubmit={submitForm}>
                <div className="create-input">
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="email" 
                        required={true} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="create-input">
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="name" 
                        required={true} 
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="create-input">
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

export default AddNewAccount
