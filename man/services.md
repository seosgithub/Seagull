#Services

##API

  * `search` - Returns an array of hashes for each found device.  Each hash has a `name`, `platform`, and `id` field.

##Locator Module
Locators find flok instances that can be connected to. They are objects defined in `./app/locators/*.rb`. Sub-class `Locator` from `locator.rb` and
use the structure described below when returning something from the search function. The `id` here is a unique identifier that can be used by the 
platform attacher to connect; it might be an IP or socket.
```ruby
{
  :name => "Name to display",
  :platform => "platform",
  :id => "3oeunth3"
}
```

##Chrome locator
The chrome locator creates a sinatra websocket endpoint at `./chrome_debug_attach`. The `CHROME` device periodically searches localhost for this
endpoint availability and then connects to it with a web-socket. The `CHROME` device then maintains a connection to this web-socket throughout the
lifetime of the services and uses it as a communication endpoint.
