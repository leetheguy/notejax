var railsRoutesSet, rangular;

rangular = angular.module('rangular', ["ngResource"]);

railsRoutesSet = {
  index: {
    method: "GET",
    isArray: true
  },
  show: {
    method: "GET"
  },
  "new": {
    method: "GET",
    params: {
      verb: "new"
    }
  },
  create: {
    method: "POST"
  },
  edit: {
    method: "GET",
    params: {
      verb: "edit"
    }
  },
  update: {
    method: "PUT"
  },
  destroy: {
    method: "DELETE"
  },
  info: {
    method: "GET",
    params: {
      verb: "info"
    }
  }
};

rangular.config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  }
]);

rangular.factory("railsResource", [
  "$resource", function($resource) {
    return $resource("/:controller/:id/:verb", {
      id: '@id'
    }, railsRoutesSet);
  }
]);

rangular.directive('raController', [
  "railsResource", function(railsResource) {
    return function(scope, element, attrs) {
      var callShowAndEdit, rctrl;
      rctrl = attrs.raController;
      scope[rctrl] = {};
      scope[rctrl].query = attrs.raQuery === void 0 ? {} : eval('(' + attrs.raQuery + ')');
      scope[rctrl].query.controller = rctrl;

      scope[rctrl].callIndex = function(query) {
        scope[rctrl].indexLoading = true;
        if (query == null) {
          query = scope[rctrl].query;
        }
        query.id = null;
        scope[rctrl].index = railsResource.index(query, function() {
          scope[rctrl].indexLoading = false;
          scope.$broadcast(rctrl + '.index ready');
        }, function() {
          scope[rctrl].indexLoading = false;
        });
      };

      callShowAndEdit = function(query) {
        if (query == null) {
          query = scope[rctrl].query;
        }
        scope[rctrl].callShow(query);
        scope[rctrl].callEdit(query);
      };

      scope[rctrl].callShow = function(query) {
        if (query == null) {
          query = scope[rctrl].query;
        }
        if (!!scope[rctrl].id) {
          scope[rctrl].showLoading = true;
          query.id = scope[rctrl].id;
          scope[rctrl].show = railsResource.show(query, function() {
            scope[rctrl].showLoading = false;
            scope.$broadcast(rctrl + '.show ready');
          }, function() {
            scope[rctrl].showLoading = false;
          });
        } else {
          scope[rctrl].showLoading = false;
          scope[rctrl].show = null;
        }
      };

      scope[rctrl].callNew = function(query) {
        scope[rctrl].newLoading = true;
        if (query == null) {
          query = scope[rctrl].query;
        }
        if (!!!query.controller) {
          query.controller = rctrl;
        }
        scope[rctrl]["new"] = railsResource["new"](query, function() {
          scope[rctrl].createError = null;
          scope[rctrl].newLoading = false;
          scope.$broadcast(rctrl + '.new ready');
        }, function() {
          scope[rctrl].newLoading = false;
        });
      };

      scope[rctrl].callEdit = function(query) {
        if (query == null) {
          query = scope[rctrl].query;
        }
        if (!!!query.controller) {
          query.controller = rctrl;
        }
        if (!!scope[rctrl].id) {
          scope[rctrl].editLoading = true;
          query.id = scope[rctrl].id;
          scope[rctrl].edit = railsResource.edit(query, function() {
            scope[rctrl].updateError = null;
            scope[rctrl].editLoading = false;
            scope.$broadcast(rctrl + '.edit ready');
          }, function() {
            scope.$broadcast(rctrl + '.edit ready');
          });
        } else {
          scope[rctrl].editLoading = false;
          scope[rctrl].edit = null;
        }
      };

      scope[rctrl].callCreate = function(query) {
        scope[rctrl].createLoading = true;
        if (query == null) {
          query = scope[rctrl].query;
        }
        scope[rctrl]["new"].$create(query, function() {
          scope[rctrl].callNew();
          scope[rctrl].callIndex();
          scope[rctrl].createError = null;
          scope[rctrl].createLoading = false;
          scope.$broadcast(rctrl + '.create success');
        }, function(object) {
          scope[rctrl].createLoading = false;
          if (object.data) {
            scope[rctrl].createError = object.data;
          }
        });
      };

      scope[rctrl].callUpdate = function(query) {
        scope[rctrl].updateLoading = true;
        if (query == null) {
          query = scope[rctrl].query;
        }
        scope[rctrl]["edit"].$update(query, function() {
          scope[rctrl].callIndex();
          scope[rctrl].updateError = null;
          scope[rctrl].updateLoading = false;
          scope.$broadcast(rctrl + '.update success');
        }, function(object) {
          scope[rctrl].updateLoading = false;
          if (object.data) {
            scope[rctrl].updateError = object.data;
          }
        });
      };

      scope[rctrl].callDelete = function(id, query) {
        scope[rctrl].deleteLoading = true;
        if (query == null) {
          query = scope[rctrl].query;
        }
        if (!query.id) {
          query.id = id;
        }
        railsResource["delete"](query, function() {
          scope[rctrl].callIndex();
          scope[rctrl].deleteLoading = false;
          scope.$broadcast(rctrl + '.delete success');
        }, function() {
          scope[rctrl].deleteLoading = false;
        });
      };

      scope[rctrl].clearId = function() {
        scope[rctrl].id = null;
        callShowAndEdit();
      };

      scope[rctrl].setId = function(id) {
        if (id == null) {
          id = attrs.raShow;
        }
        scope[rctrl].id = id;
        callShowAndEdit();
      };

      scope[rctrl].callNew();
      if (!!!attrs.raShow) {
        scope[rctrl].callIndex();
        scope[rctrl].clearId();
      } else {
        scope[rctrl].setId();
      }
    };
  }
]);
