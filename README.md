# discovery
NPM module for querying the DiscoveryGC API.

## Installation

```
npm install --save discoverygc
// OR
yarn add discoverygc
```

## Import

```js
// ES5
var Disco = require('discoverygc').default

var options = {
	key: "your api key here"
}

var disco = new Disco(options)
```

```js
// ESNext
import Disco from 'discoverygc'

const options = {
	key: "your api key here"
}

const disco = new Disco(options)
```

## Usage

### Options

When creating the instance of `disco` you can specify options in the constructor.

- `key`: Your api key. This is mandatory.
- `noFormat`: This will make every function return unformatted Discovery API object keys. These do not adhere to StandardJS style guidelines for naming functions.

### Functions

For unformatted outputs go look up the Discovery API docs.

All functions take callback and timeout (in ms) as their last two arguments.

If callback is undefined returns the data, otherwise calls the callback with data as the first argument.

All data related to time (aside from the timestamps) is provided as Strings, you need to parse it yourself.

#### `players([callback[, timeout]])`

Returns the current online player list.

```js
{
	players: {
		name: String,
		system: String,
		region: String,
		ping: Number.
		time: String
	},
	timestamp: Date
}
```

#### `factions([callback[, timeout]])`

Returns faction activity data.

`currentTime` and `lastTime` is activity for this month and previous month respectively.

```js
{
	factions: {
		tag: String,
		name: String,
		unofficial: Boolean,
		openTag: Boolean,
		currentTime: String,
		lastTime: String,
		danger: Boolean,
		id: Number
	}
	timestamp: Date
}
```

#### `allPlayers(page[, callback[, timeout]])`

Returns individual player statistics separated into pages sorted by activity.

`page` is required.

```js
{
	players: {
		name: String,
		currentTime: String,
		lastTime: String
	},
	lastPage: Number,
	timestamp: Date
}
```

## Examples

Log all online players into the console.

```js
//ES5 and callbacks
var Disco = require('discoverygc').default
var disco = new Disco({key: "potato"})

disco.players(data => {
	console.log(data)
})
```

```js
//ES6, CommonJS and promises
const Disco = require('discoverygc').default
const disco = new Disco({key: "potato"})

disco.players().then(data => console.log(data))
```

```js
//ESNext, imports and async-await
import Disco from 'discoverygc'
const disco = new Disco({key: "potato"})

;(async function() {
	console.log(await disco.players())
})()
```

Log all unofficial faction names.

```js
import Disco from 'discoverygc'
const disco = new Disco({key: "potato"})

;(async function() {

	// We're not using a callback, but we want a timeout of 5 seconds.
	// We need await because the request is asynchronous.
	let data = await disco.factions(null, 5000)	

	// First we will filter out all factions we aren't interested in.
	let factions = data.factions.filter(faction => {
		// We check if the faction is unofficial and if it isn't an open tag.
		if(faction.unofficial && !faction.openTag) return true
	
	// Next we flatten the objects to just strings of their names.
	}).map(faction => {
		return faction.name
	})

	// Finally we log the faction names.
	console.log(factions)
	
})()

```
