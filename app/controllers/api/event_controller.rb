module Api
  class EventsController < ApplicationController
    skip_before_action :verify_authenticity_token

    before_action :set_client_cookie

    # POST /api/record-event
    def create
      client = Client.find_or_create_by(cookie_id: @cookie_id)

      event = client.coin_events.build(coin_name: params[:eventAction])

      if event.save
        MetricsCalculator.refresh

        render json: {
          message: "Client #{client.id} recorded new event: #{event.coin_name}.",
          clientId: client.id,
          newRecord: true
        }
      else
        render json: {
          message: "Client #{client.id} already had event: #{event.coin_name}. No new record created.",
          clientId: client.id,
          newRecord: false
        }
      end
    end

    def metrics
      data = MetricsCalculator.stats

      if data
        render json: { status: "success", data: data }
      else
        render json: { status: "error", message: "Metrics initializing..." }, status: 503
      end
    end

    private

    def set_client_cookie
      cookie_name = "pzlabs_client_id"

      if cookies[cookie_name].blank?
        new_id = SecureRandom.uuid
        cookies[cookie_name] = {
          value: new_id,
          expires: 1.year.from_now,
          httponly: true,
          secure: Rails.env.production?,
          same_site: :none
        }
        @cookie_id = new_id
        Rails.logger.info "Setting new client cookie: #{new_id}"
      else
        @cookie_id = cookies[cookie_name]
      end
    end
  end
end
