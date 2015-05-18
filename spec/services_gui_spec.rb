require_relative 'helpers'; include SpecHelpers
Dir.chdir File.join File.dirname(__FILE__), '../'

#Testi"ng the services GUI helpers (like the rest services)
RSpec.describe "Services for GUI" do
  #it "Responds to /search" do
    #sh "rake services:run GUI_PORT=#{GUI_PORT}", /SERVICES STARTED/ do
      #get("http://localhost:#{GUI_PORT}/search")
    #end
  #end

  #it "Responds to /search with a blank array" do
    #sh "rake services:run GUI_PORT=#{GUI_PORT}", /SERVICES STARTED/ do
      #res = get("http://localhost:#{GUI_PORT}/search")
      #expect(res).to eq([])
    #end
  #end

  #it "Responds to /search with a non-blank array when a CHROME device connects via websocket" do
    #sh "rake services:run GUI_PORT=#{GUI_PORT} DEBUG_CHROME_WS_PORT=#{DEBUG_CHROME_WS_PORT}", /SERVICES_STARTED/ do
      #code = %{
        #$(document).ready(function() {
          #var socket = io("http://localhost:9999")
          #console.log("OPEN");
        #});
      #}

      #chrome code, /OPEN/ do
        #res = get("http://localhost:#{GUI_PORT}/search")
        #expect(res.class).to eq(Array)
        #expect(res.count).to eq(1)
      #end
    #end
  #end

  #it "Responds to /search with a correct hash when a CHROME device connects via websocket" do
    #sh "rake services:run GUI_PORT=#{GUI_PORT} DEBUG_CHROME_WS_PORT=#{DEBUG_CHROME_WS_PORT}", /SERVICES_STARTED/ do
      #code = %{
        #$(document).ready(function() {
          #var socket = io("http://localhost:9999")
          #console.log("OPEN");
        #});
      #}

      #chrome code, /OPEN/ do
        #res = get("http://localhost:#{GUI_PORT}/search")
        #expect(res[0].class).to eq({}.class)
        #expect(res[0].keys).to include("name")
        #expect(res[0].keys).to include("platform")
        #expect(res[0].keys).to include("id")
      #end
    #end
  #end

  it "Removes /search entry when CHROME device disconnects" do
    sh "rake services:run GUI_PORT=#{GUI_PORT} DEBUG_CHROME_WS_PORT=#{DEBUG_CHROME_WS_PORT}", /SERVICES_STARTED/ do
      code = %{
        $(document).ready(function() {
          var socket = io("http://localhost:9999")
          console.log("OPEN");
        });
      }

      #We want this to run and then shutdown
      chrome code, /OPEN/ do
        sleep 0.5
      end

      res = get("http://localhost:#{GUI_PORT}/search")
      expect(res.count).to eq(0)
    end
  end
end
