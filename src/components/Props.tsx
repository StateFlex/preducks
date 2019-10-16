import React, { Component, Fragment } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import { addProp, deleteProp } from '../actions/components.ts';
import ReactDataTable from './ReactDataTable.tsx';
import { StoreInterface } from '../utils/InterfaceDefinitions';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    color: '#222'

  },
  chip: {
    color: '#00f',
    backgroundColor: '#eee',
  },
  column: {


  },
  icon: {
    fontSize: '20px',
    color: '#0f0',
    opacity: '0.7',
    transition: 'all .2s ease',

    '&:hover': {
      color: 'red',
    },
  },
  cssLabel: {
    color: '222',

    '&$cssFocused': {
      color: '222',
    },
  },
  cssFocused: {},
  input: {
    color: '#222',
    marginBottom: '0px',
    width: '60%',
  },
  light: {
    color: '#222',
  },
  avatar: {
    color: '#eee',
    fontSize: '10px',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  addProp: ({
    key,
    value,
    required,
    type,
  }: {
  key: string;
  value: string;
  required: boolean;
  type: string;
  }) => dispatch(
    addProp({
      key,
      value,
      required,
      type,
    }),
  ),
  deleteProp: (propId: number) => dispatch(deleteProp(propId)),
});

const mapStateToProps = (store: any) => ({
  focusComponent: store.workspace.focusComponent,
  storeConfig: store.workspace.storeConfig
});

const availablePropTypes = {
  string: 'STR',
  number: 'NUM',
  object: 'OBJ',
  array: 'ARR',
  boolean: 'BOOL',
  function: 'FUNC',
  node: 'NODE',
  element: 'ELEM',
  any: 'ANY',
  tuple: 'TUP',
  enum: 'ENUM',
};

// const typeOptions = [
//   <option value="" key="" />,
//   ...Object.keys(availablePropTypes).map(type => (
//     <option value={type} key={type} style={{ color: '#000' }}>
//       {type}
//     </option>
//   )),
// ];

const convertToOptions = choices => [
  <option value="" key="" />,
  choices.map(choice => (
    <option value={choice} key={choice} style={{ color: '#eee' }}>
      {choice}
    </option>
  )),
];


class Props extends Component {
  state = {
    propKey: '',
    propValue: '',
    propRequired: true,
    propType: '',
  };


  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value.trim(),
    });
  };

  togglePropRequired = () => {
    this.setState({
      propRequired: !this.state.propRequired,
    });
  };

  reactHandler = (row, callback) => {
    const name = row._Key
    const type = row.Type
    const initialValue = row.Value
    const isRequired = row.Required
    this.setState({
    propKey: name,
    propValue: initialValue,
    propRequired: isRequired,
    propType: type,
    });
    return callback(row.id);
    
    // dispatch(deleteState(name));
    // setEnteredName(name);
    // setEnteredType(type);
    // setEnteredValue(initialValue);
    };

  handleAddProp = (event) => {
    event.preventDefault();

    const {
      propKey, propValue, propRequired, propType,
    } = this.state;

    // check if prop exists with same key. CANNOT have duplicates
    const savedPropKeys = this.props.focusComponent.props.map(p => p.key);
    if (savedPropKeys.includes(propKey)) {
      window.alert(`A prop with the name: "${propKey}" already exists.`);
      return;
    }

    // check if prop starts with digits. Digits at string start breaks indexedDB
    if (/^\d/.test(propKey)) {
      window.alert('Props are not allowed to begin with digits');
      return;
    }

    this.props.addProp({
      key: propKey,
      value: propValue,
      required: propRequired,
      type: propType,
    });

    this.setState({
      propKey: '',
      propValue: '',
      propRequired: true,
      propType: '',
    });
  };

  render() {
    const {
      focusComponent, classes, deleteProp, addProp,
    } = this.props;

    const rowHeader = ['_Key', 'Value', 'Type', 'Required'];
    // prepare the saved Props in a nice way, so you can sent them to TableData
    const propsRows = focusComponent.props.map(prop => ({
      _Key: prop.key,
      Value: prop.value,
      Type: prop.type,
      Required: prop.required,
      id: prop.id,
    }));

    return (
      <Fragment>
          <form 
                className="props-input" 
                onSubmit={this.handleAddProp}
                >

          <div 
                className="bottom-panel-props">



          <div 
                className="bottom-panel-props-submit">
          <Button
                aria-label="Add"
                type="submit"
                // disabled={!this.state.propKey || !this.state.propType}
                variant="contained"
                size="large">                                     
                ADD PROP
          </Button>
          </div>



          <div 
                className="bottom-panel-props-key">
          <TextField
                id="propKey"
                label="Key"
                autoFocus
                onChange={this.handleChange}
                value={this.state.propKey}
                required
                InputProps={{
                            className: classes.input,
                            }}
                            InputLabelProps={{
                            className: classes.input,
                           }}/>
          </div>




          <div 
                className="bottom-panel-props-value">
          <TextField
                id="propValue"
                label="Value"
                onChange={this.handleChange}
                InputProps={{
                  className: classes.input,
                }}
                InputLabelProps={{
                  className: classes.input,
                }}
                value={this.state.propValue} 
                />
          </div>



          <div 
                className="bottom-panel-props-type">
        <FormControl required>
        <InputLabel 
                className={classes.light} 
                htmlFor="propType">
                Type
        </InputLabel>
        <Select
                native
                className={classes.light}
                id="propType"
                placeholder="title"
                onChange={this.handleChange}
                value={this.state.propType}
                required >
                {convertToOptions([
                  'string',
                  'number',
                  'object',
                  'array',
                  'boolean',
                  'function',
                  'node',
                  'element',
                  'any',
                  'tuple',
                  'emum',
                  //...Object.keys(this.props.storeConfig.interfaces),
                  ])}
        </Select>
        </FormControl>
        </div>


        <div 
                className="bottom-panel-props-required">
                <Grid container 
                      spacing={0}
                      justify="flex-start"
                      alignItems="flex-end"
                      direction='row'>
                <Grid item xs={6}>
                <InputLabel 
                        className={classes.light} htmlFor="propRequired"
                        >
                        Required?
                </InputLabel>
                </Grid>
                <Grid xs={6}>
                <Switch
                      checked={this.state.propRequired}
                      onChange={this.togglePropRequired}
                      value="propRequired"
                      id="propRequired"/>
                </Grid>
                </Grid>
        </div>


        <div 
                className="bottom-panel-props-data">
        <ReactDataTable
                rowHeader={rowHeader}
                rowData={propsRows}
                deletePropHandler={deleteProp}
                reactHandler={this.reactHandler}/>
        </div>


        </div>          
        </form>             
        </Fragment>      
      );
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Props));
