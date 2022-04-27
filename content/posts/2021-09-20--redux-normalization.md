---
title: Normalizing Redux state to ensure good performance in React apps
date: "2021-09-20T18:00:37.121Z"
template: "post"
draft: false
slug: "redux-state-normalization"
category: "Redux State Normalization"
tags:
- "react"
- "redux"
- "javascript"
description: "In complex applications, client apps have to store and manage a large amount of nested data, and if the data is not normalized, it can be incredibly time-consuming for a program to lookup nested data which could become a performance concern."
---

**Normalization** is the process of efficiently organizing data.
In the case of the backend, we generally store the data in the database
and apply some normalization techniques to eliminate redundant data 
(for example, storing the same data in more than one table) 
and ensuring data dependencies make sense (only storing related data in a table).

Traditionally, client-side applications were only used to show 
the data coming from the backend with minimal business logic.
But with the advent of SPA and various libraries around it like
[React](https://reactjs.org/)
and
[Vue](https://vuejs.org/)
etc., client applications have now evolved, have become more complex and, 
now they are capable of managing the data as well.
So, to store and manage the data,
we use some state management tools like
[Redux](https://redux.js.org/).

The idea of Redux is simple: the whole state of the application 
is contained in one central location. We need to define Action Types/Creators, 
Pure Reducers, and Store that is it.

Before getting into the **Normalization**, let us see how data flows in Redux.

![alt](/redux-async-data-flow.gif)

[Image Credit](https://redux.js.org/tutorials/fundamentals/part-6-async-logic#redux-async-data-flow)

The work done by Redux generally falls into two major areas:
1. Processing actions in middleware(calling an API).
2. Calling the Reducers to update the state (including object duplication for immutable updates).

It is certainly possible for each of these to become a performance concern 
in complex situations. 
We can increase the performance by improving the state shape.

Let us understand how denormalized state shape could be a performance bottleneck. 
Suppose we are building an online Chat room. 
Here our data would be nested in nature. 
For example, each Chat room has multiple users and, 
each user would belong to multiple Chat rooms. 
Data for this kind of application might look like:

```javascript

const chatRooms = [
  {
    id: 'chatRoom1',
    name: 'general',
    users: [
      {
        id: 'user1',
        name: 'John'
        belongToRooms: [
          { id: 'chatRoom1', name: 'general'},
          { id: 'chatRoom2', name: 'random'}
        ]
      },
      {
        id: 'user2',
        name: 'Smith'
        belongToRooms: [
          { id: 'chatRoom1', name: 'general'},
          { id: 'chatRoom2', name: 'random'}
        ]
      }
    ]
  },
  {
    id: 'chatRoom2',
    name: 'random',
    users: [
      {
        id: 'user1',
        name: 'John'
        belongToRooms: [
          { id: 'chatRoom1', name: 'general'},
          { id: 'chatRoom2', name: 'random'}
        ]
      },
      {
        id: 'user2',
        name: 'Smith'
        belongToRooms: [
          { id: 'chatRoom1', name: 'general'},
          { id: 'chatRoom2', name: 'random'}
        ]
      }
    ]
  }
]

```


The structure of this data is a bit complex, and some of the data is repeated. 
Let us see, how our reducer would look like if we need to delete/update the particular Chat room.

```javascript

export default function (state = initialState, action) {

  switch (action.type) {

    case DELETE_CHAT_ROOM: {
      const { roomId } = action.payload; 
      const { chatRooms } = state;

      const indexOfChatRoomToBeDeleted = chatRooms.findIndex(chatRoom => chatRoom.id === roomId)

      // Delete Chat room

      chatRooms.splice(indexOfChatRoomToBeDeleted, 1);


       // Delete Chat room from the users

      chatRooms.forEach(chatRoom => {
        chatRoom.users.forEach(user => {
          
          const index = 
            user.belongToRooms.findIndex(chatRoom => chatRoom.id === roomId)
          if (index != -1) {
            user.belongToRooms.splice(index, 1);
          }

        })
      })
    }
  }
}

```

***Note: Redux does not allow to mutate the old state so, to avoid the duplication complexity and for the example purpose, we are mutating the state directly.***

That is why unnormalized data is a concern for several reasons:
- When we have duplicated data in several places,
  it becomes harder to make sure it is updated appropriately.
- When we have nested structures, we need to create complex reducers
  which would parse the entire state tree to update the single field.
- An update to a deeply nested data object could force unrelated UI components
  to re-render even if the data did not change.

So, to avoid all of the above issues, Normalization comes to the rescue.
It is a similar technique to what we generally do at the database level.

- Creating a separate table for each entity, whereas in the Redux store
 we would treat all the entities as separate slices of a state
 and create separate reducers for each of them.
- We have primary keys on the data table,
 whereas in the Redux store we store the individual entities in an object,
 with the IDs of the entities as keys and the entities themselves as the values.
- At the database level, we store the references as IDs,
  similarly here in Redux store references to individual entities
  should be done by storing the ID only.

As we are treating the Redux store like a database,
many of the principles of database design apply here as well.
For example, in our case Chat room and the user have a many-to-many relationship,
we can model that using an intermediate entity called as chatRoomUser
that stores the IDs of the Chat room and User entities.

So, after normalization our slices of state
and their corresponding reducers would look like:-

```javascript

const chatRooms = {
  byId: {
    'chatRoom1': { id: 'chatRoom1', name: 'general'},
    'chatRoom2': { id: 'chatRoom2', name: 'random'}
  }
}

const users = {
  byId: {
    'user1': { id: 'user1', name: 'John'},
    'user2': { id: 'user2', name: 'Smith'}
  }
}

const chatRoomUsers = {
  byId: {
    'chatRoomUser1': { id: 'chatRoomUser1', chatRoomId: 'chatRoom1', userId: 'user1'},
    'chatRoomUser2': { id: 'chatRoomUser2', chatRoomId: 'chatRoom2', userId: 'user2'}
  }
}

```

```javascript


// chatRoomReducer

export default function (state = initialState, action) {
  switch (action.type) {
    case DELETE_CHAT_ROOM: {

      const { roomId } = action.payload; 
      const { chatRooms } = state;
      delete chatRooms.byId[roomId];

    }
  }
}

// chatRoomUserReducer

export default function (state = initialState, action) {
  switch (action.type) {
    case DELETE_CHAT_ROOM_USER: {

      const { roomId } = action.payload; 
      const { chatRoomUsers } = state;

      const chatRoomUsersIdsToBeDeleted = Object.values(chatRoomUsers.byId)
        .filter(value => value.chatRoomId === roomId)
          .map(value => value.id);

      chatRoomUsersIdsToBeDeleted.forEach(chatRoomUserId => delete chatRoomUsers.byId[chatRoomUserId]);
    }
  }
}

```

Now our state structure has become flat and, it has several advantages:-
- We have to update the slice of the state,
  no parsing of an entire state tree.
- Lookup has become simple like a dictionary
  with a given chatRoomId or userId you can find an element in O(1).
- No complex reducers.
- Since each entity is separated, an update like changing the name of a Chat room would only require new copies of the "chatRooms > byId > chatRoom" portion of the tree.
It means the fewer portion of the State gets updates which result in fewer re-renders.

It is important to normalize the state before it can be included in the state tree
because APIs frequently send back data in a nested form.
