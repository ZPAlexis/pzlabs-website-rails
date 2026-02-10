class Client < ApplicationRecord
  has_many :coin_events, dependent: :destroy
  
  validates :cookie_id, presence: true, uniqueness: true
end