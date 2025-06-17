class OrdersController < ApplicationController
  before_action :authenticate_user!

  def index
    @orders = current_user.orders
  end

  def show
    @order = current_user.orders.find(params[:id])
  end

  def create
    cart = current_user.cart
    total = cart.cart_items.joins(:product).sum('cart_items.quantity * products.price')
    order = current_user.orders.create(total_price: total)
    cart.cart_items.destroy_all
    redirect_to order
  end
end
