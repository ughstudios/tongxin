class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  serialize :preferences, JSON

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
end
