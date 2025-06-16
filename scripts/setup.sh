#!/bin/bash
set -e

# Build libllama if the llama_cpp gem's native extension can't
# find it. This allows the local LLM features to work out of the box.
if ! ldconfig -p | grep -q libllama; then
  echo "Building libllama from source"
  git clone --depth 1 https://github.com/ggerganov/llama.cpp.git /tmp/llama.cpp
  cmake -S /tmp/llama.cpp -B /tmp/llama.cpp/build -DLLAMA_STATIC=OFF -DLLAMA_CURL=OFF
  cmake --build /tmp/llama.cpp/build --target llama
  sudo cp /tmp/llama.cpp/build/bin/libllama.so /usr/local/lib/
  sudo cp /tmp/llama.cpp/include/llama*.h /usr/local/include/
  sudo cp /tmp/llama.cpp/ggml/include/*.h /usr/local/include/
  sudo ldconfig
fi

# Install Ruby dependencies and set up the database
echo "Installing gems"
bundle config set --local without 'production'
bundle config set --local build.llama_cpp --with-llama-dir=/usr/local
bundle install

echo "Setting up the database"
bin/rails db:setup

# Basic sanity check: start and stop the server
echo "Starting Rails server to verify setup"
bin/rails server -d -e test
sleep 5
if [ -f tmp/pids/server.pid ]; then
  kill "$(cat tmp/pids/server.pid)"
fi
echo "Setup complete"
