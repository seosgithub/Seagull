controller :hierarchy do
  view :hierarchy

  action "index" do
    on_entry %{
    }
  end
end

controller :root do
  view :container_split
  spots "content", "sidebar"
    
  action :splash do 
    on_entry %{
      Embed("rotate", "content", {})
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

controller :splash do
  view :splash

  action :index do
    on_entry %{
      var info = {
        url: "http://localhost:3000/search",
        params: {},
      }
      Request("rest", info, "search_res")
    }

    on "search_res", %{
      var info = {name: params.info[0].name};
      Send("found", info);
    }
  end
end

