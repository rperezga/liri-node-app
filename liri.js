// Grab the request package...
var request = require("request");
const cTable = require("console.table");
var inquirer = require("inquirer");
var colors = require('colors/safe');

inquirer
  .prompt([
    {
      type: "input",
      message: "What is your Name?",
      name: "username"
    },
    {
      type: "password",
      message: "Set your password",
      name: "password"
    },
    {
      type: "list",
      message: "What you want to find?",
      choices: ["Movie Info", "Band Info", "Track Info"],
      name: "find"
    },
    {
      type: "confirm",
      message: "Are you sure:",
      name: "confirm",
      default: true
    }
  ])
  .then(function (inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.confirm) {
      if (inquirerResponse.find == 'Movie Info') {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Wich movie you are looking for?",
              name: "movie"
            }
          ])
          .then(function (inquirerResponse) {
            request("http://www.omdbapi.com/?t=" + inquirerResponse.movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
              // If the request was successful...
              if (!error && response.statusCode === 200) {
                var table = [];
                table.push(
                  { "Info": "Title", "Data": JSON.parse(body).Title },
                  { "Info": "Year", "Data": JSON.parse(body).Year },
                  { "Info": "Rated", "Data": JSON.parse(body).Rated },
                  { "Info": "Genre", "Data": JSON.parse(body).Genre },
                  { "Info": "Director", "Data": JSON.parse(body).Director },
                  { "Info": "Actors", "Data": JSON.parse(body).Actors },
                  { "Info": "Plot", "Data": JSON.parse(body).Plot },
                  { "Info": "Country", "Data": JSON.parse(body).Country },
                  { "Info": "Awards", "Data": JSON.parse(body).Awards }
                )
                console.table("Movie Info:", table);
              }
            });
          });
      } else if (inquirerResponse.find == 'Band Info') {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Wich band you are looking for?",
              name: "band"
            }
          ])
          .then(function (inquirerResponse) {
            request("https://rest.bandsintown.com/artists/" + inquirerResponse.band + "?app_id=<KEY>", function (error, response, body) {
              // If the request was successful...
              if (!error && response.statusCode === 200) {
                var tableArtist = [];
                tableArtist.push(
                  { "Info": "Name", "Data": JSON.parse(body).name },
                  { "Info": "Facebook Page", "Data": JSON.parse(body).facebook_page_url },
                  { "Info": "Upcoming Events", "Data": JSON.parse(body).upcoming_event_count }
                )
                console.table("Artist Info:", tableArtist);

                if (JSON.parse(body).upcoming_event_count > 0) {
                  request("https://rest.bandsintown.com/artists/" + JSON.parse(body).name + "/events?app_id=<KEY>&date=upcoming", function (error, response, body) {
                    // If the request was successful...
                    if (!error && response.statusCode === 200) {
                      var tableEvent = [];
                      tableEvent.push(
                        { "Info": "Place", "Data": JSON.parse(body)[0].venue.name },
                        { "Info": "City", "Data": JSON.parse(body)[0].venue.city },
                        { "Info": "Date", "Data": JSON.parse(body)[0].datetime },
                        { "Info": "Lineup", "Data": JSON.parse(body)[0].lineup },
                        { "Info": "Ticket Status", "Data": JSON.parse(body)[0].offers[0].status }
                      )
                      console.table("Next Event Info:", tableEvent);
                    }
                  });
                }
              }
            });
          });
      } else {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Wich song you are looking for?",
              name: "song"
            }
          ])
          .then(function (inquirerResponse) {
            var Spotify = require('node-spotify-api');

            var spotify = new Spotify({
              id: '<KEY>',
              secret: '<KEY>'
            });
    
            var tableTracks = [];
    
            spotify.search({ type: 'track', query: inquirerResponse.song }, function (err, data) {
              if (!err) {
                // console.log(data.tracks.items[0]); 
                for (var i = 0; i < data.tracks.limit; i++) {
                  tableTracks.push(
                    { "Name": data.tracks.items[i].name },
                    { "Artist": data.tracks.items[i].artists[0].name },
                    { "Album": data.tracks.items[i].album.name },
                    { "Release Date": data.tracks.items[0].album.release_date }
                  )
                }
                console.table("Tracks Info:", tableTracks);
              }
    
    
            });
          })        
      }
    }
    else {
      console.log("\nThat's okay " + inquirerResponse.username + ", come again when you are more sure.\n");
    }
  });
