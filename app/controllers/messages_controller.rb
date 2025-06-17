class MessagesController < ApplicationController
  before_action :authenticate_user!

  def index
    @messages = Message.where(recipient_id: current_user.id)
    render json: @messages
  end

  def create
    @message = current_user.messages.create(message_params)
    render json: @message, status: :created
  end

  private

  def message_params
    params.require(:message).permit(:recipient_id, :group_id, :body)
  end
end
