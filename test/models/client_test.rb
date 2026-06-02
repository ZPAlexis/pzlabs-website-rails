require "test_helper"

class ClientTest < ActiveSupport::TestCase
  test "valid with a cookie_id" do
    client = Client.new(cookie_id: "some-uuid")
    assert client.valid?
  end

  test "invalid without a cookie_id" do
    client = Client.new
    assert_not client.valid?
    assert_includes client.errors[:cookie_id], "can't be blank"
  end

  test "cookie_id must be unique" do
    existing = clients(:alice)
    duplicate = Client.new(cookie_id: existing.cookie_id)
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:cookie_id], "has already been taken"
  end

  test "destroying a client destroys its coin_events" do
    client = clients(:alice)
    event_ids = client.coin_events.pluck(:id)
    assert event_ids.any?

    client.destroy
    event_ids.each do |id|
      assert_nil CoinEvent.find_by(id: id)
    end
  end
end
