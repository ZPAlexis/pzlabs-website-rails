class CreateClients < ActiveRecord::Migration[8.1]
  def change
    create_table :clients do |t|
      t.string :cookie_id, null: false
      t.index :cookie_id, unique: true 
      t.timestamps 
    end
  end
end