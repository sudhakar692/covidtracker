import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import GoogleMap from './components/GoogleMap';

import INDIA_CENTER from './const/india_center';
import config from './config';

// InfoWindow component
const InfoWindow = (props) => {
  const { place } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 200,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
    borderRadius:'10px',
    'line-height':'20px' 
  };

  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 16, fontWeight:'bold'}}>
        {place.name}
      </div>
      <div style={{ fontSize: 14 }}>
        Active: {place.active}
      </div>
      <div style={{ fontSize: 14 }}>
        Recovered: {place.recovered}
      </div>
      <div style={{ fontSize: 14 }}>
        Death: {place.deceased}
      </div>
      <div style={{ fontSize: 14 }}>
        Confirmed: {place.confirmed}
      </div>
    </div>
  );
};

// Marker component
const Marker = (props) => {
  const markerStyle = {
    border: '1px solid white',
    borderRadius: '50%',
    height: 25,
    width: 25,
    backgroundColor: '#8cadda',
    cursor: 'pointer',
    zIndex: 10,
  };

  return (
    <Fragment>
      <div style={markerStyle} />
      {props.show && <InfoWindow place={props.place} />}
    </Fragment>
  );
};

class MarkerInfoWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: this.props.places,
    };
  }
      
  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.places!==prevState.places){
      return {places: nextProps.places}
    }
    else return null;
  }


  // onChildClick callback can take two arguments: key and childProps
  onChildClickCallback = (key) => {
    this.setState((state) => {
      state.places.forEach(place => {
        place.show = place.id === key?!place.show:false;
      });
      return { places: state.places };
    });
  };

  render() {
    const { places } = this.state;
    return (
      <Fragment>
        {!isEmpty(places) ? (
          <GoogleMap
            defaultZoom={5}
            defaultCenter={INDIA_CENTER}
            bootstrapURLKeys={{ key: config.GOOGLE_MAP_API_KEY }}
            onChildClick={this.onChildClickCallback}
          >
            {places.map(place =>
              (((this.props.selectedState && this.props.selectedState === place.name) || !this.props.selectedState) &&
              <Marker
                key={place.id}
                lat={place.geometry.location.lat}
                lng={place.geometry.location.lng}
                show={place.show}
                place={place}
              />))}
          </GoogleMap>
        ):null}
      </Fragment>
    );
  }
}

InfoWindow.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string,
    active: PropTypes.number,
    recovered: PropTypes.number,
    deceased: PropTypes.number,
    confirmed: PropTypes.number,
  }).isRequired,
};

Marker.propTypes = {
  show: PropTypes.bool.isRequired,
  place: PropTypes.shape({
    name: PropTypes.string,
    active: PropTypes.number,
    recovered: PropTypes.number,
    deceased: PropTypes.number,
    confirmed: PropTypes.number,
  }).isRequired,
};

export default MarkerInfoWindow;
