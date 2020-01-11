const snoowrap = require("snoowrap");
const packagejson = require('./package.json');

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
    return this.reddit.getSubreddit(subreddit).getHot({ limit })
      .then(res => res
        .filter(r => r.media)
        .map(r => r.title.match(songRegex)))
        .filter(r => !!r && r.length >= 3)
        .map(r => ({ band: r[1], title: r[2] }))
      .catch(err => {
        console.error("Getting tracks from reddit failed", err)
      })
  }
}

module.exports = RedditApi