from app.db.base import Base, engine


def test_robots_txt_endpoint(client):
    response = client.get("/robots.txt")
    assert response.status_code == 200
    assert "User-agent: *" in response.text
    assert "Sitemap:" in response.text
    assert "Disallow: /review" in response.text
    assert "Disallow: /api/" in response.text
    for path in ("/api/v1/signals/", "/api/v1/community/", "/api/v1/seo/"):
        assert f"Allow: {path}" in response.text
    assert "x-robots-tag" not in response.headers


def test_public_api_json_is_crawlable_but_noindex(client):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    response = client.get("/api/v1/signals/")
    assert response.status_code == 200
    assert response.headers["x-robots-tag"] == "noindex"


def test_og_image_is_not_noindexed(client):
    response = client.get("/api/v1/seo/og/default.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert "x-robots-tag" not in response.headers


def test_sitemap_xml_endpoint(client):
    response = client.get("/sitemap.xml")
    assert response.status_code == 200
    assert response.text.startswith('<?xml version="1.0" encoding="UTF-8"?>')
    assert "<urlset" in response.text


def test_blog_sitemap_xml_endpoint(client):
    response = client.get("/blog-sitemap.xml")
    assert response.status_code == 200
    assert response.text.startswith('<?xml version="1.0" encoding="UTF-8"?>')
    assert "<urlset" in response.text
