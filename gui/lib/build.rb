require 'erb'

#This file contains the code for compiling the resources in ./app/ like javascripts, stylesheets, images, and html
#And is based on the way rails handles it's assets
module Build
  def self.run
    #Go into the gui/ directory
    Dir.chdir File.join(File.dirname(__FILE__), "../") do
      #Make sure we have a public folder
      FileUtils.mkdir_p "public"

      #Copy all ./app/assets/images into ./public
      FileUtils.cp_r "./app/assets/images/.", "public"

      #Run the erb compiler
      index = File.read "./app/views/index.html.erb"
      rdr = ERB.new(index)
      context = ERBContext.new
      File.write "./public/index.html",rdr.result(context.get_binding)
    end
  end

  #Context for the ERB file
  class ERBContext
    def initialize
      #Get javascript source
      @js = Dir["./app/assets/javascripts/**/*.js"].select{|e| File.file?(e)}.reduce("") {|s, e| s << File.read(e) << "\n"}

      @css = Dir["./app/assets/stylesheets/**/*.css"].select{|e| File.file?(e)}.reduce("") {|s, e| s << File.read(e) << "\n"}

      @html = Dir["./app/assets/views/**/*.html"].select{|e| File.file?(e)}.reduce("") {|s, e| s << File.read(e) << "\n"}
    end

    def get_binding
      binding
    end
  end
end
