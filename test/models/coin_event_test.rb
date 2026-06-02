require "test_helper"

class CoinEventTest < ActiveSupport::TestCase
  test "valid with a known coin name" do
    CoinEvent::VALID_NAMES.each do |name|
      event = CoinEvent.new(client: clients(:bob), coin_name: name)
      assert event.valid?, "Expected #{name} to be valid"
    end
  end

  test "invalid without a coin_name" do
    event = CoinEvent.new(client: clients(:bob))
    assert_not event.valid?
    assert_includes event.errors[:coin_name], "can't be blank"
  end

  test "invalid with an unknown coin_name" do
    event = CoinEvent.new(client: clients(:bob), coin_name: "hackCoin")
    assert_not event.valid?
    assert_includes event.errors[:coin_name], "is not included in the list"
  end

  test "requires a client" do
    event = CoinEvent.new(coin_name: "boxCoin")
    assert_not event.valid?
    assert event.errors[:client].any?
  end
end
