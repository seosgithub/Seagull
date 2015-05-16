#The chrome locator 
require File.join File.dirname(__FILE__), "chrome.rb"

#The CHROME locator must establish a web-socket server and then hand off
#socket connections because clients have no ability to be connected to
#themselves
$chrome_debug_sockets = []
get "/chrome_debug_attach" do
  if request.websocket?
    request.websocket do |s|
      $chrome_debug_sockets << s

      s.onopen do
        s.send "Hello"
      end
    end
  end
end

class ChromeLocator < Locator
  def initialize
  end

  def search
    return $chrome_debug_sockets.map do |e|
      {
        :name => "Chrome (localhost)",
        :platform => "chrome",
        :id => e.inspect,
      }
    end
  end
end
