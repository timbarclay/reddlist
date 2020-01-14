const RedditApi = require("./RedditApi")
const SpotifyApi = require("./SpotifyApi")

function createPlaylist (subreddit, playlist, limit, keys) {
  const redditApi = new RedditApi(keys.REDDIT_APP_ID, keys.REDDIT_SECRET_KEY, keys.REDDIT_USERNAME, keys.REDDIT_PASSWORD)

  return SpotifyApi.newApi(keys.SPOTIFY_APP_ID, keys.SPOTIFY_SECRET_KEY, keys.SPOTIFY_REFRESH_TOKEN)
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