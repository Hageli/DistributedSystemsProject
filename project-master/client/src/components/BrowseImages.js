import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

function BrowseImages() {
    const [ images, setImages ] = useState(null);
    const [ dogimages, setDogimages ] = useState(null);
    const [ cookies ] = useCookies(['user']);

    // get all images from server
    const getDogImages = async () => {
        try {
            axios.get('/dogimages', {params: {UserEmail: cookies.UserEmail}})
            .then(response => {
                setDogimages(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    const getImages = async () => {
        try {
            const response = await axios.get('/images', {params: {UserEmail: cookies.UserEmail}});
            setImages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const backToMain = () => {
        window.location.href = "/mainpage";
    }

    useEffect(() => {
        getImages();
        getDogImages();
    }, [])

    return (
        <>
        <div>
            <h1>User's images</h1>
            <button className="btn-large" onClick={backToMain}>Back to mainpage</button>
        </div>
        <div className="img-div">
            {images == null ? "" : images.map((image, index) => {
                return (
                <div key={index} className="gallery-item">
                    <img src={require(`../images/${image.image}`)} alt={`Dog ${index}`} />
                </div>
                )
            })}    
        </div>
        <h1>API Images</h1>
        <div className="img-div">
            {dogimages == null ? "" : dogimages.map((image, index) => {
                return (
                <div key={index} className="gallery-item">
                    <img src={image.url} alt={`Dog ${index}`} />
                </div>
                )
            })}    
        </div>
        </>
    )
}

export default BrowseImages