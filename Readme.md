# route-sort

Comparator to compare URI route patterns by specificity.

Useful for Express apps, for example, to make sure more specific route
patterns are matched before more generic ones.

Acutally, currently only supports Express style routes. Could be expanded.

## Behaviour

- Deeper routes are more specific, e.g. `/base/id` > `/base`
- If the route has free variables, e.g. `/:id`, specificity
  is lower when more variables are towards the base of the path,
  e.g. `/:type/:id` < `/whatev/:id`

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
