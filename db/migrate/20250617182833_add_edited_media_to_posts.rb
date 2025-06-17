class AddEditedMediaToPosts < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :edited_image_url, :string
    add_column :posts, :edited_video_url, :string
    add_column :posts, :ar_filter, :string
  end
end
