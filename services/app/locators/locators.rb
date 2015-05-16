class Locator
  #Return an array of Entities
  def search

  end
end

get "/search" do
  res = []
  res = $locators.map do |l|
    l.search
  end

  reply :results => res.flatten
end
