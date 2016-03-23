import './setup'
import test from 'tape'
import { mount } from 'enzyme'
import React, { PropTypes } from 'react'
import { createStore, combineReducers } from 'redux'
import connect from '../connect'
import createProvider from '../create-provider'

const storeName = 'blog'
const store = createStore(combineReducers({
  user: (/* state, action */) => ({ name: 'John' }),
}))
const Provider = createProvider(storeName)

test('Render component using custom store name', t => {
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
