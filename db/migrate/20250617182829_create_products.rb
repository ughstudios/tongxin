class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2
      t.string :link_url
      t.references :post, foreign_key: true
      t.timestamps
    end
  end
end
