class LiveStreamsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    @live_streams = LiveStream.where(active: true)
    render json: @live_streams
  end

  def show
    @live_stream = LiveStream.find(params[:id])
    render json: @live_stream
  end

  def create
    @live_stream = current_user.live_streams.create(live_stream_params)
    render json: @live_stream, status: :created
  end

  private

  def live_stream_params
    params.require(:live_stream).permit(:title, :stream_url, :product_link, :active)
  end
end
