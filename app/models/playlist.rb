class Playlist < ActiveRecord::Base
  has_many :songs
  has_many :user_playlists
  has_many :users, through: :user_playlists
end