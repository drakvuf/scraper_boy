defmodule ScraperBoyWeb.PageController do
  use ScraperBoyWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
