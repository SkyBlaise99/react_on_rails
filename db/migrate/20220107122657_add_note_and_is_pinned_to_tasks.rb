class AddNoteAndIsPinnedToTasks < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :note, :string
    add_column :tasks, :is_pinned, :boolean
  end
end
