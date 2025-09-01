source "https://rubygems.org"

gem "jekyll", "~> 4.2"
gem "jekyll-redirect-from"
gem "kramdown", "~> 2.3"
gem "rouge", "~> 3.26"

group :jekyll_plugins do
  gem "jekyll-sitemap"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Note: wdm removed due to compatibility issues with Ruby 3.2 