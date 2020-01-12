[Donate](https://paypal.me/timrbarclay?locale.x=en_GB)

# Reddlist

A CLI app for populating a Spotify playlist with tracks from the hot posts of a subreddit.

## What it does

Running the app will query reddit to find the n top posts from a given sub. From those it will attempt to find any song posts i.e. a post with a youtube link body and with a title that matches the pattern:

    band name - song title 

It will then query Spotify for each of those tracks and replace the contents of a nominated Spotify playlist with those tracks.

## Running locally

Make sure you have node and npm

* `git clone git@github.com:timbarclay/reddlist.git`
* `cd reddlist`
* `npm install`

Make a copy `keys.js.sample` at `keys.js` and then fill in the empty strings with your credentials for the reddit and Spotify APIs. How to do that is described below.

The app can be configured either by setting the values in `config.js` or by passing in command line options. You'll need the ID of an existing playlist that your account has permission to edit (make sure the Spotify API scope matches the public/private setting of the playlist) and a subreddit that is likely to have some song among its top posts.

Run the app

    node index.js -r progmetal -p <a playlist ID>

### Reddit API

Follow [https://github.com/reddit-archive/reddit/wiki/OAuth2](these instructions) to generate client ID and secret.

### Spotify API

Follow [https://blog.getpostman.com/2016/11/09/generate-spotify-playlists-using-a-postman-collection/](these instructions) to create a client ID and secret and then use those to generate an access token and refresh token using Postman. You'll need the `playlist-modify-public` scope if you want to target a public playlist or the `playlist-modify-private` to target a private one.

## Deployment

The repo contains a serverless config to deploy the app as an AWS lambda so it can be triggered on a schedule to update playlists regularly. You will need AWS credentials either saved in `~/.aws/credentials` or manually configured in serverless.

    npm run deploy

## To do

* Make song regex configurable to suit subs that have different post title conventions