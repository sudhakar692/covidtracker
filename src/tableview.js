import React from 'react';

export default class TableView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirmed:0,
            active: 0,
            deaths: 0
        }
        this.renderTable = this.renderTable.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(key, data){
        return(<tr>
            <td>{key}</td>
            <td>{data['active']}</td>
            <td>{data['recovered']}</td>
            <td>{data['deceased']}</td>
            <td>{data['confirmed']}</td>
        </tr>);
    }
    renderTable(data){
        let active = 0, deaths = 0, confirmed = 0;
        let state = this.props.selectedState;
		return Object.keys(data).map((key,index) => {
                if(state && state !== key){ 
                    return null;
                }
                // console.log(data[key], index);
                let districtData = data[key]['districtData'];
                return Object.keys(districtData).map((districtName, index) => {
                    active += districtData[districtName]['active'];
                    confirmed += districtData[districtName]['confirmed'];
                    deaths += districtData[districtName]['deceased'];
                    console.log(active, deaths, confirmed)
                    // this.setState({
                    //     active,
                    //     deaths,
                    //     confirmed
                    // })
                    // console.log(districtData, districtData[districtName], "printing district")
                    return this.renderRow(districtName, districtData[districtName]);
                })
                
        });

    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.selectedState!==prevState.selectedState){
          return {selectedState: nextProps.selectedState}
        }
        else if(nextProps.data !== prevState.data){
            return {data: nextProps.data}
        }
        else return null;
      }
    

    render(){
        let data = this.props.data;
        return(
            <React.Fragment>
                <a href="#" className="btn btn-primary" onClick={(e)=>this.props.back('')}>Back to view state wise data</a>
                <table className="table table-striped table-bordered table-responsive">
                    <thead>
                        <tr>
                            <th>Districts</th>
                            <th>Active</th>
                            <th>Recovered</th>
                            <th>Deaths</th>
                            <th>Confirmed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data !== null ? this.renderTable(data):null}    
                    </tbody>
                    
                </table>
            </React.Fragment>
        )
    }


}