import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleClose } from '../actions/components';
import BottomTabs from './BottomTabs';
import { ComponentInt, ComponentsInt, ChildInt } from '../utils/InterfaceDefinitions';

const mapDispatchToProps = (dispatch: any) => ({
  handleNotificationClose: () => dispatch(handleClose()),
});

const mapStateToProps = (store: any) => ({
  focusChild: store.workspace.focusChild,
  components: store.workspace.components,
});

interface PropsInt {
  focusChild: ChildInt;
  components: ComponentsInt;
  focusComponent: ComponentInt;
  reduxView: boolean;
}

class BottomPanel extends Component<PropsInt> {
  render() {
    const { components, focusComponent, focusChild, reduxView } = this.props;

    return (
      <div className="bottom-panel" style={{ width: '100%' }}>
        <BottomTabs
          components={components}
          focusComponent={focusComponent}
          focusChild={focusChild}
          reduxView={reduxView}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BottomPanel);
