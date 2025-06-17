class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    extra = [:username, :preferences, :avatar_url, :bio, :influencer_verified]
    devise_parameter_sanitizer.permit(:sign_up, keys: extra)
    devise_parameter_sanitizer.permit(:account_update, keys: extra)
    devise_parameter_sanitizer.permit(:sign_in, keys: [:login])
  end
end
