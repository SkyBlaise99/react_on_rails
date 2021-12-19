class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :description
      t.boolean :is_done
      t.datetime :due_date

      t.timestamps
    end
  end
end
