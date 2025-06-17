class PostsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show, :trending, :tagged]
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = if params[:q].present?
               Post.where("title ILIKE ? OR body ILIKE ?", "%#{params[:q]}%", "%#{params[:q]}%")
             else
               Post.all
             end
    @posts = @posts.order(created_at: :desc)

    if user_signed_in?
      @feed_posts = Post.where(user_id: current_user.following_ids).order(created_at: :desc)
      recent_posts = Post.order(created_at: :desc).limit(20)
      recommender = LlmPostRecommender.new(current_user)
      @recommended_posts = recent_posts.select { |post| recommender.interested?(post) }
    end
    @top_tags = Tag.trending.limit(10)
  end

  def tagged
    @tag = Tag.find_by!(name: params[:name])
    @posts = @tag.posts.order(created_at: :desc)
    render :index
  end

  def feed
    @posts = Post.where(user_id: current_user.following_ids).order(created_at: :desc)
    render :index
  end

  def trending
    @posts = Post.trending.limit(10)
    render :trending
  end

  def videos
    @posts = Post.where.not(video_url: [nil, '']).order(created_at: :desc)
  end

  def show
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.build(post_params)
    @post.tag_list = params[:post][:tag_list]
    if @post.save
      redirect_to @post, notice: 'Post was successfully created.'
    else
      render :new
    end
  end

  def edit
  end

  def update
    @post.tag_list = params[:post][:tag_list]
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
    params.require(:post).permit(:title, :body, :image_url, :video_url)
  end
end
