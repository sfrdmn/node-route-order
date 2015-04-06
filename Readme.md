# route-sort

[![build status](https://secure.travis-ci.org/sfrdmn/node-route-order.png)](http://travis-ci.org/sfrdmn/node-route-order)

Comparator to compare URI route patterns by specificity.

Useful for Express apps, for example, to make sure more specific route
patterns are matched before more generic ones.

Acutally, currently only supports Express style routes. Could be expanded.

## API

Where `var routeOrder = require('route-order')` routeOrder accepts the following
configuration options:

- **order**: May be `'nonascending'` or `'na'` or `'nondescending'` or `'nd'`
- **default**: If supplied, the string to determine a catchall route, i.e. route
  with lowest priority. Defaults to an empty string.

## Behaviour

- Deeper routes are more specific, e.g. `/base/id` > `/base`
- If two routes have the same depth, specificity is then determined
  by the position of its bound parts, i.e. the position of parts which don't
  have a free variable like `/:id`. The more and the deeper the bound parts,
  the more specific.

## Usage

```Javascript
// Require returns a higher order function which accepts config and
// returns a comparator function
var routeOrder = require('route-order')

var routes = [
  '/',
  '/resource/:name',
  '/resource/doggy'
]

// Sorts in nonascending order by default
routes.sort(routeOrder())
// returns ['/resource/doggy', '/resource/:name', '/']
```

With Express:

```Javascript
var express = require('express')
var specificity = require('route-order')()
var app = express()

var views = {
  '/': IndexView,
  '/resource/doggy': DoggyView,
  '/resource/:name': ResourceView
}

Object.keys(views)
    .sort(specificity)
    .forEach(function(route) {
      app.use(route, views[route])
    })
```

## License

MIT
