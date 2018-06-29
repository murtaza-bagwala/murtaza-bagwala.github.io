---
layout: post
title: Strategies to create Observable Sequence
---

In the previous posts we got to know what `Observable` is and how it is different from `Subject`.
Also, in previous examples we used `Subjects` and manually pushed values into them to create a `Observable` sequence to understand some key concept like most important Rx method, **subscribe**. In most cases, subjects are not the best way to create a new Observable. We will now see some tidier ways to create observable sequences using some simple Factory methods.

## Observable.just

The just method creates an Observable that will emit a predifined sequence of values, supplied on creation, and then terminate.

{% highlight java %}
Observable<String> values = Observable.just("one", "two", "three");
Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);

// Output
// Received: one
// Received: two
// Received: three
// Completed
{% endhighlight %}

## Observable.empty

This observable will emit a single onCompleted and nothing else.

{% highlight java %}
Observable<String> values = Observable.empty();
Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);

// Output
// Completed
{% endhighlight %}

## Observable.never

This observable will never emit anything

{% highlight java %}
Observable<String> values = Observable.never();
Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);
{% endhighlight %}

The code above will print nothing. Note that this doesn't mean that the program is blocking. In fact, it will terminate immediately.

## Observable.error

This observable will emit a single error event and terminate.

{% highlight java %}
Observable<String> values = Observable.error(new Exception("Oops"));
Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);

// Output
// Error: java.lang.Exception: Oops
{% endhighlight %}

Now, you could have thought why we need these kind of Observables which do nothing so, the `Empty`, `Never`, and `Throw` operators generate Observables with very specific and limited behavior. These are useful for testing purposes, and sometimes also for combining with other Observables or as parameters to operators that expect other Observables as parameters.

Now the most important and powerful function for creating Observable which gets widely used is `Observable.create`.

## Observable.create

{% highlight java %}
static <T> Observable<T> create(Observable.OnSubscribe<T> f)
{% endhighlight %}

The Observable.OnSubscribe<T> is simpler than it looks. It is basically a function that takes a Subscriber<T> for type T. Inside it we can manually determine the events that are pushed to the subscriber.

{% highlight java %}
Observable<String> values = Observable.create(subscriber -> {
  subscriber.onNext("Hello");
  subscriber.onCompleted();
});
Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);

// Output
// Received: Hello
// Completed
{% endhighlight %}

When Observer subscribes to the observable (here: values), the corresponding Subscriber instance is passed to your function. As the code is executed, values are being pushed to the subscriber. Note that you have to call onCompleted in the end by yourself, if you want the sequence to signal its completion.

The key difference as compared to `Subject` is that the code is executed lazily, when and if an observer subscribes. In the example above, the code is run not when the observable is created (because there is no Subscriber yet), but each time subscribe is called. This means that every value is generated again for each subscriber.

This `Observable.create` is the preferred way of creating a custom observable, when none of the existing shorthands serve your purpose. The code is similar to how we created a `Subject` and pushed values to it, but there are a few important differences. First of all, the source of the events is neatly encapsulated and separated from unrelated code that means we can place the data source in Observable like this

{% highlight java %}
Observable<String> values = Observable.create(subscriber -> {
  while (data = getDataFromTwitter()) {
    subscriber.onNext(data);
  }
});
Observable.onNext() // there is no such method defined
// here we are not allowed to push value to the Observables once it is created
{% endhighlight %}


But, in case of `subject` we can push the value even after creating it that could cause a serious
dangers that are not obvious: with a `Subject` you are managing state, and anyone with access to the instance can push values into it and alter the sequence

{% highlight java %}
PublishSubject<Double> subject = PublishSubject.create();
subject.subscribe((v -> System.out.println("First: "+ v)));
subject.onNext(1.0); // here we can push the value even after subject is created
subject.subscribe((v -> System.out.println("Second: "+ v)));
subject.onNext(2.0);
{% endhighlight %}

## Observable.from

Much like most of the functions we've seen so far, you can turn any kind of input into an Rx `Observable` with `create`.

`Futures` are part of the Java framework and you may have used it for concurrency. Since, once task is completed  they return a single value so, we can turn them into observables.

{% highlight java %}
FutureTask<Integer> f = new FutureTask<Integer>(() -> {
  Thread.sleep(2000);
  return 21;
});
new Thread(f).start();

Observable<Integer> values = Observable.from(f);

Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);

// Output
// Received: 21
// Completed
{% endhighlight %}

The observable emits the result of the FutureTask when it is available and then terminates. If the task is canceled, the observable will emit a `java.util.concurrent.CancellationException` error.

If you're interested in the results of the Future for a limited amount of time, you can provide a timeout period like this

{% highlight java %}
Observable<Integer> values = Observable.from(f, 1000, TimeUnit.MILLISECONDS);
{% endhighlight %}

If the `Future` has not completed in the specified amount of time, the observable will ignore it and fail with a **TimeoutException**.

You can also turn any collection into an observable using the overloads of `Observable.from` that take `arrays` and `iterables`. This will result in every item in the collection being emitted and then a final `onCompleted` event.

{% highlight java %}
Integer[] is = {1,2,3};
Observable<Integer> values = Observable.from(is);
Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);


// Output
// Received: 1
// Received: 2
// Received: 3
// Completed
{% endhighlight %}

Also, not that `Observable` is not ***interchangeable*** with `Iterable` or `Stream` as `Observables` are **push-based** that means they push the value(once it is available) to all of its subscriber whereas, other `Streams` are **pull-based**, which means that values are requested as soon as possible and execution blocks until the result is returned.

{% highlight java %}
Map<String, Integer> items = new HashMap<>();
items.put("A", 10);
items.put("B", 20);
items.put("C", 30);

items.forEach((k,v)->{
  System.out.println("Item : " + k + " Count : " + v);
    // pulling the values, which are available in items
});


{% endhighlight %}

## Functional Constructs

In functional programming it is common to create sequences oF infinite length. RxJava has factory methods that create such observable sequences

### Observable.range

A straight forward and familiar method to any functional programmer. It emits the specified range of integers.

{% highlight java %}
Observable<Integer> values = Observable.range(10, 15);
// The example emits the values from 10 to 24 in sequence.


// Output
// Received for one: 10
// Received for one: 11
// Received for one: 12
// Received for one: 13
// ...
// ...
// Received for one: 25
{% endhighlight %}

### Observable.interval

This function will create an infinite sequence of ticks, separated by the specified time duration.

{% highlight java %}
Observable<Long> values = Observable.interval(1000, TimeUnit.MILLISECONDS);
Subscription subscription = values.subscribe(
    v -> System.out.println("Received: " + v),
    e -> System.out.println("Error: " + e),
    () -> System.out.println("Completed")
);
System.in.read();



// Output
// Received: 0
// Received: 1
// Received: 2
// Received: 3
// ...
// ...
{% endhighlight %}

This sequence will not terminate until we unsubscribe.

Please note the blocking read `System.in.read()` at the end is necessary here. Without it, the program terminates without printing something. That's because the timer that produces the ticks runs on its own thread and our operations are non-blocking. We create an observable that will emit values over time, then we register the subscriber which processes the value when it arrives. None of that is blocking and the main thread proceeds to terminate so, just to block the main thread and to see the values coming from an `Observable` we used blocking read at the end.

In the next post, we will unfold the Hot and Cold Observable




