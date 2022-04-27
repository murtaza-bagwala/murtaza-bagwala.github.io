---
title: Rails 7 adds caching? and uncachable! helper
date: "2021-12-20T18:00:37.121Z"
template: "post"
draft: false
slug: "rails-7-caching-helper"
category: "Rails"
tags:
- "rails"
- "rails-7"
description: "Starting with Rails 7, we can add caching? helper to check whether the current code path is being cached and uncacheable! helper to avoid fragment caching."
---

We often hear ***Cache invalidation is a hard problem in computer science and could cause bugs***
but sometimes, caching something that should not be cached is a potential source of bugs
and security vulnerabilities.
Rails has a built-in mechanism for [Fragment Caching](https://guides.rubyonrails.org/caching_with_rails.html#fragment-caching),
which stores part of the rendered view as a fragment.
For subsequent requests, the pre-saved fragment is used instead of rendering it again.

But this could cause some serious bugs!
For example, we could have an S3 URL helper which generates a unique presigned URL
for each product
or one could write a form helper that outputs a request-specific auth token.
In such cases, it is better to avoid fragment caching.

### Before

We can implement fragment caching using the `cache` helper.

**views/products/index.html.erb**

```ruby
  <table>
    <thead>
        <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Image</th>
        </tr>
    </thead>

    <tbody>
        <% @products.each do |product| %>
          <% cache(product) do %>
              <%= render product %>
          <% end %>
        <% end %>
    </tbody>
  </table>
```

**views/products/_product.html.erb**

```ruby
  <tr>
    <td><%= product.title %></td>
    <td><%= product.description %></td>
    <td><%= image_tag(generate_presigned_url(product.image_url)) %></td>
  </tr>
```

But there is a bug because
we get a cached version of the product each time we render
despite generating a unique presigned URL each time.
To resolve this,
we need to include `cacheable` in the Product partial.
If someone tries to cache the product partial,
it will throw an `ActionView::Template::Error` error.

### After

```ruby
  <tr>
    <%= uncacheable! %>
    <td><%= product.title %></td>
    <td><%= product.description %></td>
    <td><%= image_tag(generate_presigned_url(product.image_url)) %></td>
  </tr>
```

which would result in,

```ruby

  ActionView::Template::Error (can't be fragment cached):
    1: <tr>
    2:     <%= uncacheable! %>
    3:   <td><%= product.title %></td>
    4:   <td><%= product.description %></td>
    5:   <td><%= image_tag(generate_presigned_url(product.image_url)) %></td>

  app/views/products/_product.html.erb:2

```


We can also use the `caching?` helper to check whether the current code path is being cached
or to enforce caching.

```ruby
  <tr>
    <%= raise Exception.new "This partial needs to be cached" unless caching? %>
    <td><%= product.title %></td>
    <td><%= product.description %></td>
  </tr>
```

For more discussion related to this change,
please refer to
[this PR](https://github.com/rails/rails/pull/42365).
