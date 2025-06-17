class NotificationsController < ApplicationController
  before_action :authenticate_user!

  def index
    @notifications = []
  end
end
