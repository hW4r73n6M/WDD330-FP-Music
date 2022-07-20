let songs= []

function sectionDisplayControl(elem) {
    const trendy = 'trendy-section';
    const search = 'search-section';
    const playlist = 'playlist-section';
    if (elem == 'search-section') {
        document.getElementById(search).classList.add('visible');
        document.getElementById(search).classList.remove('hidden');
        document.getElementById(trendy).classList.remove('visible');
        document.getElementById(trendy).classList.add('hidden');
        document.getElementById(playlist).classList.remove('visible');
        document.getElementById(playlist).classList.add('hidden');
        console.log("1")
    } else if (elem == 'playlist-section') {
        document.getElementById(playlist).classList.add('visible');
        document.getElementById(playlist).classList.remove('hidden');
        document.getElementById(trendy).classList.remove('visible');
        document.getElementById(trendy).classList.add('hidden');
        document.getElementById(search).classList.remove('visible');
        document.getElementById(search).classList.add('hidden');
        console.log("2")
    } else if (elem == 'trendy-section') {
        document.getElementById(trendy).classList.add('visible');
        document.getElementById(trendy).classList.remove('hidden');
        document.getElementById(playlist).classList.remove('visible');
        document.getElementById(playlist).classList.add('hidden');
        document.getElementById(search).classList.remove('visible');
        document.getElementById(search).classList.add('hidden');
        console.log("3")
    }
};

addSongToPlaylist = (id) => {
    console.log('songs: ', songs)
    const song = songs.find(s => s.result.id == id)
    const rawPlaylist = localStorage.getItem("hhmusik_playlist.hits") || '[]';
    const playlist = JSON.parse(rawPlaylist);
    playlist.push(song)
    localStorage.setItem('hhmusik_playlist.hits', JSON.stringify(playlist));
}

showSongs = (songs, section) => {
    const sectionContainer = section + '-songs';
    songs.forEach(song => {
        document.getElementById(sectionContainer).insertAdjacentHTML("afterbegin",
            `<div class="col-6 space-divs"><div class="row"> <div class="col-6"> <img src="${song.result.song_art_image_thumbnail_url}" class="img-fluid rounded-image"> </div> <div class="col-6"> <h5 class="upper">${song.result.title}</h5> <h6>${song.result.artist_names}</h6> <span>${song.result.release_date_for_display}</span>  <br><br> <span><a href="${song.result.url}" target="_blank">Lyric and 30-second song ↗</a></span> <br><br> <span><button type="button" class="btn btn-outline-info" onclick="addSongToPlaylist('${song.result.id}')">+ Playlist</button></span> </div> </div></div>`);
    });
}

getSongsData = async (searchString, section) => {
    try {
        const newURL = 'https://genius.p.rapidapi.com/search?q=' + searchString;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b263d3b213msh95c825121fb3327p17d590jsna288e0c76ed5',
                'X-RapidAPI-Host': 'genius.p.rapidapi.com'
            }
        };

        let result = await fetch(newURL, options)
        result = await result.json()
        console.log('result: ', result)
        songs = result.response.hits;
        showSongs(songs, section)
    }catch (err) {
        console.error(err);
    }
}

function loadHomeData() {
    const section = 'trendy-section';
    const searchString = 'Celine Dion';
    sectionDisplayControl(section);
    getSongsData(searchString, section);
}

function loadSearchData() {
    const section = 'search-section';
    const searchString = document.getElementById("searchString").value;
    sectionDisplayControl(section);
    getSongsData(searchString, section);
}

function loadPlaylistData() {
    const section = 'playlist-section';
    sectionDisplayControl(section);
    const rawPlaylist = localStorage.getItem("hhmusik_playlist.hits");
    const playlist = JSON.parse(rawPlaylist);
    showSongs(playlist, section)
}

window.onload = function () {
    loadHomeData();
    document.getElementById("searchString").addEventListener("input", function () {
        if (this.value.length < 1) {
            document.querySelector('#search-btn').disabled = true;
        } else {
            document.querySelector('#search-btn').disabled = false;
        }
    });
    document.getElementById("home-link").addEventListener("click", loadHomeData);
    document.getElementById("search-btn").addEventListener("click", loadSearchData);
    document.getElementById("playlist-link").addEventListener("click", loadPlaylistData);

};
