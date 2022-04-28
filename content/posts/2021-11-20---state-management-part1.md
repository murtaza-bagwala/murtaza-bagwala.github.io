---
title: Different ways to handle state in React applications
date: "2021-11-20T18:00:37.121Z"
template: "post"
draft: false
slug: "8-ways-to-handle-state-management-part-1"
category: "State Management"
tags:
- "react"
- "redux"
- "javascript"
description: "Sometimes, it is better not to use any external state management tool unless our application is that complex.  We can avoid complexities involved in state management using some of the inherent ways."
---

In React apps, there are at least seven ways to handle the state.
Let us briefly explore a few of them in this part.

#### URL

We can use URL to store some data e.g.
- The id of the current item, being viewed
- Filter parameters
- Pagination offset and limit
- Sorting data

Keeping such data in the URL allows users to share deep links with others.

It is recommended to avoid storing such information in the app's state
to avoid the URL in our app getting out of sync.
The URL should be used as the system of record,
 Read from it as needed for information related to sorting, pagination, etc.
Update the URL as required when the settings change

React Router is a great tool to handle routes and manage the params.

```javascript
  GET:- https://example.com/products/23

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, useParams } from "react-router-dom";

  export default function URLExample() {
    return (
      <Router>
        <div>
          <h2>Products</h2>
          <ul>
            <li>
              <Link to="/products/23">Product Details</Link>
            </li>
          </ul>
          <Switch>
            <Route path="/products/:id" component={ProductDetails} />
          </Switch>
        </div>
      </Router>
    );
  }

  function ProductDetails() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();

    return (
      <div>
        <h3>ProductID: {id}</h3>
      </div>
    );
  }
```

We do not need to store the id in a state
or pass it as props to the `ProductDetails` component instead,
it can be fetched using `useParams()`.

#### Web Storage

The second option is to store the state in the browser via web storage.
This is useful when we want to persist state between reloads and reboots.
Examples include cookies, local storage, and IndexedDB.
These are native browser technologies.

Data persisted in the browser is tied to a single browser.
So, if the user loads the site in a different browser,
the data will not be available.

We avoid storing sensitive data in the browser
since the user may access the app on a shared machine.
Some examples of where web storage might be most useful
include storing a user's shopping cart,
saving partially completed form data
or storing JWT token in HttpOnly Cookie.

Here is an example of saving user preferences locally in the browser
or even persist the complete state for one or more of our components.

```javascript

  import React, { useState, useEffect } from 'react';

  function LocalStorage () {
    const [state, setState] = useState({});

    useEffect(() => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const user = rememberMe ? localStorage.getItem('user') : '';
      setState({ user, rememberMe });
    }, []);

    function handleChange (event) {
      const input = event.target;
      let { user, rememberMe } = state;
      if (input.type === 'checkbox') {
        rememberMe = input.checked
      } else {
        user = input.value
      }
      setState({ user, rememberMe });
    }

    function handleFormSubmit () {
      const { user, rememberMe } = state;
      localStorage.setItem('rememberMe', rememberMe);
      localStorage.setItem('user', rememberMe ? user : '');
    };

    return (
      <form onSubmit={handleFormSubmit}>
        <label>
          User: <input name="user" value={state.user} onChange={handleChange}/>
        </label>
        <label>
          <input name="rememberMe" checked={state.rememberMe} onChange={handleChange} type="checkbox"/> Remember me
        </label>
        <button type="submit">Sign In</button>
      </form>
    );
  }

```

#### Local State

The third option is to use store state locally.
It is useful when one component needs the state.
Examples include a toggle button, a form, etc.

```javascript
  import React, { useState } from 'react';
  import ReactDOM from 'react-dom';

function PlayerInfo(props) {
  const [show, setShow] = useState(true);

  function toggleButton() {
    setShow(!show)
  }

  return (
    <div>
      <button onClick={toggleButton}> Toggle </button>
      {show ? props.children : null}
    </div>
  );
}

function App() {
  return (<PlayerInfo>
    <div>
      Player: Smith
    </div>
  </PlayerInfo>)
}

export default App;
```

#### Lifted State

The Fourth option is to define the state in the parent component.
Often, the same state is used across multiple components.
In those cases, it is useful to lift the state to a common parent.
The lifting state is a two‑step process.
First, we declare the state in a common parent component,
and then we pass the state down to child components via props.
This pattern should be considered any time a few related components need to use the same state.
The lifting state avoids duplicating states in multiple components.
It helps to assure that our components all consistently reflect the same state.

In the below example, we have lifted the state and
the `handleChange` event in the parent component, helping to maintain consistency.

```javascript

  function PlayerInfo () {
    const [gender, setGender] = useState("Male");

    function handleChange (event) {
      setGender(event.target.value)
    }

    return (
      <div>
        <Dropdown onChoose = {handleChange} />
        <Choosen choice = {gender} />
      </div>
    );
  }

```

#### Derived State

The fifth option is to compute the new state based on the available state
and we do not need to declare a state at all.
If there are existing values that can be composed to give us the information we need,
then we can calculate that information on each render instead of storing it.
Some examples include calling `.length` on an array to determine the number of records
instead of storing a separate `numItems` variable in the state or deriving an `errorsExist` boolean
by checking if the errors array is empty.

So, why bother deriving the state?
Well, deriving the state avoids our state values getting out of sync.
It simplifies our code since we do not have to remember to keep separate values in sync.
When we update the state, derived values are automatically recalculated in the render.

For example, we can calculate the items added to the cart and show it on the cart icon like this,
`this.state.cart.items.length` and pass it as a prop to Badge Component.
We do not need to store the `itemsCount` key in a cart state.
Each time the cart state gets changed,
the count on the Badge will be calculated automatically.

```javascript

  <IconButton aria-label="cart">
    <StyledBadge badgeContent={ {this.state.cart.items.length} } color="secondary">
      <ShoppingCartIcon />
    </StyledBadge>
  </IconButton>
```
