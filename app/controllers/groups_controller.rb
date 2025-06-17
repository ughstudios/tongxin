class GroupsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    @groups = Group.all
    render json: @groups
  end

  def show
    @group = Group.find(params[:id])
    render json: @group
  end

  def create
    @group = Group.new(group_params)
    if @group.save
      @group.group_memberships.create(user: current_user)
      render json: @group, status: :created
    else
      render json: { errors: @group.errors }, status: :unprocessable_entity
    end
  end

  private

  def group_params
    params.require(:group).permit(:name, :description)
  end
end
