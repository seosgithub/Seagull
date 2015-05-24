controller :dashboard do
  spots "content"
  
  action :hierarchy do
    on_entry %{
      var info = {
        sp: context.sp
      }
      Embed("hierarchy", "content", info)
    }

    on "repl_clicked", %{
      Goto("repl");
    }
  end

  action :repl do
    on_entry %{
      var info = {
        sp: context.sp
      }
      Embed("repl", "content", info)
    }

    on "hierarchy_clicked", %{
      Goto("hierarchy");
    }
  end

end
