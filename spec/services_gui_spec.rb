require_relative 'helpers'; include SpecHelpers
Dir.chdir File.join File.dirname(__FILE__), '../'

#Testing the services GUI helpers (like the rest services)

RSpec.describe "Services for GUI" do
  it "Responds to /find" do
    sh "rake services:run GUI_PORT=3336", /SERVICES STARTED/ do
      uri = URI.parse("http://localhost:3336/find")
      http = Net::HTTP.new(uri.host, uri.port)
      request = Net::HTTP::Get.new(uri.request_uri)
      response = http.request(request)
      expect(response.body).to eq("{}")
    end
  end
end
