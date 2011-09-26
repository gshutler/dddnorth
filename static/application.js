(function() {
    
    _.extend(Backbone.View.prototype, {
        
        show : function() {
            this._show();
        },
        
        hide : function() {
            this._hide();
        },
        
        _show : function() {
            $(this.el).show();
        },
        
        _hide : function() {
            $(this.el).hide();
        }
    
    });
    
    var Task = Backbone.Model.extend({
    
        initialize : function() {
            _.bindAll(this, "getNextStatus", "getPreviousStatus");
        },
    
        taskStatuses : ["todo", "doing", "done"],
        
        getNextStatus : function() {
            var status = this.get("status");
            var possibleStatusIndex = Task.taskStatuses.indexOf(status) + 1;
            var nextStatus = status;
            
            if (possibleStatusIndex < Task.taskStatuses.length) {
                nextStatus = Task.taskStatuses[possibleStatusIndex];
            }
            
            return nextStatus;
        },
        
        getPreviousStatus : function() {
            var status = this.get("status");
            var possibleStatusIndex = Task.taskStatuses.indexOf(status) - 1;
            var previousStatus = status;
            
            if (possibleStatusIndex > -1) {
                previousStatus = Task.taskStatuses[possibleStatusIndex];
            }
            
            return previousStatus;
        }
        
    });
    
    Task.taskStatuses = ["todo", "doing", "done"];

    var Tasks = Backbone.Collection.extend({

        url : '/tasks',
    
        model : Task,
        
        getTasksByStatus : function(status) {
            return _.select(this.models, function(model) {
                return model.get("status") === status;
            });
        }
    
    });
    
    var TaskEditView = Backbone.View.extend({
                
        initialize : function() {
            this.form = this.$(".edit")[0];
            
            _.bindAll(this, "render", "saveTask", "deleteTask");
        },
        
        events : {
        
            "click .save-task" : "saveTask",
            
            "click .delete-task" : "deleteTask"
        
        },
        
        render : function(model) {
            this.model = model;
            this.form.name.value = model.get("name");
            this.form.description.value = model.get("description");
                        
            return this;
        },
        
        saveTask : function() {         
            var json = {
                "name" : this.form.name.value,
                "description" : this.form.description.value
            };
            
            this.model.set(json);
            this.model.save();
        },
        
        deleteTask : function() {
            this.model.destroy();
        }        
        
    });
    
    var TaskView = Backbone.View.extend({
    
        className : "task",
        
        events : {
        
            "click .move-left" : "moveLeft",
            
            "click .move-right" : "moveRight"
        
        },

        render : function() {
            var html = ich.task(this.model.toJSON());
            
            $(this.el).html(html);
            
            return this;
        },
        
        moveLeft : function() {
            this._moveTask(this.model.getPreviousStatus);
        },
        
        moveRight : function() {
            this._moveTask(this.model.getNextStatus);
        },
        
        _moveTask : function(newStatusFn) {
            var currentStatus = this.model.get("status");
            var newStatus = newStatusFn();
            
            if (currentStatus !== newStatus) {
                this.model.set({ "status" : newStatus });
                this.model.save();
            }
        }

    });
    
    var AddTaskView = Backbone.View.extend({
    
        initialize : function() {
            this.form = this.$("form.add")[0];
            
            _.bindAll(this, "reset", "addTask");
        },
    
        events : {
                        
            "click .add-task" : "addTask"
        
        },
    
        addTask : function() {          
            var json = {
                "name" : this.form.name.value,
                "description" : this.form.description.value
            };
            
            this.collection.create(json);
        },
        
        show : function() {         
            this._show();
            this.$(".name").focus();
        },
    
        reset : function() {
            this.form.name.value = "";
            this.form.description.value = "";
        }
    
    });

    var TaskListView = Backbone.View.extend({

        initialize : function() {
            _.bindAll(this, "render");
            
            this.todoColumnView = new TaskListColumnView({ collection : this.collection, el : "#todo", status : "todo" });
            this.doingColumnView = new TaskListColumnView({ collection : this.collection, el : "#doing", status : "doing" });
            this.doneColumnView = new TaskListColumnView({ collection : this.collection, el : "#done", status : "done" });
            
            this.collection.bind("add", this.render);
            this.collection.bind("remove", this.render);            
            this.collection.bind("change", this.render);
        },
    
        render : function() {
            this.todoColumnView.render();
            this.doingColumnView.render();
            this.doneColumnView.render();
        }

    });
    
    var TaskListColumnView = Backbone.View.extend({
    
        initialize : function() {
            _.bindAll(this, "render");
        },
        
        render : function() {
            $(this.el).empty();
            
            var taskViews = [];
            
            _.forEach(this.collection.getTasksByStatus(this.options.status), function(task) {
                var taskView = new TaskView({ model : task });
                var renderedTask = taskView.render().el;
                taskViews.push(renderedTask);
            });
            
            $(this.el).append(taskViews);
            
            return this;        
        }
    
    });

    var TodoList = Backbone.Router.extend({

        initialize : function(options) {
            this.tasks = options.tasks;
            this.todoListView = new TaskListView({ collection : options.tasks, el : "#todo-list" });
            this.addTaskView = new AddTaskView({ collection : options.tasks, el : "#add-task" });
            this.taskEditView = new TaskEditView({ el : "#edit-task" });
        },
    
        routes : {
            
            "" : "index",
            
            "task/new" : "newTask",
            
            "task/:id" : "showTask"
                        
        },
    
        index : function() {
            this._hideAll();
            this.todoListView.render();
            this.todoListView.show();
        },
        
        showTask : function(id) {
            this._hideAll();
            this.taskEditView.render(this.tasks.get(id));
            this.taskEditView.show();
        },
        
        newTask : function() {
            this._hideAll();
            this.addTaskView.reset();
            this.addTaskView.show();
        },
        
        _hideAll : function() {
            this.todoListView.hide();
            this.addTaskView.hide();
            this.taskEditView.hide();
        }

    });

    $(function() {
        var tasks = new Tasks();

        tasks.fetch({
        
            complete : function() {
                var app = new TodoList({ tasks : tasks });

                Backbone.history.start();
            }

        });
    });

})();
