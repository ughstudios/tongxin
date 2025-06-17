class Product < ApplicationRecord
  belongs_to :post, optional: true
  has_many :cart_items, dependent: :destroy
end
