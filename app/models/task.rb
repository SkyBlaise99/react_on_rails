class Task < ApplicationRecord
  validates :description, presence: true
  validates :due_date, presence: true

  after_validation :set_default, on: [ :create ]

  private
  def set_default
    self.is_done = false
    self.is_pinned = false
  end
end
