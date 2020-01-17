const SpotifyApi = require("../src/SpotifyApi")

let spotifyApi = new SpotifyApi("123")

describe("match title", () => {
  it("matches exactly", () => {
    expect(spotifyApi._matchesTitle("Epipelagic", "Epipelagic")).toEqual(true)
  })
  it("matches case insensitively", () => {
    expect(spotifyApi._matchesTitle("la fuga", "La Fuga")).toEqual(true)
  })
  it("ignores non word characters", () => {
    expect(spotifyApi._matchesTitle("Bathyalpelagic I: Impasses", "Bathyalpelagic I Impasses")).toEqual(true)
  })

  it("matches if a contains b", () => {
    expect(spotifyApi._matchesTitle("2112: Overture / The Temples Of Syrinx / Discovery / Presentation / Oracle / Soliloquy / Grand Finale - Medley", "2112")).toEqual(true)
  })
  it("matches if b contains a", () => {
    expect(spotifyApi._matchesTitle("2112", "2112: Overture / The Temples Of Syrinx / Discovery / Presentation / Oracle / Soliloquy / Grand Finale - Medley")).toEqual(true)
  })
})