import React from 'react';
import TableView from './tableview';
import MapView from './mapview';
import StateWiseTableView from './statetableview';
export default class CovidTable extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			'data':null,
			'selectedState': '',
			'stateWiseSortedData': []
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
			let stateWiseSortedData = [];
			
			Object.keys(data).map((stateName,index) =>{
				stateWiseSortedData[index] ={   'name': stateName, 
												'active': 0,
												'recovered': 0,
												'deceased': 0,
												'confirmed': 0
											};
				Object.keys(data[stateName]['districtData']).map((disName) =>{
					stateWiseSortedData[index]['active'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['active']));	
					stateWiseSortedData[index]['recovered'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['recovered']));	
					stateWiseSortedData[index]['deceased'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['deceased']));	
					stateWiseSortedData[index]['confirmed'] += Math.abs(parseInt(data[stateName]['districtData'][disName]['confirmed']));	
				})
				
			})
			stateWiseSortedData.sort(this.sortDescActive);
			this.setState({
				stateWiseSortedData
			})
	}
	
	componentDidMount(){
		fetch("https://api.covid19india.org/state_district_wise.json")
		.then(res => {
			if (!res.ok) {
				// console.log("An error")
				// console.log(res);
				throw new Error("An error occurred")
			}
			return res.json()
		})
		.then(data=>{
			this.prepareStateWiseData(data);
			this.setState({
				'data':data
			});
			// console.log(data);
			return data;
		})
	}


	render(){
		let data = this.state.data;
		return (
			<React.Fragment>
				<div className="row">
					<div className="col-sm-12">
						Total Cases
					</div>
					<div className="col-sm-8">
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
					<div className="col-sm-12 col-md-8 col-lg-8">
						{this.state.selectedState ?
						<TableView 
							data={data} 
							selectedState={this.state.selectedState}
							back={this.handleLocationChange}
						/>:
						<StateWiseTableView 
							data={this.state.stateWiseSortedData} 
							viewMore={this.handleLocationChange}
						/>
						}

					</div>
					<div className="col-sm-12 col-md-4 col-lg-4">
						<MapView 
							data={data} 
							isMarkerShown={true}
							selectedState={this.state.selectedState}
							stateWiseSortedData={this.stateWiseSortedData}
						/>
					</div>
				</div>
			</React.Fragment>
		)
		
	}
}