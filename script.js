"use strict";

const OS_COLLECTION_BASE = "https://api.opensea.io/api/v1/collection/"
const OS_COLLECTIONS_BASE = "https://api.opensea.io/api/v1/collections?asset_owner="



const $table = $("#price-table");
const $tableHeader = $("#table-header-row");

function getCollectionChoices(){
    let selectedCollections = [];

    for (let i = 1; i < 6; i++) {
        selectedCollections.push($(`#collection-${i}-select`).val())
    }
    return selectedCollections;
}

async function getCollectionStats(name) {
    console.log("Running getCollectionsStats");

    const response = await axios({
        url: `${OS_COLLECTION_BASE}${name}/stats`,
        method: "GET",
    });

    const collection = response.data.stats;//.floor_price;

    return collection;

}

async function getCollectionPrices() {
    console.log("Running getAllCollections");

    let selectedCollections = getCollectionChoices()

    const collections = {};

    for (let collection of selectedCollections) {
        let price = await getCollectionStats(collection)
        collections[collection] = price.floor_price;
    }

    return collections;

}
//refactor
//updateDOM should call getCollectionChoices
//then loop through that returned array and call getCollectionStates
    //create object from the above
//then call each function(price, # of owners, etc)
//this allows me to do a single call to the api and store the 5 collection objects in local memory
async function updateDOM() {
    console.log("Running updateDOM");
    const prices = await getCollectionPrices();
    let collectionCounter = 1;
    

    for (let p in prices) {
        $(`#c${collectionCounter}-header`).text(p);
        $(`#c${collectionCounter}-price`).text(prices[p]);
        collectionCounter += 1;
    }

}


$("#update-prices-btn").on("click", updateDOM);


/** Button to update the collection dropdowns from input ETH address */
async function updateCollectionsDropdowns() {
    
    const collectionsArray = [];

    const walletAddress = $("#eth-address-input").val();

    const response = await axios({
        url: `${OS_COLLECTIONS_BASE}${walletAddress}&limit=200`,
        method: "GET",
    });
    
    for (let c of response.data) {
        collectionsArray.push(c.slug);
    }

    collectionsArray.sort();

    for (let c of collectionsArray) {
        $("#collection-1-select").append($(`<option value="${c}">${c}</option>`))
        $("#collection-2-select").append($(`<option value="${c}">${c}</option>`))
        $("#collection-3-select").append($(`<option value="${c}">${c}</option>`))
        $("#collection-4-select").append($(`<option value="${c}">${c}</option>`))
        $("#collection-5-select").append($(`<option value="${c}">${c}</option>`))
    }

}

$("#update-collections-btn").on("click", updateCollectionsDropdowns);