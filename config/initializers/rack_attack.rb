class Rack::Attack
  # Limit coin event recording to 9 requests/minute per IP (covers full 3-coin collection with headroom).
  throttle("api/record-event", limit: 9, period: 1.minute) do |req|
    req.ip if req.path == "/api/record-event" && req.post?
  end

  self.throttled_responder = lambda do |_req|
    [ 429, { "Content-Type" => "application/json" }, [ '{"error":"Too many requests. Please try again later."}' ] ]
  end
end
