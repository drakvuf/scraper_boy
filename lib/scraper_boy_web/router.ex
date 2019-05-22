defmodule ScraperBoyWeb.Router do
  use ScraperBoyWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ScraperBoyWeb do
    pipe_through :browser

    get "/", SiteController, :index
    get "/sites", SiteController, :index
    get "/sites/:id", SiteController, :edit
    put "/sites/:id", SiteController, :update
    post "/test", SiteController, :test
  end

  # Other scopes may use custom stacks.
  # scope "/api", ScraperBoyWeb do
  #   pipe_through :api
  # end
end
