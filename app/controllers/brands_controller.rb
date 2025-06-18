class BrandsController < ApplicationController
  before_action :authenticate_user!, except: [:index]

  def index
    @brands = Brand.all
    render json: @brands
  end
end
