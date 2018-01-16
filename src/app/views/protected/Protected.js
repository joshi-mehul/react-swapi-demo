// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';
import cx             from 'classnames';
import ReactBubbleChart from 'react-bubble-chart';
import 'react-bubble-chart/src/style.css';


const colorLegend = [
  //reds from dark to light
  {color: "#67000d", text: 'Negative', textColor: "#ffffff"}, "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2",
  //neutral grey
  {color: "#f0f0f0", text: 'Neutral'},
  // blues from light to dark
  "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", {color: "#08306b", text: 'Positive', textColor: "#ffffff"}
];

const tooltipProps = [{
  css: 'symbol',
  prop: '_id'
}, {
  css: 'value',
  prop: 'value',
  display: 'Last Value'
}, {
  css: 'change',
  prop: 'colorValue',
  display: 'Change'
}];



class Protected extends PureComponent {
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    // views
    currentView:    PropTypes.string.isRequired,
    enterProtected: PropTypes.func.isRequired,
    leaveProtected: PropTypes.func.isRequired,

    // apollo actions
    searchPlanet: PropTypes.func.isRequired,

    // redux
    planets:  PropTypes.object,
  };

  state = {
    viewEntersAnim: true,
    search: ''
  };

  componentDidMount() {
    const { enterProtected } = this.props;
    enterProtected();
  }

  componentWillUnmount() {
    const { leaveProtected } = this.props;
    leaveProtected();
  }

  render() {
    const { viewEntersAnim, search } = this.state;
    const {planets} = this.props;
    let getColor = () => {
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    };

    let data;
    if(planets) {
      data = planets.map(d => ({
        _id: d.name,
        value: d.diameter,
        colorValue: getColor(),
        selected: false
      }));
      console.log(data);
    }

    return(
      <div className={cx({ "view-enter": viewEntersAnim })}>
        <div className="form-group">
          <div className="col-lg-10">
            <input
              type="text"
              className="form-control"
              placeholder="Planets search"
              value={search}
              onChange={this.handlesOnSearchChange}
            />
          </div>
          <div className="col-lg-2">
            <button
              className="btn"
              onClick={this.handlesOnSearch}
            >
              Go
            </button>
          </div>
        </div>
        <div>
          {planets && <ReactBubbleChart
            className="my-cool-chart"
            data={data}
            selectedColor="#737373"
            selectedTextColor="#d9d9d9"
            fixedDomain={{min: -1, max: 1}}
            legend={true}
            legendSpacing={0}
            tooltip={true}
            tooltipProps={tooltipProps}
            tooltipFunc={this.tooltipFunc}
            style={{width:'700px', height: '700px'}}
          />}
        </div>
      </div>
    );
  }

  handlesOnSearchChange = (event) => {
    event.preventDefault();
    // should add some validator before setState in real use cases
    this.setState({ search: event.target.value });
  }

  handlesOnSearch = async (event) => {
    event.preventDefault();
    const {
      searchPlanet,
    } = this.props;

    const {
      search
    } = this.state;


    try {
      await searchPlanet({search});
    } catch (error) {
      console.log('could not search planet please try again..., error: ', error);
    }
  }

  tooltipFunc = (val) => {
    console.log(val);
  }


}

export default Protected;
