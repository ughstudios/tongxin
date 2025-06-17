class CreatePartnerships < ActiveRecord::Migration[8.0]
  def change
    create_table :partnerships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :brand, null: false, foreign_key: true
      t.string :status
      t.timestamps
    end
  end
end
