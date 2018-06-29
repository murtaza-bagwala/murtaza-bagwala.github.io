---
layout: post
title: Diving into RxJava
---

I am back with the another post which aims to introduce a beginner reactive programmer to the complete power of the Java implementation of reactive programming.

Basic knowledge of functional programming is needed like (lamdbdas, lazy evaluation) to follow the basics of RxJava, other than this only familiarity with the basics of Java is required.

## Fundamental types

So, basically RX is composed of two fundamental types `Observable` and `Observer`, while several others expand the functionality around these core types

As we saw in the [last post](https://www.linkedin.com/pulse/reactive-programming-step-ahead-functional-murtaza-bagwala/) Rx builds upon the Observer pattern. It is nothing new. Event handling already exists in Java (e.g. JavaFX's, Swing's EventHandler, ). Those are simpler approaches, which suffer in comparison to Rx:

* Events through event handlers are hard to compose.
* They cannot be queried over time
* They can lead to memory leaks
* These is no standard way of signaling completion.
* Require manual handling of concurrency and multithreading.

## Observable

Observable is the fundamental element that we will see. All core operators of Rx extends this class. Observable implements very important interface known as ObservableSource which contains a method known as subscribe:

{% highlight java %}
public final Subscription subscribe(Subscriber<? super T> subscriber)
{% endhighlight %}

This is the method that we use to receive the values emitted by the observable, so subscribers subscribe to observables using this method

As we saw in the previous post, Rx handles error and recovery mechanism using 3 kinds of signals and actually these signals are pushed by Observables

1. Values
2. Completion, which indicates that no more values will be pushed.
3. Errors, if something caused the sequence to fail. These events also imply termination.

## Observer

This is also called as a `Subsrciber` who continuosly listens to the Observable For now, it is simpler to first understand the interface.

{% highlight java %}
interface Observer<T> {
  void onCompleted();
  void onError(java.lang.Throwable e);
  void onNext(T t);
}
{% endhighlight %}

Those three methods are the behaviour that is executed every time the observable pushes a value. The observer will have its `onNext` called zero or more times, optionally followed by an           `onCompleted` or an `onError`. No calls happen after a call to onError or onCompleted

## Subject

Subjects are an extension of the Observable that also implements the Observer interface. You may be thinking why we need Subjects if we have `Observables`, In order to understand the difference between a Subject and an Observable, you need to be aware of two distinct concepts
* `A data producer`
* `A data consumer`

An `Observable`, by definition is a data producer. Albeit a special kind that can produce data over time.

A `Subject` on the other hand can act as both – a data producer and a data consumer.

This implies two things.
1. A subject can be subscribed to, just like an observable.
2. A subject can subscribe to other observables.

That being said, there is one critical difference between a subject and an observable.

>All subscribers to a subject share the same execution of the subject. i.e. when a subject
produces data, all of its subscribers will receive the same data. This behavior is different from observables, where each subscription causes an independent execution of the observable.

Lets see an example to clarify this.

**Publishing through Subject**

{% highlight java %}
PublishSubject<Double> subject = PublishSubject.create();

subject.subscribe(System.out::println);
subject.subscribe(System.out::println);
subject.onNext(Math.random());

// Here data is broadcasted to each subscriber
// A: 0.8495447073368834
// B: 0.8495447073368834
{% endhighlight %}

**Publishing through Observable**

{% highlight java %}
Observable<Double> observable = Observable.create(subscriber -> subscriber.onNext(Math.random()));

observable.subscribe(System.out::println);
observable.subscribe(System.out::println);

// Here observable function is re-executed for each subscriber
// 0.8530384417006546
// 0.30647595617691514
{% endhighlight %}



lets have a look at some couple of Subjects like **PublishSubject** and **ReplaySubject**

## Publish Subject

`PublishSubject` is the most straight-forward kind of subject. When a value is pushed into a
`PublishSubject`, the subject pushes it to every subscriber that is subscribed to it at that moment.

{% highlight java %}
public static void main(String[] args) {
  // creating a Subject this could be anything, any data stream
  // from any source
  PublishSubject<Integer> subject = PublishSubject.create();

  // we are manually making the subject to send the data,
  // but actually in create we can pass the lambda function
  // that automatically emits the data, we will see this in
  // detail in our later posts
  subject.onNext(1);

  // subscribing to the subject on client side,
  // right now we are just printing the values received from the
  // observable but, here actually processing of data takes place
  subject.subscribe((data -> System.out.println("First Subscriber: "+ data)));

  subject.onNext(2);

  subject.subscribe((data -> System.out.println("Second Subscriber: "+ data)));
  subject.onNext(3);
  subject.onNext(4);
}

// output
// First Subscriber: 2
// First Subscriber: 3
// Second Subscriber: 3
// First Subscriber: 4
// Second Subscriber: 4
{% endhighlight %}

As we can see in the example, `1` isn't printed because we weren't subscribed when it was pushed. After we subscribed, we began receiving the values that were pushed to the subject.

This is the first time we see subscribe being used, so it is worth paying attention to how it was used. In this case, we used the overload which expects one Function for the case of onNext. That function takes an argument of type Integer and returns nothing. Functions without a return type are also called actions. We can provide that function in different ways:

1. Implicitly create one using a lambda expression or
2. Pass a reference to an existing method that fits the signature. In this case,
`System.out::println` has an overload that accepts Object, so we passed a reference to it.
`subscribe` will call `println` with the arriving values as the argument.

Also, notice that when second subscriber joins in it doesn't get the old values `1` and `2`,
It only gets the data which is at the moment and after it subscribes in so, This type of `Subject` is called as **Hot Subject** which only sends the current data to the Subscribers.

This type of Subjects can be used in scenarios where we want to process the current data like processing of the live video stream of a Football match. or processing the current stock price for say Wallmart

## ReplaySubject

`ReplaySubject` has the special feature of caching all the values pushed to it. When a new subscription is made, the event sequence is replayed from the start for the new subscriber. After catching up, every subscriber receives new events as they come.

{% highlight java %}
ReplaySubject<Integer> s = ReplaySubject.create();
s.subscribe(data -> System.out.println("Early:" + data));
s.onNext(0);
s.onNext(1);
s.subscribe(data -> System.out.println("Late: " + data));
s.onNext(2);

// output
// Early:0
// Early:1
// Late: 0
// Late: 1
// Early:2
// Late: 2
{% endhighlight %}

All the values are received by the subscribers, even though one was late. Also notice that the late subscriber had everything replayed to it before proceeding to the next value. This type of Subject is called as **Cold Subject**.

Here, you can also control the replaying parameter that is how many values you want to replay once, new subscriber joins in using ReplaySubject.createWithSize

{% highlight java %}
ReplaySubject<Integer> s = ReplaySubject.createWithSize(2);
s.onNext(0);
s.onNext(1);
s.onNext(2);
s.subscribe(data -> System.out.println("Late: " + data));
s.onNext(3);

// output
// Late: 1
// Late: 2
// Late: 3
{% endhighlight %}

Our late subscriber now missed the first value, which fell off the buffer of size 2.

Other than these there are other subjects as well like **BehaviorSubject**,
**AsyncSubject** you can dig in [here](https://github.com/ReactiveX/RxJava/wiki/Subject) more deeper

In the next post we will be looking in to the [LifeCycle management of Reactive Subscriptions](https://murtaza-bagwala.github.io/Lifecycle-Management/) and how to handle errors emitted through Observables so, stay tuned
