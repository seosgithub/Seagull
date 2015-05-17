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