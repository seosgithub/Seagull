controller :root do
  view :container_split
  spots "content", "sidebar"
    
  action :splash do 
    on_entry %{
      Embed("splash", "content", {})
      Embed("hierarchy", "sidebar", {})
    }
  end
end

controller :rotate do
  view :rotate

  action :index do
    on_entry %{
    }
  end
end
