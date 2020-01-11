const snoowrap = require("snoowrap");
const axios = require("axios");
const Keys = require("./keys");
const package = require('./package.json');

const userAgent = `script:reddlist:v${package.version} (by /u/${Keys.REDDIT_USERNAME})`
const reddit = new snoowrap({
  userAgent: userAgent,
  clientId: Keys.REDDIT_APP_ID,
  clientSecret: Keys.REDDIT_SECRET_KEY,
  username: Keys.REDDIT_USERNAME,
  password: Keys.REDDIT_PASSWORD
});

const songRegex = /([\w\s]*)(?:\s-\s)([\w\s]*)/

const spotifyApi = axios.create({
  //baseURL: 'https://api.spotify.com/v1/',
  timeout: 1000,
  headers: {'Authorization': `Bearer ${Keys.SPOTIFY_ACCESS_TOKEN}`}
});

reddit.getSubreddit("progmetal").getHot({ limit: 50 })
  .then(res => res
    .filter(r => r.media)
    .map(r => r.title.match(songRegex)))
    .filter(r => !!r && r.length >= 3)
    .map(r => ({ band: r[1], title: r[2] }))
  .then(songs => {
    const first = songs[0]
    return spotifyApi.get(`https://api.spotify.com/v1/search?q=${first.band}+${first.title}&type=track&limit=1`)
  })
  .then(res => res.data)
  .then(search => {
    const track = search.tracks.items[0]
    // handle not found
    return track.uri
  })
  .then(trackUri => {
    return spotifyApi.put(`https://api.spotify.com/v1/playlists/${Keys.SPOTIFY_PLAYLIST_ID}/tracks`, {
      uris: [trackUri]
    })
  })
  .catch(err => {
    var a = err
  })
  