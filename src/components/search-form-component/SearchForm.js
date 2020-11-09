import React from 'react';


class SearchForm extends React.Component{
    

    render(){
        return(
            <form id="form">
                <div className="input-group">
                    <input onChange={(e) => {this.props.onInputChange(e,900)}}
                    id="search-input" type="text" name="query" className="form-control" placeholder="Search" aria-label="User Input" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                    </div>
                </div>
            </form>
        );
    }

    //If we have query in URI put it to input
    componentDidMount(){
        let query = this.checkQuery();
        if(query){
            document.getElementById('search-input').value = query;
            this.props.queryCallback(query);
        }
    }

    checkQuery(){
        let urlParams = new URLSearchParams(window.location.search);
        let query = urlParams.get('query');
        if(query!=null && query.length>0){
            return query;
        }else{
            return null;
        }
    }
}

export default SearchForm;