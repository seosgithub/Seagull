controller :root do
  spots "content"
    
  action :splash do 
    on_entry %{
      Embed("splash", "content", {})
    }

    on "device_selected", %{
      context.sp = params.sp;
      Goto("dashboard")
    }
  end

  action :dashboard do
    on_entry %{
      Embed("dashboard", "content", context);
    }
  end
end
