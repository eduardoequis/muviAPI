var express = require('express');
var router = express.Router();
var database = require('./database');

router
  .route('/')
    .get(function(req, res, next) {

      if(!req.query) {
        let list = database.getAllData()
        res.json(list)
      } else if (req.query.year) {
        // By Year 
        let moviesByYear = database.getMovieByDate(parseInt(req.query.year))
        res.json(moviesByYear)
      } else if (req.query.genre) {
        // By Genre
        let moviesByGenre = database.getMovieBygenres(req.query.genre)
        res.json(moviesByGenre)
      } else if (req.query.sortBy) {
        // Sort by
          if (req.query.sortBy === "title") {

            let moviesSortedByTitle = database.getAllMoviesSortedByTitle()
            res.json(moviesSortedByTitle)

          } else if (req.query.sortBy === "year") {

            let moviesSortedByYear = database.getAllMoviesSortedByDate()
            res.json(moviesSortedByYear)
            
          } else if (req.query.sortBy === "rate") {

            let moviesSortedByRate = database.getAllMoviesSortedByRate()
            res.json(moviesSortedByRate)
            
          }
      }

    })
    .post(function(req, res, next) {

      let movie = {
        "id": database.getLargestID()+1,
        "title": req.body.title,
        "overview": req.body.overview,
        "genres": req.body.genres,
        "poster": req.body.poster,
        "backdrop": req.body.backdrop,
        "rate": req.body.rate
      }
      // Send to database
      if (database.post(movie)) {
        res.json(movie)
      } else {
        res.status(400).send(`400 - Bad Request`)
        //pasar el error al next
      }

    })

router
  .route('/genres')
    .get(function(req, res, next) {
        res.json(database.getGenres())  
  });

router
  .route('/years')
    .get(function(req, res, next) {
        res.json(database.getYears())  
  });

router
  .route('/rates')
    .get(function(req, res, next) {
        res.json(database.getRates())  
  });

router
  .route('/:id')
    .get(function(req, res, next) {
      let id = parseInt(req.params.id)
      let movie = database.getMovieByID(id)
      if (movie) {
        res.json(movie)
      } else {
        res.status(404).send(`404 - The movie with the id ${id} was not found`)
        //pasar err al next
      }
      
    });



module.exports = router;
