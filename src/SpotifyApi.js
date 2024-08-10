const axios = require("axios");
const FuzzySet = require("fuzzyset.js")

const FUZZY_CUTOFF = 0.6
const nonWordRegex = /[^\w\s]/g

class SpotifyApi {
  constructor (accessToken) {
    this.spotifyApi = axios.create({
      baseURL: "https://api.spotify.com/v1/",
      timeout: 10000,
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
    const searches = songs
      .filter(s => !!s.band && !!s.title)
      .map(s => {
        const q = `${s.band} ${s.title}`.replace(nonWordRegex, "")
        return this.spotifyApi.get(`search?q=${q}&type=track&limit=10`)
      })
    return Promise.all(searches)
      .then(responses => responses.map(r => r.data))
      .then(results => {
        const uris = results
          .map((result, i) => ({ result, search: songs[i] }))
          .filter(r => r.result.tracks.total > 0)
          .map(r => {
            const match = this._bestMatch(r)
            if (match) {
              console.log(`Searched for: ${r.search.band} - ${r.search.title}. Found: ${match.artists[0].name} - ${match.name}`)
            } else {
              console.warn(`Searched for: ${r.search.band} - ${r.search.title}. Failed to find a match among results`)
            }
            return match
          })
          .filter(r => !!r)
          .map(t => t.uri)
        console.log(`Found ${uris.length} songs on Spotify`)
        return uris
      })
      .catch(err => {
        console.log("Searching Spotify for songs failed", err)
      })
  }

  /**
   * Find the item from among the search results that best matches the track being searched for
   * @param {Object} searchAndResult
   */
  _bestMatch ({search, result}) {
    const tracks = result.tracks.items
    
    // The simplest case is that the first result matches the search perfectly
    if (tracks.length === 1 || this._matchesTitle(tracks[0].name, search.title)) {
      return tracks[0]
    }

    // If not, we need to try a bit harder. This often happens in cases where the track name is also the album title so the search returns all the
    // album tracks in order
    const titleMatch = tracks.find(t => this._matchesTitle(t.name, search.title))
    if (titleMatch) {
      return titleMatch
    }

    // If simple string matching didn't find anything, try fuzzy searching. This should attempts to handle cases where the reddit post has misspelled
    // the title or written it in a way that doesn't match Spotify's catalogue
    const matchSet = FuzzySet(tracks.map(t => t.name))
    const matchResult = matchSet.get(search.title)

    if (matchResult && matchResult.length >= 1 && matchResult[0][0] > FUZZY_CUTOFF) {
      const titleMatch = matchResult[0][1]
      return tracks.find(t => t.name === titleMatch)
    } else {
      // If none of that worked there's not much else we can do
      return null
    }
  }

  /**
   * Check if two versions of a title match. A match means they are the same or either one contains the other. This is intended to handle cases like
   * 2112 where a post title is likely to call it 2112, but the actual title is 2112: Overture / The Temples of Syrinx / Discover...
   * @param {String} a 
   * @param {String} b 
   */
  _matchesTitle(a, b) {
    const prepareStr = str => str.trim().toLowerCase().replace(/\W/g, "")

    const aLower = prepareStr(a)
    const bLower = prepareStr(b)

    return aLower === bLower || aLower.includes(bLower) || bLower.includes(aLower)
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
    const params = new URLSearchParams()
    params.set("grant_type", "refresh_token")
    params.set("refresh_token", refreshToken)
    
    console.log("Refreshing Spotify access token")
    return axios.post("https://accounts.spotify.com/api/token", params.toString(), {
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
