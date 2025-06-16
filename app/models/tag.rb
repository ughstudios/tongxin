class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :posts, through: :taggings

  validates :name, presence: true, uniqueness: true

  scope :trending, -> { left_joins(:taggings).group(:id).order('COUNT(taggings.id) DESC') }
end
