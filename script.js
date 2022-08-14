//<!-- The Script for the Spookinator -->
//<!-- Since the platform does not allow large file-size within a plugins-widget, the script of the Spookinator has to be placed in multiple smaller plugins-widgets. -->

//<script>/*0*/// Global initial values
let items = [];
let foundItems = [];
let maxRange = 3;

class itemClass {
    constructor(id, name, description, requirements, executedIn, amountOfPersons, preparationTime, buildUpTime, needsElectricity, needsDressingClothes, needsFacePaint, isPortable) {
        this.id = 'item' + id;
        this.name = name;
        this.description = description;
        this.requirements = requirements;
        this.executedIn = executedIn;
        this.amountOfPersons = amountOfPersons;
        this.preparationTime = preparationTime;
        this.buildUpTime = buildUpTime;
        this.needsElectricity = needsElectricity;
        this.needsDressingClothes = needsDressingClothes;
        this.needsFacePaint = needsFacePaint;
        this.isPortable = isPortable;
        this.html = this.buildHtml();
    }

    buildHtml() {
        let displayName = this.name.split(/(?=[A-Z])/).join('<wbr>');
        let htmlString;

        // display main information
        htmlString = `<div id="${this.id}" class="spookinator__item spookinator__toggle" tabindex="1">`;
        htmlString += `<h4>${displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h4>`;

        // display icons
        htmlString += `<span class="left">`;
        htmlString += `<img alt="Uitgevoerd in" title="Uitgevoerd in" src="src/executed-in.svg"> ${this.executedIn.join(', ')}<br>`;
        if (this.amountOfPersons) {
            htmlString += `<img alt="${this.amountOfPersons.length} Staf nodig" title="${this.amountOfPersons.length} Staf nodig" src="src/amount-of-persons.svg">`;
        }
        if (this.needsElectricity) {
            htmlString += `<img alt="Electra nodig" title="Electra nodig" src="src/needs-electricity.svg">`;
        }
        if (this.needsDressingClothes) {
            htmlString += `<img alt="Kleding nodig" title="Kleding nodig" src="src/needs-dressing-clothes.svg">`;
        }
        if (this.needsFacePaint) {
            htmlString += `<img alt="Schmink nodig" title="Schmink nodig" src="src/needs-face-paint.svg">`;
        }
        if (this.isPortable) {
            htmlString += `<img alt="Draagbaar" title="Draagbaar" src="src/is-portable.svg">`;
        }
        htmlString += `</span>`;

        // display ranged icons
        htmlString += `<span>`;
        Array.from({length: this.preparationTime.length}, (x, i) => {
            htmlString += `<img class="right" alt="${this.rangeText(this.preparationTime.length)} voorbereidingstijd" title="${this.rangeText(this.preparationTime.length)} voorbereidingstijd" src="src/preparation-time.svg">`;
        });
        htmlString += `<br>`;
        Array.from({length: this.buildUpTime.length}, (x, i) => {
            htmlString += `<img class="right" alt="${this.rangeText(this.buildUpTime.length)} opbouwtijd" title="${this.rangeText(this.buildUpTime.length)} opbouwtijd" src="src/build-up-time.svg">`;
        });
        htmlString += `</span>`;

        // display additional information
        htmlString += `<div class="spookinator__toggle--hidden-div">`;
        htmlString += `<br><p>${this.description}</p>`;
        htmlString += ' &bull; ' + this.requirements.join(' &bull; ');
        htmlString += `</div>`;

        htmlString += `</div>`;

        return htmlString;
    }

    rangeText(n) {
        switch (n) {
            case 1:
                return 'Weinig';
            case 2:
                return 'Gemiddeld';
            default:
                return 'Veel';
        }
    }
}

// to make sure some input transformations are correct
function sanitizeInput(input) {
    return input.trim().replace('&amp;', '&').replace('&nbsp;', '');
}

// additional sanitation rules for ranged input
function sanitizeRangeInput(input) {
    let regexp = new RegExp("[^x]", "g"); // keep only the character "x"
    let sanitizedInput = sanitizeInput(input).toLowerCase().replace(regexp, '');

    // ensure a minimum range of 1 and a maximum range of maxRange
    return sanitizedInput.length === 0 ? 'x' : (sanitizedInput.length > maxRange ? 'xxx' : sanitizedInput);
}

//</script>

//<script>/*1*/// display the items with their values
function show(id) {
    document.getElementById(id).classList.remove('spookinator__item--hidden');
}

function hide(id) {
    document.getElementById(id).classList.add('spookinator__item--hidden');
}

function retrieveItemsFromDocument() {
    let children = document.querySelector('[js-spookinator-source-table]').children[0];
    let len = children.childElementCount;
    let resultHTML = '';

    for (let i = 1; i < len; i++) {
        let valueToPush = [];
        for (let column = 0; column <= 10; column++) {
            if (column === 2 || column === 3) { // these columns can have multiple entries separated by commas
                valueToPush[column] = children.children[i].children[column].innerHTML.split(',').map(function (item) {
                    return sanitizeInput(item);
                });
            } else if (column === 5 || column === 6) { // these columns contain a ranged input
                valueToPush[column] = sanitizeRangeInput(children.children[i].children[column].innerHTML);
            } else {
                valueToPush[column] = sanitizeInput(children.children[i].children[column].innerHTML);
            }
        }

        // filter items without a name
        if (!valueToPush[0]) {
            continue;
        }

        items.push(new itemClass(i, ...valueToPush));
    }

    // sort alphabetically
    items.sort((a, b) => a.name.localeCompare(b.name));

    resultHTML += items.map(item => item.html).join(' ');

    document.querySelector('[js-spookinator-results]').innerHTML += resultHTML;
}

// search for the programs
function search() {
    foundItems = [];

    let preparationTimeX = document.querySelector('input[value="preparation-time-x"]').checked;
    let preparationTimeXX = document.querySelector('input[value="preparation-time-xx"]').checked;
    let preparationTimeXXX = document.querySelector('input[value="preparation-time-xxx"]').checked;
    let buildUpTimeX = document.querySelector('input[value="build-up-time-x"]').checked;
    let buildUpTimeXX = document.querySelector('input[value="build-up-time-xx"]').checked;
    let buildUpTimeXXX = document.querySelector('input[value="build-up-time-xxx"]').checked;

    let amountOfPersons = document.querySelector('input[value="amount-of-persons"]').checked;
    let needsElectricity = document.querySelector('input[value="needs-electricity"]').checked;
    let needsDressingClothes = document.querySelector('input[value="needs-dressing-clothes"]').checked;
    let needsFacePaint = document.querySelector('input[value="needs-face-paint"]').checked;
    let isPortable = document.querySelector('input[value="is-portable"]').checked;

    let when = document.getElementById('date').value;

    // cycle through all items and only add those that match the search parameters
    for (const item of items) {
        if (!preparationTimeX && item.preparationTime.length === 1 || !preparationTimeXX && item.preparationTime.length === 2 || !preparationTimeXXX && item.preparationTime.length === 3) {
            continue;
        }
        if (!buildUpTimeX && item.buildUpTime.length === 1 || !buildUpTimeXX && item.buildUpTime.length === 2 || !buildUpTimeXXX && item.buildUpTime.length === 3) {
            continue;
        }
        if (!amountOfPersons && item.amountOfPersons) {
            continue;
        }
        if (!needsElectricity && item.needsElectricity) {
            continue;
        }
        if (!needsDressingClothes && item.needsDressingClothes) {
            continue;
        }
        if (!needsFacePaint && item.needsFacePaint) {
            continue;
        }
        if (!isPortable && item.isPortable) {
            continue;
        }
        if (+item.executedIn[0] + +when >= (new Date()).getFullYear() + 1 && item.executedIn[0] !== '*') { // check if the program has right date
            continue;
        }

        foundItems.push(item);
    }

    // show the result
    showItems();
    showCounter();
}

//<script>/*2*/// display the programs with their values
function showItems() {
    if (!foundItems) {
        return;
    }

    // show the programs on this page
    for (const item of items) {
        if (foundItems.includes(item)) {
            show(item.id);
        } else {
            hide(item.id);
        }
    }
}

function showCounter() {
    let foundElement = document.querySelector('[js-item-counter]');
    foundElement.innerHTML = (foundItems.length).toString() + ' resultaten';
    foundElement.classList.remove('update-counter');
    void foundElement.offsetWidth; // trigger reflow to start the css animation
    foundElement.classList.add('update-counter');
}

// show the correct value of the slider-range
function showSliderValue(newValue) {
    let yearText = newValue === '0' || newValue === '1' ? ' jaar' : ' jaren';
    document.querySelector('[js-spookinator-range]').innerHTML = newValue + yearText;
}

// initial function calls and eventListeners
window.addEventListener('DOMContentLoaded', () => {
    retrieveItemsFromDocument();
    search();

    // add search event listeners
    let clickableSearchElements = document.querySelectorAll("input");
    for (let i = 0; i < clickableSearchElements.length; i++) {
        clickableSearchElements[i].addEventListener('click', (e) => {
            search();
        });
    }
});
//</script>

module.exports = {itemClass}