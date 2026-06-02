require "test_helper"

module Api
  class EventsControllerTest < ActionDispatch::IntegrationTest
    setup do
      Rails.cache.clear
    end

    # ---------------------------------------------------------------------------
    # POST /api/record-event
    # ---------------------------------------------------------------------------

    test "creates a new client and event on first visit" do
      assert_difference [ "Client.count", "CoinEvent.count" ], 1 do
        post api_record_event_url, params: { eventAction: "boxCoin" }, as: :json
      end

      assert_response :success
      body = response.parsed_body
      assert body["newRecord"]
      assert body["clientId"].present?
    end

    test "re-uses existing client identified by cookie" do
      post api_record_event_url, params: { eventAction: "boxCoin" }, as: :json
      client_id = response.parsed_body["clientId"]

      # Second request uses the cookie set by the first
      assert_no_difference "Client.count" do
        assert_difference "CoinEvent.count", 1 do
          post api_record_event_url, params: { eventAction: "fillCoin" }, as: :json
        end
      end

      assert_equal client_id, response.parsed_body["clientId"]
    end

    test "rejects an unknown coin name" do
      post api_record_event_url, params: { eventAction: "hackCoin" }, as: :json

      assert_response :success
      body = response.parsed_body
      assert_not body["newRecord"]
    end

    test "sets the client cookie on first visit" do
      post api_record_event_url, params: { eventAction: "boxCoin" }, as: :json

      assert_not_nil cookies["pzlabs_client_id"]
    end

    test "cookie is httponly" do
      post api_record_event_url, params: { eventAction: "boxCoin" }, as: :json

      set_cookie_header = response.headers["Set-Cookie"] || ""
      assert_match(/HttpOnly/i, set_cookie_header)
    end

    # ---------------------------------------------------------------------------
    # Full coin collection flow
    # ---------------------------------------------------------------------------

    test "collecting all three coins in sequence" do
      %w[boxCoin fillCoin rpsCoin].each_with_index do |coin, i|
        post api_record_event_url, params: { eventAction: coin }, as: :json
        assert_response :success
        assert response.parsed_body["newRecord"], "Expected newRecord for #{coin}"

        # Same client throughout
        assert_equal i + 1, CoinEvent.where(
          client_id: response.parsed_body["clientId"]
        ).count
      end

      client_id = response.parsed_body["clientId"]
      assert_equal 3, CoinEvent.where(client_id: client_id).distinct.count(:coin_name)
    end

    test "metrics reflect full collection after all three coins recorded" do
      %w[boxCoin fillCoin rpsCoin].each do |coin|
        post api_record_event_url, params: { eventAction: coin }, as: :json
      end

      get api_metrics_coins_url, as: :json
      assert_response :success

      data = response.parsed_body["data"]
      assert data["totalUsersWithAllThreeCoins"] >= 1
    end

    # ---------------------------------------------------------------------------
    # GET /api/metrics/coins
    # ---------------------------------------------------------------------------

    test "returns metrics with expected keys" do
      get api_metrics_coins_url, as: :json

      assert_response :success
      body = response.parsed_body
      assert_equal "success", body["status"]

      data = body["data"]
      assert data.key?("totalCoinsCollected")
      assert data.key?("totalUsersWithCoins")
      assert data.key?("totalUsersWithAllThreeCoins")
    end

    test "metrics counts match fixture data" do
      get api_metrics_coins_url, as: :json

      data = response.parsed_body["data"]
      assert_equal CoinEvent.count, data["totalCoinsCollected"]
      assert_equal 2, data["totalUsersWithCoins"]       # alice + bob
      assert_equal 1, data["totalUsersWithAllThreeCoins"] # alice only
    end
  end
end
