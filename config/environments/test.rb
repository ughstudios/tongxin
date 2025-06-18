# frozen_string_literal: true

Rails.application.configure do
  config.eager_load = false
  # Allow asset pipeline to compile missing files during tests
  config.assets.compile = true
end
