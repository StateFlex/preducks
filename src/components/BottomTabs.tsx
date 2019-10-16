import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import HtmlAttr from './HtmlAttr';
import Interfaces from './Interfaces';
import Reducers from './Reducers';
import CodePreview from './CodePreview';
import Props from './Props.tsx';
import ReactCodePreview from './ReactCodePreview'
import { ComponentInt, ComponentsInt, ChildInt } from '../utils/InterfaceDefinitions';
import ComponentReduxSetup from './ComponentReduxSetup';
import AppBar from '@material-ui/core/AppBar';
import theme from './theme';

interface PropsInt {
  focusChild: ChildInt;
  components: ComponentsInt;
  focusComponent: ComponentInt;
  classes: any;
  reduxView: boolean;
}

// interface TreeInt {
//   name: string;
//   attributes: { [key: string]: { value: string } };
//   children: TreeInt[];
// }

const styles = (theme: any): any => ({
  appBarRoot: {
    color: '#000000',
    backgroundColor: '#61d8f9' //theme.palette.primary.light
  },

    root: {
      flexGrow: 1,
      backgroundColor: 'white',
      height: '100%',
      width: '100%',
      color: '#000',
      padding: '0px',
      // boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    },
    tabsRoot: {
      borderBottom: '0.5px solid #222',
    },
    tabsIndicator: {
      backgroundColor: '#000',
    },
    tabRoot: {
      textTransform: 'initial',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: 0, //theme.spacing.unit * 4,
  
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#444',
        opacity: 1,
      },
      '&$tabSelected': {
        color: '#000',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#000',
      },
    },
    tabSelected: {},
    typography: {
      padding: theme.spacing.unit * 3,
    },
    padding: {
      padding: 0 //`0 ${theme.spacing.unit * 2}px`,
    },

  });
  

class BottomTabs extends Component<PropsInt> {
  state = {
    value: 0,
  };

  handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  generateComponentTree(componentId: number, components: ComponentsInt) {
    const component = components.find(comp => comp.id === componentId);
    const tree = { name: component.title, attributes: {}, children: [] };

    component.childrenArray.forEach((child) => {
      if (child.childType === 'COMP') {
        tree.children.push(this.generateComponentTree(child.childComponentId, components));
      } else {
        tree.children.push({
          name: child.componentName,
          attributes: {},
          children: [],
        });
      }
    });
    return tree;
  }

  render() {
    const {
      classes, components, focusComponent, focusChild, reduxView
    } = this.props;
    const { value } = this.state;

    // display count on the tab. user can see without clicking into tab
    const propCount = focusComponent.props.length;
    const htmlAttribCount = focusComponent.childrenArray.filter(child => child.childType === 'HTML')
      .length;






      
    return (
      <div className={classes.root}>
        <AppBar 
          position="static"
          color="primary"
          classes={{ root: classes.appBarRoot}}
        >

        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}>
         
          { reduxView ?
          <Tooltip
            title="give selected component local state and/or connections to the redux store/actions"
            aria-label="give selected component local state and/or connections to the redux store/actions"
            placement="top">
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={`local state & redux connections ${propCount ? `(${propCount})` : ''} `}
            />
          </Tooltip>
          :
          <Tooltip
            title="component props"
            aria-label="Component Props"
            placement="top">
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={`component props ${propCount ? `(${propCount})` : ''} `}
            />
          </Tooltip>
          }




          <Tooltip
            title="interfaces"
            aria-label="define typescript interfaces"
            placement="top">
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={`typescript interfaces ${propCount ? `(${propCount})` : ''} `}
            />
          </Tooltip>



          <Tooltip
            title="edit attributes of currently selected HTML element"
            aria-label="edit attributes of currently selected HTML element"
            placement="top">
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={`HTML Element Attributes ${htmlAttribCount ? `(${htmlAttribCount})` : ''} `}
            />
          </Tooltip>

          { reduxView  && 

<Tooltip
  title="reducers"
  aria-label="define redux reducers"
  placement="top">
  <Tab
    disableRipple
    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
    label={`redux reducers ${propCount ? `(${propCount})` : ''} `}
  />
</Tooltip>
}


          {/* <Tooltip
            title="react code preview"
            aria-label="react code preview"
            placement="top">
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={'react code preview'}
            />
          </Tooltip> */}
        </Tabs>
        </AppBar>
        <div>
          {/* {(reduxView && value === 0) ? 
          <CodePreview focusComponent={focusComponent} components={components} />  
          :
          <ReactCodePreview focusComponent={focusComponent} components={components} />
          } */}
       
      
          {reduxView && value === 0 && <ComponentReduxSetup focusComponent={focusComponent} />}
          {!reduxView && value === 0 && <Props />}

          { value === 1 && <Interfaces /> }

          {reduxView && value === 2 && focusChild.childType === 'HTML' && <HtmlAttr />}
          {!reduxView && value === 2 && focusChild.childType === 'HTML' && <HtmlAttr />}
          {reduxView && value === 2 && focusChild.childType !== 'HTML' && (
            <p>select an HTML element to view attributes</p>
          )}
          {!reduxView && value === 2 && focusChild.childType !== 'HTML' && (
            <p>select an HTML element to view attributes</p>
          )}
          
          {!reduxView && value === 3 && <Reducers />}

          {/* {value === 0 && <CodePreview focusComponent={focusComponent} components={components} />} */}
          {/* {value === 1 && <ComponentReduxSetup focusComponent={focusComponent} />}
          {value === 2 && focusChild.childType === 'HTML' && <HtmlAttr />}
          {value === 2 && focusChild.childType !== 'HTML' && (
            <p>select an HTML element to view attributes</p>
          )} */}
          {/* {value === 3 && <ReactCodePreview focusComponent={focusComponent} components={components} />} */}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(BottomTabs);
