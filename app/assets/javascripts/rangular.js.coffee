resource = angular.module('railsResource', ["ngResource"])

railsRoutes =
  index:
    method: "GET"
    isArray: true
  show:
    method: "GET"
  new:
    method: "GET"
    params:
      verb: "new"
  create:
    method: "POST"
  edit:
    method: "GET"
    params:
      verb: "edit"
  update:
    method: "PUT"
  destroy:
    method: "DELETE"

resource.factory "Rails", ($resource) ->
  $resource "/:controller/:id/:verb", {id: '@id'}, railsRoutes

resource.factory "NestedRails", ($resource) ->
  $resource "/:parent/:parent_id/:child/:child_id/:verb", {child_id: '@id'}, railsRoutes


resource.directive 'railsController', ->
  link: (scope, element, attrs) ->
    hello

