console.log('Script loaded successfully!');

// document.querySelector('#sendNotification').addEventListener("click", () => {
//   console.log('Dit bestaat dus wel, okay.')
//   if (Notification.permission === "granted") {
//     const notification = new Notification("Het werkt hoor!")
//   } else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         const notification = new Notification("Notificaties staan aan!");
//       }
//     })
//   }
// })  



function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null; // Return null if the cookie is not found
  }

  let device_id_var = null

  function playThisTrack(albumId, trackPosition) {
    const token = getCookie('access_token')

    // switch to Dopify on click
    // fetch('https://api.spotify.com/v1/me/player', {
    //   method: 'PUT',
    //   headers: {
    //       'Authorization': 'Bearer ' + getCookie('access_token'),
    //       'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //       "device_ids": [
    //           device_id_var
    //       ]
    //   })
    // })

    // play track 
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id_var, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'context_uri': 'spotify:album:' + albumId,
        "offset": {
          "position": trackPosition
        },
        'position_ms': 0
      })
    })

  }

  function playThisPlaylist(playlistId, trackPosition) {
    const token = getCookie('access_token')
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id_var, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'context_uri': 'spotify:playlist:' + playlistId + '?market=NL',
        "offset": {
          "position": trackPosition
        },
        'position_ms': 0
      })
    })

  }
  

  let previousTrack = null
  
  
  window.onSpotifyWebPlaybackSDKReady = () => {
    device_id_test = ""
    const token = getCookie('access_token');
      console.log(token)
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });
      console.log(player)
  
      // Ready
      player.addListener('ready', ({ device_id }) => {
        device_id_test = device_id
        device_id_var = device_id
        console.log('Ready with Device ID', device_id);
      });
  
      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
  
      player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });
  
    player.setName("Dopify").then(() => {
      console.log('Player name updated!');
    });
  
    player.addListener('player_state_changed', update);
  
    player.connect();
  
    function update(changedStateEvent) {
      // console.log(changedStateEvent);
      player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }
        //console.log(state)
        document.getElementById("album").src = state.track_window.current_track.album['images'][2]["url"];
        document.getElementById("trackname").innerHTML = state.track_window.current_track['name'];
        document.getElementById("artistname").innerHTML = state.track_window.current_track['artists'][0]['name'];

        const currentTrack = state.track_window.current_track;
        const trackTitleElement = document.getElementById('trackname');

        // Check if the current track is different from the previous track
        if (currentTrack && currentTrack.uri !== previousTrack) {
          trackTitleElement.textContent = currentTrack.name;
          fetch(currentTrack['artists'][0]['url'], {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
            },
          })
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
            if (Notification.permission === "granted") {     
              const trackNotification = new Notification(
                'Now playing: '.concat(currentTrack.name + ' from ' + currentTrack['artists'][0]['name']),{
                  //icon: currentTrack['artists'][0]['url'],
                  //icon: currentTrack.album['images'][2]["url"],
                  icon: data.images[0].url,
                  image: currentTrack.album['images'][2]["url"],
                  
                })
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  const trackNotification = new Notification(
                    'Now playing: '.concat(currentTrack.name + ' from ' + currentTrack['artists'][0]['name']),{
                      //icon: currentTrack['artists'][0]['url'],
                      //icon: currentTrack.album['images'][2]["url"],
                      icon: data.images[0].url,
                      image: currentTrack.album['images'][2]["url"],
                  })
                }
              })
            }
          })
          previousTrack = currentTrack.uri;
        }

        const test3 = document.getElementById('seek')
        test3.addEventListener('change', function() {
          const test = document.documentElement.style.getPropertyValue('--seek')
          // Dimitri K - Where Have You Been
          // Op de plek van 149940 moet de duratie van het liedje komen te staan en test dient als percentage tussen 0-100 voor hoe ver het liedje is.
          const timestamp = state.track_window.current_track['duration_ms'] * test
          //console.log(millisToMinutesAndSeconds(timestamp))
    
          player.seek(timestamp).then(() => {
            console.log('Changed position to '.concat(millisToMinutesAndSeconds(timestamp)));
            const timestampElement = document.getElementById('timestamp')
            timestampElement.textContent = millisToMinutesAndSeconds(timestamp)
          });
        })
      });
    }
  
    player.getVolume().then(volume => {
      let volume_percentage = volume * 100;
      console.log('The volume of the player is '.concat(volume_percentage + '%'));
    });
  
    const test2 = document.getElementById('volumeSlider')
    test2.addEventListener('change', function() {
      const test = document.documentElement.style.getPropertyValue('--volume')
      //console.log(test)
      player.setVolume(test).then(() => {
        console.log('Volume updated to '.concat(test * 100 + '%'));
      });
  });
  
    document.getElementById('togglePlay').onclick = function() {
      player.togglePlay();
    };

    document.getElementById('switchDevice').onclick = function() {
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "device_ids": [
                    device_id_test
                ]
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
          })
          .catch(error => {
            console.error('Request failed:', error);
          });       
    }
  
    // document.getElementById('pause').onclick = function() {
    //   player.pause().then(() => {
    //     console.log('Paused!')
    //   });
    // };
  
    // document.getElementById('resume').onclick = function() {
    //   player.resume().then(() => {
    //     console.log('Resumed!')
    //   });
    // };
  
    document.getElementById('next').onclick = function() {
      player.nextTrack().then(() => {
        console.log('Next!')
      });
    };
  
    document.getElementById('previous').onclick = function() {
      player.previousTrack().then(() => {
        console.log('Previous!')
      });
    };

    let repeatValue = 0
    let repeatState;
    document.getElementById('repeat').onclick = function() {
      if (repeatValue == 0) {
        console.log('Repeat 1')
        repeatState = 'context'
        repeatValue = repeatValue + 1
      } else if (repeatValue == 1) {
        console.log('Repeat 2')
        repeatState = 'track'

        repeatValue = repeatValue + 1
      } else if (repeatValue == 2) {
        console.log('Repeat 3')
        repeatState = 'off'

        repeatValue = repeatValue - 2
      }

      fetch('https://api.spotify.com/v1/me/player/repeat?state=' + repeatState + '&device_id=' + device_id_test, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token')
            },
        })   
    }

    let shuffleValue = 0
    let shuffleState;
    document.getElementById('shuffle').onclick = function() {
      if (shuffleValue == 0) {
        console.log('Shuffle 1')
        shuffleState = 'true'
        shuffleValue = shuffleValue + 1
      } else if (shuffleValue == 1) {
        console.log('Shuffle 2')
        shuffleState = 'false'
        shuffleValue = shuffleValue - 1
      } 

      fetch('https://api.spotify.com/v1/me/player/shuffle?state=' + shuffleState + '&device_id=' + device_id_test, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token')
            },
        })   
    }

    // document.querySelector('#sendNotification').addEventListener("click", () => {
    //   if (Notification.permission === "granted") {
    //     const notification = new Notification("Het werkt hoor!")
    //   } else if (Notification.permission !== "denied") {
    //     Notification.requestPermission().then((permission) => {
    //       if (permission === "granted") {
    //         const notification = new Notification("Notificaties staan aan!");
    //       }
    //     })
    //   }
    // })  


}
  
  