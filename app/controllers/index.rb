# require 'bcrypt'

get '/' do
  if session[:user_id] != nil
    erb :home
  else
  redirect '/loginsignup'
  end
end

get '/loginsignup' do
  if session[:user_id]
    redirect '/'
  end
  erb :loginsignup
end

post '/login' do
  @user = User.find_by_username(params[:username])
  if @user.password == params[:password]
    session[:user_id] = @user.id
    current_user
      @playlist = current_user.playlists.last
      session[:playlist_id] = @playlist.id
    redirect "/home/#{@user.id}"
  else
    redirect_to '/loginsignup'
  end
end

post '/signup' do
  @user = User.new(firstname:params[:firstname], lastname:params[:lastname], username:params[:username])
  @playlist = Playlist.new(title: "default")
  @playlist.save
  session[:playlist_id] = @playlist.id
  @user.password = params[:password]
  @user.save!
  session[:user_id] = @user.id
  redirect "/home/#{@user.id}"
end

get '/home/:id' do
  @user = User.find(params[:id])
  @songs = Song.where(playlist_id: session[:playlist_id])
  @list = Playlist.last
  @playlist = Playlist.find(session[:playlist_id])
  @friends = @playlist.users
  erb :home
end

get '/playlist/:id' do
  p params[:id]
  @playlist = Playlist.find_by(id: params[:id] )
  p @playlist
  session[:playlist_id] = @playlist.id
  @playlist_songs = @playlist.songs
  @songs = []
  @playlist_songs.each do |song|
    @songs << song.title
  end

  content_type :json
  @songs.to_json
end

get '/playlist' do
  @user = current_user
  @playlist = @user.playlists.last.songs
  @songs = []
  @playlist.each do |song|
    @songs << song.title
  end

  content_type :json
  p @songs.to_json
end

post '/new_playlist' do
  playlist = Playlist.new(title: params[:title])
  playlist.save
  session[:playlist_id] = playlist.id
  current_user.playlists << playlist
  puts current_user.playlists
  redirect "/home/#{current_user.id}"
end

post '/add_song' do
  song = Song.new(title: params[:title], playlist_id: session[:playlist_id])
  song.save!
  content_type :json
  {song: song}.to_json
end

post '/add_song_from_search/:title' do
  song = Song.new(title: params[:title], playlist_id: session[:playlist_id])
  song.save!
  content_type :json
  {song: song}.to_json
end

post '/find_song' do
  song = params[:song_title]
  content_type :json
  song.to_json
end

post '/add_friend' do
  @friend = User.find_by(username: params[:username])
  playlist_id = session[:playlist_id]
  playlist = Playlist.find_by(id: playlist_id)
  p @friend
  p playlist
  @friend.playlists << playlist
  redirect "/home/#{current_user.id}"
end

get '/logout' do
  session[:user_id] = nil
  # session[:playlist_id] = nil
  redirect '/'
end


