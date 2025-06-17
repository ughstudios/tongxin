class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: %i[google_oauth2 wechat]

  attr_writer :login

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post

  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :following, through: :active_follows, source: :followed
  has_many :followers, through: :passive_follows, source: :follower

  has_one :cart, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :messages, foreign_key: :sender_id, dependent: :destroy
  has_many :live_streams, dependent: :destroy
  has_many :partnerships, dependent: :destroy
  has_many :group_memberships, dependent: :destroy
  has_many :groups, through: :group_memberships

  def preferences
    raw = super()
    return {} if raw.blank?
    JSON.parse(raw) rescue {}
  end

  def preferences=(value)
    parsed = if value.is_a?(String)
               JSON.parse(value) rescue {}
             else
               value || {}
             end
    super(parsed.to_json)
  end

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :avatar_url, format: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true

  def login
    @login || username || email
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if (login = conditions.delete(:login))
      where(conditions.to_h).where(["lower(username) = :value OR lower(email) = :value", { value: login.downcase }]).first
    else
      where(conditions.to_h).first
    end
  end

  def follow(user)
    active_follows.find_or_create_by(followed: user) unless self == user
  end

  def unfollow(user)
    active_follows.find_by(followed: user)&.destroy
  end

  def following?(user)
    following.include?(user)
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize do |u|
      u.email = auth.info.email
      u.username = auth.info.name.presence || auth.info.nickname
      u.password = Devise.friendly_token[0, 20]
    end
  end
end
