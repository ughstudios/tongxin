class BrandsController < ApplicationController
  before_action :authenticate_user!, except: [:index]

  def index
    @brands = Brand.all
  end
end
