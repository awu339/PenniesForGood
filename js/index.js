//hi raymond
let active;
chrome.storage.local.get({active: true}, function(result) {
    active = result.active;
});

trackPurchase();
var price_val;
var counts = -1;
var category; //1 or 2 ed,health,hung

var targetButton;

function trackPurchase() {
    var price;

    const url = location.href;
    if (!url) {
        return;
    }

    if (url.includes('amazon.com') && !url.includes('buy')) {
        targetCategories = document.title.split(":");
        targetCategory = targetCategories[targetCategories.length-1];
        console.log(targetCategory);
        if (!category) {
            category = 2;
            if (targetCategory == " Office Products")
                category = 0;
            else if (targetCategory == " Health & Personal Care" || targetCategory == " Health & Household" || targetCategory == " Sports & Outdoors")
                category = 1;
            else if (targetCategory == " Grocery & Gourmet Food")
                category = 2;
        }
        targetButton = document.getElementById('add-to-cart-button');

        if (targetButton){
            price = document.getElementById('priceblock_ourprice');
            if (!price) price = document.getElementById('priceblock_dealprice');
            console.log(price);
            if (price) {
                price_val = price.innerHTML;
                console.log(price_val);
                let length = price_val.length;
                price_val = price_val.substring(1,length);
                console.log(price_val);
            }
        }


    } else if (url.includes('ebay.com')) {
        targetButton = null; // replace with the id of the button we want to track
    }

    if (targetButton) {
        targetButton.addEventListener('click', (e) => {
            // If buy window has not already been shown and Pennies For Good is active
            if (active && !document.getElementById('buyChecked')) {
                e.preventDefault();
                insertWindow();
                console.log("hi");
            }
        });
    }
}

function insertWindow() {
    fetch(chrome.extension.getURL('html/buy_window.html'))
        .then(response => response.text())
        .then(data => {
            const body = document.getElementsByTagName('body')[0];
            const window = document.createElement('div');
            window.className = 'buy-window';
            window.id = 'buy-window';
            window.innerHTML = data;
            body.append(window);

            const overlay = document.createElement('div');
            overlay.className = 'buy-overlay';
            overlay.id = 'buy-overlay';
            body.append(overlay);

            startup(price_val);
        }).catch(err => {
        console.log('Error loading Buy window:' + err)
    });
}