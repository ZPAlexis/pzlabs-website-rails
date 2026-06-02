require "test_helper"

class MetricsCalculatorTest < ActiveSupport::TestCase
  # Fixtures: alice has all 3 coins, bob has 1, charlie has 0.

  setup do
    Rails.cache.clear
  end

  test "totalCoinsCollected counts all events" do
    stats = MetricsCalculator.stats
    assert_equal CoinEvent.count, stats[:totalCoinsCollected]
  end

  test "totalUsersWithCoins counts distinct clients that have at least one event" do
    stats = MetricsCalculator.stats
    assert_equal 2, stats[:totalUsersWithCoins] # alice + bob
  end

  test "totalUsersWithAllThreeCoins counts only clients with all three distinct coins" do
    stats = MetricsCalculator.stats
    assert_equal 1, stats[:totalUsersWithAllThreeCoins] # alice only
  end

  test "stats are memoized in cache" do
    # Pass an explicit MemoryStore so we test real caching behaviour
    # independently of whatever cache store the environment configures.
    cache = ActiveSupport::Cache::MemoryStore.new
    MetricsCalculator.stats(cache: cache) # prime cache
    CoinEvent.create!(client: clients(:bob), coin_name: "fillCoin")

    # cached value should not reflect the new event
    assert_equal 4, MetricsCalculator.stats(cache: cache)[:totalCoinsCollected]
  end

  test "refresh clears the cache so next call recalculates" do
    cache = ActiveSupport::Cache::MemoryStore.new
    MetricsCalculator.stats(cache: cache) # prime cache
    CoinEvent.create!(client: clients(:bob), coin_name: "fillCoin")
    MetricsCalculator.refresh(cache: cache)

    assert_equal 5, MetricsCalculator.stats(cache: cache)[:totalCoinsCollected]
  end

  test "totalUsersWithAllThreeCoins updates correctly when a client completes collection" do
    # charlie collects all three
    %w[boxCoin fillCoin rpsCoin].each do |name|
      CoinEvent.create!(client: clients(:charlie), coin_name: name)
    end
    MetricsCalculator.refresh

    assert_equal 2, MetricsCalculator.stats[:totalUsersWithAllThreeCoins]
  end
end
