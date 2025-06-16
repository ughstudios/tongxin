class LocalLlmClient
  DEFAULT_MODEL_PATH = ENV.fetch('LLM_MODEL_PATH', 'models/llama.bin')

  def initialize(model_path: DEFAULT_MODEL_PATH)
    require 'llama_cpp'
    @context = LlamaCpp::Context.new(model_path: model_path)
  rescue StandardError => e
    Rails.logger.warn("llama_cpp unavailable: #{e.message}; using keyword matcher")
    @context = nil
  end

  def complete(prompt, tokens: 64)
    return keyword_match(prompt) unless @context

    @context.complete(prompt: prompt, n_predict: tokens).to_s
  end

  private

  def keyword_match(prompt)
    prompt.downcase.include?('yes') ? 'Yes' : 'No'
  end
end
