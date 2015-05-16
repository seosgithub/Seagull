#namespace(:spec) do
  #task :services do
    #Dir.chdir 'services' do
      #system('bundle exec rake spec')
    #end
  #end
#end

#Build the GUI into one index.html in ./gui/public/index.html. ./gui/index.html is a
#symlink to this file
namespace(:gui) do
  task :build do
    Dir.chdir './gui/' do
      require './lib/build'
      Build.run
    end
  end

  task :run => [:build] do
    Dir.chdir './gui/' do
      system('nw .')
    end
  end
end
