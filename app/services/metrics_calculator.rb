class MetricsCalculator
  def self.stats
    Rails.cache.fetch("coin_metrics", expires_in: 12.hours) do
      calculate_stats
    end
  end

  def self.refresh
    Rails.cache.delete("coin_metrics")
  end

  private

  def self.calculate_stats
    {
      totalCoinsCollected: CoinEvent.count,
      totalUsersWithCoins: CoinEvent.distinct.count(:client_id),
      totalUsersWithAllThreeCoins: Client.joins(:coin_events)
                                         .group(:id)
                                         .having('COUNT(DISTINCT coin_events.coin_name) >= 3')
                                         .count
                                         .keys
                                         .size
    }
  end
end