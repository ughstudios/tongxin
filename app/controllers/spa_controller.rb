class SpaController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    render template: 'spa/index', layout: false
  end
end
