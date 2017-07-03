"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define("todolist/adapters/application", ["exports", "ember-data"], function (exports, _emberData) {
	exports["default"] = _emberData["default"].JSONAPIAdapter.extend({
		namespace: "api/v1"
	});

	/* export { default } from 'ember-data-fixture-adapter'; */
});
define('todolist/app', ['exports', 'ember', 'todolist/resolver', 'ember-load-initializers', 'todolist/config/environment'], function (exports, _ember, _todolistResolver, _emberLoadInitializers, _todolistConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _todolistConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _todolistConfigEnvironment['default'].podModulePrefix,
    Resolver: _todolistResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _todolistConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define("todolist/controllers/index", ["exports", "ember"], function (exports, _ember) {
	exports["default"] = _ember["default"].Controller.extend({
		newTask: "",
		currentTask: null,
		isDisplayedAll: true,
		isDisplayedActive: false,
		isDisplayedCompleted: false,
		doNotShowEdit: false,
		addTaskError: "",
		lock: false,
		count: 0,
		total: 0,
		getCounter: function getCounter() {
			var count = 0,
			    total = 0;

			this.get('model').forEach(function (taskItem) {
				if (!taskItem.get('completed') && !taskItem.get('deleted')) {
					count++;
				}
				total = taskItem.get('id');
			});

			this.set('total', total);
			return count;
		},
		taskCompletedDidChange: (function () {
			var count = 0,
			    model = this.get('model');

			model.forEach(function (taskItem, index) {
				if (!taskItem.get('completed') && !taskItem.get('deleted')) {
					count++;
				}
			});
			this.set('count', count);
		}).observes('model.@each.completed'),
		actions: {
			saveTaskCompleted: function saveTaskCompleted(task) {
				task.save();
			},
			toggleTaskCompleted: function toggleTaskCompleted(task) {},
			addTask: function addTask() {

				var title = this.get('newTask'),
				    controller = this;

				this.set('lock', true);

				if (title === '') {

					this.set('addTaskError', 'Must have a title');
				} else {

					var total = parseInt(this.get('total')) + 1,
					    _name = 'todo-' + total;

					this.set('total', total);

					var task = this.get('store').createRecord('task', {
						name: _name,
						title: this.get('newTask'),
						editing: false,
						completed: false,
						deleted: false
					});

					this.set('newTask', '');
					this.set('addTaskError', '');

					task.save().then(function () {
						controller.set('lock', false);
					});
				}
			},
			showEdit: function showEdit(task) {

				if (!this.get('doNotShowEdit')) {

					this.get('model').forEach(function (taskItem) {
						taskItem.set('editing', false);
					});

					task.set('editing', true);
					this.set('currentTask', task);
				}
			},
			editTask: function editTask() {

				var title = this.get('currentTask').get('title'),
				    controller = this;

				this.set('lock', true);

				if (title === '') {

					this.get('currentTask').set('error', 'Must have a title');
					this.set('doNotShowEdit', true);
				} else {

					this.get('model').forEach(function (taskItem) {
						taskItem.set('editing', false);
					});

					this.get('currentTask').set('error', '');
					this.set('doNotShowEdit', false);

					this.get('currentTask').save().then(function () {
						controller.set('lock', false);
					});
				}
			},
			destroyTask: function destroyTask(task) {

				var controller = this;

				this.set('lock', true);
				task.set('deleted', true);

				if (!task.get('completed')) {
					var count = parseInt(this.get('count')) - 1;
					this.set('count', count);
				}

				this.get('store').findRecord('task', task.get('id'), { backgroundReload: false }).then(function (taskItem) {
					taskItem.destroyRecord();
					controller.set('lock', false);
				});
			},
			displayAll: function displayAll() {

				this.set('isDisplayedAll', true);
				this.set('isDisplayedActive', false);
				this.set('isDisplayedCompleted', false);
				this.set('count', this.getCounter());
			},
			displayCompleted: function displayCompleted() {

				this.set('isDisplayedAll', false);
				this.set('isDisplayedActive', false);
				this.set('isDisplayedCompleted', true);
				this.set('count', this.getCounter());
			},
			displayActive: function displayActive() {

				this.set('isDisplayedAll', false);
				this.set('isDisplayedActive', true);
				this.set('isDisplayedCompleted', false);
				this.set('count', this.getCounter());
			}
		}
	});
});
define('todolist/helpers/app-version', ['exports', 'ember', 'todolist/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _todolistConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _todolistConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('todolist/helpers/append', ['exports', 'ember-composable-helpers/helpers/append'], function (exports, _emberComposableHelpersHelpersAppend) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend['default'];
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend.append;
    }
  });
});
define('todolist/helpers/array', ['exports', 'ember-composable-helpers/helpers/array'], function (exports, _emberComposableHelpersHelpersArray) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray['default'];
    }
  });
  Object.defineProperty(exports, 'array', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray.array;
    }
  });
});
define('todolist/helpers/chunk', ['exports', 'ember-composable-helpers/helpers/chunk'], function (exports, _emberComposableHelpersHelpersChunk) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk['default'];
    }
  });
  Object.defineProperty(exports, 'chunk', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk.chunk;
    }
  });
});
define('todolist/helpers/compact', ['exports', 'ember-composable-helpers/helpers/compact'], function (exports, _emberComposableHelpersHelpersCompact) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact['default'];
    }
  });
  Object.defineProperty(exports, 'compact', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact.compact;
    }
  });
});
define('todolist/helpers/compute', ['exports', 'ember-composable-helpers/helpers/compute'], function (exports, _emberComposableHelpersHelpersCompute) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute['default'];
    }
  });
  Object.defineProperty(exports, 'compute', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute.compute;
    }
  });
});
define('todolist/helpers/contains', ['exports', 'ember-composable-helpers/helpers/contains'], function (exports, _emberComposableHelpersHelpersContains) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains['default'];
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains.contains;
    }
  });
});
define('todolist/helpers/dec', ['exports', 'ember-composable-helpers/helpers/dec'], function (exports, _emberComposableHelpersHelpersDec) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec['default'];
    }
  });
  Object.defineProperty(exports, 'dec', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec.dec;
    }
  });
});
define('todolist/helpers/drop', ['exports', 'ember-composable-helpers/helpers/drop'], function (exports, _emberComposableHelpersHelpersDrop) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop['default'];
    }
  });
  Object.defineProperty(exports, 'drop', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop.drop;
    }
  });
});
define('todolist/helpers/filter-by', ['exports', 'ember-composable-helpers/helpers/filter-by'], function (exports, _emberComposableHelpersHelpersFilterBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy['default'];
    }
  });
  Object.defineProperty(exports, 'filterBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy.filterBy;
    }
  });
});
define('todolist/helpers/filter', ['exports', 'ember-composable-helpers/helpers/filter'], function (exports, _emberComposableHelpersHelpersFilter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter['default'];
    }
  });
  Object.defineProperty(exports, 'filter', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter.filter;
    }
  });
});
define('todolist/helpers/find-by', ['exports', 'ember-composable-helpers/helpers/find-by'], function (exports, _emberComposableHelpersHelpersFindBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy['default'];
    }
  });
  Object.defineProperty(exports, 'findBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy.findBy;
    }
  });
});
define('todolist/helpers/flatten', ['exports', 'ember-composable-helpers/helpers/flatten'], function (exports, _emberComposableHelpersHelpersFlatten) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten['default'];
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten.flatten;
    }
  });
});
define('todolist/helpers/group-by', ['exports', 'ember-composable-helpers/helpers/group-by'], function (exports, _emberComposableHelpersHelpersGroupBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy['default'];
    }
  });
  Object.defineProperty(exports, 'groupBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy.groupBy;
    }
  });
});
define('todolist/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/has-next'], function (exports, _emberComposableHelpersHelpersHasNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext['default'];
    }
  });
  Object.defineProperty(exports, 'hasNext', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext.hasNext;
    }
  });
});
define('todolist/helpers/has-previous', ['exports', 'ember-composable-helpers/helpers/has-previous'], function (exports, _emberComposableHelpersHelpersHasPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'hasPrevious', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious.hasPrevious;
    }
  });
});
define('todolist/helpers/inc', ['exports', 'ember-composable-helpers/helpers/inc'], function (exports, _emberComposableHelpersHelpersInc) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc['default'];
    }
  });
  Object.defineProperty(exports, 'inc', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc.inc;
    }
  });
});
define('todolist/helpers/intersect', ['exports', 'ember-composable-helpers/helpers/intersect'], function (exports, _emberComposableHelpersHelpersIntersect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect['default'];
    }
  });
  Object.defineProperty(exports, 'intersect', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect.intersect;
    }
  });
});
define('todolist/helpers/invoke', ['exports', 'ember-composable-helpers/helpers/invoke'], function (exports, _emberComposableHelpersHelpersInvoke) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke['default'];
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke.invoke;
    }
  });
});
define('todolist/helpers/join', ['exports', 'ember-composable-helpers/helpers/join'], function (exports, _emberComposableHelpersHelpersJoin) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin['default'];
    }
  });
  Object.defineProperty(exports, 'join', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin.join;
    }
  });
});
define('todolist/helpers/map-by', ['exports', 'ember-composable-helpers/helpers/map-by'], function (exports, _emberComposableHelpersHelpersMapBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy['default'];
    }
  });
  Object.defineProperty(exports, 'mapBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy.mapBy;
    }
  });
});
define('todolist/helpers/map', ['exports', 'ember-composable-helpers/helpers/map'], function (exports, _emberComposableHelpersHelpersMap) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap['default'];
    }
  });
  Object.defineProperty(exports, 'map', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap.map;
    }
  });
});
define('todolist/helpers/next', ['exports', 'ember-composable-helpers/helpers/next'], function (exports, _emberComposableHelpersHelpersNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext['default'];
    }
  });
  Object.defineProperty(exports, 'next', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext.next;
    }
  });
});
define('todolist/helpers/object-at', ['exports', 'ember-composable-helpers/helpers/object-at'], function (exports, _emberComposableHelpersHelpersObjectAt) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt['default'];
    }
  });
  Object.defineProperty(exports, 'objectAt', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt.objectAt;
    }
  });
});
define('todolist/helpers/optional', ['exports', 'ember-composable-helpers/helpers/optional'], function (exports, _emberComposableHelpersHelpersOptional) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional['default'];
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional.optional;
    }
  });
});
define('todolist/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe-action'], function (exports, _emberComposableHelpersHelpersPipeAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipeAction['default'];
    }
  });
});
define('todolist/helpers/pipe', ['exports', 'ember-composable-helpers/helpers/pipe'], function (exports, _emberComposableHelpersHelpersPipe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe['default'];
    }
  });
  Object.defineProperty(exports, 'pipe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe.pipe;
    }
  });
});
define('todolist/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('todolist/helpers/previous', ['exports', 'ember-composable-helpers/helpers/previous'], function (exports, _emberComposableHelpersHelpersPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'previous', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious.previous;
    }
  });
});
define('todolist/helpers/queue', ['exports', 'ember-composable-helpers/helpers/queue'], function (exports, _emberComposableHelpersHelpersQueue) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue['default'];
    }
  });
  Object.defineProperty(exports, 'queue', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue.queue;
    }
  });
});
define('todolist/helpers/range', ['exports', 'ember-composable-helpers/helpers/range'], function (exports, _emberComposableHelpersHelpersRange) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange['default'];
    }
  });
  Object.defineProperty(exports, 'range', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange.range;
    }
  });
});
define('todolist/helpers/reduce', ['exports', 'ember-composable-helpers/helpers/reduce'], function (exports, _emberComposableHelpersHelpersReduce) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce['default'];
    }
  });
  Object.defineProperty(exports, 'reduce', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce.reduce;
    }
  });
});
define('todolist/helpers/reject-by', ['exports', 'ember-composable-helpers/helpers/reject-by'], function (exports, _emberComposableHelpersHelpersRejectBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy['default'];
    }
  });
  Object.defineProperty(exports, 'rejectBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy.rejectBy;
    }
  });
});
define('todolist/helpers/repeat', ['exports', 'ember-composable-helpers/helpers/repeat'], function (exports, _emberComposableHelpersHelpersRepeat) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat['default'];
    }
  });
  Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat.repeat;
    }
  });
});
define('todolist/helpers/reverse', ['exports', 'ember-composable-helpers/helpers/reverse'], function (exports, _emberComposableHelpersHelpersReverse) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse['default'];
    }
  });
  Object.defineProperty(exports, 'reverse', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse.reverse;
    }
  });
});
define('todolist/helpers/shuffle', ['exports', 'ember-composable-helpers/helpers/shuffle'], function (exports, _emberComposableHelpersHelpersShuffle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle['default'];
    }
  });
  Object.defineProperty(exports, 'shuffle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle.shuffle;
    }
  });
});
define('todolist/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('todolist/helpers/slice', ['exports', 'ember-composable-helpers/helpers/slice'], function (exports, _emberComposableHelpersHelpersSlice) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice['default'];
    }
  });
  Object.defineProperty(exports, 'slice', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice.slice;
    }
  });
});
define('todolist/helpers/sort-by', ['exports', 'ember-composable-helpers/helpers/sort-by'], function (exports, _emberComposableHelpersHelpersSortBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy['default'];
    }
  });
  Object.defineProperty(exports, 'sortBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy.sortBy;
    }
  });
});
define('todolist/helpers/take', ['exports', 'ember-composable-helpers/helpers/take'], function (exports, _emberComposableHelpersHelpersTake) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake['default'];
    }
  });
  Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake.take;
    }
  });
});
define('todolist/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle-action'], function (exports, _emberComposableHelpersHelpersToggleAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggleAction['default'];
    }
  });
});
define('todolist/helpers/toggle', ['exports', 'ember-composable-helpers/helpers/toggle'], function (exports, _emberComposableHelpersHelpersToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle['default'];
    }
  });
  Object.defineProperty(exports, 'toggle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle.toggle;
    }
  });
});
define('todolist/helpers/union', ['exports', 'ember-composable-helpers/helpers/union'], function (exports, _emberComposableHelpersHelpersUnion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion['default'];
    }
  });
  Object.defineProperty(exports, 'union', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion.union;
    }
  });
});
define('todolist/helpers/without', ['exports', 'ember-composable-helpers/helpers/without'], function (exports, _emberComposableHelpersHelpersWithout) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout['default'];
    }
  });
  Object.defineProperty(exports, 'without', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout.without;
    }
  });
});
define('todolist/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'todolist/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _todolistConfigEnvironment) {
  var _config$APP = _todolistConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('todolist/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('todolist/initializers/data-adapter', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('todolist/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _emberDataSetupContainer, _emberDataIndex) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('todolist/initializers/export-application-global', ['exports', 'ember', 'todolist/config/environment'], function (exports, _ember, _todolistConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_todolistConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _todolistConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_todolistConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('todolist/initializers/injectStore', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('todolist/initializers/store', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('todolist/initializers/transforms', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("todolist/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _emberDataInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataInstanceInitializersInitializeStoreService["default"]
  };
});
define('todolist/models/task', ['exports', 'ember-data'], function (exports, _emberData) {

		var Task = _emberData['default'].Model.extend({
				title: _emberData['default'].attr('string'),
				name: _emberData['default'].attr('string'),
				error: _emberData['default'].attr('string'),
				editing: _emberData['default'].attr('boolean'),
				completed: _emberData['default'].attr('boolean'),
				deleted: _emberData['default'].attr('boolean')
		});

		/*
  Task.reopenClass({
  	FIXTURES: [
  	    {
  	    	id: 1,
  	    	name: 'todo-1',
  	      	title: 'This is Task 1',
  	      	error: '',
  	      	editing: false,
  	      	completed: false,
  	      	deleted: false,
  	    },
  	    {
  			id: 2,
  	    	name: 'todo-2',
  			title: 'This is Task 2',
  	      	error: '',
  			editing: false,
  			completed: false,
  			deleted: false,
  	    },
  	    {
  	    	id: 3,
  	    	name: 'todo-3',
  	    	title: 'This is Task 3',
  	      	error: '',
  	    	editing: false,
  	    	completed: false,
  	    	deleted: false,
  	    },
  	    {
  	    	id: 4,
  	    	name: 'todo-4',
  	    	title: 'This is Task 4',
  	      	error: '',
  	    	editing: false,
  	    	completed: false,
  	    	deleted: false,
  	    }
  	 ]
  });
  */

		exports['default'] = Task;
});
define('todolist/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('todolist/router', ['exports', 'ember', 'todolist/config/environment'], function (exports, _ember, _todolistConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _todolistConfigEnvironment['default'].locationType,
    rootURL: _todolistConfigEnvironment['default'].rootURL
  });

  Router.map(function () {});

  exports['default'] = Router;
});
define('todolist/routes/index', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({
		model: function model() {
			return this.get('store').findAll('task');
		},
		setupController: function setupController(controller, model) {

			this._super(controller, model);
			controller.set('count', controller.getCounter());

			_ember['default'].run.later(function () {
				if (!controller.get('lock')) {
					controller.set('model', model);
				}
			}, 5000);
		}
	});
});
define('todolist/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("todolist/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "84KK2ZQQ", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"wrapper\"],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"container\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"welcome\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"EmberJS Symfony 2 Todos\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"status\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"      \\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "todolist/templates/application.hbs" } });
});
define("todolist/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "pIm5+mCV", "block": "{\"statements\":[[\"open-element\",\"section\",[]],[\"static-attr\",\"id\",\"todoapp\"],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"header\",[]],[\"static-attr\",\"id\",\"header\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"error\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"addTaskError\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"placeholder\",\"value\",\"enter\"],[\"text\",\"new-todo\",\"What needs to be done?\",[\"get\",[\"newTask\"]],\"addTask\"]]],false],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"section\",[]],[\"static-attr\",\"id\",\"main\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"toggle-all\"],[\"flush-element\"],[\"text\",\"Mark all as complete\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"todo-list\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isDisplayedAll\"]]],null,12,9],[\"text\",\"\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"footer\",[]],[\"static-attr\",\"id\",\"footer\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"id\",\"todo-count\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"count\"]],false],[\"close-element\"],[\"text\",\" items left\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"filters\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"filter selected\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"displayAll\"],[[\"preventDefault\"],[false]]],[\"flush-element\"],[\"text\",\"All\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"filter selected\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"displayActive\"],[[\"preventDefault\"],[false]]],[\"flush-element\"],[\"text\",\"Active\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"filter selected\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"displayCompleted\"],[[\"preventDefault\"],[false]]],[\"flush-element\"],[\"text\",\"Completed\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"completed\"]],\"completed\",\"\"],null],\" \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"editing\"]],\"editing\",\"\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"view\"],[\"flush-element\"],[\"text\",\"\\n  \\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"name\",\"checked\",\"click\"],[\"checkbox\",\"toggle\",[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"completed\"]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"queue\"],[[\"helper\",[\"toggle\"],[\"toggleTaskCompleted\",[\"get\",[null]]],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"saveTaskCompleted\",[\"get\",[\"task\"]]],null]],null]],null]]]],false],[\"text\",\"\\n  \\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showEdit\",[\"get\",[\"task\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"destroy\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"destroyTask\",[\"get\",[\"task\"]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"error \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"error\"]],\"\",\"hidden\"],null]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"error\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"enter\"],[\"text\",\"edit\",[\"get\",[\"task\",\"title\"]],\"editTask\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"deleted\"]]],null,0],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"task\",\"completed\"]]],null,1],[\"text\",\"\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,2],[\"text\",\"\\n\\t\\t\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isDisplayedCompleted\"]]],null,3]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"completed\"]],\"completed\",\"\"],null],\" \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"editing\"]],\"editing\",\"\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"view\"],[\"flush-element\"],[\"text\",\"\\n  \\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"name\",\"checked\",\"click\"],[\"checkbox\",\"toggle\",[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"completed\"]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"queue\"],[[\"helper\",[\"toggle\"],[\"toggleTaskCompleted\",[\"get\",[null]]],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"saveTaskCompleted\",[\"get\",[\"task\"]]],null]],null]],null]]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showEdit\",[\"get\",[\"task\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"destroy\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"destroyTask\",[\"get\",[\"task\"]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"error \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"error\"]],\"\",\"hidden\"],null]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"error\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"enter\"],[\"text\",\"edit\",[\"get\",[\"task\",\"title\"]],\"editTask\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"deleted\"]]],null,5],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"completed\"]]],null,6],[\"text\",\"\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,7],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isDisplayedActive\"]]],null,8,4]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"completed\"]],\"completed\",\"\"],null],\" \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"editing\"]],\"editing\",\"\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"view\"],[\"flush-element\"],[\"text\",\"\\n  \\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"name\",\"checked\",\"click\"],[\"checkbox\",\"toggle\",[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"completed\"]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"queue\"],[[\"helper\",[\"toggle\"],[\"toggleTaskCompleted\",[\"get\",[null]]],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"saveTaskCompleted\",[\"get\",[\"task\"]]],null]],null]],null]]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showEdit\",[\"get\",[\"task\"]]],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"destroy\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"destroyTask\",[\"get\",[\"task\"]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"error \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"error\"]],\"\",\"hidden\"],null]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"error\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"enter\"],[\"text\",\"edit\",[\"get\",[\"task\",\"title\"]],\"editTask\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"deleted\"]]],null,10],[\"text\",\"\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,11],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "todolist/templates/index.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('todolist/config/environment', ['ember'], function(Ember) {
  var prefix = 'todolist';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("todolist/app")["default"].create({"name":"todolist","version":"0.0.0+60ec6b92"});
}

/* jshint ignore:end */
//# sourceMappingURL=todolist.map
