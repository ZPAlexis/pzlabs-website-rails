class MetricsCalculator
  def self.stats(cache: Rails.cache)
    cache.fetch("coin_metrics", expires_in: 12.hours) do
      calculate_stats
    end
  end

  def self.refresh(cache: Rails.cache)
    cache.delete("coin_metrics")
  end

  private

  def self.calculate_stats
    {
      totalCoinsCollected: CoinEvent.count,
      totalUsersWithCoins: CoinEvent.distinct.count(:client_id),
      totalUsersWithAllThreeCoins: Client.joins(:coin_events)
                                         .group("clients.id")
                                         .having("COUNT(DISTINCT coin_events.coin_name) >= 3")
                                         .count
                                         .length
    }
  end
end
