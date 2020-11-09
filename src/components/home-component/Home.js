import React from 'react';
import Marquee from '../marquee-component/Marquee';
import SearchForm from '../search-form-component/SearchForm';
import ResultList from '../result-list-component/ResultList';
import Compare from '../compare-component/Compare';
import './Home.css';

class Home extends React.Component{
    timeout = null;
    constructor(props){
        super(props);
        this.state = {
            searchInput: '',
            companyToAdd: null
        }
    }

    //We don't want to send request to server every input change we should wait until user stops typing
    onInputChange = (e,wait) =>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({searchInput: e.target.value});
            window.history.pushState("", "", "?query="+e.target.value);
        },wait);
    }

    queryCallback = (query) => {
        this.setState({searchInput: query});
    }

    addToComparisonButton = (elem) => {
        this.setState({companyToAdd: elem})
    }

    render(){
        return(
            <div>
                <Marquee />
                <div className="container site-container">
                    <section id="site-content">
                        <div className="container">
                            <Compare companyToAdd={this.state.companyToAdd}/>
                            <div className="row head-text">
                                <div className="col-12 text-center">
                                    <h1>Search Nasdaq Stocks</h1>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                <SearchForm onInputChange={this.onInputChange} queryCallback={this.queryCallback}/>
                                </div>
                            </div>
                            <div id="spinner" className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <ResultList searchQuery={this.state.searchInput} addToComparisonButton={this.addToComparisonButton}/>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Home;