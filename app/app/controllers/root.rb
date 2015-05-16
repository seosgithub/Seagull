controller :root do
  view :container
  spots "content"
    
  action :splash do 
    on_entry %{
      Embed("splash", "content", {})
    }
  end
end
