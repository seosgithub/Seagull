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
      var info = {
        url: "http://localhost:3334/search",
        params: {},
      }
      Request("rest", info, "search_res")
    }

    on "search_res", %{
      var devices = params.info;

      Send("devices_updated", devices);
    }

    #User selected a device
    on "device_clicked", %{
      //Create a connection to the gui socket.io server
      var sp = tels(1);
      context.sp = sp;
      if_sockio_init("http://localhost:4444", sp);

      //Attach this socket to the correct device
      var info = {
        id: params.id,
      };
      if_sockio_send(sp, "attach", info);

      //raise this request
      var raise_info = {
        sp: sp
      };

      Raise("device_selected", raise_info);
    }
  end
end
