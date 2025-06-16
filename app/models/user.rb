class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  serialize :preferences, JSON
  after_initialize :set_default_preferences

  def preferences=(value)
    parsed =
      if value.is_a?(String) && !value.blank?
        JSON.parse(value) rescue {}
      else
        value
      end
    super(parsed)
  end

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true

  private

  def set_default_preferences
    self.preferences ||= {}
  end
end
