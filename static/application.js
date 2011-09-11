(function() {
    
    var Task = Backbone.Model.extend({

    });

    var Tasks = Backbone.Collection.extend({

	url : '/tasks',

	model : Task,
	
    });

    var TaskView = Backbone.View.extend({

    });

    var TaskListView = Backbone.View.extend({


	


    });

    var tasks = new Tasks();
    
    tasks.fetch({
    
	success : function() {
	    console.log("Tasks : " + tasks.length);

	    tasks.each(function(task) {
		console.log("Task [" + task.id + "] : " + task.get('name'));
	    });
	}

    });

    var Controller = {

	init : function() {

	    this.tasks = new Tasks();

	    this.view = new TaskListView({ model : this.tasks });

	    return this;	
	}

    };

})();
