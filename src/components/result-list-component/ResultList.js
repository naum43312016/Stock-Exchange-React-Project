import React from 'react';
import './ResultList.css';


class ResultList extends React.PureComponent{
    constructor(props){
        super(props);
        this.url = "";//Add api key and url
        this.companyUrl = "";//Add api key and url
    }

    render(){
        return(
            <div id="list-container">
                <ul id="stocks-list">
                </ul>
            </div>
        );
    }

    async componentDidUpdate(){
        let list = document.getElementById('stocks-list');
        while(list.firstChild){ //Clear list
            list.removeChild(list.firstChild);
        }
        try{
            if(this.props.searchQuery.length > 0 && this.props.searchQuery !== " "){
                let response = await fetch(this.url + "query=" + this.props.searchQuery + "&limit=10&exchange=NASDAQ");
                if(response.ok){
                    let arr = await response.json();
                    let fetches = [];
                    let companies="";
                    /*
                    We know than we have limit 10 companies
                    and we can request only five at every api request 
                    P.S , in the end is not important for url
                    */
                    for(let i=0;i<arr.length;i++){
                        if(i===4 || i===arr.length-1){
                            companies+=arr[i].symbol+",";
                            fetches.push(companies);
                            companies="";
                        }else{
                            companies+=arr[i].symbol+",";
                        }
                    }
                    let urls = this.createFetchsUrl(fetches);
                    Promise.all(urls.map(u=>fetch(u))).then(responses =>
                        Promise.all(responses.map(res => res.json()))
                    ).then(json => {
                        this.renderResults(list,json,this.props.searchQuery);
                    })
                }
        }
        }catch{
            alert("Server Error");
        }
    }

    renderResults(resultElement,companies,inputValue){
        for(let i=0;i<companies.length;i++){
            let array = companies[i];
            array.forEach(elem => {
                resultElement.appendChild(this.createResultLi(elem,inputValue));
            });
        }
    }
    createResultLi(elem,inputValue){
        let change = elem.changes;
        let changeElement = this.getChangeElement(change);
        let companyName = this.checkSearchedPart(elem.companyName,inputValue);
        let symbol = this.checkSearchedPart(elem.symbol,inputValue);
        let li = document.createElement("li");
        li.classList.add("result-list-item");
        let img = document.createElement("img");
        img.src = elem.image; 
        img.setAttribute("id", "company-image-main");
        li.appendChild(img);
        let a = document.createElement("a");
        a.href = '/company?symbol=' + elem.symbol;
        a.classList.add("list-link");
        a.innerHTML = companyName + ". "+'<span class="symbol-text">'+"("+symbol+")"+ changeElement + '</span>';
        li.appendChild(a);
        let btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("btn-compare","btn","btn-info");
        btn.innerText = "Compare";
        btn.addEventListener("click",() => {
            this.props.addToComparisonButton(elem);
        })
        li.appendChild(btn);
        return li;
    }

    //Check if searched part presents and add highlighted background
    checkSearchedPart(companyName,inputValue){
        let index = companyName.toLowerCase().indexOf(inputValue.toLowerCase());
            if(index >- 1){
                let len = inputValue.length;
                companyName = companyName.slice(0,index) + '<mark>' + companyName.slice(index,index+len) + '</mark>' + companyName.slice(index+len);
            }
            if(companyName.length>45){
                companyName = companyName.slice(0,45) + '...'
            }
        return companyName;
    }
    getChangeElement(change){
        if(change==null || change==undefined) return "";
        if(change>=0){
            return '<span class="green-text change-text-main">'+ "(" + change + "%)" + '</span>'
        }else{
            return '<span class="red-text change-text-main">'+ "(" + change + "%)" + '</span>'
        }
    }

    createFetchsUrl(fetches){
        let urls = [];
        for(let i=0;i<fetches.length;i++){
            urls.push(this.companyUrl + fetches[i]);
        }
        return urls;
    }
    
    async getProfile(company){
        let response = await fetch(this.companyUrl+company);
        if(response.ok){
            let json = await response.json();
            return json[0];
        }else{
            alert("HTTP-Error: " + response.status);
        }
    }
    
}

export default ResultList;