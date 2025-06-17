class PartnershipsController < ApplicationController
  before_action :authenticate_user!

  def create
    brand = Brand.find(params[:brand_id])
    partnership = current_user.partnerships.create(brand: brand, status: 'pending')
    render json: partnership, status: :created
  end
end
