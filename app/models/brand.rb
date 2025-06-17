class Brand < ApplicationRecord
  has_many :partnerships, dependent: :destroy
end
