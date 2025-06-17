class CreateLiveStreams < ActiveRecord::Migration[8.0]
  def change
    create_table :live_streams do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.string :stream_url
      t.string :product_link
      t.boolean :active, default: false
      t.timestamps
    end
  end
end
