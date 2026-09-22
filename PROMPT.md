# Build prompt

Paste everything below the line into Claude (or any capable coding model) to have this demo built from scratch. It describes the finished result precisely, so the model can recreate it without seeing this repo.

---

Build a single self-contained `index.html` (no build step, no external images, no libraries, no network requests) that recreates the experience of looking out through a rainy, fogged-up window at night. It must run by double-clicking the file in Chrome, Edge, Firefox or Safari. Use WebGL2 for rendering and plain JavaScript. Aim for photographic realism, then check your work in a browser and fix anything that looks fake.

## The scene outside

Paint the view once into an offscreen 2D canvas, then build three focus layers from it with `ctx.filter = 'blur()'`: sharp (about 1px), mid (about 5px) and heavy (about 34px), all scaled to screen height. Paint the scene into a canvas padded on every side and crop the center, so blurred edges never darken or shift out of line with the sharp layer.

- A night sky: near-black blue at the top fading to a warm sodium-orange glow at the horizon, with a soft cloud layer lit from below by the city.
- Two layers of city skyline: distant low towers and nearer tall blocks, with a grid of lit windows in mixed warm and cool colors, some rows fully dark, and the odd rooftop antenna.
- Three neon signs (pink, cyan, orange) that also cast a colored glow on the wall behind them.
- A wet street: dark asphalt, a curb line, and street lamps every fifth of the width. Each lamp has a pole and arm with a warm edge where the light catches them, a glowing head, a visible cone of light falling through the rain, an oval pool of light on the pavement, and long vertical reflections stretching down the wet road.
- One traffic light with a green glow and reflection. Neon colors smear down the wet street as vertical reflections too.

Animated in the shader, on top of the painted layers:

- **Cars seen from the side**, in two lanes going opposite ways, with the far lane smaller and slower. Each car has a rounded lower body, a cabin with dark windows, and two wheels. The street lamps light the roofline as a car passes under them. Each car has a white-warm headlight at the front that throws an elongated beam onto the road ahead, and a red tail light at the back that brightens now and then as if braking. Both lights leave vertical reflections in the wet asphalt. Cars blur along with the fog.
- **Rain falling** through the street light: three depth layers of thin, slightly slanted streaks, brightness modulated by how lit the scene behind them is.

## Rain on the outside of the glass

Simulate drops on a 2D canvas (the "water map") and pass it to the shader as a texture. Draw every drop with one pre-rendered sprite that encodes the surface normal in R and G, height in B and coverage in A.

- A dense layer of tiny mist droplets builds up over time on its own canvas and slowly evaporates, so it never saturates.
- Larger beads land at random and merge with any bead they hit. Beads stay pinned until they grow past a critical radius (about 5 CSS px), then slide down in jerky stop and start motion, as a real contact line catches and releases.
- A sliding bead speeds up with its size, wanders slightly sideways, stretches vertically as it moves, swallows the smaller beads in its path, wipes a clear track through the mist, and leaves a trail of tiny beads behind it while losing mass. When it shrinks enough it stops.
- Cap the bead count and evaporate the oldest small ones.
- Pre-soak the glass at load so it looks like it has been raining for a while. Vary rain intensity slowly over time.

In the shader, render each bead as a lens. Sample the scene at `uv - normal * k` so the bead shows a small inverted image of the street. Add a dark refractive rim, a bright caustic crescent at the bottom of the bead, and a small specular highlight from a top-left light. Beads behind fog are blurred and milky.

## Condensation on the inside, and wiping it

The fog is on the inside of the glass. Keep a low-resolution Float32 "clear map" (one cell per 3 CSS px), uploaded each frame as an R8 texture.

- Fogged glass is milky: sample the heavy blur layer, lower the contrast, lift the blacks with a cool scattering tint, and add fine micro-droplet grain. Make it slightly denser toward the bottom and the edges of the pane, where the glass is colder.
- Press and drag to wipe. Stamp a soft round brush (radius about 36 CSS px) along the pointer path with tight spacing. Stamps set the cell to at least 1.9, a "hold" value above 1 that keeps the area clear for a few seconds before the fog returns.
- The clear value decays by about 0.15 per second, so an area stays clear for about 5 seconds and is fully fogged again after about 13. In the shader, subtract fbm noise before the threshold so the fog comes back in patches, like real condensation, rather than as a flat fade. Keep any finger streak texture very faint, or it shows up as stripes as the fog returns.
- Water pushed to the rim of a stroke sometimes gathers into a drip. Drips run down slowly with the same stop and start pinning, wander a little, shrink, expire after 5 to 11 seconds, and cut a thin continuous clear channel through the fog. Stamp every half cell along each frame's movement so fast drips do not leave dashed gaps.
- Wiping clears only the inside fog. Outside raindrops stay, and look crisp through the cleared glass.

## Lightning and thunder

- Faint, distant flickers come every 6 to 16 seconds. About 3 in 10 flashes are a close strike, followed by a longer gap. The first flash comes within about 8 seconds of loading.
- A flash is one to five quick pulses. It lights up the whole scene, not just the sky: the sky blazes with slightly noisy cloud structure, buildings become silhouettes, the street picks up a cold wash, the rain streaks light up, and the fog on the glass glows because it scatters the light.
- Thunder follows every flash. Distant flickers get a quiet low rumble 2.5 to 5.5 seconds later. Close strikes get a sharp crack almost right away, then several overlapping low rumbles rolling off over a few seconds.

## Sound (Web Audio, starts on the first click)

Generate everything from one looping pink noise buffer:
- A rain bed (high-pass around 220 Hz, low-pass around 3200 Hz) whose volume follows rain intensity.
- Short band-passed ticks when big drops land, with a rate limit.
- A soft band-passed squeak while wiping, with volume tied to pointer speed.
- The thunder described above, all low-passed filtered noise.

`M` toggles mute.

## Frame, cursor and interface

- A dark painted wooden window frame drawn in CSS: an inset bevel, a rubber seal line, inner shadows, and a deeper sill at the bottom. Add a faint warm reflection of the room on the glass and a gentle vignette plus film grain.
- Hide the system cursor and replace it with a **cartoon white glove** drawn as inline SVG, with a thick dark outline, a cuff and a soft drop shadow. While hovering it is a pointing hand with the hotspot at the fingertip. On press it springs into an open palm (hotspot at the palm center, sized to match the wipe brush, with a few water drops on the glove) and tilts with horizontal drag speed. It hides when the pointer leaves the window.
- Top left: a small label, "Rain on Glass". Top right: two frosted pill links, a GitHub logo with "Open source" linking to the repo, and an X logo with the creator's handle. Clicking a link must not start a wipe. On narrow screens show icons only.
- Bottom center: "Press and drag to wipe the glass", which fades out after the first wipe. Bottom right: "M sound · R re-fog · H hide text". `R` fogs the glass back up right away. `H` hides all text and links for clean screen recordings.

## Quality bar

- Handle resize (debounced) by rebuilding the layers and the simulation. Cap the device pixel ratio at 2, and scale drop sizes so they look the same on any screen.
- Keep the rain density identical on every screen: scale the pre-soak counts, spawn rates and bead cap by the glass area in CSS pixels, never by canvas pixels. A phone must look exactly as foggy as a desktop, not covered in extra beads.
- Safari (every iPhone) ignores `ctx.filter`, so feature-detect it by blurring a single white pixel and checking that the light spread. When it is missing, build the same gaussian by hand (three box blurs, big radii at reduced resolution), or iPhones will show a sharp city through thin fog.
- On portrait screens, paint a landscape-width street (at least 1.25 times the height) and show the middle slice, so buildings, lamps and cars keep their real proportions.
- Support touch through pointer events, with `touch-action: none`.
- Show a friendly message if WebGL2 is unavailable.
- Before calling it done, open it in a real browser, wipe, wait for the fog to return, watch a lightning flash, and look closely at the drops, the cars and the fog edges. Fix anything that reads as fake: hard edges, stripes, banding, dotted trails, floating lights with no car attached.
