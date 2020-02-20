let dotenv = require('dotenv').config()
const {apiKey = process.env.APIKEY} = process.env // Get the API Key
let apiPage = 1 // Config the page from the API response I'll get. 
const got = require('got');
var database = require('./database');
var dayjs = require('dayjs');

let genres 
let moviesForRanking = [] // Array filled with movies from the API

function getDataFromAPI() {
    //Start process of getting info: first get genres > then movies
    getGenres()
}

let  getGenres = (async () => {
    try {
        let API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
        const response = await got(API).json();
        genres = response.genres
        callMovieDatabaseApi()
        
        } catch (error) {
            console.log(error);
            //=> 'Internal server error ...'
        }
})

const callMovieDatabaseApi = (async () => {
    try {
        let API = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${apiPage}`
        const response = await got(API).json();
        let moviesResults = response.results
        orderMovies(moviesResults, moviesForRanking)
        //console.log(response.results); // 20 movies
        
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})

function orderMovies (listOfMovies, array) {
    
    listOfMovies.forEach(function(movie) {

        let newFormat = {
            "id": movie.id,
            "title": movie.title,
            "overview": movie.overview,
            "date": dayjs(movie.release_date).format('MMMM D, YYYY'),
            "genres": changeGenresToString(movie.genre_ids), // falta pasar a strings
            "poster": "https://image.tmdb.org/t/p/w1280" + movie.poster_path,
            "backdrop": "https://image.tmdb.org/t/p/w1280" + movie.backdrop_path,
            "rate": movie.vote_average
          }
        
          array.push(newFormat)

    })

    countMovies(array)
}

function countMovies (listOfMovies) {
    if (listOfMovies.length < 100) {
        console.log("faltan")
        apiPage++
        callMovieDatabaseApi()

    } else {
        console.log("LLENO")
        //console.log(listOfMovies)
        console.log(listOfMovies.length)
        listOfMovies.forEach(movie => database.post(movie))
        console.log("DONE!")
    }
}

function changeGenresToString (array) {
    let genresStrings = []
    array.forEach(function (IDnumber) {    
        for (i=0; i < genres.length; i++) {
            if (IDnumber === genres[i].id) {
                genresStrings.push(genres[i].name)
            } 
        }
    })
    return genresStrings
}




module.exports = getDataFromAPI;

/*
{
    "id": 105,
    "title": "Back to the Future",
    "overview": "Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. Marty must repair the damage to history by rekindling his parents' romance and - with the help of his eccentric inventor friend Doc Brown - return to 1985.",
    "date": "July 3, 1985",
    "genres": ["Adventure", "Comedy", "Science Fiction", "Family"],
    "poster": "https://image.tmdb.org/t/p/w1280/pTpxQB1N0waaSc3OSn0e9oc8kx9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
    "rate": 8.32
  }
*/
