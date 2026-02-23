require "csv"

task import_legacy_data: :environment do
  CSV.foreach("tmp/migration/clients.csv", headers: true) do |row|
    Client.create!(
      id: row["Id"],
      cookie_id: row["CookieId"],
      created_at: row["Created"]
    )
  end

  CSV.foreach("tmp/migration/events.csv", headers: true) do |row|
    CoinEvent.create!(
      client_id: row["ClientId"],
      coin_name: row["CoinName"],
      collected_at: row["CollectedAt"]
    )
  end
  puts "Data migration complete!"
end
