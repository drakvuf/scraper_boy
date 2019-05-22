defmodule ScraperBoyWeb.SiteView do
  use ScraperBoyWeb, :view

  def render("test.json", %{result: result}) do
    %{
      title: result.title,
      author: result.author,
      published_at: result.published_at,
      category: result.category,
      content: result.content
    }
  end
end
