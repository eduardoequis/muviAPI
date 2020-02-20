const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

//JSON Validation
var Ajv = require('ajv');
var ajv = new Ajv(); 
let movieSchema = require('./schema')
var validate = ajv.compile(movieSchema);

//Date format
var dayjs = require('dayjs');
const naturalCompare = require('string-natural-compare');

// Set some defaults (required if your JSON file is empty)
db.defaults({ movies: [], count: 0 })
  .write()

// Add a post

database = {

    getAllData: function() {
        return db.get('movies').value()
    },

    getMovieByID: function(inputID) {
        return db.get('movies').find({ id: inputID}).value()
    },
/////////////////////
    getMovieByDate: function(inputYear) {
        let allMovies = db.get('movies').value()
        let onlyFromYear = []
        allMovies.forEach(function(movie){
            let yearOfTheMovie = parseInt(dayjs(movie.date).format('YYYY')) // Get only the year of the date
            if (yearOfTheMovie === inputYear) {
                onlyFromYear.push(movie)
            }
        })    
        return onlyFromYear
    },

    getAllMoviesSortedByDate: function() {
        let allMovies = db.get('movies').value()
    
        allMovies.sort(function(movie1, movie2){
            //Compare the 2 years of a date.
            return parseInt(dayjs(movie1.date).format('YYYY')) - parseInt(dayjs(movie2.date).format('YYYY'));
        })

        return allMovies
    },

    getAllMoviesSortedByTitle: function() {
        let allMovies = db.get('movies').value()

        return allMovies.sort((movie1, movie2) => (
            naturalCompare(movie1.title, movie2.title, {caseInsensitive: true})
          ))
    },

    getMovieBygenres: function(inputGenre) {
        let allMovies = db.get('movies').value()
        let onlyOneGenre = []
        allMovies.forEach(function(movie){   
            for (i=0; i < movie.genres.length; i++){ //Genres are in arrays
                if (movie.genres[i] === inputGenre) {
                    onlyOneGenre.push(movie)
                }
            } 
        })    
        return onlyOneGenre
        
    },

    getAllIDs: function () {
        return db.get('movies').map('id').value()  
    },

    getLargestID: function () {
        return getLargest(db.get('movies').map('id').value() )
    },


    getGenres: function () {
        let listOfGenres = db.get('movies').map('genres').value()
        let listMerged = [].concat.apply([], listOfGenres)
        let genresFiltered = [...new Set(listMerged)]
        return genresFiltered

    },

    getYears: function () {
        let listOfDates = db.get('movies').map('date').value()
        let listDatesMerged = [].concat.apply([], listOfDates)
        let onlyYears = []
        listDatesMerged.forEach(function(date){
            onlyYears.push(parseInt(dayjs(date).format('YYYY'))) // Get only the year of the date
        })
        let yearsFiltered = [...new Set(onlyYears)]
        return yearsFiltered.sort(compareNumbers)
    },

    getRates: function () {
        let listOfRates = db.get('movies').map('rate').value()
        let listRatesMerged = [].concat.apply([], listOfRates)
        let ratesFiltered = [...new Set(listRatesMerged)]
        return ratesFiltered.sort(compareNumbers)
    },

    getAllMoviesSortedByRate: function() {
        let allMovies = db.get('movies').value()
    
        allMovies.sort(function(movie1, movie2){
            //Compare the 2 rates of movies.
            return movie1.rate - movie2.rate
        })

        return allMovies
    },

    post: function(movie) {
        // Start Validation
        var valid = validate(movie);
        if (valid) {
                db.get('movies')
                .push(movie)
                .write()
                this.countUp()
                return true
          } else {
                console.log(validate.errors);   
                return false       
          }
    },

    countUp: function() {
        db.update('count', n => n + 1)
        .write()
    },

    totalCount: function() {
        return db.get('count').value()
    },

}

//

function getLargest(array) {
    
    let largest = 0;

    for (i = 0; i <= largest; i++){
        if (array[i]>largest) {
            largest = array[i];
        }
    }

    return largest
}

function compareNumbers(a, b) {
    if ( a < b ){
      return -1;
    }
    if ( a > b ){
      return 1;
    }
    return 0;
  }



module.exports = database;