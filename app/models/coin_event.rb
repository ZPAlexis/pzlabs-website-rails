class CoinEvent < ApplicationRecord
  belongs_to :client
  
  validates :coin_name, presence: true
end