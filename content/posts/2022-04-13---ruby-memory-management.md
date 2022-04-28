---
title: How does Ruby manage memory?
date: "2022-04-13T18:00:37.121Z"
template: "post"
draft: false
slug: "ruby-memory-management-part1"
category: "Ruby"
tags:
- "ruby"
- "ruby-3"
description: "Each programming language has its version of memory management so, let us look into how Ruby does this under the hood."
---

In this two-part series, we aim to demystify the concepts behind Ruby's memory management 
and take a deeper look at how 
[Variable Width Allocation](https://bugs.ruby-lang.org/issues/18045) 
can improve Ruby's memory performance.

### RVALUE

For Dynamic Memory allocation, 
the Ruby program uses Heap memory 
and the basic unit of the heap is a slot. Here, each slot occupies a value which is known as **RVALUE**. 
This **RVALUE** comprises 40 bytes and a container for objects of all types (Array, String, Class). 
Out of these 40 bytes, the initial 8 bytes are reserved for a flag, followed by 8 bytes of Klass pointer. 
The remaining 24 bytes are reserved for object-specific fields.  
For example, for a Class object, it stores the pointer to an extension object 
and for a String, it stores its content. 

![alt](/ruby-memory/r-value.jpg)

### Heap Pages:-

These 40-byte slots are organized into Heap pages. 
Heap pages are containers of 16kb memory region, 
accordingly, each Heap page has 408-409 slots 
and all the slots on the same heap page are contiguous, with no gaps in between.

![alt](/ruby-memory/heap-page.png)

### Freelist:-

Initially, when the Heap page is created, all the slots are filled with the special RVALUE type **T_NONE**.
This represents an empty slot 
and contains only a flag, 
and a Klass pointer value known as **next**. This can be further pointed to another RVALUE.

![alt](/ruby-memory/freelist1.png)

Also, when the Heap page is initialized, 
Ruby sets a pointer called **freelist** pointer to the address of the first slot, 
and then it starts visiting each of these slots. 
As it gradually gets to each slot, 
it sets the freelist pointer to the address of the current slot
and the current slot's **next** pointer to the address of the previous slot.  
It derives the address of the previous slot from its last visit by creating a LinkedList of the empty slots called **FreeList**.

![alt](/ruby-memory/freelist.gif)

### Allocating an object

So, when it needs to allocate an object, Ruby asks for an address of an empty slot from a Heap page. 
Not to mention, the Heap page always returns a freelist pointer that has an address to the empty slot, 
updates a freelist pointer with the address of the next empty slot 
and also unlinks the current empty slot from the freelist.
This allows Ruby to put data into it. 
The use of freelist keeps the object allocation operation constant in time, 
so each time Ruby asks for an empty slot, 
the Heap page just checks a value of the freelist pointer 
and returns the address to Ruby.  

![alt](/ruby-memory/alloc1.png)

Allocating an object of type Rclass

![alt](/ruby-memory/alloc2.png)

Allocating an object of type RString

![alt](/ruby-memory/alloc3.png)

Allocating an object of type RArray

![alt](/ruby-memory/alloc4.png)

And once all the slots are filled in, 
**Garbage Collector** comes into action to reclaim spaces from the dead objects.

### Garbage collection

Ruby uses the **Mark-Sweep-Compact** garbage collection algorithm, 
also when GC is active, the ruby code does not get executed. 
Let us look into each of the GC phases:-

**Marking**:- It is the phase where we determine which objects are alive 
and which can be freed. 
First, we mark the root-like global variables, 
classes, etc. along with their children 
until the mark stack is empty.

Let us consider that we have 2 Heap pages with 4 slots each from A to C and E to G. 
Empty slots are free slots 
and black slots are marked slots. 
Here, the arrow shows the references, 
for example, an arrow from A to G shows that object A 
has an instance variable declared in G.

![alt](/ruby-memory/mark1.png)

Let us start with the root elements we have - A 
and B 
and push them both on the Mark stack.
Now, let's pop one element from the stack, mark it 
and push its children on the stack. 
Here pop A, 
and push A's child G to mark stack.
Now, pop B, mark it 
and push its child E in the mark stack 
and repeat this until we have the entire Mark stack as empty. 
And, once it has marked all the objects along with their children, 
it moves to the sweep phase.

![alt](/ruby-memory/mark.gif)

**Sweeping**:- It is the phase where all the unmarked objects can be reclaimed by the garbage collector. 
So, after the marking step, this is how our heap pages look like:-

![alt](/ruby-memory/sweep1.png)

Now, GC scans all the heap pages, checks for unmarked objects, 
and frees the space. 
In our case, we have C 
and F as unmarked, therefore, GC will reclaim these spaces.

![alt](/ruby-memory/sweep2.png)

**Compaction**:- Compaction moves objects within the heap page to the start of the heap page 
and it results in various benefits including reduced memory usage, faster garbage collection, 
and better write performance. 
Also, this involves 2 steps:-

- **Compact step**:- This uses two cursors, 
**Free cursor** which moves forward 
and **Compact cursor** which moves backward. 
This is why it is also called **2 Fingers algorithm** 
and when these two cursors meet, this step is complete. 

Let us understand this through an example. 
Here, the white arrow is the Free cursor 
and the black arrow is the Compact cursor. 
The Free cursor begins from the start of the heap 
and moves to the first free slot. 
Then the Compact cursor starts from the end of the heap 
and moves to the first filled slot. 
It will then move the object at the compact cursor to the free slot 
and leave a forwarding address at the original object to remember where this object was moved. 
Now, continue moving the Free cursor forward 
and the Compact cursor backward, repeat the above steps till these two cursors meet, 
meaning that this step is complete. 
After this step, we can see all the initial free slots are filled.

![alt](/ruby-memory/compact.gif)

- **Update reference step**:- In this step, 
we update the pointers to objects which were moved in the compaction step. 
Let us continue with the previous example:-

![alt](/ruby-memory/refer1.png)

We will now have just one cursor which will scan the objects linearly 
and check if any of the objects have the reference to a forwarding address, 
So, in our case object, `A` and `B` have the references to forwarding addresses 
that says `Moved to Heap Page 1` 
and it will update the reference to the correct object which is `G` and `E`.

![alt](/ruby-memory/refer2.png)

In this blog, we looked at how Ruby manages memory 
and Garbage collection works, 
in the next blog, we will see how Variable Width Allocation works.


