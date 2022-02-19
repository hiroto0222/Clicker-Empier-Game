// User
class User {
    constructor(username, days, age, money, burgers, clickProfit, dailyProfit, purchasedProducts) {
        this.username = username;
        this.days = days;
        this.age = age;
        this.money = money;
        this.burgers = burgers;
        this.clickProfit = clickProfit;
        this.dailyProfit = dailyProfit;
        this.purchasedProducts = purchasedProducts;
        this.yearCounter = 0;
    }

    burgerCnt() {
        return this.burgers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    clickBurger() {
        this.burgers++;
        this.money += this.clickProfit;
    }

    incrementDays() {
        this.days++;
        this.yearCounter++;
    }

    canPurchase(key) {
        if (this.purchasedProducts[key].price <= this.money) {
            return true;
        } else {
            return false;
        }
    }

    purchase(key) {
        this.money -= this.purchasedProducts[key].price;
        this.purchasedProducts[key].currPurchases++;

        // update click profit
        if (this.purchasedProducts[key].type === "ability") {
            this.clickProfit += this.purchasedProducts[key].profit;
            config.hamburgerInfo.querySelector("#clickProfit").innerHTML = `$${this.clickProfit} / click`;
        }
        // update daily profit
    }

    updateAge() {
        if (this.yearCounter === 365) {
            this.age++;
            this.yearCounter = 0;
        }
    }

    incrementDailyMoney() {
        this.money += this.dailyProfit;
    }
}


// Product
class Product {
    constructor(name, price, profit, type, maxPurchases, currPurchases, description, imgURL) {
        this.name = name;
        this.price = price;
        this.profit = profit;
        this.type = type;
        this.maxPurchases = maxPurchases;
        this.currPurchases = currPurchases;
        this.description = description;
        this.imgURL = imgURL;
    }

    getProfitPerUnit() {
        if (this.type === "ability") {
            return "+$" + this.profit + " / click";
        }
        else if (this.type === "investment") {
            return "+%" + this.profit + " / sec";
        }
        else {
            return "+$" + this.profit + " / sec";
        }
    }
}


// default products
const products = {
    "flipMachine": new Product("Flip Machine", 15000, 25, "ability", 500, 0, "グリルをクリックごとに 25円 を取得します。", "images/hamburger.png"),
    "etfStock": new Product("ETF Stock", 300000, 0.1, "investment", Infinity, 0, "ETF 銘柄の購入分をまとめて加算し、毎秒 0.1% を取得します。", "images/hamburger.png"),
    "etfBonds": new Product("ETF Bonds", 300000, 0.07, "investment", Infinity, 0, "債券 ETF の購入分をまとめて加算し、毎秒 0.07% を取得します。", "images/hamburger.png"),
    "lemonadeStand": new Product("Lemonade Stand", 30000, 30, "estate", 1000, 0, "毎秒 30 円を取得します。", "images/hamburger.png"),
    "iceCreamTruck": new Product("Ice Cream Truck", 100000, 120, "estate", 500, 0, "毎秒 120 円を取得します。", "images/hamburger.png"),
    "house": new Product("House", 20000000, 32000, "estate", 100, 0, "毎秒 32,000 円を取得します。", "images/hamburger.png"),
    "townHouse": new Product("Town House", 40000000, 64000, "estate", 100, 0, "毎秒 64,000 円を取得します。", "images/hamburger.png"),
    "mansion": new Product("Mansion", 250000000, 500000, "estate", 20, 0, "毎秒 500,000 円を取得します。", "images/hamburger.png"),
    "industrialSpace": new Product("Industrial Space", 1000000000, 2200000, "estate", 10, 0, "毎秒 2,200,000 円を取得します。", "images/hamburger.png"),
    "hotelSkyscraper": new Product("Hotel Skyscraper", 10000000000, 25000000, "estate", 5, 0, "毎秒 25,000,000 円を取得します。", "images/hamburger.png"),
    "railway": new Product("Bullet-Speed Sky Railway", 1000000000000, 30000000000, "estate", 1, 0, "毎秒 30,000,000,000 円を取得します。", "images/hamburger.png"),
}


// document pages
const config = {
    initialPage: document.getElementById("initialPage"),
    gamePage: document.getElementById("gamePage"),
    hamburgerInfo: document.getElementById("hamburgerInfo"),
    userInfo: document.getElementById("userInfo"),
    productsInfo: document.getElementById("productsInfo"),
    dataUtils: document.getElementById("dataUtils"),
}


// util functions
const displayNone = (ele) => {
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
}

const displayBlock = (ele) => {
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
}

const updateAllGameInfo = (currUser) => {
    stopInterval();
    config.userInfo.innerHTML = ``;
    config.hamburgerInfo.innerHTML = ``;
    config.productsInfo.innerHTML = ``;
    gamePage(currUser);
}

const updateUserAge = (currUser) => {
    currUser.updateAge();
    config.userInfo.querySelector("#userInfo-age").innerHTML = `${currUser.age} yrs old`;
}

const updateUserMoney = (currUser) => {
    currUser.incrementDailyMoney();
    config.userInfo.querySelector("#userInfo-money").innerHTML = `$${currUser.money}`;
}

// intervals timer
let interval;
const startInterval = (currUser) => {
    interval = setInterval(() => {
        currUser.incrementDays();
        config.userInfo.querySelector("#userInfo-days").innerHTML = `${currUser.days} days`;
        updateUserAge(currUser);
        updateUserMoney(currUser);
    }, 1000)
}

const stopInterval = () => {
    clearInterval(interval);
}


// initialPage logic
const loginUser = () => {
    return;
}

const registerUser = () => {
    let username = document.getElementById("username").value.replace(/ /g, "");
    if (username !== "") {
        let currUser = new User(username, 0, 20, 30000, 0, 25, 0, products);
        displayNone(config.initialPage);
        displayBlock(config.gamePage);
        gamePage(currUser);
    }
}

const gamePage = (currUser) => {
    // userInfo
    config.userInfo.append(userInfo(currUser));
    startInterval(currUser);

    // hamburgerInfo
    config.hamburgerInfo.append(hamburgerInfo(currUser));
    
    // productsInfo
    config.productsInfo.append(productsInfo(currUser));
}

const updateMoney = (currUser) => {
    let userInfoMoney = config.userInfo.querySelector("#userInfo-money");
    userInfoMoney.innerHTML = `$${currUser.money}`;
}

const hamburgerInfo = (currUser) => {
    let hamburgerInfoContainer = document.createElement("div");
    hamburgerInfoContainer.classList.add("p-2");
    hamburgerInfoContainer.id = "hamburgerInfoContainer";
    hamburgerInfoContainer.innerHTML = 
    `
        <div class="inner-container text-center">
            <h1 id="hamburgerCnt">${currUser.burgerCnt()} Burgers</h1>
            <div class="d-flex col-12 text-center">
                <p class="col-6" id="clickProfit">$${currUser.clickProfit} / click</p>
                <p class="col-6" id="dailyProfit">$${currUser.dailyProfit} / sec</p>  
            </div>
        </div>
        <div class="hamburger-img-container p-2 pt-3 d-flex justify-content-center">
            <img id="hamburger" class="py-2 hover img-fluid" src="images/hamburger.png" alt="hamburger-img">
        </div>
    `;

    hamburgerInfoContainer.querySelector("#hamburger").addEventListener("click", () => {
        let hamburgerCnt = hamburgerInfoContainer.querySelector("#hamburgerCnt");
        currUser.clickBurger();
        hamburgerCnt.innerHTML = `${currUser.burgerCnt()} Burgers`;
        updateMoney(currUser);
    });

    return hamburgerInfoContainer;
}

const userInfo = (currUser) => {
    let userInfoContainer = document.createElement("div");
    userInfoContainer.classList.add("d-flex", "flex-wrap", "mt-1");
    userInfoContainer.id = "userInfoContainer";
    userInfoContainer.innerHTML = 
    `
        <div class="col-6 p-1">
            <div class="inner-container d-flex col-12 justify-content-center align-items-center">
                <p id="userInfo-username">${currUser.username}</p>
            </div>
        </div>
        <div class="col-6 p-1">
            <div class="inner-container d-flex col-12 justify-content-center align-items-center">
                <p id="userInfo-age">${currUser.age} yrs old</p>
            </div>
        </div>
        <div class="col-6 p-1">
            <div class="inner-container d-flex col-12 justify-content-center align-items-center">
                <p id="userInfo-days">${currUser.days} days</p>
            </div>
        </div>
        <div class="col-6 p-1">
            <div class="inner-container d-flex col-12 justify-content-center align-items-center">
                <p id="userInfo-money">$${currUser.money}</p>
            </div>
        </div>
    `;

    return userInfoContainer;
}

const productsInfo = (currUser) => {
    let productsInfoContainer = document.createElement("div");
    productsInfoContainer.id = "productsInfoContainer";
    for (let [key, product] of Object.entries(products)) {
        productsInfoContainer.innerHTML += 
        `
            <div class="col-12 p-1">
                <div class="inner-container d-flex align-items-center p-2">
                    <div class="col-3 text-center">
                        <img src="${product.imgURL}" alt="${product.name}-img">
                    </div>
                    <div class="col-9 px-4">
                        <div class="col-12 d-flex justify-content-between">
                            <h2>${product.name}</h2>
                            <h2>${currUser.purchasedProducts[key].currPurchases}</h2>
                        </div>
                        <p>${product.description}</p>
                        <div class="col-12 d-flex justify-content-between">
                            <p>$${product.price}</p>
                            <p class="profit-text">${product.getProfitPerUnit()}</p>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button id="${key}" class="btn btn-success">Purchase</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    for (let [key, product] of Object.entries(products)) {
        let purchaseButton = productsInfoContainer.querySelector("#" + key);
        if (!currUser.canPurchase(key)) {
            purchaseButton.disabled = true;
            purchaseButton.classList.replace("btn-success", "btn-danger");
        } else {
            purchaseButton.disabled = false;
            purchaseButton.classList.replace("btn-danger", "btn-success");
        }
        purchaseButton.addEventListener("click", () => {
            purchaseProduct(key, currUser);
        })
    }

    return productsInfoContainer;
}

const purchaseProduct = (key, currUser) => {
    if (currUser.canPurchase(key)) {
        currUser.purchase(key);
    }
    updateAllGameInfo(currUser);
}