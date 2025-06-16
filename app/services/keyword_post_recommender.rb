class KeywordPostRecommender
  def initialize(user)
    @user = user
  end

  def interested?(post)
    keywords = extract_keywords
    return false if keywords.empty?
    text = "#{post.title} #{post.body}".downcase
    keywords.any? { |word| text.include?(word) }
  end

  private

  def extract_keywords
    prefs = @user.preferences
    return [] unless prefs
    str = if prefs.is_a?(Hash)
            prefs.values.join(' ')
          else
            begin
              parsed = JSON.parse(prefs.to_s)
              parsed.is_a?(Hash) ? parsed.values.join(' ') : prefs.to_s
            rescue JSON::ParserError
              prefs.to_s
            end
          end
    str.downcase.scan(/\w+/).uniq
  end
end
