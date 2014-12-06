
get '/redirect_auth_url' do
  client_id = ENV["CLIENT_ID"]
  # client_id = "811933872220-hrmhkij0ati96vrn7v7v6qkjbv6vdqg7.apps.googleusercontent.com"
  redirect "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=#{client_id}&redirect_uri=http://localhost:9393/logged_in&scope=email&state=12345&approval_prompt=force"
  # redirect "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=#{client_id}&redirect_uri=https://dry-anchorage-3965.herokuapp.com/logged_in&scope=email&state=12345&approval_prompt=force"

end


get '/logged_in' do
  p params # these are your string query parameters (your authorization code will be in here!)

  token_response = HTTParty.post("https://accounts.google.com/o/oauth2/token",
                                body: {
                                      code: params[:code],
                                      # client_id: "811933872220-hrmhkij0ati96vrn7v7v6qkjbv6vdqg7.apps.googleusercontent.com",
                                      client_id: ENV["CLIENT_ID"],
                                      # client_secret: "Vybq5zHSNDwUlfaB6bV6kQGH",
                                      client_secret: ENV["CLIENT_SECRET"],
                                      redirect_uri: "http://localhost:9393/logged_in", # what you specify in your developer console (this matches the route we are currently in)
                                      grant_type: "authorization_code"
                                })

  token_response # returns an access_token, expires_in, refresh_token (optionally)

  # in order to make a request to the Google + API, we need to enable it in our Google Developer Console
  google_plus_response = HTTParty.get("https://www.googleapis.com/plus/v1/people/me?access_token=#{token_response["access_token"]}")

  first_name = google_plus_response["name"]["givenName"]
  last_name = google_plus_response["name"]["familyName"]
  user_img = google_plus_response["image"]["url"]
  email = google_plus_response["emails"].first["value"]

  @user = User.find_by(firstname: first_name)
    if @user
      session[:user_id] = @user.id
      current_user
        @playlist = current_user.playlists.last
        session[:playlist_id] = @playlist.id
      p @user
    else
      @user = User.create(firstname: first_name, lastname: last_name, email: email, username: first_name)
      p @user.id
      session[:user_id] = @user.id
      p session[:user_id]
      @playlist = Playlist.new(title: "default")
      @playlist.save
      @user.playlists << @playlist
    end

  redirect '/'
end

# def create_gplus_session(google_plus_response)
# @user = User.find_by_firstname(params[:firstname])
#   if @user
#     session[:user_id] = @user.id
#     current_user
#       @playlist = current_user.playlists.last
#       session[:playlist_id] = @playlist.id
#   else
#     @user = User.create(firstname: params[:])
#     redirect_to '/loginsignup'
#   end

# end

#<HTTParty::Response:0x7fd05cb67810 parsed_response={"kind"=>"plus#person", "etag"=>"\"RqKWnRU4WW46-6W3rWhLR9iFZQM/R42QWgZvh9NcIDarkmBwwmaByYQ\"", "gender"=>"female", "emails"=>[{"value"=>"samantha.stallings1@gmail.com", "type"=>"account"}], "objectType"=>"person", "id"=>"117641109997628040449", "displayName"=>"Sam Stallings", "name"=>{"familyName"=>"Stallings", "givenName"=>"Sam"}, "url"=>"https://plus.google.com/117641109997628040449", "image"=>{"url"=>"https://lh3.googleusercontent.com/-7st1bPM_EQM/AAAAAAAAAAI/AAAAAAAAAEI/BpTDYO0nuaA/photo.jpg?sz=50", "isDefault"=>false}, "isPlusUser"=>true, "circledByCount"=>19, "verified"=>false}, @response=#<Net::HTTPOK 200 OK readbody=true>, @headers={"expires"=>["Tue, 02 Dec 2014 23:08:20 GMT"], "date"=>["Tue, 02 Dec 2014 23:08:20 GMT"], "cache-control"=>["private, max-age=0, must-revalidate, no-transform"], "etag"=>["\"RqKWnRU4WW46-6W3rWhLR9iFZQM/R42QWgZvh9NcIDarkmBwwmaByYQ\""], "vary"=>["Origin", "X-Origin"], "content-type"=>["application/json; charset=UTF-8"], "x-content-type-options"=>["nosniff"], "x-frame-options"=>["SAMEORIGIN"], "x-xss-protection"=>["1; mode=block"], "content-length"=>["635"], "server"=>["GSE"], "alternate-protocol"=>["443:quic,p=0.02"], "connection"=>["close"]}>

