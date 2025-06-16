class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: :show
  before_action :set_user, only: [:show, :follow, :unfollow]
  before_action :authenticate_user!, only: [:follow, :unfollow]

  def show
  end

  def follow
    current_user.follow(@user)
    redirect_to @user
  end

  def unfollow
    current_user.unfollow(@user)
    redirect_to @user
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
