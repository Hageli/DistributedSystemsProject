import React from 'react'
import { useState } from 'react'
import AddNewAccount from './AddNewAccount';
import Login from './Login';

// HOMEPAGE CONTAINS BOTH THE LOGIN AND ACCOUNT CREATION FORMS AND SHOWS THEM WHEN USER PRESSES A BUTTON
function Home() {
    const [ showNewAccount, setShowNewAccount] = useState(false)
    const [ showLogin, setShowLogin ] = useState(false);

    // SHOW LOGIN FORM
    const signInClick = () => {
        setShowLogin(true);
    }

    // SHOW ACCOUNT CREATION FORM
    const createAccountClick = () => {
        setShowNewAccount(true);
    }

    return (
    <div className="home">
        {!showNewAccount && !showLogin && (
            <h1>Welcome to PhotoFinder</h1>
        )}

        <div className="buttonDiv">
            {!showNewAccount && !showLogin && (
                <button className="btn-large" onClick={signInClick}>Log in </button>
            )}
        </div>
        <div className="buttonDiv">
            {!showNewAccount && !showLogin && (
                <button className="btn-large" onClick={createAccountClick}>
                    Create account
                </button>
            )}
        </div>

        {showNewAccount && (
            <AddNewAccount setShowNewAccount={(setShowNewAccount)} />
        )}
        {showLogin && (
            <Login setShowLogin={(setShowLogin)}/>
        )}
    </div>
  )
}

export default Home
