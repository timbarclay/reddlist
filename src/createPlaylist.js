const RedditApi = require("./RedditApi")
const SpotifyApi = require("./SpotifyApi")
const Keys = require("../keys")

function createPlaylist (subreddit, playlist, limit) {
  const redditApi = new RedditApi(Keys.REDDIT_APP_ID, Keys.REDDIT_SECRET_KEY, Keys.REDDIT_USERNAME, Keys.REDDIT_PASSWORD)

  return SpotifyApi.newApi(Keys.SPOTIFY_APP_ID, Keys.SPOTIFY_SECRET_KEY, Keys.SPOTIFY_REFRESH_TOKEN)
    .then(spotifyApi => {
      redditApi.getTracks(subreddit, limit)
        .then(tracks => spotifyApi.searchSongUris(tracks))
        .then(uris => spotifyApi.replacePlaylist(playlist, uris))
    })
    .catch(err => {
      console.error(err)
    })
}

module.exports = createPlaylist