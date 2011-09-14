(function() {
    
    var Task = Backbone.Model.extend({

    });

    var Tasks = Backbone.Collection.extend({

	url : '/tasks',

	model : Task,
	
    });

    var TaskView = Backbone.View.extend({

        render : function() {
            console.log("rendering task");
	    console.log(this.model);

            var html = ich.task(this.model.toJSON());

            $(this.el).html(html);

	    return this;
	}

    });

    var TaskListView = Backbone.View.extend({

	initialize : function() {
	    _.bindAll(this, "render");

            console.log(this);

            this.collection.bind("refresh", this.render);
	    this.collection.bind("add", this.render);
	    this.collection.bind("remove", this.render);
	},

	render : function() {
	    console.log("rendering");
            $("#todo").empty();
            $("#doing").empty();
            $("#done").empty();

	    var taskViews = { todo : [], doing : [], done : [] };

	    console.log(this.collection);
	    console.log(this.collection.length);

	    this.collection.each(function(model) {
	        console.log("trying to render task");
	        var taskView = new TaskView({ model : model });
		console.log(model);
		taskViews[model.get("status")].push(taskView.render().el);
	    });
            
            $("#todo").append(taskViews.todo);
            $("#doing").append(taskViews.doing);
            $("#done").append(taskViews.done);

	    return this;
	}

    });

    TodoList = Backbone.Router.extend({

        initialize : function() {
	    var tasks = new Tasks();
            this.listView = new TaskListView({ collection : tasks });

	    var taskListView = this.listView;

	    tasks.fetch({ complete : function() { taskListView.render(); } });
	},

	routes : {
	    "" : "index"
	},

	index : function() {
            this.listView.render();
	}

    });

    $(function() {
        var app = new TodoList();

	Backbone.history.start();
    });

})();
