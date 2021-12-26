class Task < ApplicationRecord
  validates :description, presence: true
  validates :due_date, presence: true

  after_validation :set_is_done, on: [ :create ]

  private
  def set_is_done
    self.is_done = false
  end
end
