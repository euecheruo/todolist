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
		taskComplete: false,
		isDisplayedAll: true,
		isDisplayedActive: false,
		isDisplayedCompleted: false,
		doNotShowEdit: false,
		addTaskError: "",
		count: 0,
		total: 0,
		getCounter: function getCounter() {
			var count = 0;
			var total = 0;
			this.get('model').forEach(function (taskItem) {
				if (!taskItem.get('completed') && !taskItem.get('deleted')) {
					count++;
				}
				total = taskItem.get('id');
			});

			this.set('total', total);
			return count;
		},
		actions: {
			toggleCompleted: function toggleCompleted(task) {

				var count = parseInt(this.get('count'));
				if (task.get('completed')) {
					this.set('count', count + 1);
					task.set('completed', false);
				} else {
					this.set('count', count - 1);
					task.set('completed', true);
				}
				task.save();
			},
			addTask: function addTask() {

				var title = this.get('newTask');
				if (title === '') {

					this.set('addTaskError', 'Must have a title');
				} else {

					var total = parseInt(this.get('total')) + 1;
					var _name = 'todo-' + total;

					this.set('total', total);

					var taskComplete = this.get('taskComplete');
					var task = this.get('store').createRecord('task', {
						name: _name,
						title: this.get('newTask'),
						editing: false,
						completed: taskComplete,
						deleted: false
					});
					task.save();

					if (!taskComplete) {
						var count = parseInt(this.get('count'));
						this.set('count', count + 1);
					}

					this.set('newTask', '');
					this.set('taskComplete', false);
					this.set('addTaskError', '');
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

				var title = this.get('currentTask').get('title');
				if (title === '') {

					this.get('currentTask').set('error', 'Must have a title');
					this.set('doNotShowEdit', true);
				} else {

					this.get('model').forEach(function (taskItem) {
						taskItem.set('editing', false);
					});

					this.get('currentTask').set('error', '');
					this.get('currentTask').save();
					this.set('doNotShowEdit', false);
				}
			},
			destroyTask: function destroyTask(task) {

				task.set('deleted', true);

				this.get('store').findRecord('task', task.get('id'), { backgroundReload: false }).then(function (taskItem) {
					taskItem.destroyRecord();
				});

				if (!task.get('completed')) {
					var count = parseInt(this.get('count')) - 1;
					this.set('count', count);
				}
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
				this.set('count', 0);
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
define('todolist/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('todolist/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
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
define('todolist/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

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
define('todolist/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

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
define('todolist/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

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
define('todolist/initializers/store', ['exports', 'ember'], function (exports, _ember) {

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
define('todolist/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

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
define("todolist/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('todolist/models/task', ['exports', 'ember-data'], function (exports, _emberData) {
		exports['default'] = _emberData['default'].Model.extend({
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
  
  export default Task;
  */
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
  exports["default"] = Ember.HTMLBars.template({ "id": "k0Wi4dbH", "block": "{\"statements\":[[\"open-element\",\"section\",[]],[\"static-attr\",\"id\",\"todoapp\"],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"header\",[]],[\"static-attr\",\"id\",\"header\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"error\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"addTaskError\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"placeholder\",\"value\",\"enter\"],[\"text\",\"new-todo\",\"What needs to be done?\",[\"get\",[\"newTask\"]],\"addTask\"]]],false],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"section\",[]],[\"static-attr\",\"id\",\"main\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"name\",\"checked\"],[\"checkbox\",\"toggle-all\",[\"get\",[\"taskComplete\"]],[\"get\",[\"taskComplete\"]],[\"get\",[\"taskComplete\"]]]]],false],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"toggle-all\"],[\"flush-element\"],[\"text\",\"Mark all as complete\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"todo-list\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isDisplayedAll\"]]],null,12,9],[\"text\",\"\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"footer\",[]],[\"static-attr\",\"id\",\"footer\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"id\",\"todo-count\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"count\"]],false],[\"close-element\"],[\"text\",\" items left\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"filters\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"filter selected\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"displayAll\"],[[\"preventDefault\"],[false]]],[\"flush-element\"],[\"text\",\"All\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"filter selected\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"displayActive\"],[[\"preventDefault\"],[false]]],[\"flush-element\"],[\"text\",\"Active\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"filter selected\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"displayCompleted\"],[[\"preventDefault\"],[false]]],[\"flush-element\"],[\"text\",\"Completed\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"  \\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t  \\t\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"completed\"]],\"completed\",\"\"],null],\" \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"editing\"]],\"editing\",\"\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"view\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"name\",\"checked\",\"click\"],[\"checkbox\",\"toggle\",[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"completed\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"toggleCompleted\",[\"get\",[\"task\"]]],null]]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showEdit\",[\"get\",[\"task\"]]],[[\"on\"],[\"doubleClick\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"destroy\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"destroyTask\",[\"get\",[\"task\"]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"error \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"error\"]],\"\",\"hidden\"],null]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"error\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"enter\"],[\"text\",\"edit\",[\"get\",[\"task\",\"title\"]],\"editTask\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t  \\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"deleted\"]]],null,0],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t  \\n\"],[\"block\",[\"if\"],[[\"get\",[\"task\",\"completed\"]]],null,1],[\"text\",\"\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"\\t\\t\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,2],[\"text\",\"\\t\\t\\n\\t\\t\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isDisplayedCompleted\"]]],null,3]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t  \\t\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"completed\"]],\"completed\",\"\"],null],\" \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"editing\"]],\"editing\",\"\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"view\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"name\",\"checked\",\"click\"],[\"checkbox\",\"toggle\",[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"completed\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"toggleCompleted\",[\"get\",[\"task\"]]],null]]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showEdit\",[\"get\",[\"task\"]]],[[\"on\"],[\"doubleClick\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"destroy\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"destroyTask\",[\"get\",[\"task\"]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"error \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"error\"]],\"\",\"hidden\"],null]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"error\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"enter\"],[\"text\",\"edit\",[\"get\",[\"task\",\"title\"]],\"editTask\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t  \\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"deleted\"]]],null,5],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t  \\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"completed\"]]],null,6],[\"text\",\"\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"\\t\\t\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,7],[\"text\",\"\\t\\t\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isDisplayedActive\"]]],null,8,4]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t  \\t\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"completed\"]],\"completed\",\"\"],null],\" \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"editing\"]],\"editing\",\"\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"view\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"name\",\"checked\",\"click\"],[\"checkbox\",\"toggle\",[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"name\"]],[\"get\",[\"task\",\"completed\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"toggleCompleted\",[\"get\",[\"task\"]]],null]]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showEdit\",[\"get\",[\"task\"]]],[[\"on\"],[\"doubleClick\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"destroy\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"destroyTask\",[\"get\",[\"task\"]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"error \",[\"helper\",[\"if\"],[[\"get\",[\"task\",\"error\"]],\"\",\"hidden\"],null]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"error\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"enter\"],[\"text\",\"edit\",[\"get\",[\"task\",\"title\"]],\"editTask\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t  \\n\"],[\"block\",[\"unless\"],[[\"get\",[\"task\",\"deleted\"]]],null,10],[\"text\",\"\\t\\t\\t\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,11],[\"text\",\"\\t\\t\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "todolist/templates/index.hbs" } });
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
  require("todolist/app")["default"].create({"name":"todolist","version":"0.0.0+"});
}

/* jshint ignore:end */
//# sourceMappingURL=todolist.map
