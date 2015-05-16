require 'sinatra'
require "sinatra/reloader" if development?

set :port, 3999

get '/' do
  "Hello world"
end
