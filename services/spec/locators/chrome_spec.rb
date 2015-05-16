require 'open3'
require 'tempfile'
require 'securerandom'
require 'json'

#Put is in the root directory
Dir.chdir(File.join(File.dirname(__FILE__), "../../"))

#Run the sinatra server until the block is finished
def launch_server &block
  Open3.popen3 "bundle exec ruby main.rb" do |inp, out, err, t|
    pid = t[:pid]
    begin
      sleep 1
      Thread.new do
        loop do
          $stderr.puts err.readline
        end
      end
      block.call
    ensure
      begin
        Process.kill :INT, pid
      rescue Errno::ESRCH
      end
    end
  end
end

#Call some javascript code as if we were in a browser
def js_call code
  Open3.popen3 "bundle exec ruby main.rb" do |inp, out, err, t|
    pid = t[:pid]
    begin
      f = Tempfile.new(SecureRandom.hex)
      f.write code
      f.close
      system("boojs #{f.path} -t 5")
    ensure
      begin
        Process.kill :INT, pid
      rescue Errno::ESRCH
      end
    end
  end
end

#Expect some JSON to be present at an endpoint
require 'net/http'
require 'uri'
def get endpoint
  uri = URI.parse("http://localhost:3999/#{endpoint}")
  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Get.new(uri.request_uri)
  response = http.request(request)

  return JSON.parse(response.body)
end

RSpec.describe "Chrome locator" do
  it "Does allow a web-socket server to connect" do
    launch_server do
      js_call 'new WebSocket("ws://localhost:3999/chrome_debug_attach")'
      res = get "search"
      expect(res["results"].count).to eq(1)
      expect(res["results"][0]["name"]).to match /Chrome/
      expect(res["results"][0].keys).to include "name"
      expect(res["results"][0].keys).to include "platform"
      expect(res["results"][0].keys).to include "id"
    end
  end
end
