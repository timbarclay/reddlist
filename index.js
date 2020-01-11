const snoowrap = require("snoowrap");
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

reddit.getSubreddit("progmetal").getHot()
  .then(res => res
    .filter(r => r.media)
    .map(r => r.title.match(songRegex)))
    .filter(r => !!r && r.length >= 3)
    .map(r => ({ band: r[1], title: r[2] }))
  .then(songs => {
    
  })
  