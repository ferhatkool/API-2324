//console.log('hoi')

// Make a fetch request to the server to get data
fetch('/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Do something with the fetched data
        console.log('Fetched data:', data);
        
        //const body = document.querySelector('body')
        //const sound = document.createElement('video')
        //const source = document.createElement('source')
        //sound.setAttribute('controls', '')
        //sound.setAttribute('autoplay', '')
        //source.setAttribute('src', data.href)
        //source.setAttribute('type', 'audio/mpeg')
        //sound.appendChild(source)
        //console.log(body.appendChild(sound))

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

console.log('Script loaded successfully!');
