class LlmPostRecommender
  def initialize(user, llm: nil)
    @user = user
    @llm = llm || safe_llm
    @keyword = KeywordPostRecommender.new(user)
  end

  def interested?(post)
    meta = @user.preferences.to_json
    prompt = <<~TEXT
      The following JSON describes a user's interests:
      #{meta}
      Based on these interests, would the user be interested in the post titled "#{post.title}" with body:
      #{post.body}
      Respond with "Yes" or "No".
    TEXT
    return @keyword.interested?(post) unless @llm
    response = @llm.complete(prompt, tokens: 8)
    response.downcase.include?('yes')
  rescue StandardError => e
    Rails.logger.error("LLM recommendation failed: #{e.message}")
    @keyword.interested?(post)
  end

  private

  def safe_llm
    LocalLlmClient.new
  rescue StandardError => e
    Rails.logger.error("LLM load failed: #{e.message}")
    nil
  end
end
