# frozen_string_literal: true

source "https://rubygems.org"

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
  gem "jekyll-feed"
  gem "bigdecimal"
  gem "logger"
  gem "jekyll-remote-theme"
  gem "jekyll-sitemap"
  gem "jekyll-toc"
  gem "kramdown-parser-gfm"
end

gem "wdm", "~> 0.1", :platforms => [:windows]  
gemspec

