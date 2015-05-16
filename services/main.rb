require 'sinatra'
require 'sinatra-websocket'
require "sinatra/reloader" if development?
require 'sinatra/json'

#Load locators
################################################################################
require './app/locators/locators.rb'
require './app/locators/chrome.rb'
$locators = [ChromeLocator.new]
################################################################################

set :port, 3999

#Reply with JSON
def reply info=nil
  info = {:hello => 'world'} if info.nil?

  json info
end


get '/' do
  "Hello world"
end
