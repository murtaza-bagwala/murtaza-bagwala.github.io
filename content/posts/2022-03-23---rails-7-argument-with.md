---
title: Rails 7 adds optional transaction arguments to with_lock
date: "2022-03-23T18:00:37.121Z"
template: "post"
draft: false
slug: "rails-7-adds-arguments-to-lock-with"
category: "Rails"
tags:
- "rails"
- "rails-7"
description: "With Rails 7 we can pass transaction arguments like isolation, joinable, etc directly to with_lock."
---

When it comes to concurrency control, there are specifically two mechanisms 
around it - pessimistic 
and optimistic locking.

**Optimistic locking**

The optimistic locking model is a concurrency control technique in which 
multiple users are allowed to update the same record without informing the users 
that others are also attempting to update the record. 
The record changes are validated only when the record is committed. 
If one user successfully updates the record, 
the other users attempting to commit their concurrent updates are informed that a conflict exists.

An advantage of the optimistic locking model is that 
it avoids the overhead of locking a record for the duration of the action. 
If there are no simultaneous updates, 
then this model provides fast updates.

**Pessimistic locking**

The pessimistic locking model prevents simultaneous updates to records. 
As soon as one user starts to update a record, 
a lock is placed on it. 
Other users who attempt to update this record are informed 
that another user has an update in progress. 
The other users must wait until the first user has finished committing their changes, 
thereby releasing the record lock. 
Only then can another user make changes based on the previous user's changes.

An advantage of the pessimistic locking model is that 
it avoids the issue of conflict resolution by preventing conflicts. 
Updates are serialized 
and each subsequent update starts with 
the committed record changes from the previous user.

**lock!**

In Rails 
[`ActiveRecord::Locking::Pessimistic`](https://edgeapi.rubyonrails.org/classes/ActiveRecord/Locking/Pessimistic.html) 
provides support for row-level locking using the `lock!` method wrapped inside a transaction for example:- 

If two users press the like button for an article, 
at the same time then instead of the like_count of that article going up to 2, 
it will only increment to 1, because both users pressed increment 
from 0 to 1 at the same time. 
To fix this we can use `lock!` wrapped inside a transaction.

{% highlight ruby %}
  ActiveRecord::Base.transaction do
    article = Article.find("00000000-0000-0000-0000-000000000001").lock!("FOR UPDATE NOWAIT")
    article.like_count += 1
    article.save! 
  end
{% endhighlight %}

What the code does here is 
first, it starts a database transaction. 
Second, it acquires a pessimistic database lock. 
Once the lock is acquired, the record is reloaded in memory, 
so that the values on the record match those in the locked database row. 
The lock will prevent others from reading or writing to that row 
and anyone else trying to acquire a lock will have to wait for the lock to be released.

Also, we can pass various 
[locking strategies](https://www.postgresql.org/docs/9.1/sql-select.html#SQL-FOR-UPDATE-SHARE) 
to the `lock!` method as supported by the underlying Database 
for example, we used `FOR UPDATE NOWAIT` on Postgres DB 
what it means is other transactions that attempt UPDATE, DELETE, 
or SELECT FOR UPDATE on this row will be blocked 
until the current transaction ends 
and suppose another transaction tries to acquire a lock on the same record 
then it will result in the below error.

```ruby

TRANSACTION (1.9ms)  ROLLBACK
/Users/murtazabagwala/.rvm/gems/ruby-3.0.1/gems/activerecord-6.1.4.1/lib/active_record/connection_adapters/postgresql_adapter.rb:672:in `exec_params': PG::LockNotAvailable: ERROR:  could not obtain lock on row in relation "articles" (ActiveRecord::LockWaitTimeout)
/Users/murtazabagwala/.rvm/gems/ruby-3.0.1/gems/activerecord-6.1.4.1/lib/active_record/connection_adapters/postgresql_adapter.rb:672:in `exec_params': ERROR:  could not obtain lock on row in relation "articles" (PG::LockNotAvailable)

```


**with_lock**

We can make it more concise using `with_lock`. 
`with_lock` does the same thing it creates a transaction 
and applies a lock on the record under the hood.

```ruby
  article = Article.find("00000000-0000-0000-0000-000000000001")
  article.with_lock("FOR UPDATE NOWAIT") do
    article.like_count += 1
    article.save! 
  end
```

But, before Rails 7 
there was no way to specify transaction arguments like 
`isolation`, `requires_new` and `joinable` to `with_lock` 
so, for example before Rails 7 
if we had to create the nested transactions 
we had to use multiple transaction blocks with `lock!`.

#### Before 

```ruby

  ActiveRecord::Base.transaction do
    article = Article.find("00000000-0000-0000-0000-000000000001").lock!("FOR UPDATE NOWAIT")
    article.like_count += 1
    article.save! 

    ActiveRecord::Base.transaction(requires_new: true) do
      author = article.author.lock!("FOR UPDATE NOWAIT")
      author.articles_liked += 1
      author.save! 
    end
  end

```

#### After 

After Rails 7 we can use `with_lock` to create nested transactions 
and can specify transaction optional arguments like:-

- `requires_new`: If this is set to `true` then the block will be wrapped in a database savepoint acting as a sub-transaction.
- `isolation`: We can specify the [Isolation Levels](https://www.postgresql.org/docs/current/transaction-iso.html) to avoid dirty reads.
- `joinable`: This can be set to `false` to avoid [surprises while dealing with custom nested transactions](https://makandracards.com/makandra/42885-nested-activerecord-transaction-pitfalls)

```ruby

  article = Article.find("00000000-0000-0000-0000-000000000001")

  article.with_lock do
    author = article.author
    article.like_count += 1
    article.save! 

    # Will create a new transaction called sub-transaction/savepoint.
    # And, in case of error it will rollback to this savepoint and will not rollback parent transaction

    author.with_lock("FOR UPDATE NOWAIT", requires_new: true) do
      author.articles_liked += 1
      author.save! 
    end
  end

```
 
Please [refer to this PR](https://github.com/rails/rails/pull/43224).
