class CartItemsController < ApplicationController
  before_action :authenticate_user!

  def create
    @cart = current_user.cart || current_user.create_cart
    product = Product.find(params[:product_id])
    @cart.cart_items.create(product: product, quantity: params[:quantity] || 1)
    redirect_to cart_path
  end

  def destroy
    @cart = current_user.cart
    item = @cart.cart_items.find(params[:id])
    item.destroy
    redirect_to cart_path
  end
end
