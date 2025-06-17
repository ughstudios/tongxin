class AddVerifiedToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :influencer_verified, :boolean, default: false
  end
end
