Possible structure

- src
  - html (maybe replace these with public?)
  - img
  - app
    - store: zustand store
    - routes
    - sections
    - containers
    - components
    - modules: Grouping of elements that are re-used in multiple components
    - elements
  - utils

How to handle the routes?

Option 1: SDUI

- All routes are rendered by default
- clicking on something is like clicking on a link
  - Route automatically requests next route
  - Could use service workers or not
- Use server push to update UI

Option 2: new-architecture

- createRoute
  - Every interaction goes through route
  - Uses xstate to handle the states, requests
  - Could use service workers or not

How would we handle a new page - Option 1:

- User clicks a link in the sidebar
- New route, request to sw is made
- sw requests preview
- done

How would we handle updating a users permissions - Option 1:

- api post to update permission
- request route

How would we handle a new page - Option 2:

- User clicks a link in the sidebar
- Request via state machine is done
- Responds with new render
- done

How would we handle updating a users permissions - Option 2:

- action is fired
- return next route json

With Opt 1. you're firing a post, then a request for a new route, it's nice because you have the api and the routes.
The state is stored on the server

With Opt 2. you're firing an action, the machine makes the request.
Opt 2. is arguably the better choice, as the component is either visiting a route or firing actions, the code is theoretically easier to switch out.

Option 1: update permission

- api request with payload
- Update database/json
- when req returns, re-request route
- route updated

Option 2: update permission

- action sent with payload
- state machine updates database/json
- responds with new route

What are your worries for opt 2?

- It requires a lot of logic to be written on the backend

Why are you choosing opt 2?

- I'll trust statecharts.dev, if it doesn't work out, I'll refactor and use SDUI
- trpc for the api calls
