//CREATED BY MIIKA KILJUNEN

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DisplayImages() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/images', { withCredentials: true })
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    return (
        <>
        <div className="gallery">
            {images.map((img, index) => (
                <div key={index} className="gallery-item">
                    <img src={img.url} alt={`Dog ${index}`} />
                    <p>Sent by: {img.sender}</p>
                </div>
            ))}
        </div>
        </>
    );
}

export default DisplayImages;
