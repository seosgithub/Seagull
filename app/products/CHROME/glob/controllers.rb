controller :root do
  view :container
  spots "content"
    
  action :splash do 
    on_entry %{
      Embed("splash", "content", {})
    }
  end
end

controller :splash do
  view :splash

  action :index do
    on_entry %{
    }
  end
end

