class MessagesController < ApplicationController
  before_action :authenticate_user!

  def index
    @messages = Message.where(recipient_id: current_user.id)
  end

  def create
    @message = current_user.messages.create(message_params)
    redirect_back fallback_location: root_path
  end

  private

  def message_params
    params.require(:message).permit(:recipient_id, :group_id, :body)
  end
end
