import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';



function Mainpage() {
    const [ user, setUser ] = useState('');
    const [ image, setImage] = useState('https://picsum.photos/id/237/200/300')
    const [ cookies, setCookie, removeCookie ] = useCookies(['user']);
    let navigate = useNavigate();

    //MIIKA: GENERATE DOG IMAGES FROM DOG CEO

    const generateDogImage = async () => {
      try {
        const fetchResponse = await axios.get('https://dog.ceo/api/breeds/image/random');
        if (fetchResponse.data.status === 'success') {
            setImage(fetchResponse.data.message);
            
            //SEND DOG IMAGE FOR SAVING
            const saveResponse = await axios.post('http://localhost:5000/saveDogImage', {
                url: fetchResponse.data.message,
                sender: user.name
            });
            if (saveResponse.status === 201) {
                console.log('Image saved successfully');
            } else {
                console.error('Failed to save image');
            }
        } else {
            console.error('Failed to fetch dog image');
        }
      } catch (error) {
          console.error('Error fetching or saving:', error);
      }
    };

    // GETS THE CURRENT LOGGED IN USER
    const getUser = async () => {
      try {
        const userEmail = cookies.UserEmail;
        const response = await axios.get('/user', {
          params: {userEmail}
        })
        setUser(response.data);
      } catch (error) {
        console.log("Axios failed:",error);
      } 
    }
    
    // REMOVES COOKIES AKA LOGS USER OUT AND NAVIGATES BACK TO HOME PAGE
    const Logout = () => {
      removeCookie('UserEmail');
      removeCookie('UserID');
      removeCookie('AuthToken');
      navigate('/home')
    }

    //MIIKA KILJUNEN: BROWSE IMAGES
    const BrowseImages = () => {
      return (
        <div>
            <Link to="/images" className="btn btn-primary">Display Images</Link>
        </div>
    );
    }

    useEffect(() => {
      getUser();
    }, [])

  return (
    <>
    <h1>Hi {user.name}!</h1>
    <div className="img-div">
      <div className="img-container">
      {image ? <img src={image} alt="Dog" /> : <p>No image loaded</p>}
      </div>
    </div>
    <div className="ai-div">
        <p>Enter your prompt for AI image creation here</p>
        <div className="ai-container">
          <textarea style={{width: '40%', backgroundColor: '#fff', textAlign: 'center'}}></textarea>
        </div>
        <button type="submit" className="btn-small">Create Image</button>
        <button onClick={generateDogImage} className="btn-small">Generate Dog</button>
    </div>
    <div className="footer-div">
      <a href="/home" onClick={Logout}>Logout</a>
      <a href="/images" onClick={BrowseImages}>Browse images</a>
    </div>
  </>
  )
}

export default Mainpage
