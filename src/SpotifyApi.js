const axios = require("axios");
const qs = require('querystring')

class SpotifyApi {
  constructor (accessToken) {
    this.spotifyApi = axios.create({
      baseURL: "https://api.spotify.com/v1/",
      timeout: 1000,
      headers: { Authorization: `Bearer ${accessToken}`}
    });
  }

  /**
  * Search for a list of songs on Spotify and get their Uris
  * @param {Array<object>} songs 
  * @returns {Promise<string>}
  */
  searchSongUris (songs) {
    console.log(`Searching Spotify for ${songs.length} tracks`)
    const searches = songs.map(s => this.spotifyApi.get(`search?q=${s.band}+${s.title}&type=track&limit=1`))
    return Promise.all(searches)
      .then(responses => responses.map(r => r.data))
      .then(results => {
        const uris = results
          .filter(r => r.tracks.total > 0)
          .map(r => r.tracks.items[0])
          .map(t => t.uri)
        console.log(`Found ${uris.length} songs on Spotify`)
        return uris
      })
      .catch(err => {
        console.log("Searching Spotify for songs failed", err)
      })
  }

  /**
   * Replace the contents of a Spotify playlist with a list of tracks
   * @param {string} playlistId Id of the playlist to update
   * @param {Array<string>} uris Uris of the tracks to put in the playlist
   */
  replacePlaylist (playlistId, uris) {
    console.log(`Replacing contents of playlist ${playlistId} with ${uris.length} tracks`)
    return this.spotifyApi.put(`playlists/${playlistId}/tracks`, { uris })
      .then(() => {
        console.log("Playlist saved")
      })
      .catch(err => {
        console.error("Updating playlist failed", err)
      })
  }

  /**
   * Construct a new Spotify Api with a newly refresh access token
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {string} refreshToken
   * @returns {SpotifyApi}
   */
  static newApi (clientId, clientSecret, refreshToken) {
    const basicAuth = `${clientId}:${clientSecret}`
    const basicAuth64 = Buffer.from(basicAuth).toString('base64');
    const params = {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }
    console.log("Refreshing Spotify access token")
    return axios.post("https://accounts.spotify.com/api/token", qs.stringify(params), {
      headers: {
        Authorization: `Basic ${basicAuth64}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(res => new SpotifyApi(res.data.access_token))
      .catch(err => {
        console.error("Refreshing Spotify token failed", err)
      })
  }
}

module.exports = SpotifyApi;
