const snoowrap = require("snoowrap");
const packagejson = require('../package.json');

const songRegex = /([\w\s]*)(?:\s-\s)([\w\s]*)/

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
        const tracks = this._getTrackPosts(posts)
        console.log(`Found ${tracks.length} tracks`)
        return tracks
      })
      .catch(err => {
        console.error("Getting tracks from reddit failed", err)
      })
  }

  _getTrackPosts (posts) {
    return posts
      .filter(r => !!r.media)
      .map(r => r.title.match(songRegex))
      .filter(r => !!r && r.length >= 3)
      .map(r => ({ band: r[1], title: r[2] }))
  }
}

module.exports = RedditApi