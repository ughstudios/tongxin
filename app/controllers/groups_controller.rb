class GroupsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    @groups = Group.all
  end

  def show
    @group = Group.find(params[:id])
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_params)
    if @group.save
      @group.group_memberships.create(user: current_user)
      redirect_to @group
    else
      render :new
    end
  end

  private

  def group_params
    params.require(:group).permit(:name, :description)
  end
end
