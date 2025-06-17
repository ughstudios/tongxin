class LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post

  def create
    @post.likes.find_or_create_by(user: current_user)
    render json: { likes_count: @post.likes.count }, status: :created
  end

  def destroy
    @post.likes.find_by(user: current_user)&.destroy
    render json: { likes_count: @post.likes.count }, status: :ok
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end
end
