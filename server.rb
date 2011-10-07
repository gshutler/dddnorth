require "rubygems"
require "sinatra"
require "json"
require File.join(File.dirname(__FILE__), "task")

set :public, File.join(File.dirname(__FILE__), "static")

# Initialize our "database".

TASKS = []

TASKS << Task.new("name" => "Eat food", "description" => "Mmmmmm... Food.")
TASKS << Task.new("name" => "Drink beer", "description" => "Discuss plans for world domination.")
TASKS << Task.new("name" => "Recover and travel home", "description" => "Could be a loooong train journey.")
TASKS << Task.new("name" => "Give presentation", "description" => "Checking", "status" => "doing")
TASKS << Task.new("name" => "Write example application", "description" => "Demonstrate as many features of backbone as sensible.", "status" => "done")
TASKS << Task.new("name" => "Create presentation", "description" => "", "status" => "done")

# Returns `index.html` for root URL.
get "/" do
  content_type "text/html"
  File.read(File.join(File.dirname(__FILE__), "static", "index.html"))
end

# Returns all the tasks that have not been deleted as an array.
get "/tasks" do
  JSON.pretty_generate(TASKS.find_all{|task| not task.nil?})
end

# Gets a representation of a specific task.
get "/tasks/:id" do |id|
  task = get_task(id)
  JSON.pretty_generate(task)
end

# Adds a new task and returns its representation.
post "/tasks" do
  new_task = Task.new(json_body)
  TASKS << new_task
  JSON.pretty_generate(new_task)
end

# Updates the representation of a specific task.
put "/tasks/:id" do |id|
  task = get_task(id)
  task.apply(json_body)
  JSON.pretty_generate(task)
end

# Deletes a specific task.
delete "/tasks/:id" do |id|
  TASKS[id.to_i] = nil
end

# Set the Content-Type of every response to `application/json`
before do
  content_type "application/json"
end

# Gets the task with the specified `id`.
#
# Halts with `404` if the task with the specified id has been deleted.
def get_task(id)
  task = TASKS[id.to_i]
  not_found if task.nil?
  task
end

# Returns the body of the request parsed as JSON.
def json_body
  JSON.parse(request.body.read.to_s)
end

