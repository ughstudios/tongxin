class SetDefaultPreferences < ActiveRecord::Migration[8.0]
  def change
    change_column_default :users, :preferences, '{}'
  end
end
