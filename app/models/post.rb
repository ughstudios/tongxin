class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user

  validates :title, presence: true
  validates :body, presence: true
  validates :image_url, format: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true

  scope :trending, -> { left_joins(:likes).group(:id).order('COUNT(likes.id) DESC') }
end
