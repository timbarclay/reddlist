'use strict'

const createPlaylist = require("./src/createPlaylist")

module.exports.createPlaylist = (event, context, callback) => {
  const subreddit = event.subreddit
  const playlist = event.playlist
  const limit = event.limit || 50

  if (!subreddit) {
    callback("No subreddit provided", { success: false })
  }
  if (!playlist) {
    callback("No playlist provided", { success: false })
  }

  createPlaylist(subreddit, playlist, limit)
    .then(snapshot => {
      callback(null, { success: true, snapshot })
    })
    .catch(error => {
      callback(error, { success: false })
    })
};