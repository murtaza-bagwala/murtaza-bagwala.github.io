---
layout: post
title: Lifecycle Management of Reactive Subscriptions
---

Lets get deeper into the Rx, the another core key of Rx is the Reactive Subscription

## Reactive Subscription

The intent behind Rx is that it is unknown when an observable sequence emits values or terminates, but you can still have a control over when you begin and stop accepting values. so,when an observer subscribes to the observable it returns a Subscription, it basically allocates the required resources for you and its always best practice to free up the resources once we are done and Rx provides control over your subscriptions to enable you to do that.

***please note that RxJava 1.0 had Subscription but in RxJava 2.0 we have Disposable***

{% highlight java %}
public interface Disposable {
  void dispose();

  boolean isDisposed();
}
{% endhighlight %}

As we have seen in the last post `Observer` interface has 3 defined methods `onNext`, `onError`,
`onComplete` so, while subscribing to the Observable we pass these actions which constructs a `subscriber` and returns the `Disposable`

{% highlight java %}
Observable observableEmitter = Observable.create(emitter-> {
  emitter.onNext(1);
});

Disposable disposable = observableEmitter.subscribe(
        v -> System.out.println(v), // passing these functions constructs Observer
        e -> System.err.println(e));
{% endhighlight %}

There are several overloads to `Observable.subscribe`, which are shorthands for the same thing.

{% highlight java %}
Disposable  subscribe()
Disposable  subscribe(Consumer<? super T> onNext)
Disposable  subscribe(Consumer<? super T> onNext, Consumer<java.lang.Throwable> onError)
Disposable  subscribe(Consumer<? super T> onNext, Consumer<? super Throwable> onError, Action onComplete)
Disposable  subscribe(Observer<? super T> observer)
Disposable  subscribe(Subscriber<? super T> subscriber)
{% endhighlight %}

`subscribe()` consumes events but performs no actions. The overloads that take one or more Action will construct a Subscriber with the functions that you provide. Where you don't give an action, the event is practically ignored.

Lets see the following example which handles error

{% highlight java %}
Subject<Integer> subject = ReplaySubject.create();
subject.subscribe(
  v -> System.out.println(v),
  e -> System.err.println(e));
subject.onNext(0);
subject.onError(new Exception("Oops"));
subject.onNext(1);

// Output
// 0
// java.lang.Exception: Oops
{% endhighlight %}

If we do not provide a function for error handling, an OnErrorNotImplementedException will be thrown at the point where `subject.onError` is called, which is the producer's side. It happens here that the producer and the consumer are side-by-side, so we could do a traditional try-catch. However, on a modularised system, the producer(Observable) and the consumer(Observer) very often are in different places. Unless the consumer provides a handle for errors to subscribe, they will never know that an error has occured and that the sequence was terminated.

Also, notice that after exception `Subject/Observable` is continue to send the data but Observer didn't print anything the reason is, in our very [first post](https://www.linkedin.com/pulse/reactive-programming-step-ahead-functional-murtaza-bagwala/) we saw _if error signal occurs through the error channel then no data will be flown through the data channel_

## Unsubscribing

As I mentioned Rx provides a way to control the subscriptions so that we can free up the resources. So, you can stop receiving values from a Observable sequence. Every subscribe overload returns an instance of Disposable, which is an interface with 2 methods:

{% highlight java %}
public interface Disposable {
    void dispose();

    boolean isDisposed();
}
{% endhighlight %}

Calling dispose will stop events from being pushed to your observer.

{% highlight java %}
Subject<Integer>  values = ReplaySubject.create();
Disposable disposable = values.subscribe(
    v -> System.out.println(v),
    e -> System.err.println(e),
    () -> System.out.println("Done")
);
values.onNext(0);
values.onNext(1);
disposable.dispose();
values.onNext(2); // observer will not receive this value

// Output
// 0
// 1
{% endhighlight %}

Also, Unsubscribing one observer does not interfere with other observers on the same observable.

{% highlight java %}
Subject<Integer>  values = ReplaySubject.create();
Disposable disposable1 = values.subscribe(
    v -> System.out.println("First: " + v)
);
Disposable disposable2 = values.subscribe(
  v -> System.out.println("Second: " + v)
);

values.onNext(0);
values.onNext(1);

disposable1.unsubscribe();
System.out.println("Unsubscribed first");

values.onNext(2); //second observer will still receive this value


// Output
// First: 0
// Second: 0
// First: 1
// Second: 1
// Unsubscribed first
// Second: 2
{% endhighlight %}

Regardless of first subscriber is disposed, second subscriber is still receving the values

## Handling onError and onComplete events

`onError` and `onCompleted` mean the termination of a sequence. An observable that complies with the Rx contract will not emit anything after either of those events. This is something to note both when consuming in Rx and when implementing your own observables.

{% highlight java %}
Subject<Integer>  values = ReplaySubject.create();
Disposable disposable = values.subscribe(
    v -> System.out.println("First: " + v),
    e -> System.out.println("First: " + e),
    () -> System.out.println("Completed")
);
values.onNext(0);
values.onNext(1);
values.onCompleted();
values.onNext(2);


// Output
// First: 0
// First: 1
// Completed
{% endhighlight %}

So, once observable has sent complete signal, no data will be flown from the data channel

## Freeing the resources

So, its always a best practice to free up the resources when it is not in use, for example if an `Observable` has multiple `Subscribers`, sharing the same resources with each of them, we can release these resources on dispose of each of the subscriber, we can create the binding between a Disposable and the necessary resources using the `Disposables factory`. Lets have a look at the below example

{% highlight java %}
Observable observableEmitter = Observable.create(emitter -> {
  BufferedReader reader = new BufferedReader(new FileReader("sample.txt"));
  String line;
  while ((line = reader.readLine()) != null)
  {
      emitter.onNext(line);
  }
  emitter.setDisposable(Disposables.fromAction(() -> {
      reader.close();
      System.out.println("resource disposed");

  }));
});

Disposable disposable1 = observableEmitter.subscribe(
        v -> System.out.println("subscriber first " + v),
        e -> System.err.println(e));
disposable1.dispose();

Disposable disposable2 = observableEmitter.subscribe(
        v -> System.out.println("subscriber second " + v),
        e -> System.err.println(e));
disposable2.dispose();


// output
// subscriber first sample
// resource disposed
// subscriber second sample
// resource disposed
{% endhighlight %}

In the above example both the observers subscribed to the same observable, while defining observable we set the disposable through `Disposables.fromAction` which returns `Disposable`. so, when any observer gets disposed all the resources mentioned in `Disposables.fromAction` will get released.

In the next post we will be looking in to the `Observable` and its types.

