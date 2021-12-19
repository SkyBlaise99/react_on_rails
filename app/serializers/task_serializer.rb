class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :is_done, :due_date, :created_at, :updated_at
end
