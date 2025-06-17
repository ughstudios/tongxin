class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: :show
  before_action :set_user, only: [:show, :follow, :unfollow]
  before_action :authenticate_user!, only: [:follow, :unfollow]

  def show
    render json: @user
  end

  def follow
    current_user.follow(@user)
    head :created
  end

  def unfollow
    current_user.unfollow(@user)
    head :no_content
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
