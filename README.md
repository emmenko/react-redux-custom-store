<h1 align="center">This repository is deprecated and not maintained anymore</h1>

# React Redux (custom store)

Simple wrapper around [react-redux](https://github.com/reactjs/react-redux).
It allows to use different _nested_ `Provider`s by specifying a custom `store` name.

[![build status](https://img.shields.io/travis/emmenko/react-redux-custom-store/master.svg?style=flat-square)](https://travis-ci.org/emmenko/react-redux-custom-store) [![npm version](https://img.shields.io/npm/v/react-redux-custom-store.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-custom-store)

### Installation

It requires **React 0.14 or later**, and **React Redux 4 or later** (those being `peerDependencies`).

```bash
npm install --save react-redux-custom-store
```

### Why?

In _normal_ cases you **don't need this**.

However, if your application _starts growing_ and you want to **decouple** it, e.g. in different modules, you may need to have different `Provider`s across the application.
This could also be applied for things like _widgets_, with their own store, actions, reducers, styles, etc. As such, the application will have different widgets but it doesn't know anything about them.

In oder words, I can have the main application just being the _scaffolding_ with a global state (e.g. `user`, `language`, etc.) and having different parts of the UI as well as different views (e.g. mapped to specific routes) being _modules_, _widgets_ or whatever.
Each module / widget will have then its own store (e.g. `todos`, `blog`, `orders`, `dashboard`, etc.) as well as actions, reducers and so on, and can still access the global state of the app.


### Usage

This modules exposes two functions:

- `createProvider([storeName])`: given an optional `storeName` (default being `store`), it returns a `Provider` component.

> The implementation is _the same_ as the one from `react-redux`, only with the custom store name used as the `context` key.

- `connect(...)(Component, [storeName])`: the signature of this method is the same as the original `connect` function of `react-redux`. It accepts extra the `storeName` (default being `store`), used to pick the related store from the `context` and pass it down to the _connected component_ as a prop.


```js
// Note: you can still use the original exports of `react-redux`,
// as long as you use the default `store`.
// You can use the two libraries alongside, `react-redux-custom-store`
// uses `connect` from the `react-redux` library at the end.

// root.js
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

const store = createStore(combineReducers({
  user: (/* state, action */) => ({ name: 'John' })
}))

// Uses the default store `store` as name.
const Root = () => (
  <Provider store={store}>
    <TodosContainer />
  </Provider>
)
ReactDOM.render(<Root />, document.getElementById('app'))


// todos-container.js
import { createStore, combineReducers } from 'redux'
import { createProvider } from 'react-redux-custom-store'

const storeName = 'todo'
const todoStore = createStore(combineReducers({
  todos: (/* state, action */) => [{ text: 'OK' }, { text: 'Missing' }],
}))
const Provider = createProvider(storeName)

// Uses the custom store `todo` as name.
// At this point there are 2 stores in `context`.
const TodosContainer = () => (
  <Provider store={todoStore}>
    <Todos />
  </Provider>
)


// todos.js
import { connect } from 'react-redux-custom-store'

const TodoProfile = ({ name }) => (
  <h2>{name}</h2>
)
TodoProfile.propTypes = {
  name: PropTypes.string.isRequired
}

const TodoList = ({ todos }) => (
  <ul>
    {todos.map(({ text }) => (<li>{text}</li>))}
  </ul>
)
TodoList.propTypes = {
  todos: PropTypes.array.isRequired
}

const ConnectedTodoProfile = connect(
  ({ user: { name } }) => ({ name })
)(TodoProfile) // uses default store name `store`

const ConnectedTodoList = connect(
  ({ todos }) => ({ todos })
)(TodoList, 'todo') // uses custom store name `todo`


const Todos = () => (
  <div>
    <ConnectedTodoProfile />
    <ConnectedTodoList />
  </div>
)
```

### License

MIT
