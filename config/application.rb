require_relative 'boot'

require 'rails/all'
require 'sprockets/railtie'

Bundler.require(*Rails.groups)

module TongXin
  class Application < Rails::Application
    config.load_defaults 8.0
  end
end
