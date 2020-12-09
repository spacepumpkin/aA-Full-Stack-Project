class Api::UsersController < ApplicationController
  before_action :require_logged_in, only: [:show, :everything]

  # Attempt to create a new user based on form inputs
  def create
    @user = User.new(user_params)
    if @user.save
      login!(@user)
      # render :show #, status: 200
      render :everything, status: 200 # ! for big fetch
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  # Returns user information (either current user's page or that of a co-member in a workspace)
  def show
    @user = User.find_by(id: params[:id])

    # if user exists, return id, username, email; else 404 Not found
    if @user
      render :show #, status: 200
    else
      render json: @user.errors.full_messages, status: 404
    end
  end

  # ! add update and destroy routes later

  # Fetch every entity associated with current user (workspaces, projects, tasks, etc.)
  def everything
    @user = User.includes(:workspaces, :projects, :tasks).find_by(id: params[:id])
    render :everything
  end

  # Remove a workspace NOT owned by user from their associated workspaces
  def remove_workspace
    @workspace = Workspace.find_by(id: params[:id])
    if @workspace.nil?
      render json: ["Workspace could not be found"], status: 404
      return
    end

    users_workspace = UsersWorkspace.find_by(user_id: current_user.id, workspace_id: @workspace.id)

    if users_workspace.nil?
      render json: ["Workspace could not be found for current user"], status: 404
      return
    end

    if users_workspace.destroy
      render template: 'workspaces/show', status: 200
    else
      render json: ["Workspace could not be removed for current user"], status: 404
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
