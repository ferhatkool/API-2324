import * as dotenv from '@tinyhttp/dotenv' 
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { parse, serialize } from '@tinyhttp/cookie'

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
    // console.log(trackId)
    // console.log(options)
    var trackUrl = 'https://api.spotify.com/v1/tracks/' + trackId + '?market=NL'
    return fetch(trackUrl, options).then(res => res.json())
  });

  return Promise.all(trackObjects)
}

function createPlaylistObject(playlistIds, options) {
  const playlistObjects = playlistIds.map((playlistId) => {
    // console.log(playlistId)
    // console.log(options)
    var playlistUrl = 'https://api.spotify.com/v1/playlists/' + playlistId + '?market=NL'
    return fetch(playlistUrl, options).then(res => res.json())
  });

  return Promise.all(playlistObjects)
}

function createQueueObject(options) {
  var queueUrl = 'https://api.spotify.com/v1/me/player/queue'
  return fetch(queueUrl, options).then(res => res.json())
  // const queueObjects = 
}

function createRecentlyPlayedObject(options) {
  var recentlyPlayedUrl = 'https://api.spotify.com/v1/me/player/recently-played?limit=15'
  return fetch(recentlyPlayedUrl, options).then(res => res.json())
}

app.get('/', async (req, res) => {
    if (req.cookies.access_token) {
      const trackIds = [
        '0Rv6Qk5lM1krVa8vWyrATj',
        '27IxsagisMzK85kLiG3Ham',
        '2Ys7qaDAMTbgmHZRJxmeBZ',
        '2vXXwb50oBHXzguiX5rh7p',
        '48pSdEaap5rLkSmWjScQQS',
        '0uHrMbMv3c78398pIANDqR',
        '6YHtcC9r1TQ4NDEVqu84KM',
        '3bzay4OfqLDujCzt2SnYQe',
        '3ZGY7R6XLdlUMpA2uR2NGa',
        '5ODeLdBfyPQj4f1nDJEbmE',
        '7CGY0SjXwObMWabcUuihUD',
        '4FeeQcxvLYNJN923fgp0zz',
        '76EpojR09zjVX00daVTxsM',
        '7E361kU543bSeuqOgNNZsX',
        '7dflWTlUpZ9fslrNIXB5eG',
        '3PNMhWdZ8WTaNLHHA7A9qX',
        '2fV1pNG8V7D60qNljC5Jcb',
        '3389Xco9E7PuZqNwEHTXPE',
        '4N0Y6CKJKDBOSAmJe0UJmc',
        '3mINB5AjmLGWMtqe9AtRmD',
        '6VgggntPiIzuQjt5iLSojV',
        '4mMup4UphNpkvEf98V3Pzy',
        '3aunNpSWTsWKkkjVU5QZlF',
        '2Ja6dTeqsDx8YFAR1ojmpx',
        '5pgQRiuJ0dKnimS6wkpNfA',
        '6XK6qCTQgLT0FiyFqq7BIO',
        '44VVjvGpTO2RhGRx0MKxZo',
        '4uRbp37AtiweQtd4Ov7om3',
        '3iWjps0VuLY8m0DcWXB4kz',
        '5uBTDwpgkR7NPUAtucEGmW',
        '4Tz5h4M9dEVTJPk1x2kImp',
        '2qVUv3F22WBqWFjbbTNB6r',
        '0VP8dYPm6cytBsj7zCy83r',
      ];

      const playlistIds = [
        '37i9dQZEVXbi9CZwpH1kj4',
        '557OhUWEAHkqKsdXJgQ5Zt',
        '2BX34DOcDREOf1ymxnAi0M',
        '3acn3tYRdInXICKkWtBdkv',
        '4DyGdxFYRkV76utcwiseTQ',
        '4zHDt33wIOJrK9XGpTq7aj',
        '5x7ab2yisuqH8ZTxeIkeny',
        '7pu2LlALXtTH6N75XKDpcd',
        '6hsoaqOXnkqRFIIRvQnH9R',
        '7u2pYDnhUA4b3QI8z4BCSb',
        '5enmmCmKB0p3CSb1jI3zL6',
        '6l8BRHX0I4vvpXTc8WYc1s',
        '37i9dQZF1EJsVN1kGVg5Ey',
        '74muPbcmDAMaqX4nsG3omF',
        '5WauXfTccc7nGwtbo081bM',
        '7IKXHFHKPPi45G8TPYBWbP',
        '3HUceOyFMFfta1ZwHUArOP',
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

        const tracks = await createTrackObjects(trackIds, options)

        const playlists = await createPlaylistObject(playlistIds, options)

        const queue = await createQueueObject(options)

        const recentlyPlayed = await createRecentlyPlayedObject(options)

        console.log(recentlyPlayed)

        // const tracks = ''

        // const playlists = ''

        // const queue = ''

        // const recentlyPlayed = ''


        const profile_name = req.cookies.profile_name

        // console.log(tracks)

        // const playlisturl = 'https://api.spotify.com/v1/playlists/557OhUWEAHkqKsdXJgQ5Zt?market=NL';
      
        // fetch(playlisturl, options)
        // .then(response => {
        //   // Check if the response is successful (status code 200)
        //   if (response.ok) {
        //     // Parse the JSON response
        //     return response.json();
        //   } else {
        //     // If the response is not successful, throw an error
        //     throw new Error('Failed to fetch data');
        //   }
        // })
        // .then(playlistdata => {
        //   // console.log(playlistdata)
        //   playlist_name = playlistdata.name
        //   // console.log(playlistdata.tracks.items[0])
        //   playlist_cover = playlistdata.images[0].url
  
        // })

      return res.send(renderTemplate('views/index.liquid', {title: 'Dopify', accessToken: true, tracks, playlists, queue, recentlyPlayed, profile_name}));
    } else if (!req.cookies.access_token) {
      return res.send(renderTemplate('views/index.liquid', {title: 'Dopify', accessToken: false}));
    }

});
// const createTrackObjects = async (trackUrls) => {
  
// }


app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-recently-played user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming';
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

          // console.log(response)
          // console.log(body)
  
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
            var profile_name = body.display_name;
            res.cookie('profile_name', profile_name, {maxAge: 86400 * 1000, httpOnly: false})
            res.redirect('/')
          });
          
          //res.cookie('display_name', body.display_name, {maxAge: 86400, httpOnly: true}) // 1 day
          
          // we can also pass the token to the browser to make requests from there
            
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
  res.clearCookie('profile_name')
  res.redirect('/')
})

const renderTemplate = (template, data) => {
    return engine.renderFileSync(template, data)
}
