var path = require('path')

function createSpecificityComparator(options) {
  options = options || {}
  // Nonascending order flag, defaults to true
  var na
  if (options.order &&
      (options.order === 'nondescending' || options.order === 'nd'))
    na = false
  else
    na = true
  // Bit misleading: here we mean that the default route is ''
  var defaultRoute = options.default || ''

  return function specificityComparator(routeA, routeB) {
    routeA = routeA || ''
    routeB = routeB || ''
    // If it's the default route, push it all the way
    // over to one of the ends
    if (routeA === defaultRoute) {
      return na ? true : false
    // Also push index route down to end, but not past the default
    } else if (/^\/$/.test(routeA) && routeB !== defaultRoute) {
      return na ? true : false
    // Otherwise, sort based on either depth or free variable priority
    } else {
      var slicedA = path.normalize('/' + routeA + '/').split('/')
      var slicedB = path.normalize('/' + routeB + '/').split('/')
      var depthA = slicedA.length
      var depthB = slicedB.length
      if (depthA === depthB) {
        var weightA = freeVariableWeight(slicedA)
        var weightB = freeVariableWeight(slicedB)
        // More free variables and/or free variables closer
        // to root == more generic route
        return na ? weightA > weightB : weightA < weightB
      } else {
        // Greater depth == more specific route
        return na ? depthA < depthB : depthA > depthB
      }
    }
  }
}

/**
 * Takes a sliced path and returns an integer representing the
 * "weight" of its free variables. More specific routes are heavier
 *
 * Intuitively: when a free variable is at the base of a path e.g.
 * '/:resource', this is more generic than '/resourceName/:id' and thus has
 * a lower weight
 */
function freeVariableWeight(sliced) {
  return sliced.reduce(function(acc, part, i) {
    if (/^:.+$/.test(part)) {
      // Weight is positively correlated to index
      acc += i + 1
    }
    return acc
  }, 0)
}

module.exports = createSpecificityComparator
