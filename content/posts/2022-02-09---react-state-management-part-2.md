---
title: React State management - Part 2
date: "2022-02-09T18:00:37.121Z"
template: "post"
draft: false
slug: "8-ways-to-handle-state-management-part-2"
category: "State Management"
tags:
- "react"
- "redux"
- "javascript"
description: "Learn some of the inherent ways of managing state without using any external state management tool."
---

This article is in continuation of 
[Part 1](https://murtazabagwala.xyz/posts/8-ways-to-handle-state-management-part-1) 
so, let us understand how 
[useRef](https://reactjs.org/docs/hooks-reference.html#useref) 
and [Context API](https://reactjs.org/docs/context.html) can be used for state management.

#### useRefs

The 
[useRef](https://reactjs.org/docs/hooks-reference.html#useref) 
was introduced in React 16.8. 
It is the functional alternative to Class based `createRef()`.

There are two main use cases for the `useRef` hook in a React functional component:- 

- Accessing a DOM element.
- Storing mutable information without triggering a re-render of that component.

A ref provides a way to access DOM nodes 
or React elements created in the render method.
The reference to the element can be used to do interesting things 
such as changing the text content 
or changing the class name. 
Earlier in vanilla JavaScript it was done using `querySelectors` 
and then jQuery even made this process more seamless with a single function call using the `$` sign.

```javascript

  <div class="title">
    This is a title of a div
  </div> 
  <p>This is a paragraph.</p>
   
  <script>
    const titleDiv = document.querySelector("div.title");
    $("p").css("background-color", "yellow");
  </script>

```

A Ref variable in React is a mutable object, 
and its value is persisted by React across re-renders. 
A ref object has a single property named `current` 
so, its structure is similar to `{ current: ReactElementReference }`.

##### Using useRef to access elements

Let us look at how we could use the `useRef` hook to interact with a DOM element 
by switching the focus to the input box on clicking of a Button:

```javascript
  const Form = () => {
    const textInput = useRef();
    const focusTextInput = () => textInput.current.focus();

    return (
        <>
          <input type="text" ref={textInput} />
          <button onClick={focusTextInput}>Focus the text input</button>
        </>
    );
  }
```

##### Using useRef to store information in State

One of the important usages of `useRef` is to store state.
In React apps, at times frequent changes have to be tracked 
without enforcing the re-rendering of the component. 
and using `useState` can cause some unnecessary re-renders 
for example, if we wanted to keep track of the number of times a component re-rendered. 
We might try to do something like this:

```javascript
  // CountRenders.js

  const CountRenders = () => {
    const [count, setCount] = useState(1);

    setCount(count + 1);

    return (
      <div>
        <p>I have rendered {count} times.</p>
      </div>
    );
  }
```

But, storing in the state is going to trigger a re-render when it changes, 
every time we increment the count 
our component will render again and thus create an infinite loop. 

By simply replacing `count` to be a `useRef` hook rather than a `useState` hook,
we can safely store this mutated data without re-rendering:

```javascript
  // App.js

  import React, { useEffect, useState } from "react";
  import CountRenders from "./CountRenders";

  const App =  () => {
    const [reload, setReload] = useState(false);

    useEffect(() => {
       setTimeout(() => {
        setReload(true)
      }, 5000)
    }, []);

    return (
      <div>
        <CountRenders />
       </div>
    );
  };

  export default App;

  // CountRenders.js

  import React, { useRef } from "react"; 
 
  const CountRenders = () => {
    const count = useRef(1);
    count.current += 1;
  
    return (
      <div>
        <p>I have rendered {count.current} times.</p>
      </div>
    );
  }

  export default CountRenders;

```

#### Context API

The idea of React is to create small reusable components
and these small components need data to work with, 
so, we pass data through props from the parent component to the child component. 
This is fine if we are dealing with 1 or 2 levels of hierarchy 
but, passing props from the parent component to a fourth- or fifth-level child component, 
can slow down our application and cause development issues.

The Context API can be used to share data with multiple components, 
without having to pass data through props manually. 
For example, in some use cases, 
the Context API is ideal for theming, user language, authentication, etc.

To start with the Context API, 
the first thing we need to do is to 
create a context using the `createContext` function from React.

Then we need to add the `Provider` component 
which is going to wrap the components that are going to have access to our context.

Finally, we need to add `Consumer` components that are going to consume the data.

Let us create a basic Authentication example using **Context API**.

So, our application is going to have an App component 
which will host two components. 
One is going to have authentication logic 
and the other will be a protected component that the user can only see once he’s authenticated.

```javascript
  //Context.js

  import { createContext } from “react”;

  export const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {}
  });

```

Let us create an App component with AuthContext 
makes sure that anytime anything in the context changes, 
children component of App that uses context change as well.

We can have user state in the App component 
and bind this to the value prop of our context 
and hence when the state here changes, 
it will re-render the components that use context.

```javascript

  // App.js Provider

  import react from ‘react’;
  import { AuthContext } from ‘./Context’;
  import Authentication from ‘./Authentication;
  import ProtectedResource from ‘./ProtectedResource;

  export default function App(){
    const [loggedIn, setLoggedIn] = useState(false);
    
    const login = () => {
        setLoggedIn(true);
    }
    
    const logout = () => {
        setLoggedIn(false);
    }

    return (
      <AuthContext.Provider value={isLoggedIn: loggedIn, login, logout}>
        <div className="center">
          <Authentication/>
          <ProtectedResource />
        </div>
      </AuthContext.Provider >
    )
  }  

```

Now, let us add `Consumers` which listen to the context changes in other components:

```javascript

  // ProtectedResource.js Consumer

  import react, { useContext } from ‘react’;
  import { AuthContext } from "./Context";

  export default function ProtectedResource () { 
    const authContext = useContext(AuthContext);
    return authContext.isLoggedIn && <h2>Protected resource</h2>;
  }

```

```javascript

  // Authentication.js Consumer

  import react, { useContext } from ‘react’;
  import { AuthContext } from "./Context";

  export default function Authentication () {
    const authContext = useContext(AuthContext);

    const loginHandler = () => {
      authContext.login();
    };

    const logoutHandler = () => {
      authContext.logout();
    };

    return (
      <>
        { !authContext.isLoggedIn && (<button onClick={loginHandler}> Login </button>) }
        { authContext.isLoggedIn && (<button onClick={logoutHandler}> Logout </button>) }
      </>
    )
  }

```
