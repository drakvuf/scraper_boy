defmodule ScraperBoyWeb.SiteController do
  use ScraperBoyWeb, :controller

  alias Db.Site.Service, as: Site
  alias Db.Site.ArticleSelector.Service, as: ArticleSelector
  alias Scraper.Utils

  def index(conn, _params) do
    sites = Site.lists(["active", "inactive", "selected"])

    render(conn, "index.html", sites: sites)
  end

  def edit(conn, %{"id" => id}) do
    site = Site.get!(id)
    article_selector = ArticleSelector.get!(site.article_selector.id)
    changeset = ArticleSelector.change(article_selector)

    render(conn, "edit.html", site: site, article_selector: article_selector, changeset: changeset)
  end

  def update(conn, %{"id" => id, "article_selector" => article_selector_params}) do
    site = Site.get!(id)
    article_selector = ArticleSelector.get!(id)

    case ArticleSelector.update(article_selector, article_selector_params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Oldal sikeresen frissítve.")
        |> redirect(to: Routes.site_path(conn, :index))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", site, changeset: changeset)
    end
  end

  def test(conn, %{"url" => url, "selectors" => selectors}) do
    IO.inspect url
    IO.inspect selectors
    formatted_selectors = %{
      title: selectors["title"],
      authors: selectors["authors"],
      published_at: selectors["published_at"],
      category: selectors["category"],
      content: selectors["content"],
    }
    IO.inspect formatted_selectors
    {:ok, result} = Scraper.Article.scrape(Utils.HTTPClient.HTTPoison, Utils.HTMLParser.Meeseeks, url, formatted_selectors)

    render(conn,"test.json", %{result: result})
  end
end
