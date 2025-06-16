class FollowsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user

  def create
    @user.followers << current_user unless current_user == @user
    redirect_to @user
  end

  def destroy
    @user.followers.destroy(current_user)
    redirect_to @user
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end
end
