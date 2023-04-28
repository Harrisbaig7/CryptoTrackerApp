    let coinData;
    window.onload = async function () {
    try {
        coinData = await fetchCoinData();

        // Find the toprated coin with the first rank
        dispayTopRated(coinData);

        // Pick two coins based on their rank and display them below
        listRankedCoin(coinData);

        // List all this coins
        listAllCoins(coinData.coins);
    } catch (error) {
        console.log(error);
    }
    };

    async function fetchCoinData() {
    const url =
        "https://api.coinstats.app/public/v1/coins?skip=0&limit=100&currency=USD";
    const res = await fetch(url);
    const data = await res.json();
    return data;
    }

    function dispayTopRated(coinData) {
    const topRated = document.querySelector("#top-rated");
    const price = document.querySelector("#price");
    const percent = document.querySelector("#percent");
    const img = document.querySelector("#img");
    const name = document.querySelector("#name");

    const coin = coinData.coins.find((coin) => coin.rank === 1);

    percent.innerHTML = `${coin.priceChange1h}%`;
    const bClass = `${coin.priceChange1h < 0.0 ? "bearish" : "bullish"}`;
    percent.classList.add = bClass;
    price.innerHTML = `${formatCurrency(coin.price)}`;
    img.src = coin.icon;
    name.innerHTML = coin.name;
    topRated.style.opacity = "1";
    }

    function listRankedCoin(coinData) {
    const coins = coinData.coins.filter((coin) => coin.rank <= 2);
    const cardDiv = document.querySelector("#card");
    let list = coins
        .map(
        (coin, index) => `
        <div id="${index}" class="card-item ${coin.rank === 1 ? "top" : "next"}">
            <p>${coin.priceChange1h}%</p>
            <p class="price">${formatCurrency(coin.price)}</p>
            <p>${coin.symbol}</p>
        </div>
        `
        )
        .join("");
    cardDiv.innerHTML = list;
    }

    function listAllCoins(coins) {
    const listDiv = document.querySelector("#list");
    let list = coins
        .map(
        (coin, index) => `
            <div id="${index}" class="list-item-holder">
            <div class="list-items">
                <div class="list-img-name">
                <img src="${coin.icon}" alt="${coin.name}">
                <p>${coin.symbol}</p>
                </div>
                <div class="list-price">
                <p class="price">${formatCurrency(coin.price)}</p>
                <p class="mc">1d chg <span class="${
                    coin.priceChange1d < 0.0 ? "bearish" : "bullish"
                }">${coin.priceChange1d}%</span></p>
                </div>
            </div>
            <div class="more">
                <p class="name">
                <img src="${coin.icon}" alt="${coin.name}">
                <span>${coin.name}</span>
                </p>
                <p class="txt"><span>Max Supply</span><span>${parseInt(
                coin.totalSupply
                ).toFixed(0)}</span></p>
                <p class="txt"><span>Av. Supply</span><span>${parseInt(
                coin.availableSupply
                ).toFixed(0)}</span></p>
                <p class="txt"><span>Mk. Cap.</span><span>${
                coin.marketCap
                }</span></p>
                <p class="txt"><span>1d Price</span><span class="${
                coin.priceChange1d < 0.0 ? "bearish" : "bullish"
                }">${coin.priceChange1d}%</span></p>
                <a class="exp" href=${coin.exp[0]}">Explore</a>
            </div>
            </div>
        `
        )
        .join("");
    listDiv.innerHTML = list;
    }

    function formatCurrency(number) {
    const price = parseFloat(number).toFixed(2);
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
    return formatter;
    }