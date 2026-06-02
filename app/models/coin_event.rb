class CoinEvent < ApplicationRecord
  belongs_to :client

  VALID_NAMES = %w[boxCoin fillCoin rpsCoin].freeze

  validates :coin_name, presence: true, inclusion: { in: VALID_NAMES }
end
