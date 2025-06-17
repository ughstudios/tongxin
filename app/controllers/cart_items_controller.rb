class CartItemsController < ApplicationController
  before_action :authenticate_user!

  def create
    @cart = current_user.cart || current_user.create_cart
    product = Product.find(params[:product_id])
    item = @cart.cart_items.create(product: product, quantity: params[:quantity] || 1)
    render json: item, status: :created
  end

  def destroy
    @cart = current_user.cart
    item = @cart.cart_items.find(params[:id])
    item.destroy
    head :no_content
  end
end
