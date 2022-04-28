---
title: Ruby 3.1 introduces Variable Width Allocation for Strings
date: "2022-04-19T18:00:37.121Z"
template: "post"
draft: false
slug: "ruby-memory-management-part2"
category: "Ruby"
tags:
- "ruby"
- "ruby-3"
description: "In this blog let us understand how Variable Width Allocation works in Ruby"
---

This post is in continuation of [part 1](https://murtazabagwala.xyz/posts/ruby-memory-management-part1) 
and in this blog, we will take a deeper look at how 
[Variable Width Allocation](https://bugs.ruby-lang.org/issues/18045) works 
and how it
can improve Ruby's memory performance. 
Before getting into the **VWA** let us understand how large objects get allocated on Heap.

### Large objects on the Heap

As we know the size of the slot is 40 bytes, 
in which only 24 bytes are used for storing content. 
The rest of the 16 bytes are used for storing the flag 
and the pointer to other RVALUE. 
Now let us look at the example in which we need to allocate a string of 12 bytes 
and 37 bytes-

So, in the case of 12 bytes, as it is less than 24 bytes, 
Ruby stores the entire string content in the same slot.

![alt](/ruby-memory/large-object1.gif)

And in the case of 37 bytes, 
as it is greater than 24 bytes, 
Ruby makes a `malloc` call to reserve the memory space outside of a Ruby Heap 
from System Heap to store the content of 37 bytes String. 
Next, it stores the address of the System Heap into the slot 
and set the flag values as `NO_EMBED` 
which means the content is not embedded in the slot 
and it stores the pointer to content.

![alt](/ruby-memory/lballoc3.png)

After the allocation.

![alt](/ruby-memory/iballoc6.png)

### Bottlenecks of Ruby Heap

- Storing content somewhere else than in the heap slot itself causes poor caching locality.
- While allocating large objects Ruby uses `malloc` calls which is a really expensive call and cause a performance overhead.

Let us understand these points in detail:-

### Caching

Let us understand how it causes poor caching locality. So, CPU has 3 levels of caches L1, L2, 
and L3.

As L1 is on the core itself, it is faster than L2 
and L3. 
But, this cache is very small only of 32Kb
L2 is faster than L3
and it has a cache size of 512Kbs
L3 is the slowest cache 
and it has a much larger capacity of 32Mb

![alt](/ruby-memory/IBALLOC7.png)

When data is fetched from the main memory, it is also stored in these caches. 
So, if we continue with the above example of 37 bytes String, 
to cache it, we need to make 2 fetches- 
first from the main memory 
and then from main memory to system memory to fetch its content. 
Then the total size of the fetched content will be 40 (RVALUE) + 37 (Content) = 77 bytes.

### Malloc

Acquiring system memory using `Malloc` is not free. 
It comes with the performance overhead, 
therefore, we need to minimize the number of times we are calling the `malloc`. 
`malloc` also requires space for headers that store metadata when allocating memory 
that results in increased memory usage.

Hence, to overcome the above bottlenecks, 
**Variable Width Allocation** was introduced.

### Variable Width Allocation:-

The major goal of this project was to improve the overall performance of Ruby.
Hence, by placing the contents directly after the RVALUE, it can
improve the cache locality 
and by allocating dynamic size slots in a heap page, 
it can avoid expensive `malloc` system calls.

Let us understand how **VWA** works.

We know that Ruby's heap is divided into pages 
and each page is divided into a fixed size slot of 40 bytes. 
Now **VWA** introduced the heap pages that comprises sizes other than 40 bytes 
and to accommodate this, 
a new structure is introduced called **Size Pool**. 
And, **Size Pool** is a collection of Heap pages with a particular slot size.
The slot size is a 
[power of 2 multiplied by the size of RVALUE](https://github.com/ruby/ruby/pull/4933/files#diff-d1cee85c3b0e24a64519c11150abe26fd0b5d8628a23d356dd0b535ac4595d49R2339) 
so it will be 40, 80, 160, 320, etc.

So, here is a diagram of **Size Pools** having heap pages of different slot sizes.

![alt](/ruby-memory/size-pool.png)

Now, when it needs to allocate the same string of 37 bytes, i.e., 40 (RVALUE) + 37 (Content) = 77 bytes.
according to the 
[source code](https://github.com/ruby/ruby/pull/4933/files#diff-d1cee85c3b0e24a64519c11150abe26fd0b5d8628a23d356dd0b535ac4595d49R2435), 
it will calculate the index of the size pool using the below formula-

```
slot_count = ceil ( total_size / sizeOf(R_VALUE) ) = ceil ( 77 / 40)
slot_count = 2

pool_index = ceil (log slot_count ) = ceil (log 2) = 1  // log with base 2
```

Next, it will go to the pool at index 1 which has a heap of pages of slot size 80 
and do the allocation. 
So, after allocating 77 bytes on 80 bytes slot, still, 3 bytes are being wasted. 
However, benchmarking has shown that this has very little effect on the overall memory 
and runtime performance.

So, this is how variable-width allocation works. 
Currently, usage of **VWA** is only limited to Class 
and String types. 
Strings with known sizes at allocation time that are small enough are allocated as an embedded string 
and for strings with unknown sizes, or with contents that are too large, 
it falls back to allocating 40-byte slots 
and store the contents in the malloc heap.

Also, if an embedded string is expanded during runtime 
and can no longer fill the slot, 
it is moved into the malloc heap. 
This means that some space in the slot is wasted. 
For example, if the string was originally allocated in a 160-byte slot with **VWA** 
and 
if it gets changed to 200 bytes during runtime, 
then the content will be moved to the malloc heap, 
and 40 bytes will still reside in the old slot of 160 bytes. This results in 120 bytes of the slot getting wasted.

We can take a look at some benchmarks results [here](https://bugs.ruby-lang.org/issues/18045#Benchmark-results), which shows how **VWA** has improved Ruby's memory performance.

Check out
[the PR](https://github.com/ruby/ruby/pull/4933)
for more details.
