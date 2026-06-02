require "csv"

task import_legacy_data: :environment do
  clients_file = "tmp/migration/clients.csv"
  events_file  = "tmp/migration/events.csv"

  [ clients_file, events_file ].each do |path|
    unless File.exist?(path)
      abort "Migration aborted: expected file not found at #{path}"
    end
  end

  begin
    CSV.foreach(clients_file, headers: true) do |row|
      Client.create!(
        id: row["Id"],
        cookie_id: row["CookieId"],
        created_at: row["Created"]
      )
    end

    CSV.foreach(events_file, headers: true) do |row|
      CoinEvent.create!(
        client_id: row["ClientId"],
        coin_name: row["CoinName"],
        collected_at: row["CollectedAt"]
      )
    end

    puts "Data migration complete!"
  rescue CSV::MalformedCSVError => e
    abort "Migration aborted: malformed CSV — #{e.message}"
  rescue ActiveRecord::RecordInvalid => e
    abort "Migration aborted: invalid record — #{e.message}"
  end
end
