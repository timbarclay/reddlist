const Config = require("./config")
const commandLineArgs = require('command-line-args')
const { optionDefs } = require("./cliOptions")
const createPlaylist = require("./src/createPlaylist")
const keys = require("./keys")

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

createPlaylist(subreddit, playlist, limit, keys)
