controller :splash do
  view :splash

  action :index do
    on_entry %{
      var info = {
        ticks: 4,
      }
      Request("timer", info, "tick")
    }

    on "tick", %{
      console.log("tick");
      var info = {
        url: "http://localhost:3334/search",
        params: {},
      }
      Request("rest", info, "search_res")
    }

    on "search_res", %{
      var device = params.info[0];
      if (device != undefined) {
        var info = {name: params.info[0].name};
        Send("found", info);
      } else {
        Send("found", null);
      }
    }
  end
end
