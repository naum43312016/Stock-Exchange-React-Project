import React from 'react';
import Chart from 'chart.js';


class CompanyInfo extends React.Component{

    constructor(props){
        super(props);
        this.url = "";//Add api key and url
        this.historicalPriceUrl = "";//Add api key and url
    }

    render(){
        return null;
    }

    componentDidMount(){
        this.companyContainer = this.createMainRow(document.getElementById('main-container'),this.props.colSize);
        this.symbol = this.props.symbol
        this.load();
    }

    async load(){
        //this.startSpinner();
        let companyUrl = this.url + this.symbol;
        try{
            let response = await fetch(companyUrl);
            if (response.ok){
                let json = await response.json();
                let data = json[0];
                this.companyContainer.appendChild(this.createImageAndCompanyNameElement(data));
                this.createStockPrice(data);
                this.companyContainer.appendChild(this.createDescription(data));
                this.addChart();
                //this.stopSpinner();
            }else{
                alert("HTTP-Error: " + "Please check if api key reached limit of requests");
                //this.stopSpinner();
            }
        }catch{
            alert("HTTP-Error: " + "Please check if api key reached limit of requests");
            //this.stopSpinner();
        }
    }

    createMainRow(companyContainer,colSize){
        let col = document.createElement('div');
        col.classList.add('main-row',colSize,'col-md-12', 'col-sm-12');
        companyContainer.appendChild(col);
        let content = document.createElement('div');//For spacing between columns
        content.classList.add('content');
        col.appendChild(content);
        return content;
    }

    createImageAndCompanyNameElement(data){
        let containerImageLink = this.createContainer();
        let row = this.createRow(containerImageLink);
        let col = document.createElement('div');
        col.classList.add('col-12');
        row.appendChild(col);
        let divInCol = document.createElement('div');
        divInCol.classList.add('row','align-items-center');
        col.appendChild(divInCol);
        let img = document.createElement('img');
        img.classList.add('company-img');
        img.src = data.image;
        divInCol.appendChild(img);
        let link = document.createElement('a');
        link.classList.add('company-link');
        this.createCompanyLink(link,data);
        divInCol.appendChild(link);
        return containerImageLink;
    }

    createCompanyLink(companyLink,data){
        if(data.website){  
            companyLink.href = data.website;
        }
        let industry = "";
        if(data.industry){
            industry = "(" +data.industry+")";
        }
        var text = document.createTextNode(data.companyName + ". " + industry );
        companyLink.appendChild(text);
    }

    createDescription(data){
        if(!data.description) data.description="";
        let descriptionContainer = this.createContainer();
        descriptionContainer.classList.add('description-container');
        let row = this.createRow(descriptionContainer);
        let col = document.createElement('div');
        col.classList.add('col-12');
        row.appendChild(col);
        let companyDesc = document.createElement('p');
        if(data.description.length>0){ 
            let text = document.createTextNode(data.description);
            companyDesc.appendChild(text);
        }
        col.appendChild(companyDesc);
        return descriptionContainer;
    }

    createStockPrice(data){
        let containerStock = document.createElement('div');
        containerStock.classList.add('container','stock-price-container');
        let row = this.createRow(containerStock);
        let stockCol = document.createElement('div');
        stockCol.classList.add('col-12');
        row.appendChild(stockCol);
        let stockPrice = document.createElement('span');
        stockPrice.classList.add('stock-price');
        let price = document.createTextNode("Stock price: " + "$" + data.price);
        stockPrice.appendChild(price);
        let changes = parseFloat(data.changes);
        let changesSpan = document.createElement('span');
        changesSpan.appendChild(document.createTextNode(" (" + changes + "%)"));
        if(changes<0){
            changesSpan.classList.add('red-text');
        }else{
            changesSpan.classList.add('green-text');
        }
        stockPrice.appendChild(changesSpan)
        stockCol.appendChild(stockPrice);
        this.companyContainer.appendChild(containerStock);
    }

    createContainer(){
        let container = document.createElement('div');
        container.classList.add('container')
        return container;
    }
    //Create row and append to container
    createRow(container){
        let row = document.createElement('div');
        row.classList.add('row');
        container.appendChild(row);
        return row;
    }


    async addChart(){
        let container = this.createContainer();
        let row = this.createRow(container);
        let col = document.createElement('div');
        col.classList.add('col-12');
        row.appendChild(col);
        let chartCanvas = document.createElement('canvas');
        chartCanvas.height = 320;
        col.appendChild(chartCanvas);
        let response = await fetch(this.historicalPriceUrl + this.symbol + "?serietype=line");
        if (response.ok){
            let json = await response.json();
            let data = json.historical;
            let dateLabels = [];
            let prices = [];
            let set = new Set();
            //Chart prices data for every year
            for(let i=data.length-1;i>=0;i--){
                let year = data[i].date.split("-");
                if(!set.has(year[0])){
                    dateLabels.push(data[i].date);
                    prices.push(data[i].close);
                    set.add(year[0]);
                }
            }
            var config = {
            type: 'line',
            data: {
                labels: dateLabels,
                datasets: [{
                label: "Stock Price History",
                backgroundColor: "#ff2f7b",
                data: prices,
                }]
            },
            options: {
                scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxRotation: 70,
                        minRotation: 70
                    }
                }],
                },
            }
            };
            var ctx = chartCanvas.getContext("2d");
            new Chart(ctx, config);
            this.companyContainer.appendChild(container);
        }else{
            alert("HTTP-Error: " + "Please check if api key reached limit of requests");
            this.stopSpinner();
        }
    }

}

export default CompanyInfo;