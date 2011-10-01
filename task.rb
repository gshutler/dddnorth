# Represents a task.
#
# `id` is controlled internally and maintained to ensure it is the same as the
# index of the task within the array they are stored in on the server side.
class Task

  attr_reader :id
  attr_accessor :name, :description, :status

  @@id = 0

  # Create a new task.
  #
  # `status` defaults to `todo` if not defined explicitly.
  def initialize(args)
    @id = @@id
    @@id += 1

    @name = args["name"]
    @description = args["description"]
    @status = args["status"] || "todo"
  end

  # Apply the given attributes to the task.
  def apply(args)
    @name = args["name"] || @name
    @description = args["description"] || @description
    @status = args["status"] || @status
  end

  # Return a JSON representation of the task.
  def to_json(*a)
    {
      'id' => @id,
      'name' => @name,
      'description' => @description,
      'status' => @status
    }.to_json(*a)
  end

end