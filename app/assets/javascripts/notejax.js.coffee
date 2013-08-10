#rangular = angular.module('rangular', ["ngResource"])
rangular = angular.module("Notejax", ["ngResource"])

railsRoutesSet =
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

rangular.factory "railsResource", ["$resource", ($resource) ->
  $resource("/:controller/:id/:verb", {id: '@id'}, railsRoutesSet)
]

rangular.directive 'raController', ["railsResource", (railsResource) ->
  (scope, element, attrs) ->
    scope.raController = attrs.raController
    scope.raId = null

    raIndex = ->
      scope.raIndex = railsResource.index(controller: scope.raController)

    raShowOrEdit = ->
      if scope.raId
        scope.raShow = railsResource.show(id: scope.raId, controller: scope.raController)
        scope.raEdit = railsResource.edit(id: scope.raId, controller: scope.raController)
      else
        scope.raShow = null
        scope.raEdit = null
        null

    raNew = ->
      scope.raNew = railsResource.new(controller: scope.raController)

    scope.raCreate = ->
      scope.raNew.$create(controller: scope.raController, ->
        raIndex()
        raNew()
      )

    scope.raUpdate = ->
      scope.raEdit.$update(id: scope.raId, controller: scope.raController, ->
        scope.raClearId()
        raIndex()
      )

    scope.raDelete = (id) ->
      railsResource.delete(controller: scope.raController, id: id, ->
        raIndex()
      )

    scope.raClearId = ->
      scope.raId = null

    scope.raSetId = (id) ->
      scope.raId = id
      raShowOrEdit()

    raIndex()
    raNew()
]

