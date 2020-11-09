import React from 'react';
import './Compare.css'

class Compare extends React.Component{

    constructor(props){
        super(props);
        this.companies = [];
    }
    
    render(){
        return(
            <div className="row pt-3">
                <div className="col-9" id="companies-list">
                </div>
                <div className="col-3 text-right">
                    <p id="compare-text" className="compare-text-before">Compare</p>
                </div>
            </div>
        );
    }


    componentDidMount(){
        this.companiesContainer = document.getElementById('companies-list');
        this.compareText = document.getElementById('compare-text');
        this.handleCompareButtonClick();
    }

    componentDidUpdate(){
        if(this.props.companyToAdd!==null && this.getCompanyIndexInList(this.props.companyToAdd) < 0){
            this.companies.push(this.props.companyToAdd);
            this.compareText.innerText = "Compare " + this.companies.length +" Companies";
            this.compareText.classList.remove("compare-text-before");
            this.compareText.classList.add("compare-text-after");
            this.createAndAppendCompanySpan(this.props.companyToAdd);
        }
    }

    getCompanyIndexInList(company){
        for(let i=0;i<this.companies.length;i++){
            if(this.companies[i].symbol===company.symbol){
                return i;
            }
        }
        return -1;
    }
    createAndAppendCompanySpan(company){
        let span = document.createElement('span');
        span.classList.add('btn','btn-info','btn-compare-margin');
        span.appendChild(document.createTextNode(company.symbol));
        let btn = document.createElement('button');
        btn.classList.add('close');
        btn.type = "button";
        btn.innerHTML = "&times;";
        btn.addEventListener('click',()=>{
            this.removeCompanyFromList(company);
        });
        span.appendChild(btn);
        this.companiesContainer.appendChild(span);
    }

    removeCompanyFromList(company){
        let index = this.getCompanyIndexInList(company);
        if(index>=0){
            this.companies.splice(index,1);
            this.companiesContainer.removeChild(this.companiesContainer.childNodes[index]);
            if(this.companies.length>0){
                this.compareText.innerText = "Compare " + this.companies.length +" Companies";
            }else{
                this.compareText.innerText = "Compare";
                this.compareText.classList.add('compare-text-before');
                this.compareText.classList.remove("compare-text-after");
            }
        }
    }

    handleCompareButtonClick(){
        this.compareText.addEventListener('click',()=>{
            console.log(this.companies)
            let url = window.location.origin + "/company?symbol=";
            if(this.companies.length>0){
                for(let i=0;i<this.companies.length;i++){
                    if(i===this.companies.length-1){
                        url +=this.companies[i].symbol;
                    }else{
                        url +=this.companies[i].symbol + ",";
                    }
                }
                window.location = url;
            }
        })
    }
}

export default Compare;