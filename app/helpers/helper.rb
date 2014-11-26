helpers do
  def current_user
    if session[:user_id]
     @current_user ||= User.find(session[:user_id])
    end
  end
end

helpers do
  def current_playlist
    if session[:playlist_id]
     @current_playlist ||= Playlist.find(session[:playlist_id])
    end
  end
end