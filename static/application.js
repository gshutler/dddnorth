(function() {
    
    var Task = Backbone.Model.extend({

    });

    var Tasks = Backbone.Collection.extend({

	url : '/tasks',

	model : Task,
	
    });

    var TaskView = Backbone.View.extend({

        render : function() {
            var html = ich.task(this.model.toJSON());

            $(this.el).html(html);

	    return this;
	}

    });

    var TaskListView = Backbone.View.extend({

	initialize : function() {
	    _.bindAll(this, "render");

            this.collection.bind("refresh", this.render);
	    this.collection.bind("add", this.render);
	    this.collection.bind("remove", this.render);
	},

	render : function() {
            $("#todo").empty();
            $("#doing").empty();
            $("#done").empty();

	    var taskViews = { todo : [], doing : [], done : [] };

	    this.collection.each(function(model) {
	        var taskView = new TaskView({ model : model });
		taskViews[model.get("status")].push(taskView.render().el);
	    });
            
            $("#todo").append(taskViews.todo);
            $("#doing").append(taskViews.doing);
            $("#done").append(taskViews.done);

	    return this;
	}

    });

    TodoList = Backbone.Router.extend({

        initialize : function(options) {
            this.listView = new TaskListView({ collection : options.tasks });
	},

	routes : {
	    "" : "index"
	},

	index : function() {
            this.listView.render();
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
