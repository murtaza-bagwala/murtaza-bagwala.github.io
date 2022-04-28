---
title: Rails 7 adds support for deferrable foreign key constraints in PostgreSQL
date: "2022-03-29T18:00:37.121Z"
template: "post"
draft: false
slug: "rails-7-adds-deferred-constraint"
category: "Rails"
tags:
- "rails"
- "rails-7"
description: "By default, foreign key constraints in PostgreSQL are checked after each statement. This works for most use cases but becomes a major limitation when creating related records before the parent record is inserted into the database."
---

---
title: Rails 7 adds optional transaction arguments to with_lock
date: "2022-03-23T18:00:37.121Z"
template: "post"
draft: false
slug: "8-ways-to-handle-state-management-part-2"
category: "State Normalization"
tags:
- "rails"
- "rails-7"
description: "With Rails 7 we can pass transaction arguments like isolation, joinable, etc directly to with_lock."
---

In the database, the Foreign Key constraint enforces referential integrity. 
This ensures the parent record has to be present before creating a child record 
and these constraints are immediately enforced(checked after each statement). 
But, this behavior can be changed within a transaction by changing a constraints `deferrable` characteristics, 
which means instead of checking the constraints immediately, these checks will be deferred until the transaction is committed
and PostgreSQL supports this feature in which constraints [can be deferred](https://www.postgresql.org/docs/9.2/sql-set-constraints.html)

So, before Rails 7, we had to write a raw SQL in migrations to use the `deferrable` constraints in Postgres.


#### Before

```ruby
# /db/migrate/20220322071034_add_foreign_key_to_reviews.rb

add_foreign_key :reviews, :products
```

```ruby
Product.transaction do
  review = Review.create!(product_id: 11, comment: "amazing product")
  product = Product.create!(id: 11, title: "Hand Sanitizer", description: "new sanitizer in town")
end
```

It will result in the below error

```ruby
TRANSACTION (1.0ms)  ROLLBACK
/Users/murtazabagwala/.rvm/gems/ruby-3.0.2/gems/activerecord-7.0.2.3/lib/active_record/connection_adapters/postgresql_adapter.rb:768:in `exec_params': PG::ForeignKeyViolation: ERROR:  insert or update on table "reviews" violates foreign key constraint "fk_rails_bedd9094d4" (ActiveRecord::InvalidForeignKey)
DETAIL:  Key (product_id)=(11) is not present in table "products".
```

#### After

But, in Rails 7, while passing the `:deferrable` option to the `add_foreign_key` statement in migrations, 
it is possible to defer this check.

We can specify whether 
or not the foreign key should be deferrable. 
Valid values are booleans or `:deferred` or `:immediate`.

- `deferrable: false`:- Default value, constraint check is always immediate.
- `deferrable: true` :- Doesn't change the default behavior, 
but allows [manually deferring the check within a transaction](https://www.postgresql.org/docs/9.2/sql-set-constraints.html).
- `deferrable: :deferred` :- Constraint check will be done once the transaction is committed 
and allows the [constraint behavior to change within transaction](https://www.postgresql.org/docs/9.2/sql-set-constraints.html).
- `deferrable: :immediate` :- Constraint check is immediate 
and allows the [constraint behavior to change within transaction](https://www.postgresql.org/docs/9.2/sql-set-constraints.html).

```ruby
# /db/migrate/20220322071050_add_foreign_key_to_reviews.rb

add_foreign_key :reviews, :products, deferrable: :deferred
```

```ruby
Product.transaction do
  review = Review.create!(product_id: 11, comment: "amazing product")
  product = Product.create!(id: 11, title: "Hand Sanitizer", description: "new sanitizer in town")
end
```

Records will be created successfully

```ruby
TRANSACTION (1.2ms)  BEGIN
Review Create (1.7ms)  INSERT INTO "reviews" ("comment", "created_at", "updated_at", "product_id") VALUES ($1, $2, $3, $4) RETURNING "id"  [["comment", "amazing product"], ["created_at", "2022-03-22 07:44:17.296514"], ["updated_at", "2022-03-22 07:44:17.296514"], ["product_id", 11]]
Product Create (1.5ms)  INSERT INTO "products" ("id", "title", "description", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5) RETURNING "id"  [["id", 11], ["title", "Hand Sanitizer"], ["description", "new sanitizer in town"], ["created_at", "2022-03-22 07:44:17.306941"], ["updated_at", "2022-03-22 07:44:17.306941"]]
TRANSACTION (2.4ms)  COMMIT
```


Check out this [pull request](https://github.com/rails/rails/pull/41487) to know about the change.
