import React from 'react';
import './Company.css';
import CompanyInfo from '../company-info-component/CompanyInfo';


class Company extends React.Component{

    constructor(props){
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const symbol = urlParams.get('symbol');
        if(symbol){
            this.symbols = symbol.split(",");
            this.colSize = this.getColumnSizeByCompaniesQuantity(this.symbols);
        }else{
            alert("You need to specify company Symbol.")
        }
    }

    render(){
        const components = [];
        for(let i=0;i<this.symbols.length;i++){
            components.push(<CompanyInfo key={i} symbol={this.symbols[i]} colSize={this.colSize}/>);
        }
        return(
            <section id="site-content">
                <div className="container-fluid">
                    <div id="main-container" className="row justify-content">
                        {components}
                    </div>
                </div>
            </section>
        );
    }

    componentDidMount(){
    }

    
    getColumnSizeByCompaniesQuantity(symbols){
        if(symbols.length<2) return "col-lg-12";
        if(symbols.length===2) return "col-lg-6";
        return "col-lg-4";
    }

}

export default Company;