# Create a default admin user if it does not already exist
User.find_or_create_by!(username: 'admin') do |user|
  user.email = 'admin@example.com'
  user.password = 'admin123'
  user.password_confirmation = 'admin123'
end

# Create additional sample users
user_data = [
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' },
  { username: 'carol', email: 'carol@example.com' }
]

users = user_data.map do |attrs|
  User.find_or_create_by!(username: attrs[:username]) do |u|
    u.email = attrs[:email]
    u.password = 'password'
    u.password_confirmation = 'password'
  end
end

# Create a welcome post from the admin
admin = User.find_by(username: 'admin')
admin_post = Post.find_or_create_by!(title: 'Welcome to TongXin', user: admin) do |p|
  p.body = 'This is the first post of the site.'
end

# Create two posts for each sample user
users.each do |user|
  2.times do |i|
    Post.find_or_create_by!(title: "Post #{i + 1} by #{user.username}", user: user) do |p|
      p.body = "Example post #{i + 1} by #{user.username}."
      p.image_url = 'https://placehold.co/600x400'
    end
  end
end

alice = User.find_by(username: 'alice')
bob   = User.find_by(username: 'bob')
carol = User.find_by(username: 'carol')

# Comments on each user's posts
Post.where(user: alice).each do |post|
  Comment.find_or_create_by!(post: post, user: bob) do |c|
    c.body = 'Nice post!'
  end
end

Post.where(user: bob).each do |post|
  Comment.find_or_create_by!(post: post, user: carol) do |c|
    c.body = 'Interesting thoughts!'
  end
end

Post.where(user: carol).each do |post|
  Comment.find_or_create_by!(post: post, user: alice) do |c|
    c.body = 'Thanks for sharing.'
  end
end

# Likes for the posts
Post.where(user: alice).each do |post|
  Like.find_or_create_by!(post: post, user: bob)
end

Post.where(user: bob).each do |post|
  Like.find_or_create_by!(post: post, user: carol)
end

Post.where(user: carol).each do |post|
  Like.find_or_create_by!(post: post, user: alice)
end

users.each do |user|
  Like.find_or_create_by!(post: admin_post, user: user)
end

# Follow relationships among users
alice.follow(bob)
bob.follow(carol)
carol.follow(alice)

