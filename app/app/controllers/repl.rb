controller :repl do
  view "repl"

  action :index do
    on_entry %{
      if_sockio_fwd(context.sp, "eval_res", __base__);
    }

    on "eval_res", %{
      var k = params.res;
      var eval_res = {
        res: k[0][5].res
      }

      Send("eval_res", eval_res);
    }

    on "eval", %{
      var str = params.input;
      var info = {
        str: str
      }
      if_sockio_send(context.sp, "eval", info);
    }
  end
end
