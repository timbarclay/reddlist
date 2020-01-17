const RedditApi = require("../src/RedditApi")

describe("parse title", () => {
  it("parses post titles", () => {
    expect(RedditApi._parseTitle("Metallica - Battery")).toEqual(
      expect.arrayContaining(["Metallica - Battery", "Metallica", "Battery"]))
  })
  it("ignores text in parentheses", () => {
    expect(RedditApi._parseTitle("Metallica - Battery (live in Rio)")).toEqual(
      expect.arrayContaining(["Metallica - Battery ", "Metallica", "Battery "]))
  })
  it("returns null for titles that are not in expected pattern", () => {
    expect(RedditApi._parseTitle("Discussion thread")).toEqual(null)
  })
})

describe("get track posts", () => {
  it("ignores non media posts", () => {
    const posts = [{ media: null, title: "Discussion thread" }]
    expect(RedditApi._getTrackPosts(posts).length).toEqual(0)
  })
  it("ignores media posts with titles that don't comply", () => {
    const posts = [{ media: { type: "youtube.com" }, title: "Discussion thread" }]
    expect(RedditApi._getTrackPosts(posts).length).toEqual(0)
  })
  it("extracts data from media posts", () => {
    const posts = [
      { media: { type: "youtube.com" }, title: "Metallica - Battery" },
      { media: { type: "youtube.com" }, title: "Rush - 2112 (Live in Slough) (bass cover)" },
      { media: { type: "youtube.com" }, title: "The Ocean - Bethyalpelagic II: The Wish In Dreams" },
      { media: { type: "youtube.com" }, title: "Venus in Fear - Twice as the Devil (oriental) [FFO: Orphaned Land, Dream Theater, Caligula's Horse]" },
      { media: { type: "youtube.com" }, title: "ENEMY AC-130 ABOVE - Prestige Elite" },
      { media: { type: "youtube.com" }, title: "Artificial Language - There's No Bottom to This" }
    ]
    expect(RedditApi._getTrackPosts(posts)).toEqual(expect.arrayContaining([
      { band: "Metallica", title: "Battery" },
      { band: "Rush", title: "2112" },
      { band: "The Ocean", title: "Bethyalpelagic II: The Wish In Dreams" },
      { band: "Venus in Fear", title: "Twice as the Devil" },
      { band: "ENEMY AC-130 ABOVE", title: "Prestige Elite" },
      { band: "Artificial Language", title: "There's No Bottom to This" }
    ]))
  })
})