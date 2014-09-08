# bespoke-notes
## Notes for [Bespoke.js](https://github.com/markdalgleish/bespoke.js) presentations

Use cases:

- Publish slides with notes to those who were not able to see the presentation
- Write notes for presentation, and present it on two screens (with help of [bespoke-sync](https://github.com/medikoo/bespoke-sync)):  
Audience screen:                      Your screen:

<img src="presentation.gif" />

See [Asynchronous JavaScript Interfaces](http://medikoo.com/asynchronous-javascript-interfaces/?notes) presentation for demo

### Usage

```javascript
notes = require('bespoke-notes');

bespoke.from(selector, [
  notes()
]);
```

Possible options:
```javascript
bespoke.from(selector, [
  notes({
    key: 0x4e, // Key that toggles notes, default: 0x4e ('n' key)
    visible: false, // Whether to display notes on startup, default: false
    slideWidth: 800 // Slide width, default: 800
  })
]);
```

Additionally notes display can be forced via `?notes` query in url search string

### Installation
#### npm

In your presentation path:

	$ npm install bespoke-notes
