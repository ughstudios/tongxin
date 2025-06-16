class RecommendationsController < ApplicationController
  def index
    posts = Post.order(created_at: :desc).limit(20)
    recommender = LlmPostRecommender.new(current_user)
    @recommended_posts = posts.select { |post| recommender.interested?(post) }
  end
end
