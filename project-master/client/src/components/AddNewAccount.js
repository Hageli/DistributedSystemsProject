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
            console.log("created req for account creation")
            const response = await axios.post('http://localhost:5000/createaccount', {email, name, age, description, password}, {withCredentials: true});
            setCookie("AuthToken", response.data.token);
            setCookie('UserEmail', response.data.userEmail);
            setCookie("UserID", response.data.userID);
            const success = response.status === 201;
            if(success) navigate('/mainpage')
        } catch (error) {
            console.error("Axios request failed:", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Data:", error.response.data);
                console.error("Status:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Axios request was made but no response was received:", error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up Axios request:", error.message);
            }
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
                        type="text" 
                        id="age" 
                        name="age" 
                        placeholder="age" 
                        required={true} 
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>
                <div className="create-input">
                    <input 
                        type="text" 
                        id="description" 
                        name="description" 
                        placeholder="description" 
                        required={true} 
                        onChange={(e) => setDescription(e.target.value)}
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
