var test = require('tape')
var routeOrder = require('..')

var routesUnsorted = [
  '/',
  '/:type/:ok',
  '/what/:up',
  '/cool/good/nice',
  'yo/ok'
]

var routesSortedNonasc = [
  '/cool/good/nice',
  'yo/ok',
  '/what/:up',
  '/:type/:ok',
  '/'
]

var routesSortedNondesc = routesSortedNonasc.slice(0).reverse()

test('happiness', function(t) {
  t.plan(1)
  t.ok(true === true, 'true is true')
})

test('can create comparator', function(t) {
  t.plan(2)
  t.ok(typeof routeOrder() !== 'undefined',
      'can create default comparator')
  t.ok(typeof routeOrder({order: 'nondescending'}) !== 'undefined',
      'can create nondescending comparator')
})

test('comparator functions correctly', function(t) {
  t.plan(2)
  var sortedNonasc = routesUnsorted.sort(routeOrder())
  t.deepEqual(sortedNonasc, routesSortedNonasc, 'can sort in nonascending order')
  var sortedNondesc = routesUnsorted.sort(routeOrder({order: 'nd'}))
  t.deepEqual(sortedNondesc, routesSortedNondesc, 'can sort in nondescending order')
})

// test('can sort regexp routes correctly', function(t) {
//   t.plan(1)
//   var routes = [
//     '^/$',
//     '/ok/?',
//     '/ok/[a-z]+',
//     '/:type.*'
//   ]
//   t.deepEqual(routes.sort(routeOrder()), [
//     '/ok/[a-z]+',
//     '/ok/?',
//     '/:type.*',
//     '^/$'
//   ], 'regexp routes don\'t mess stuff up')
// })

test('default routes sorted correctly', function(t) {
  t.plan(1)
  var routes = [
    'default',
    'hmm',
    '/',
    '/ok/cool'
  ]
  t.deepEqual(routes.sort(routeOrder({default: 'default'})), [
    '/ok/cool',
    'hmm',
    '/',
    'default'
  ], 'default route sematic is correct')
})

test('can differentiate between index and blank routes', function(t) {
  t.plan(1)
  var routes = [
    '',
    '/beep',
    '/'
  ]
  t.deepEqual(routes.sort(routeOrder()), [
    '/beep',
    '/',
    ''
  ], 'blank route is at tail position')
})
