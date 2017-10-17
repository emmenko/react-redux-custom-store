import './setup'
import test from 'tape'
import { mount } from 'enzyme'
import React from 'react'
import PropTypes from 'prop-types'
import { createStore, combineReducers } from 'redux'
import connect from '../lib/connect'
import createProvider from '../lib/create-provider'

const store = createStore(combineReducers({
  user: (/* state, action */) => ({ name: 'John' }),
}))

test('Render component using custom store name', t => {
  const storeName = 'blog'
  const Provider = createProvider(storeName)
  const Foo = ({ name }) => (<span>{name}</span>)
  Foo.propTypes = { name: PropTypes.string }

  const Connected = connect(
    ({ user: { name } }) => ({ name })
  )(Foo, storeName)

  const wrapper = mount(
    <Provider store={store}>
      <Connected />
    </Provider>
  )

  const wrapped = wrapper.find('WrappedConnect(Connect(Foo))')
  t.true(wrapped, 'find the wrapped connected component')
  t.true(storeName in wrapped.node.context, 'find custom store name in context')

  const connected = wrapper.find('Connect(Foo)')
  t.true(connected, 'find the connected component')
  t.true('store' in connected.props(), 'pass store as a prop to connect')

  const foo = wrapper.find(Foo)
  t.true(foo, 'find the Foo component')
  t.equal(foo.props().name, 'John', 'pick the user name from the custom store')

  t.end()
})

test('Render nested providers', t => {
  const storeName = 'todo'
  const TodoProvider = createProvider(storeName)

  const todoStore = createStore(combineReducers({
    todos: (/* state, action */) => [{ text: 'OK' }, { text: 'Missing' }],
  }))

  const TodoProfile = ({ name }) => (<h2>{name}</h2>)
  TodoProfile.propTypes = { name: PropTypes.string.isRequired }
  TodoProfile.contextTypes = {
    store: PropTypes.object,
    [storeName]: PropTypes.object,
  }

  const TodoList = ({ todos }) => (
    <ul>
      {todos.map(({ text }, i) => (<li key={i}>{text}</li>))}
    </ul>
  )
  TodoList.propTypes = { todos: PropTypes.array.isRequired }
  TodoList.contextTypes = {
    store: PropTypes.object,
    [storeName]: PropTypes.object,
  }

  const ConnectedTodoProfile = connect(
    ({ user: { name } }) => ({ name })
  )(TodoProfile) // uses default store name `store`

  const ConnectedTodoList = connect(
    ({ todos }) => ({ todos })
  )(TodoList, storeName) // uses custom store name `todo`

  const Todos = () => (
    <div>
      <ConnectedTodoProfile />
      <ConnectedTodoList />
    </div>
  )

  const TodosContainer = () => (
    <TodoProvider store={todoStore}>
      <Todos />
    </TodoProvider>
  )

  const Provider = createProvider()
  const Root = () => (
    <Provider store={store}>
      <TodosContainer />
    </Provider>
  )

  const wrapper = mount(<Root />)

  t.comment('TodoProfile')
  const profile = wrapper.find('TodoProfile')
  t.true(profile, 'find the connected component for profile')
  t.true('store' in profile.node.context, 'find default store name in context')
  t.true(storeName in profile.node.context, 'find custom store name in context')
  t.equal(profile.text(), 'John')

  t.comment('TodoList')
  const list = wrapper.find('TodoList')
  t.true(list, 'find the connected component for profile')
  t.true('store' in list.node.context, 'find default store name in context')
  t.true(storeName in list.node.context, 'find custom store name in context')
  t.equal(list.find('li').at(0).text(), 'OK')
  t.equal(list.find('li').at(1).text(), 'Missing')

  t.end()
})
