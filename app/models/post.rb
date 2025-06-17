class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :products, dependent: :destroy
  has_many :live_streams, dependent: :destroy

  validates :title, presence: true
  validates :body, presence: true
  validates :image_url, format: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true
  validates :video_url, format: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true
  validates :edited_image_url, format: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true
  validates :edited_video_url, format: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true
  validates :ar_filter, length: { maximum: 255 }, allow_blank: true

  scope :trending, -> { left_joins(:likes).group(:id).order('COUNT(likes.id) DESC') }

  def tag_list
    tags.pluck(:name).join(', ')
  end

  def tag_list=(names)
    tag_names = names.to_s.split(',').map { |n| n.strip.downcase }.reject(&:blank?)
    self.tags = tag_names.map { |n| Tag.find_or_create_by(name: n) }
  end
end
