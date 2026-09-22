# Rain on Glass

An interactive rainy window at night. Wipe the fogged glass with your hand, watch the city come into focus, and wait for it to steam back up while the storm rolls on.

**Try it live: [rain-on-glass-production.up.railway.app](https://rain-on-glass-production.up.railway.app)**

Built with Claude Opus 5.5 as a model capability test. One HTML file, no libraries, no images, no network requests. Everything you see and hear is generated in code.

Made by [@hixonstudio](https://x.com/hixonstudio).

## What's in it

- **Real raindrops.** Every bead on the glass is a tiny lens that shows an upside-down image of the street. Beads stick until they grow heavy enough, then slide down in jerky runs, swallow smaller beads, and leave a trail behind them.
- **Condensation you can wipe.** The fog is on the inside of the glass. Press and drag to clear it. Water pushed to the edge of your stroke drips down and cuts thin channels, and the fog comes back in patches after a few seconds.
- **A living street.** Cars pass in both directions with headlights, tail lights and wet road reflections. Street lamps throw cones of light through the rain, and neon signs glow on wet walls.
- **A storm.** Faint lightning flickers every few seconds, with a close strike now and then that lights up the whole scene. Thunder follows each flash, rolling in later the farther away the strike is.
- **Sound.** Rain, drops tapping the glass, the squeak of your hand, and thunder, all synthesized with the Web Audio API.

## Controls

| Input | Action |
| --- | --- |
| Press and drag | Wipe the glass |
| `M` | Mute or unmute sound |
| `R` | Fog the glass back up |
| `H` | Hide all text, for clean screen recordings |

Sound starts on your first click, since browsers block audio until you interact with the page.

## Run it yourself

Open `index.html` in any modern browser. That's it.

To serve it the way the live site does:

```bash
npm start
```

Then visit `http://localhost:3000`. The server (`server.js`) has no dependencies and reads the `PORT` environment variable, so it deploys to Railway or any Node host as is.

## Build your own with AI

[`PROMPT.md`](PROMPT.md) is a complete, clean prompt that describes this demo in enough detail for Claude (or another capable coding model) to recreate it from scratch. Paste it in, and tweak whatever you like: a different city, snow instead of rain, daytime, your own cursor.

## Requirements

A browser with WebGL2 (every current version of Chrome, Edge, Firefox and Safari). Works with a mouse, a trackpad or touch.

## License

[MIT](LICENSE). Use it, remix it, ship it.
