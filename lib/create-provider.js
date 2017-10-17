/*
  Note: this is copied from `react-redux/Provider`.
  The only difference is the wrapping function and the name
  of the context property.
*/
import { Component, Children } from 'react'
import PropTypes from 'prop-types'

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
})

export default function createProvider (storeName = 'store') {
  let didWarnAboutReceivingStore = false
  function warnAboutReceivingStore () {
    if (didWarnAboutReceivingStore) {
      return
    }
    didWarnAboutReceivingStore = true

    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(
        '<Provider> does not support changing `store` on the fly. ' +
        'It is most likely that you see this error because you updated to ' +
        'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' +
        'automatically. See https://github.com/reactjs/react-redux/releases/' +
        'tag/v2.0.0 for the migration instructions.'
      )
    }
    /* eslint-disable no-console */
  }

  class Provider extends Component {
    constructor (props, context) {
      super(props, context)
      this.store = props.store
    }

    getChildContext () {
      return { [storeName]: this.store }
    }

    render () {
      const { children } = this.props
      return Children.only(children)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    Provider.prototype.componentWillReceiveProps = function (nextProps) {
      const { store } = this
      const { store: nextStore } = nextProps

      if (store !== nextStore) {
        warnAboutReceivingStore()
      }
    }
  }

  Provider.propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
  }
  Provider.childContextTypes = {
    [storeName]: storeShape.isRequired,
  }

  return Provider
}
