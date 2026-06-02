class AddIndexToCoinEventsCollectedAt < ActiveRecord::Migration[8.1]
  def change
    add_index :coin_events, :collected_at
  end
end
