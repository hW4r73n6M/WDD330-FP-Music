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

function clearSection(divId)
{
    document.getElementById(divId).innerHTML = "";
}

addSongToPlaylist = (id) => {

    const song = songs.find(s => s.result.id == id)
    const rawPlaylist = localStorage.getItem("hhmusik_playlist.hits") || '[]';
    const playlist = JSON.parse(rawPlaylist);
    let exist = false;
    let songId = song.result.api_path;
    console.log("songId: ", songId);
    for (let i = 0; i < playlist.length; i++) {
        let playlistSong = playlist[i];
        console.log("playlistSong.result.api_path: ", playlistSong.result.api_path);
        if (playlistSong.result.api_path == songId) {
            exist = true;
        }
    }
    if (!exist) playlist.push(song);
    localStorage.removeItem('hhmusik_playlist.hits');
    localStorage.setItem('hhmusik_playlist.hits', JSON.stringify(playlist));
}

/*deleteSongFromPlaylist = (id) => {
    const song = songs.find(s => s.result.id == id)
    const rawPlaylist = localStorage.getItem("hhmusik_playlist.hits") || '[]';
    const playlist = JSON.parse(rawPlaylist);
    let songId = song.result.api_path;
    console.log("songId: ", songId);
    for (let i = 0; i < playlist.length; i++) {
        let playlistSong = playlist[i];
        console.log("playlistSong.result.api_path: ", playlistSong.result.api_path);
        if (playlistSong.result.api_path == songId) {
            delete playlist[i];
        }
    }
    localStorage.removeItem('hhmusik_playlist.hits');
    localStorage.setItem('hhmusik_playlist.hits', JSON.stringify(playlist));
    loadPlaylistData()
}*/


showSongs = (songs, section) => {
    const sectionContainer = section + '-songs';
    if (section === 'playlist-section') {
        songs.forEach(song => {
            document.getElementById(sectionContainer).insertAdjacentHTML("afterbegin",
                `<div class="col-6 space-divs"><div class="row"> <div class="col-6"> <img src="${song.result.song_art_image_thumbnail_url}" class="img-fluid rounded-image"> </div> <div class="col-6"> <h5 class="upper">${song.result.title}</h5> <h6>${song.result.artist_names}</h6> <span>${song.result.release_date_for_display}</span>  <br><br> <span><a href="${song.result.url}" target="_blank">Lyric and 30-second song ↗</a></span> <br><br>  </div> </div></div>`);
        });
    } else {
        songs.forEach(song => {
            document.getElementById(sectionContainer).insertAdjacentHTML("afterbegin",
                `<div class="col-6 space-divs"><div class="row"> <div class="col-6"> <img src="${song.result.song_art_image_thumbnail_url}" class="img-fluid rounded-image"> </div> <div class="col-6"> <h5 class="upper">${song.result.title}</h5> <h6>${song.result.artist_names}</h6> <span>${song.result.release_date_for_display}</span>  <br><br> <span><a href="${song.result.url}" target="_blank">Lyric and 30-second song ↗</a></span> <br><br> <span><button type="button" class="btn btn-outline-info" onclick="addSongToPlaylist('${song.result.id}')">+ Playlist</button></span> </div> </div></div>`);
        });
    }

}

getSongsData = async (searchString, section) => {
    try {
        const newURL = 'https://genius.p.rapidapi.com/search?q=' + searchString;
        console.log("URL: ", newURL);
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
    let section = 'trendy-section';
    let searchString = 'Celine Dion';
    sectionDisplayControl(section);
    getSongsData(searchString, section);
}

function loadSearchData() {
    let section = 'search-section';
    let searchString = document.getElementById("searchString").value;
    console.log("SEARCH: ", searchString);
    sectionDisplayControl(section);
    getSongsData(searchString, section);
}

function loadPlaylistData() {
    const section = 'playlist-section';
    sectionDisplayControl(section);
    let rawPlaylist = localStorage.getItem("hhmusik_playlist.hits");
    let playlist = JSON.parse(rawPlaylist);
    if(playlist != null) {
        clearSection('playlist-section-songs');
        showSongs(playlist, section)
    }
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
