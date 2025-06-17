class PartnershipsController < ApplicationController
  before_action :authenticate_user!

  def create
    brand = Brand.find(params[:brand_id])
    current_user.partnerships.create(brand: brand, status: 'pending')
    redirect_back fallback_location: brands_path
  end
end
