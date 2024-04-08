console.log('Script loaded successfully!');

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
      console.log(changedStateEvent);
      player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }
        console.log(state)
        document.getElementById("album").src = state.track_window.current_track.album['images'][2]["url"];
        document.getElementById("trackname").innerHTML = state.track_window.current_track['name'];
        document.getElementById("artistname").innerHTML = state.track_window.current_track['artists'][0]['name'];
  
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
  }
  