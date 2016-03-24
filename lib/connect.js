import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

export default (...args) => (Component, storeName = 'store') => {
  // Return the "normal" connected component from `react-redux`.
  // Then wrap it and pass the store with the custom name as a `prop`,
  // after picking it from `context`.
  const ConnectedComponent = connect(...args)(Component)

  const Wrapper = (props, context) => (
    <ConnectedComponent {...props} store={context[storeName]} />
  )

  Wrapper.displayName = `WrappedConnect(${ConnectedComponent.displayName})`
  Wrapper.contextTypes = {
    [storeName]: PropTypes.object,
  }

  return Wrapper
}

