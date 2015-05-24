controller :hierarchy do
  spots "selector", "info"

  action "index" do
    on_entry %{
      Embed("hierarchy_selector", "selector", context);
      Embed("hierarchy_vc_info", "info", context);
    }

    on "vc_clicked", %{
      //Save the clicked vc ptr
      context.clicked_ptr = params.ptr;

      var info = {
        ptr: context.clicked_ptr
      };

      Lower("selector", "vc_selected", info);
      Lower("info", "vc_selected", info);
    }
  end
end

controller :hierarchy_selector do
  action "index" do
    on_entry %{
      if_sockio_fwd(context.sp, "debug_dump_ui_res", __base__);

      var info = {
      }
      if_sockio_send(context.sp, "hierarchy", info);

    }

    on "vc_selected", %{
      Send("vc_selected", params);
    }

    on "debug_dump_ui_res", %{
      Send("hierarchy_updated", params);
    }

    on "highlight", %{
      if_sockio_send(context.sp, "highlight", params);
    }
  end
end

controller :hierarchy_vc_info do
  action "index" do
    on_entry %{
      if_sockio_fwd(context.sp, "debug_controller_describe_res", __base__)
    }

    on "debug_controller_describe_res", %{
      Send("context_update", params.context);
      Send("events_update", params.events);
    }

    on "fwd_int_event", %{
      var info = {
        bp: context.selected_vc,
        name: params.name,
        info: params.info
      };
      if_sockio_send(context.sp, "fwd_int_event", info);
    }

    on "vc_selected", %{
      context.selected_vc = params.ptr;

      var info = {
        bp: params.ptr,
      }
      if_sockio_send(context.sp, "int_debug_controller_describe", info);
    }
  end
end
