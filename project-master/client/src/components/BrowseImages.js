import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

function BrowseImages() {
    const [ allImages, setAllImages ] = useState(null);
    const [ cookies ] = useCookies(['user']);

    // get all images from server
    const getImages = async () => {
        try {
            const response = await axios.get('/images', {params: {UserEmail: cookies.UserEmail}});
            setAllImages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const backToMain = () => {
        window.location.href = "/mainpage";
    }

    useEffect(() => {
        getImages();
    }, [])

    return (
        <>
        <div>
            <h1>User's images</h1>
            <button className="btn-large" onClick={backToMain}>Back to mainpage</button>
        </div>
        <div className="img-div">
            {allImages == null ? "" : allImages.map((image) => {
                return (
                <div key={image.image} className="browse-img">
                    <img  src={require(`../images/${image.image}`)} style={{width: '70%'}} />
                </div>
                )
            })}    
        </div>
        </>
    )
}

export default BrowseImages