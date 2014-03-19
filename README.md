# bespoke-notes
## Notes for [Bespoke.js](https://github.com/markdalgleish/bespoke.js) presentations

### Usage

```javascript
bespoke.plugins.notes = require('bespoke-notes');

bespoke.from(selector, {
  notes: true
});
```

Possible options:
```javascript
bespoke.from(selector, {
  notes: {
    key: 0x4e, // Key that toggles notes, default: 0x4e ('n' key)
    visible: false, // Whether to display notes on startup, default: false
    slideWidth: 840 // Slide width, default: 840
	}
});
```

Additionally notes display can be forced via `?notes` query in url search string

### Installation
#### npm

In your presentation path:

	$ npm install bespoke-notes
