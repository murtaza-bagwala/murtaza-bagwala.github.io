---
title: My experience with Egghead Portfolio Project Club
date: "2021-07-20T18:00:37.121Z"
template: "post"
draft: false
slug: "state-management"
category: "State Management"
tags:
- "Portfolio Project"
- "State Management"
- "Redux"
description: "A couple of months back I had won the full year of free egghead courses in one of the Gatsby contests and one fine day while I was enjoying my free premium access and watching some amazing tutorials on Redux and State Management I came to know about Egghead Portfolio Project Club and I found it interesting because I really believe in learning together.
Through this club, I got a chance to meet and learn from some amazing developers from all over the world, and in this post, I would like to describe my experience being a part of this club."
---

![alt](/meeting.png)

A couple of months back I had won the full year of free [egghead](https://egghead.io) courses in one of the Gatsby contests and one fine day while I was enjoying my free premium access and watching some amazing tutorials on Redux and State Management I came to know about [Egghead Portfolio Project Club](https://egghead.io/clubs/portfolio-project) and I found it interesting because I really believe in learning together and in no time I registered for it and then the meeting was scheduled with [Will](https://twitter.com/willjohnsonio) and [Taylor](https://twitter.com/taylorbell) from [egghead](https://egghead.io) to discuss what I want to get out of the club and my aspirations.

The goal of this club is to create a business-oriented portfolio project. The club meets for 6 weeks with 1-hour live group sessions every week. Each session focuses on readings to discuss and group exercises, in addition to specific learning resources for your project. 

And this time the focus of the club was to learn and implement State Management in React and I was really excited because I have been doing mostly backend work for the last 6 years, have some little experience with React, and wanted to learn and explore Redux and other state management tools.

The idea of this club was not just to write a code but, to understand and execute the entire project life cycle like ideation and selecting the project, deciding its tech stack, creating Readme, creating napkin sketches, and then successively building the app, showing and getting the feedback from the club and improvise accordingly.

So, we met for six weeks, every Thursday, and I got a chance to meet some amazing folks out there and in these six weeks we were given some assignments like reading some great resources and implementing them in a project and I am planning to have a separate blog for each week's learning so, let's start with the first week.

###1st Week Challenge

The first week’s assignment was to select a project which we would be building and to learn and implement **Readme-Driven Development Methodology** along with watching the amazing [interview](https://egghead.io/lessons/react-using-redux-in-modern-react-apps-with-mark-erikson) by Joel Hooks(Egghead) with Mark Erikson (Redux Maintainer). 

###State Management Project

The project which I chose to build for a Portfolio Club was a [Shopping Cart App](https://github.com/murtaza-bagwala/ecommerce-react-app#readme). It might sound simple but the idea was not to build something out of the box but to understand how state management works in React.

In a shopping cart app, we have a cart icon on the header of the site and it gets updated each time a user adds or removes any product or its quantity. No matter what page the user is on, they should be able to know at a glance how many items are in their cart and I thought it was the best use-case to implement state management.

###Readme-Driven Development

Before I got introduced to [Readme-Driven Development](https://tom.preston-werner.com/2010/08/23/readme-driven-development.html), I used to write a readme that only contains information about how to install and start a project with some operating instructions but when I read about Readme-Driven Development Methodology it changed my perception and I realized how important is to have a readme for a project. Do read this amazing [article](https://tom.preston-werner.com/2010/08/23/readme-driven-development.html) by GitHub founder Tom Preston-Werner.

This article was written 11 years back and it applies so much today and it's true that in this age of Agile we talk about TDD, BDD, and Xtreme programming but they all are worthless if we don't have proper documentation of our working software.

Writing Readme before writing an actual code has its own advantages:- 

- You would think more about the features and use cases in advance and it would make the documentation less prone to change in the future.
- Conversations get easy when you have something written down.
- You have a nice piece of documentation in front of you which could help your co-devs to start on the project seamlessly.
- Users can easily understand the motivation behind the project, the features, and operating instructions.

I tried to create a [Readme for my Portfolio Project](https://github.com/murtaza-bagwala/ecommerce-react-app#readme) even before writing a single line of code and it feels amazing.

###Mark Erikson on Redux

I chose Redux as a state management tool for my Project because I thought Redux was a great choice here because it is simple, its core idea is that the whole state of the app is contained in one central location. You just need to define Action Types, Pure Reducers, and Store that’s it. Also, it’s very easy to maintain, debug, and test.

This [interview](https://egghead.io/lessons/react-using-redux-in-modern-react-apps-with-mark-erikson) is really amazing and I really like the questions which [Joel](https://twitter.com/jhooks) has asked because I had some exact same questions somewhere in my mind.

[Mark](https://twitter.com/acemarke) responses are amazing too and I really got to understand what type of questions we need to ask while looking for any state management tool:

- Where is the data coming from?
- How am I interacting with that data?
- How long does the data need to live?
- Does the data need to change over time?

[Mark](https://twitter.com/acemarke) also demonstrates how [redux-toolkit](https://redux-toolkit.js.org/) can be used in place of [Redux](https://redux.js.org/) to avoid some extra overheads like setting up the store, creating separate files for actions, reducers, and action-types, etc.

But, I prefer Redux over Redux-toolkit because redux-toolkit obscures so many things and does them under the hood and I really like to write a code that is readable, less abstract, and should convey what it is supposed to do because obscurity may lead to errors.

Mark also mentions how redux-toolkit uses **duck file structure** which means keeping all of your Redux-related logic for a given slice into a single file so your action-types, action-creators, and reducers all will reside in the same file, unlike Redux.

I would really insist you to watch this [interview](https://egghead.io/lessons/react-using-redux-in-modern-react-apps-with-mark-erikson) if you are new to state management and learning Redux.

Finally, I would like to thank our great hosts, [Will Johnson](https://twitter.com/willjohnsonio) and [Taylor Bell](https://twitter.com/taylorbell), they are amazing community builders and the entire [egghead](https://egghead.io/) community for providing great learning resources and coming up with such initiatives.

Stay tuned for the next blog
