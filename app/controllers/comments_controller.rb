class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post
  before_action :set_comment, only: :destroy

  def create
    @comment = @post.comments.build(comment_params.merge(user: current_user))
    if @comment.save
      render json: @comment, status: :created
    else
      render json: { errors: @comment.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if @comment.user == current_user
      @comment.destroy
      head :no_content
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_comment
    @comment = @post.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:body)
  end
end
