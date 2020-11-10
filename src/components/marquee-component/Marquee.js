import React from 'react';
import './Marquee.css';


class Marquee extends React.Component{

    render(){
        return(
            <div className="marquee-container">
                <div id="text-container">
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.container = document.getElementById('text-container');
        this.load();
    }

    //We check animation duration according to text inside marquee
    animateMarquee(){
        let len = parseInt(this.container.innerText.length);
        let animDuration = len/100*10000;
        this.container.animate([
            {transform : 'translateX(0)'},
            {transform : 'translateX(-100%)'},
        ],{
            duration: animDuration,
            iterations: Infinity
        });
    }

    async load(){
        let response = await fetch("");//Add api key and url
        try{
            if (response.ok){
                let array = await response.json();
                array = array.map((elem)=>{
                    return '<span class="company-name-marquee-text">' + elem.ticker
                    + '<span class="company-price-marquee">' + " $" + elem.price + '</span></span> ';
                })
                array.forEach(elem => {
                    this.container.innerHTML+=elem;
                });
                this.animateMarquee();
            }else{
                alert("HTTP-Error: " + response.status);
            }
        }catch{
            alert("Server Error: Please refresh your page")
        }
    }

    
}

export default Marquee;