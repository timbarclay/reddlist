const Keys = require("./keys")
const Config = require("./config")
const RedditApi = require("./RedditApi")
const SpotifyApi = require("./SpotifyApi")
const commandLineArgs = require('command-line-args')
const { optionDefs } = require("./cliOptions")

const options = commandLineArgs(optionDefs)

const subreddit = options.subreddit || Config.subreddit
const limit = options.limit || Config.limit || 50
const playlist = options.playlist || Config.playlist

if (!subreddit) {
  throw "No subreddit defined. Either pass one in using --subreddit or set one in config.js"
}
if (!playlist) {
  throw "No playlist ID defined. Either pass one in using --playlist or set one in config.js"
}

const redditApi = new RedditApi(Keys.REDDIT_APP_ID, Keys.REDDIT_SECRET_KEY, Keys.REDDIT_USERNAME, Keys.REDDIT_PASSWORD)

SpotifyApi.newApi(Keys.SPOTIFY_APP_ID, Keys.SPOTIFY_SECRET_KEY, Keys.SPOTIFY_REFRESH_TOKEN)
  .then(spotifyApi => {
    redditApi.getTracks(subreddit, limit)
      .then(tracks => spotifyApi.searchSongUris(tracks))
      .then(uris => spotifyApi.replacePlaylist(playlist, uris))
  })
  .catch(err => {
    console.error(err)
  })
