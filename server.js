'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios')

const server = express();
server.use(cors());

const PORT = process.env.PORT;

let inMemory = {}// to store data 

// ROUTES
server.get('/', homeHandler);
server.get('/photos', getPhotoHandler)
server.get('*', notFoundHandler);


// Function Handlers
function homeHandler(req, res) {
    res.send('all good')
}

// localhost:3001/photos?searchQuery=book
// async function getPhotoHandler(req, res) {
//     let photoSearchQuery = req.query.searchQuery;
//     // https://api.unsplash.com/search/photos?client_id=aMXXjKn7RNxE6iy2Rlyxofb2ssKogf8NvcAQYm3NElM&query=book
//     let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_KEY}&query=${photoSearchQuery}`

//     console.log('before axios');
//     try {
//         let photoResults = await axios.get(url);
//         console.log('inside axios');

//         // console.log(photoResults.data)
//         let photoArray = photoResults.data.results.map(photo => {
//             return new Photo(photo)
//         })
//         res.send(photoArray)
//     }
//     catch (error) {
//         console.log('error from axios', error)
//         res.send(error)
//     }

//     console.log('after axios');


// }

// localhost:3001/photos?searchQuery=book
function getPhotoHandler(req, res) {
    let photoSearchQuery = req.query.searchQuery;
    // https://api.unsplash.com/search/photos?client_id=aMXXjKn7RNxE6iy2Rlyxofb2ssKogf8NvcAQYm3NElM&query=book
    let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_KEY}&query=${photoSearchQuery}`

    //the object inMemory need to read the value if there is if there is no data it will return undefined
    if (inMemory[photoSearchQuery] !== undefined) {
        console.log(' cache hit , data in cache memory');
        res.send(inMemory[photoSearchQuery]);
    }
    else {
        console.log(' cache miss , send req to unsplash API');
        try {
            axios.get(url).then((photoResults) => {
                // console.log(photoResults.data)
                let photoArray = photoResults.data.results.map(photo => {
                    return new Photo(photo)
                })
                inMemory[photoSearchQuery] = photoArray;
                console.log(inMemory)
                res.send(photoArray)
            })
        }
        catch (error) {
            console.log('error from axios', error)
            res.send(error)
        }
    }

}


function notFoundHandler(req, res) {
    res.status(404).send({
        "error": "Unable to get the route"
    })
}

class Photo {
    constructor(photoData) {
        this.imageUrl = photoData.urls.raw;
        this.likes = photoData.likes;
    }
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}!`)
})