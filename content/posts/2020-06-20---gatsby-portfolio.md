---
title: Why I chose GatsbyJS for my blogs
date: "2020-06-20T18:00:37.121Z"
template: "post"
draft: false
slug: "gatsby-blogs"
category: "GatsbyJS"
tags:
	- "GatsbyJS"
description: "This year in ByteConf2020 I got to know about GatsbyJS, and I really found it interesting so, I thought of giving it a try. As developers, we always look out for some cool tech stacks which are powerful, practical and save us from some serious mundane tasks. So, in this post, I would like to explain why I chose GatsbyJS to build my blogging site."
---

[GatsbyJs](https://www.gatsbyjs.org/) is one of the most powerful frameworks which I have come across, It is an amazing framework to build really performant static websites.

## Why I moved from Jekyll to GatsbyJS

So, when I thought of creating a blogging website 3 years back, I had various options like going for CMSs or to use the static site generators. I really wanted it to be simple and without any admin interfaces so I used [Jekyll](https://jekyllrb.com/). Jekyll is a static site generator, lightweight and fast, perfect for building blogging sites. And, as a developer, it really took a little to learn. And my first blog was up in an hour or so.

But, as I started writing blogs on Jekyll, I encountered various problems which I want to mention here:-

- Jekyll is a **_truly static site_** generator. Every piece of data has to be available at the build time, for example, while writing one of the blogs I had to mentioned the tweet in it. There was no way but to copy the embedded tweet from the twitter feed and adding it in the markdown file.
- In Jekyll, you have separate `\_drafts` and `\_posts` directories for storing your work in progress and your completed content pages. While in Gatsby I use just one flag called `isDraft` to achieve the same.
- Working with assets might be a hassle. Minimizing javascript and image preloading does not come with Jekyll.
- While there are some plugins, many features become very manual and time-consuming.

There are other reasons which I haven’t counted here which make Gatsby ahead of other static site generators, but to look out for them [Gatsby has a great comparison table here](https://www.gatsbyjs.org/features/jamstack/gatsby-vs-jekyll-vs-hugo/).

## Why GatsbyJS ?

The reasons why I consider GatsbyJS for building my blogging site:-

###Great learning experience 
Gatsby comprised of a cool tech stack which includes [ReactJS](https://reactjs.org/), [Webpack](https://webpackjs.org/), and [GraphQL](https://graphql.org/), etc. As I have started looking into the React I see everything on a webpage as a reusable component. Gatsby aims to behave like a regular React application and uses its components which you can reuse and share throughout your project. And having the modular component-based style always makes code manageable and inherently optimized.

###Pull data from anywhere
Also, I got a chance to look into **GraphQL**. GraphQL is a query language with which you can fetch data from nearly any source. One of its most powerful features is its ability to get only the data you ask for, you decide what you want and need, not the server/source. Therefore, Gatsby doesn't need a backend, and GraphQL lets you query all necessary data from wherever you want: markdown files, databases, 3rd party feeds, traditional CMSs like Wordpress, and so on. You just specify the query, Gatsby will fetch the data during build time and will create the pages. For example, in my application, I’ve used GraphQL to fetch all the markdown files content for the posts and Gatsby compiles the returned content with the React templates and creates the pages during build time.

###Follows JAMStack inherently
So applications developed using Gatsby inherently falls under the category of [JAMStack](https://jamstack.org/) architecture where **JAM** stands for JavaScript, APIs, and Markup. I would like to have a separate blog on this topic but, in simple terms, it means the application architecture that doesn’t depend on a Web Server.

###Amazingly fast
GatsbyJS was built keeping performance in mind. Let’s discuss two key website performance metrics that summarize the most important parts of website performance. How quickly is your website visible (**Speed Index**) and how quickly is your site usable (**Time to Interactive—TTI**). So, if you look at [here](https://www.gatsbyjs.org/blog/2017-09-13-why-is-gatsby-so-fast/#lets-review-our-scores) you will notice that most of the popular websites have very high Speed Index(***>= 5sec***). Below is the snippet of the test result for [murtazabagwala.xyz](https://murtazabagwala.xyz) look for the value of **Speed Index** its just ***1.7secs***.

![alt](/test-performance.png) 

Gatsby sites are 2-3 times faster than similar types of sites. The framework itself takes care of performance, leaving you with the pleasure of working on something more fun. All you have to do is to create React components, and Gatsby.js will then compile the most performant Webpack configuration to build your site. Additionally, it prefetches resources so clicking through your pages feels excitingly fast. If you want to learn more about how and why the creators of Gatsby are doing this, [you can read more here](https://www.gatsbyjs.org/blog/2017-09-13-why-is-gatsby-so-fast/).

###Easy deployments
Gatsby is really fast in terms of deployments and its really easy to integrate with the CI tools, for example you can deploy your Gatsby site with [surge.sh](https://www.gatsbyjs.org/docs/deploying-to-surge/) using just a couple of commands.
  
Along with the features mentioned above GatsbyJS has **extensive plugins support**, **vast and active community**, also can be used to build **Progressive Web Apps** etc.

##Future of GatsbyJS 
JAMStack Architecture seems to be the future for the Javascript apps and any framework which inherits this architecture would definetly going to become popular. We will see people using static site generators more often in the future. The need for performant, fast to build but top-notch quality websites and PWAs is on the rise. And I would say GatsbyJS is and will be leading them all.


