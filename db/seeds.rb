# Create a default admin user if it does not already exist
User.find_or_create_by!(username: 'admin') do |user|
  user.email = 'admin@example.com'
  user.password = 'admin123'
  user.password_confirmation = 'admin123'
end

