import * as dotenv from '@tinyhttp/dotenv' 
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import request from 'request'
import crypto from 'crypto'
import cors from 'cors'
import querystring from 'querystring'
import cookieparser from 'cookie-parser'

const test = dotenv.config({path:'../token.env'})
var client_id = process.env.client_id
var client_secret = process.env.client_secret
var redirect_uri = 'http://localhost:8500/callback'; // Your redirect uri

var access_token_temp = ''
var refresh_token_temp = ''

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

app
    .use(logger())
    .use('/', sirv('dist/assets'))
    .use(cors())
    .use(cookieparser())
    .listen(8500);
  
app.get('/', (req, res) => {
    //console.log(req);
    //console.log('yooo')
    //res.send('Hello World!');
    //console.log(access_token_temp)
    return res.send(renderTemplate('views/index.liquid', {
        title: 'Welkom', 
        access_token: access_token_temp, 
        refresh_token: refresh_token_temp
    }));
});

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email';
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
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
        
          //window.localStorage.setItem('access_token', access_token)
          console.log(access_token)
          access_token_temp = access_token
          console.log(refresh_token)
          refresh_token_temp = refresh_token

          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });
          
          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
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

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        res.send({
          'access_token': access_token,
          'refresh_token': refresh_token
        });
      }
    });
});

// Define a route to fetch and send data to the client
app.get('/data', async (req, res) => {
    try {
      // Define the URL for the Spotify API endpoint
      const url = 'https://api.spotify.com/v1/tracks/0Rv6Qk5lM1krVa8vWyrATj?market=NL';
  
      // Define the authorization token
      const token = "Bearer ".concat(access_token_temp);
  
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
          res.json(data)
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
