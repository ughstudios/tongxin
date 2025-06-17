class SpaController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
end
