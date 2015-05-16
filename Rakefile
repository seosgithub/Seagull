#namespace(:spec) do
  #task :services do
    #Dir.chdir 'services' do
      #system('bundle exec rake spec')
    #end
  #end
#end

#Build the GUI into one index.html in ./gui/products/index.html. ./gui/index.html is a
#symlink to this file
namespace(:gui) do
  task :build do
    FileUtils.mkdir_p "./gui/products/"
    Dir.chdir './gui/' do
      `touch './products/index.html'`
    end
  end
end
