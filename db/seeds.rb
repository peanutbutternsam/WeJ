require 'faker'

30.times do
  User.create(:username => Faker::Lorem.word, :password => "fakepass", :fname => Faker::Lorem.word, :lname => Faker::Lorem.word, :email => Faker::Internet.email)
end

200.times do
  Twit.create(:content => Faker::Lorem.sentence, :user_id => User.all.sample.id)
end

100.times do
  Following.create(:follower_id => User.all.sample.id, :followed_id => User.all.sample.id)
end

