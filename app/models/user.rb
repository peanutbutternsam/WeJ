class User < ActiveRecord::Base

  include BCrypt

  has_many :user_playlists
  has_many :playlists, through: :user_playlists

  def password
    @password ||= Password.new(secure_password)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.secure_password = @password
  end

end
