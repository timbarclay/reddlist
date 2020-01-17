const snoowrap = require("snoowrap");
const packagejson = require('../package.json');

const songRegex = /(.*)(?:\s-\s)(.*)/

class RedditApi {
  constructor (appId, secretKey, username, password) {
    const userAgent = `script:reddlist:v${packagejson.version} (by /u/${username})`
    this.reddit = new snoowrap({
      userAgent: userAgent,
      clientId: appId,
      clientSecret: secretKey,
      username: username,
      password: password
    });
  }

  /**
   * Get a list of tracks based on the hot posts from a subreddit.
   * To be recognised as tracks, the posts must be links to youtube where the title matches the song regex
   * @param {string} subreddit 
   * @param {number} limit 
   */
  getTracks (subreddit, limit) {
    console.log(`Getting top ${limit} top tracks from /r/${subreddit}`)
    return this.reddit.getSubreddit(subreddit).getHot({ limit })
      .then(posts => {
        console.log(`Found ${posts.length} posts from /r/${subreddit}`)
        const tracks = RedditApi._getTrackPosts(posts)
        console.log(`Found ${tracks.length} tracks`)
        return tracks
      })
      .catch(err => {
        console.error("Getting tracks from reddit failed", err)
      })
  }

  static _getTrackPosts (posts) {
    return posts
      .filter(r => r.media)
      .map(r => this._parseTitle(r.title))
      .filter(r => !!r && r.length >= 3)
      .map(r => ({ band: r[1].trim(), title: r[2].trim() }))
  }

  /**
   * Apply the songRegex to the reddit post title. Also strip out stuff in brackets because they often denote live versions or other info that
   * will confuse Spotify
   * @param {String} title 
   */
  static _parseTitle (title) {
    return title
      .replace(/\([^\)]*\)/g, "") // remove bits in parentheses
      .replace(/\[[^\]]*\]/g, "") // remove bits in square brackets
      .match(songRegex)
  }
}

module.exports = RedditApi