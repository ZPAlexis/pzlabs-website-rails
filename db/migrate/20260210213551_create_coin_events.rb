class CreateCoinEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :coin_events do |t|
      t.references :client, null: false, foreign_key: { on_delete: :cascade }
      t.string :coin_name, null: false
      t.datetime :collected_at, null: false, default: -> { 'CURRENT_TIMESTAMP' }
    end
  end
end