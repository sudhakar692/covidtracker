import React from 'react';

export default class TableView extends React.Component {
    constructor(props){
        super(props);
        this.renderTable = this.renderTable.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(stateData){
        return(<tr key={stateData['name']}>
            <td ><a href='#' onClick={()=>this.props.viewMore(stateData['name'])}>{stateData['name']}</a></td>
            <td >{stateData['active']}</td>
            <td >{stateData['recovered']}</td>
            <td >{stateData['deceased']}</td>
            <td >{stateData['confirmed']}</td>
        </tr>);
    }
    renderTable(data){
        return data.map((value)=>{
            return this.renderRow(value)
        })
    }

    render(){
        let data = this.props.data;
        return(
            <React.Fragment>
                <table className="table table-striped table-bordered table-responsive">
                    <thead>
                        <tr>
                        <th>State</th>
                        <th>Active</th>
                        <th>Recovered</th>
                        <th >Deaths</th>
                        <th >Confirmed</th>
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