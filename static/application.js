(function() {
    
    var Task = Backbone.Model.extend({

    });

    var Tasks = Backbone.Collection.extend({

        url : '/tasks',
    
        model : Task,
                
        getTasksByStatus : function(status) {
        	return _.select(this.models, function(model) {
				return model.get("status") === status;
			});
        }
    
    });
    
    var taskStatuses = ["todo", "doing", "done"];
    
    var getNextStatus = function(status) {
    	var possibleStatusIndex = taskStatuses.indexOf(status) + 1;
    	var nextStatus = status;
    	
    	if (possibleStatusIndex < taskStatuses.length) {
    		nextStatus = taskStatuses[possibleStatusIndex];
    	}
    	
    	return nextStatus;
    };
    
    var getPreviousStatus = function(status) {
    	var possibleStatusIndex = taskStatuses.indexOf(status) - 1;
    	var previousStatus = status;
    	
    	if (possibleStatusIndex > -1) {
    		previousStatus = taskStatuses[possibleStatusIndex];
    	}
    	
    	return previousStatus;
    };
    
    var TaskView = Backbone.View.extend({
    
    	className : "task",
    	
    	events : {
    	
    		"click .move-left" : "moveLeft",
    		
    		"click .move-right" : "moveRight",
    		
    		"click .display" : "beginEdit",
    		
    		"click .cancel-edit" : "cancelEdit"
    	
    	},

        render : function() {
            var html = ich.task(this.model.toJSON());
            
            $(this.el).html(html);
            
            return this;
        },
        
        beginEdit : function() {
        	console.log("begin editing");
        	$(this.el).addClass("edit");
        },
        
        cancelEdit : function() {
        	console.log("cancelling edit");
        	this.render();
        	$(this.el).removeClass("edit");
        	return false;
        },
        
        moveLeft : function() {
        	this._moveTask(getPreviousStatus);
        },
        
        moveRight : function() {
        	this._moveTask(getNextStatus);
        },
        
        _moveTask : function(newStatusFn) {
			var currentStatus = this.model.get("status");
			var newStatus = newStatusFn(currentStatus);
			
			if (currentStatus !== newStatus) {
				this.model.set({ "status" : newStatus });
				this.model.save();
			}
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

    TodoList = Backbone.Router.extend({

        initialize : function(options) {
            this.todoListView = new TaskListView({ collection : options.tasks });
        },
    
        routes : {
            "" : "index"
        },
    
        index : function() {
            this.todoListView.render();
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
