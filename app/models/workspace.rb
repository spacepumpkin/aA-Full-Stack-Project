# == Schema Information
#
# Table name: workspaces
#
#  id          :bigint           not null, primary key
#  name        :string           not null
#  description :text
#  creator_id  :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null

class Workspace < ApplicationRecord
  validates :name, presence: true,
                   length: { maximum: 25, too_long: "can't be over 25 characters" },
                   uniqueness: { scope: :creator_id }
  validate :name_cannot_start_with_space

  def name_cannot_start_with_space
    if name.present? && name.starts_with?(" ")
      errors.add(:name, "cannot start with a space")
    end
  end

  # * BUILT-IN ASSOCIATIONS ----------------------------------------

  # Join Table for Users that are members of the Workspace
  has_many :users_workspaces,
    foreign_key: :workspace_id,
    class_name: :UsersWorkspace,
    dependent: :destroy # ! necessary?

  has_many :users,
    through: :users_workspaces,
    source: :user

  # A Workspace has 1 creator
  belongs_to :workspace_creator,
    foreign_key: :creator_id,
    class_name: :User

  # A Workspace has 0+ projects
  has_many :projects,
    foreign_key: :workspace_id,
    class_name: :Project,
    dependent: :destroy

  # * CUSTOM ASSOCIATIONS ----------------------------------------

  # All the tasks associated with all the projects under a workspace
  has_many :projects_tasks,
    through: :projects,
    source: :tasks
end
