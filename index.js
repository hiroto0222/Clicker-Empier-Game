// div elements
const hamburgerInfoCon = document.getElementById("hamburger-info-container");
const itemsInfoCon = document.getElementById("items-info-container");


const burgerCntToString = (cnt) => {
    return cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let tot_burgers = 1102;

const handleHamburgerClick = () => {
    tot_burgers += 1;
    hamburgerInfoCon.querySelector("#hamburger-cnt").innerHTML = 
    `
        ${burgerCntToString(tot_burgers)} Burgers
    `;
}