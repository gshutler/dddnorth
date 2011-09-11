require "rubygems"
require "sinatra"
require "json"

set :public, File.dirname(__FILE__) + '/static'

class Task

  attr_reader :id
  attr_accessor :name, :description, :status

  @@id = 0

  def initialize(args)
    @id = @@id
    @@id += 1

    @name = args["name"]
    @description = args["description"]
    @status = args["status"] || "todo"
  end

  def apply(args)
    @name = args["name"] || @name
    @description = args["description"] || @description
    @status = args["status"] || @status
  end

  def to_json(*a)
    {
      'id' => @id,
      'name' => @name,
      'description' => @description,
      'status' => @status
    }.to_json(*a)
  end

end

TASKS = []

TASKS << Task.new("name" => "Sketch out in-memory", "description" => "Demonstrate idea")
TASKS << Task.new("name" => "Replace with database perhaps", "description" => "Might not be needed")
TASKS << Task.new("name" => "Implement Sinatra methods", "description" => "Out of practice")

puts TASKS.inspect

after do
  content_type 'application/json'
end

get "/tasks" do
  puts "RETRIEVING TASKS"
  json = JSON.pretty_generate(TASKS.find_all{|task| not task.nil?})
  puts json
  # content_type 'application/json'
  json
end

get "/tasks/:id" do |id|
  puts "RETRIEVING TASK #{id}"
  # get the task
  task = get_task id
  # return it
  JSON.pretty_generate(task)
end

post "/tasks" do
  puts "CREATING TASK"
  # parse the request
  args = JSON.parse(request.body.read.to_s)
  # create a new task from th request parameters
  new_task = Task.new(args)
  # push the new task into the list
  TASKS << new_task
  # return the new task as json
  JSON.pretty_generate(new_task)
end

put "/tasks/:id" do |id|
  puts "UPDATING #{id}"
  # retrieve the task
  task = get_task id
  # get the update arguments
  update_args = JSON.parse(request.body.read.to_s)
  # apply them to the task
  task.apply(update_args)
  # return the updated task
  JSON.pretty_generate(task)
end

delete "/tasks/:id" do |id|
  puts "DELETING #{id}"
  # nil the entry at the given index
  TASKS[id.to_i] = nil
end

def get_task(id)
  task = TASKS[id.to_i]
  not_found if task.nil?
  task
end

