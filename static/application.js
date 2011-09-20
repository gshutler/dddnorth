(function() {
    
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
    
    var TaskView = Backbone.View.extend({
    
    	className : "task",
    	
    	events : {
    	
    		"click .move-left" : "moveLeft",
    		
    		"click .move-right" : "moveRight",
    		
    		"click .display" : "toggleExpand",
    		
    		"dblclick .display" : "beginEdit",
    		
    		"click .cancel-edit" : "endEdit",
    		
    		"click .save-task" : "saveTask"
    	
    	},

        render : function() {
            var html = ich.task(this.model.toJSON());
            
            $(this.el).html(html);
            
            return this;
        },
        
        toggleExpand : function() {
        	$(this.el).toggleClass("expanded");
        },
        
        beginEdit : function() {
        	$(this.el).addClass("edit");
        	this.$(".name").focus();
        },
        
        endEdit : function() {
        	this.render();
        	$(this.el).removeClass("edit");
        	return false;
        },
        
        saveTask : function() {
        	var form = this.$(".edit")[0];
        	
        	var json = {
        		"name" : form.name.value,
        		"description" : form.description.value
        	};
        	
        	this.model.set(json);
        	this.model.save();        	
        	this.endEdit();
        	
        	return false;
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
    
    	events : {
    	
    		"click #show-add-form" : "showForm",
    		
    		"click .cancel" : "reset",
    		
    		"click .add-task" : "addTask"
    	
    	},
    
    	addTask : function() {
    		var form = this.$("form.add")[0];
        	
        	var json = {
        		"name" : form.name.value,
        		"description" : form.description.value
        	};
        	
        	this.collection.create(json);        	
        	this.reset();
        	
        	return false;
    	},
    	
    	showForm : function() {
    		$(this.el).addClass("show-form");
    		this.$(".name").focus();
    	},
    
    	reset : function() {
    		$(this.el).removeClass("show-form");
    		var form = this.$("form.add")[0];
    		
    		form.name.value = "";
    		form.description.value = "";
    		
    		return false;
    	}
    
    });

    var TaskListView = Backbone.View.extend({

        initialize : function() {
            _.bindAll(this, "render");
            
            this.todoColumnView = new TaskListColumnView({ collection : this.collection, el : "#todo", status : "todo" });
            this.doingColumnView = new TaskListColumnView({ collection : this.collection, el : "#doing", status : "doing" });
            this.doneColumnView = new TaskListColumnView({ collection : this.collection, el : "#done", status : "done" });
            this.addTaskView = new AddTaskView({ collection : this.collection, el : "#add-task" });
            
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
