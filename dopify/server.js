import * as dotenv from '@tinyhttp/dotenv' 
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { parse, serialize } from '@tinyhttp/cookie'

import { createServer } from 'https'
import fs from 'fs'

//import { cookieParser, JSONCookie, JSONCookies, signedCookie, signedCookies } from '@tinyhttp/cookie-parser'
import serveStatic from 'serve-static';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath function from the 'url' module
import { dirname } from 'path'; // Import dirname function from the 'path' module

import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import request from 'request'
import crypto from 'crypto'
import cors from 'cors'
import querystring from 'querystring'
import cookieparser from 'cookie-parser'
import { log } from 'console';

const test = dotenv.config({path:'../token.env'})
var client_id = process.env.client_id
var client_secret = process.env.client_secret
var redirect_uri = 'http://localhost:8500/callback'; // Your redirect uri

var profile_name = ''
var track_artist = ''
var track_title = ''
var track_cover = ''
var playlist_name = ''
var playlist_cover = ''

// const data = []
// spotify shizzle
const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
  }

var stateKey = 'spotify_auth_state';

const app = new App();
var engine = new Liquid()

app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid')
//console.log(process.env) // remove this after you've confirmed it is working

const __filename = fileURLToPath(import.meta.url); // Convert the URL of the current module to a file path
const __dirname = dirname(__filename); // Get the directory name of the current module


app
    .use(logger())
    //.use(serveStatic(path.join(__dirname, 'src')))
    .use(serveStatic(path.join(__dirname, 'src')))
    .use('/', sirv('dist/assets'))
    .use(cors())
    .use(cookieparser())
    .listen(8500);
  
// function getTrackInformation(req, trackId) {
//       const url = 'https://api.spotify.com/v1/tracks/' + trackId + '?market=NL';
//       const token = "Bearer ".concat(req.cookies.access_token);
//       const options = {
//         method: 'GET',
//         headers: {
//           'Authorization': token
//         }
//       };
    
//       fetch(url, options)
//       .then(response => {
//         // Check if the response is successful (status code 200)
//         if (response.ok) {
//           // Parse the JSON response
//           return response.json();
//         } else {
//           // If the response is not successful, throw an error
//           throw new Error('Failed to fetch data');
//         }
//       })
//       .then(data => {
//         console.log(data)
//         // Handle the retrieved data
//         //console.log('Retrieved data:', data);
//         track_artist = data.artists[0].name
//         track_title = data.album.name
//         track_cover = data.album.images[0].url
    
//       })
//     }
// function createTrackObjects(trackUrls, options) {
//   const trackObjects = trackUrls.map((trackUrl) => {
//     console.log(trackUrl)
//     console.log(options)
//     return fetch(trackUrl, options).then(res => res.json())
//   });

//   return Promise.all(trackObjects)
// }

function createTrackObjects(trackIds, options) {
  const trackObjects = trackIds.map((trackId) => {
    console.log(trackId)
    console.log(options)
    var trackUrl = 'https://api.spotify.com/v1/tracks/' + trackId + '?market=NL'
    return fetch(trackUrl, options).then(res => res.json())
  });

  return Promise.all(trackObjects)
}

app.get('/', async (req, res) => {
  
  //console.log(req.cookies.access_token)
    //console.log(req);
    //console.log('yooo')
    //res.send('Hello World!');
    //console.log(access_token_temp)

    //console.log(req.cookies.access_token)
    if (req.cookies.access_token) {
      // Define the URL for the Spotify API endpoint
      // const trackIds = [
      //   'https://api.spotify.com/v1/tracks/0Rv6Qk5lM1krVa8vWyrATj?market=NL',
      //   'https://api.spotify.com/v1/tracks/0uHrMbMv3c78398pIANDqR?market=NL',
      // ];
      const trackIds = [
        '0Rv6Qk5lM1krVa8vWyrATj',
        '0uHrMbMv3c78398pIANDqR',
        '27IxsagisMzK85kLiG3Ham',
      ]
      
    
      // Define the authorization token
      const token = "Bearer ".concat(req.cookies.access_token);

      // Define options for the fetch request
      const options = {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      };

      // Make the fetch request
      // const data = fetch(trackurl, options)
      //   .then(response => {
      //     // Check if the response is successful (status code 200)
      //     if (response.ok) {
      //       // Parse the JSON response
      //       return response.json();
      //     } else {
      //       // If the response is not successful, throw an error
      //       throw new Error('Failed to fetch data');
      //     }
      //   })



        //const data = await fetch(trackIds[0], options).then(res => res.json());

        const tracks = await createTrackObjects(trackIds, options)

        console.log(tracks)

        // console.log(data);

        // .then(data => {
        //   console.log(data)
        //   // Handle the retrieved data
        //   //console.log('Retrieved data:', data);
        //   // track_artist = data.artists[0].name
        //   // track_title = data.album.name
        //   // track_cover = data.album.images[0].url
          
        //   //res.json(data)
        //   // Now you can do whatever you want with the data
        // })
        // .catch(error => {
        //   // Handle any errors that occur during the fetch request
        //   console.error('Error:', error.message);
        // });
        const playlisturl = 'https://api.spotify.com/v1/playlists/557OhUWEAHkqKsdXJgQ5Zt?market=NL';
        // Define the authorization token
        // const token = "Bearer ".concat(req.cookies.access_token);
  
        // // Define options for the fetch request
        // const options = {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': token
        //   }
        // };
  
        fetch(playlisturl, options)
        .then(response => {
          // Check if the response is successful (status code 200)
          if (response.ok) {
            // Parse the JSON response
            return response.json();
          } else {
            // If the response is not successful, throw an error
            throw new Error('Failed to fetch data');
          }
        })
        .then(playlistdata => {
          // console.log(playlistdata)
          playlist_name = playlistdata.name
          // console.log(playlistdata.tracks.items[0])
          playlist_cover = playlistdata.images[0].url
  
        })
  
      // const data = {
      //   title: 'Dopify', 
      //   access_token: req.cookies.access_token, 
      //   refresh_token: req.cookies.refresh_token,
      //   profile_name: profile_name,
      //   track_artist: track_artist,
      //   track_title: track_title,
      //   track_cover: track_cover,
      //   playlist_name: playlist_name,
      //   playlist_cover: playlist_cover,
      // }
      return res.send(renderTemplate('views/index.liquid', {title: 'Dopify', accessToken: true, tracks}));
      }

});
// const createTrackObjects = async (trackUrls) => {
  
// }


app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
});

app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
    //var testURL = window.location.pathname.split('/');

  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code',
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

          console.log(response)
          console.log(body)
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
        
          res.cookie('access_token', access_token, {maxAge: 3600 * 1000, httpOnly: false}) // 1 hour
          res.cookie('refresh_token', refresh_token, {maxAge: 86400 * 1000, httpOnly: true}) // 1 day
          
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
            profile_name = body.display_name
            
          });

          //res.cookie('display_name', body.display_name, {maxAge: 86400, httpOnly: true}) // 1 day
          
          // we can also pass the token to the browser to make requests from there
          return res.redirect('/')
            
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
});

app.get('/refresh_token', function(req, res) {

    var refresh_token = req.cookies.refresh_token;
    var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming';
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        scope: scope
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;

            res.set(
              'Set-Cookie',
            serialize('access_token', String(access_token), {
              httpOnly: false,
              maxAge: 60 * 60
            }))
            //refresh_token_temp = refresh_token_temp

        res.redirect('/')
      }
    });
});

app.get('/get-user-info', function(req, res) {
  
})

app.get('/logout', function(req, res) {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  res.clearCookie('display_name')
  res.redirect('/')
})

// NOT USED ANYMORE !!!
app.get('/data', async (req, res) => {
    try {
      // Define the URL for the Spotify API endpoint
      const url = 'https://api.spotify.com/v1/tracks/0Rv6Qk5lM1krVa8vWyrATj?market=NL';
  
      // Define the authorization token
      const token = "Bearer ".concat(req.cookies.access_token);
  
      // Define options for the fetch request
      const options = {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      };
  
      // Make the fetch request
      fetch(url, options)
        .then(response => {
          // Check if the response is successful (status code 200)
          if (response.ok) {
            // Parse the JSON response
            return response.json();
          } else {
            // If the response is not successful, throw an error
            throw new Error('Failed to fetch data');
          }
        })
        .then(data => {
          // Handle the retrieved data
          //console.log('Retrieved data:', data);
          track_artist = data.artists[0].name
          track_title = data.album.name
          track_cover = data.album.images[0].url
          res.redirect('/')
          //res.json(data)
          // Now you can do whatever you want with the data
        })
        .catch(error => {
          // Handle any errors that occur during the fetch request
          console.error('Error:', error.message);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
  });

const renderTemplate = (template, data) => {
    return engine.renderFileSync(template, data)
}
