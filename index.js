const Keys = require("./keys");
const RedditApi = require("./RedditApi")
const SpotifyApi = require("./SpotifyApi")

const redditApi = new RedditApi(Keys.REDDIT_APP_ID, Keys.REDDIT_SECRET_KEY, Keys.REDDIT_USERNAME, Keys.REDDIT_PASSWORD)

SpotifyApi.newApi(Keys.SPOTIFY_APP_ID, Keys.SPOTIFY_SECRET_KEY, Keys.SPOTIFY_REFRESH_TOKEN)
  .then(spotifyApi => {
    redditApi.getTracks("progmetal", 50)
      .then(tracks => spotifyApi.searchSongUris(tracks))
      .then(uris => spotifyApi.replacePlaylist(Keys.SPOTIFY_PLAYLIST_ID, uris))
  })
  .catch(err => {
    console.error(err)
  })
