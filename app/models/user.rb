class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post

  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :following, through: :active_follows, source: :followed
  has_many :followers, through: :passive_follows, source: :follower

  serialize :preferences, JSON

  def preferences=(value)
    parsed = if value.is_a?(String)
               JSON.parse(value) rescue {}
             else
               value || {}
             end
    super(parsed)
  end

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :avatar_url, format: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true

  def follow(user)
    active_follows.find_or_create_by(followed: user) unless self == user
  end

  def unfollow(user)
    active_follows.find_by(followed: user)&.destroy
  end

  def following?(user)
    following.include?(user)
  end
end
