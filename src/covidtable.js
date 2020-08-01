import React from 'react';
import TableView from './tableview';
import StateWiseTableView from './statetableview';
import MarkerInfoWindow from './infomap';
import {postFetch} from './api';
import isEmpty from 'lodash.isempty';
import config from './config';

export default class CovidTable extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			'data':null,
			'selectedState': '',
			'places': []
		}
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.prepareStateWiseData = this.prepareStateWiseData.bind(this);
		this.sortDescActive = this.sortDescActive.bind(this);
		
	}

	handleLocationChange(value){
		this.setState({
			selectedState: value
		})
	}

	sortDescActive(a, b) {
		return b['active'] - a['active'];
	}

	prepareStateWiseData(data){
			let places = this.state.places;
			Object.keys(data).map((stateName,index) =>{
				let stateData = places.find(place=> place.name.toLowerCase() === stateName.toLowerCase())
				if(!isEmpty(stateData)){
					Object.keys(data[stateName]['districtData']).map((disName) =>{
						stateData['active'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['active']));	
						stateData['recovered'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['recovered']));	
						stateData['deceased'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['deceased']));	
						stateData['confirmed'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['confirmed']));	
					})
				}
				
				
			})
			places.sort(this.sortDescActive);

			this.setState({
				places
			})
			
	}
	
	componentDidMount(){
		postFetch(config.HOMEPAGE_URL+"/places.json")
		.then((data) => {
			data.results.forEach((result) => {
			  result.show = false; // eslint-disable-line no-param-reassign
			  result.active =0;
			  result.recovered =0;
			  result.deceased =0;
			  result.confirmed = 0;
			});
			this.setState({ places: data.results });
		  }).then(()=>{
			postFetch("https://api.covid19india.org/state_district_wise.json")
			.then(data=>{
				this.prepareStateWiseData(data);
				this.setState({
					'data':data
				});
			})
		  })
  

		
	}


	render(){
		let data = this.state.data;
		return (
			<React.Fragment>
				<div className="row">
					<div className="col-sm-12 col-md-8 col-lg-6">
						Total Cases
					
						<select className="form-control" name="location" onChange={(e)=> this.handleLocationChange(e.target.value)}>
							<option>Choose State</option>
						{data && Object.keys(data).map((key,index) => {
							return <option value={key} 
							selected={this.state.selectedState === key? true:false}>{key}</option>
						})}
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-12 col-md-8 col-lg-6">
						{this.state.selectedState ?
						<TableView 
							data={data} 
							selectedState={this.state.selectedState}
							back={this.handleLocationChange}
						/>:
						<StateWiseTableView 
							data={this.state.places} 
							viewMore={this.handleLocationChange}
						/>
						}

					</div>
					<div className="col-sm-12 col-md-4 col-lg-6">
						<MarkerInfoWindow 
							selectedState={this.state.selectedState}
							places={this.state.places}/>
					</div>
				</div>
			</React.Fragment>
		)
		
	}
}