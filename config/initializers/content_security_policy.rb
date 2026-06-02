Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.font_src    :self, "https://fonts.gstatic.com"
    policy.img_src     :self, :data
    policy.object_src  :none
    policy.script_src  :self
    policy.style_src   :self, :unsafe_inline, "https://fonts.googleapis.com"
    policy.connect_src :self
  end

  # Nonces let the browser trust only Rails-generated script tags, blocking injected scripts.
  config.content_security_policy_nonce_generator = ->(request) { request.session.id.to_s }
  config.content_security_policy_nonce_directives = %w[script-src]
  config.content_security_policy_nonce_auto = true
end
