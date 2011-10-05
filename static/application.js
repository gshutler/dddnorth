(function() {
    
    /**
     * Representation of a task.
     * 
     * Encapsulates the business logic for transitioning the task between
     * statuses over and above what is provided by Backbone.
     */
    var Task = Backbone.Model.extend({
    
        /**
         * Ensure that when a task is created its `getNextStatus` and 
         * `getPreviousStatus` methods have `this` scoped to the task itself at
         * all times.
         */
        initialize : function() {
            _.bindAll(this, "getNextStatus", "getPreviousStatus");
        },
        
        /**
         * The statuses it is possible for a task to be in, in the order they
         * are transitioned between.
         */
        statuses : ["todo", "doing", "done"],
        
        /**
         * Get the next status this task can transition to.
         *
         * If the task is already in the final status then the final status
         * will be returned.
         */
        getNextStatus : function() {
            var status = this.get("status");
            var possibleStatusIndex = this.statuses.indexOf(status) + 1;
            var nextStatus = status;
            
            if (possibleStatusIndex < this.statuses.length) {
                nextStatus = this.statuses[possibleStatusIndex];
            }
            
            return nextStatus;
        },
        
        /**
         * Get the previous status this task can transition to.
         *
         * If the task is already in the initial status then the initial status
         * will be returned.
         */
        getPreviousStatus : function() {
            var status = this.get("status");
            var possibleStatusIndex = this.statuses.indexOf(status) - 1;
            var previousStatus = status;
            
            if (possibleStatusIndex > -1) {
                previousStatus = this.statuses[possibleStatusIndex];
            }
            
            return previousStatus;
        }
        
    });
    
    /**
     * Representation of a task collection.
     *
     * Adds the ability to retrieve all the tasks of a particular status over
     * and above what is provided by Backbone.
     */
    var Tasks = Backbone.Collection.extend({

        /**
         * The URL which is used to interact with the tasks collection on the
         * server-side.
         */
        url : '/tasks',
    
        /**
         * The model to encapsulate each of the items in the collection with.
         */
        model : Task,
        
        /**
         * Returns all of the tasks within the collection that have the given
         * `status`.
         */
        getByStatus : function(status) {
            return _.select(this.models, function(model) {
                return model.get("status") === status;
            });
        }
    
    });
    
    /**
     * Extend all Backbone views to have `show` and `hide` functions.
     */
    _.extend(Backbone.View.prototype, {
        
        /**
         * Ensures that the view is displayed.
         */
        show : function() {
            this._show();
        },

        /**
         * Ensures that the view is hidden.
         */        
        hide : function() {
            this._hide();
        },
        
        /**
         * Internal implementation of the `show` method to make it available to
         * methods that replace the default implementation.
         */
        _show : function() {
            $(this.el).show();
        },
        
        /**
         * Internal implementation of the `hide` method to make it available to
         * methods that replace the default implementation.
         */
        _hide : function() {
            $(this.el).hide();
        }
    
    });

    /**
     * View encapsulating the logic required for the task creation view.
     */
    var AddTaskView = Backbone.View.extend({
    
        /**
         * Initializes the view.
         *
         * Retrieves a handle to the creation form to save constant retrieval
         * and ensure the `reset` and `addTask` functions always have `this` 
         * scoped to the view.
         */
        initialize : function() {
            this.form = this.$("form.add")[0];
            
            _.bindAll(this, "reset", "addTask");
        },
    
        /**
         * Defines the events to bind within the view.
         */
        events : {
            
            /**
             * When the `add-task` element within the view is clicked then the
             * `addTask` function should be invoked.
             */
            "click .add-task" : "addTask"
        
        },
        
        /**
         * Transfers the values within the form into a JSON object which is used
         * to create a new task within the collection.
         */
        addTask : function() {          
            var json = {
                "name" : this.form.name.value,
                "description" : this.form.description.value
            };
            
            this.collection.create(json);
        },
        
        /**
         * Ensure that the view is visible and additionally set focus to the 
         * name field.
         */
        show : function() {         
            this._show();
            this.$(".name").focus();
        },
        
        /**
         * Reset the form by clearing out all the fields.
         */
        reset : function() {
            this.form.name.value = "";
            this.form.description.value = "";
        }
    
    });
    
    /**
     * View encapsulating the logic required for the task editing view.
     */
    var TaskEditView = Backbone.View.extend({
        
        /**
         * Initializes the view.
         *
         * Retrieves a handle to the editing form to save constant retrieval
         * and ensure the `render`, `saveTask` and `deleteTask` functions
         * always have `this` scoped to the view.
         */
        initialize : function() {
            this.form = this.$(".edit")[0];
            
            _.bindAll(this, "render", "saveTask", "deleteTask");
        },
        
        /**
         * Defines the events to bind within the view.
         */
        events : {
            
            /**
             * When the `save-task` element is clicked within the view then the
             * `saveTask` function should be invoked.
             */
            "click .save-task" : "saveTask",
            
            /**
             * When the `delete-task` element is clicked within the view then
             * the `deletedTask` function should be invoked.
             */
            "click .delete-task" : "deleteTask"
        
        },
        
        /**
         * Renders the view for the given model.
         *
         * This is stores a reference to the model within the view and sets the
         * values within the form according to those stored within the model.
         */
        render : function(model) {
            this.model = model;
            this.form.name.value = model.get("name");
            this.form.description.value = model.get("description");
                        
            return this;
        },
        
        /**
         * Transfers the values from the form into the active model and invokes
         * its `save` function.
         */
        saveTask : function() {         
            var json = {
                "name" : this.form.name.value,
                "description" : this.form.description.value
            };
            
            this.model.set(json);
            this.model.save();
        },
        
        /**
         * Deletes the active model by invoking its `destroy` function.
         */
        deleteTask : function() {
            this.model.destroy();
        }        
        
    });
    
    /**
     * View encapsulating the logic required for displaying an individual task.
     */
    var TaskView = Backbone.View.extend({
    
        /**
         * The class name to add to any generated views.
         */
        className : "task",
        
        /**
         * Defines the events to bind within the view.
         */
        events : {
        
            /**
             * When the `move-left` element is clicked within the view then the
             * `moveLeft` function should be invoked.
             */
            "click .move-left" : "moveLeft",
            
            /**
             * When the `move-right` element is clicked within the view then
             * the `moveRight` function should be invoked.
             */
            "click .move-right" : "moveRight"
        
        },

        /**
         * Renders a view for the model by passing its JSON representation to an
         * ICanHaz template and pushing the resulting HTML into the views `el`.
         */
        render : function() {
            var html = ich.task(this.model.toJSON());
            
            $(this.el).html(html);
            
            return this;
        },
        
        /**
         * Transitions the model to the next status it can have.
         * 
         * The model will be saved once it is updated.
         */
        moveLeft : function() {
            this._moveTask(this.model.getPreviousStatus);
        },
        
        /**
         * Transitions the model to the previous status it can have.
         * 
         * The model will be saved once it is updated.
         */
        moveRight : function() {
            this._moveTask(this.model.getNextStatus);
        },
        
        /**
         * Internal implementation for moving the model to another status.
         *
         * Invokes the given function to retrieve the new status and if it is
         * different to the model's current status it will update the model and
         * invoke its `save` function.
         */
        _moveTask : function(newStatusFn) {
            var currentStatus = this.model.get("status");
            var newStatus = newStatusFn();
            
            if (currentStatus !== newStatus) {
                this.model.set({ "status" : newStatus });
                this.model.save();
            }
        }

    });
    
    /**
     * View encapsulating the logic required for rendering a column of tasks
     * with a specified status.
     */
    var TaskListColumnView = Backbone.View.extend({
    
        /**
         * Initializes the view.
         * 
         * Ensures that the `render` function always has `this` scoped to the 
         * view when it is invoked.
         */
        initialize : function() {
            _.bindAll(this, "render");
        },
        
        /**
         * Renders a column of tasks from the collection with the specified 
         * status.
         *
         * Removes everything from the containing element before rendering each
         * of the tasks individually.
         */
        render : function() {
            $(this.el).empty();
            
            var taskViews = [];
            
            var columnTasks = this.collection.getByStatus(this.options.status);
            
            _.forEach(columnTasks, function(task) {
                var taskView = new TaskView({ model : task });
                var renderedTask = taskView.render().el;
                taskViews.push(renderedTask);
            });
            
            $(this.el).append(taskViews);
            
            return this;        
        }
    
    });
    
    /**
     * View encapsulating the logic required to display a collection of tasks.
     */
    var TaskListView = Backbone.View.extend({

        /**
         * Initializes the view.
         * 
         * Ensures that the `render` and `_addChildView` functions always have
         * `this` scoped to the view when they are invoked, it also creates the
         * three child views for displaying the individual columns for each 
         * status a task can have.
         *
         * Finally, it ensures that whenever the collection of tasks is altered
         * in any way that the view is re-rendered to reflect the changes.
         */
        initialize : function() {
            _.bindAll(this, "render");
            
            this.childViews = [];
            
            this._addChildView({ el : "#todo",  status : "todo" });
            this._addChildView({ el : "#doing", status : "doing" });
            this._addChildView({ el : "#done",  status : "done" });
            
            this.collection.bind("add", this.render);
            this.collection.bind("remove", this.render);            
            this.collection.bind("change", this.render);
        },
    
        /**
         * Renders each of the child views.
         */
        render : function() {
            _.each(this.childViews, function(view) {
                view.render();
            });
        },
        
        /**
         * Internal method that creates a new child view, passing it a reference
         * to the model collection and adds it to the child view collection.
         */
        _addChildView : function(args) {
            args.collection = this.collection;          
            var childView = new TaskListColumnView(args);            
            this.childViews.push(childView);
        }

    });

    /**
     * The router for a todo list application.
     */
    var TodoList = Backbone.Router.extend({

        /**
         * Initializes the router.
         *
         * Aliases out the tasks provided within the options for easier access
         * and then initializes all the top-level views.
         */
        initialize : function(options) {
            this.tasks = options.tasks;
            this.todoListView = new TaskListView({ collection : this.tasks, el : "#todo-list" });
            this.addTaskView = new AddTaskView({ collection : this.tasks, el : "#add-task" });
            this.taskEditView = new TaskEditView({ el : "#edit-task" });
        },
    
        /**
         * Defines the routes for the application.
         */
        routes : {
            
            /**
             * The default route.
             *
             * Rendered by invoking the `index` function.
             */
            "" : "index",
            
            /**
             * The route for displaying the "add task" view.
             *
             * Rendered by invoking the `addTask` function.
             */
            "task/new" : "addTask",
            
            /**
             * The route for displaying the "edit task" view.
             *
             * Rendered by invoking the `editTask` function with the specified 
             * id.
             */
            "task/:id" : "editTask"
                        
        },
    
        /**
         * Displays the full todo list.
         *
         * First ensures that we are in a known state by hiding all the 
         * top-level views and then renders and displays the todo list view.
         */
        index : function() {
            this._hideAll();
            this.todoListView.render();
            this.todoListView.show();
        },
        
        /**
         * Displays the edit task view.
         *
         * First ensures that we are in a known state by hiding all the 
         * top-level views and then renders the edit task view for the 
         * specified task and then displays it.
         */
        editTask : function(id) {
            this._hideAll();
            this.taskEditView.render(this.tasks.get(id));
            this.taskEditView.show();
        },
        
        /**
         * Displays the add task view.
         *
         * First ensures that we are in a known state by hiding all the 
         * top-level views and then resets and displays the add task view.
         */
        addTask : function() {
            this._hideAll();
            this.addTaskView.reset();
            this.addTaskView.show();
        },
        
        /**
         * Hides all of the top-level views.
         */
        _hideAll : function() {
            this.todoListView.hide();
            this.addTaskView.hide();
            this.taskEditView.hide();
        }

    });
    
    /**
     * Initializes the application.
     *
     * First, retrieves all tasks once the document is ready and then uses the
     * retrieved collection to initialize the application.
     */
    $(function() {
        var tasks = new Tasks();

        tasks.fetch({
        
            /**
             * Once the tasks have been retrieved, the application is 
             * initialized with them.
             */
            complete : function() {
                var app = new TodoList({ tasks : tasks });

                Backbone.history.start();
            }

        });
    });

})();
