#Panel that shows a JSON message
controller :json_info do
  view :json_info

  action "index" do
    on_entry %{
    }
  end
end
