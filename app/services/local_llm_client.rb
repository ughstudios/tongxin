class LocalLlmClient
  DEFAULT_MODEL_PATH = ENV.fetch('LLM_MODEL_PATH', 'models/llama.bin')

  def initialize(model_path: DEFAULT_MODEL_PATH)
    require 'llama_cpp'
    @context = LlamaCpp::Context.new(model_path: model_path)
  rescue LoadError
    raise 'Please add the llama_cpp gem to use the local LLM.'
  end

  def complete(prompt, tokens: 64)
    @context.complete(prompt: prompt, n_predict: tokens).to_s
  end
end
