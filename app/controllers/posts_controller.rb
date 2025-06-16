class PostsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show, :trending]
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = Post.order(created_at: :desc).all
  end

  def feed
    @posts = Post.joins(user: :followers).where(follows: { follower_id: current_user.id })
                 .or(Post.where(user: current_user)).order(created_at: :desc)
    render :index
  end

  def trending
    @posts = Post.order(likes_count: :desc).limit(20)
    render :index
  end

  def show
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.build(post_params)
    if @post.save
      redirect_to @post, notice: 'Post was successfully created.'
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @post.update(post_params)
      redirect_to @post, notice: 'Post was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @post.destroy
    redirect_to posts_url, notice: 'Post was successfully destroyed.'
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :body, :image_url)
  end
end
