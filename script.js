// The Script for the Spookinator
// Since the platform does not allow large file-size within a plugins-widget, the script of the Spookinator has to be placed in multiple smaller plugins-widgets.

//<script>//0 Global initial values
let items = [];
let foundItems = [];
let maxRange = 3;

class itemClass {
    constructor(id, name, description, requirements, needsPersons, preparationTime, buildUpTime, needsElectricity, needsDressingClothes, needsFacePaint, isPortable, wheelchairAccessible, containsGore, pioneering, needsHole) {
        this.id = 'item' + id;
        this.name = name;
        this.description = description;
        this.requirements = requirements;
        this.needsPersons = needsPersons;
        this.preparationTime = preparationTime;
        this.buildUpTime = buildUpTime;
        this.needsElectricity = needsElectricity;
        this.needsDressingClothes = needsDressingClothes;
        this.needsFacePaint = needsFacePaint;
        this.isPortable = isPortable;
        this.wheelchairAccessible = wheelchairAccessible;
        this.containsGore = containsGore;
        this.pioneering = pioneering;
        this.needsHole = needsHole;
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
        if (this.needsPersons) {
            htmlString += `<img alt="${this.needsPersons.length} Personen nodig" title="${this.needsPersons.length} Personen nodig" src="src/needs-persons.svg">`;
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
        if (this.wheelchairAccessible) {
            htmlString += `<img alt="Rolstoel toegankelijk" title="Rolstoel toegankelijk" src="src/wheelchair-accessible.svg">`;
        }
        if (this.containsGore) {
            htmlString += `<img alt="Bloed en/of gore" title="Bloed en/of gore" src="src/contains-gore.svg">`;
        }
        if (this.pioneering) {
            htmlString += `<img alt="Pionieren" title="Pionieren" src="src/pioneering.svg">`;
        }
        if (this.needsHole) {
            htmlString += `<img alt="Gegraven gat nodig" title="Gegraven gat nodig" src="src/needs-hole.svg">`;
        }
        htmlString += `</span>`;

        // display ranged icons
        htmlString += `<span>`;
        for (let i = 0; i < this.preparationTime.length; i++) {
            htmlString += `<img class="right" alt="${this.rangeText(this.preparationTime.length)} voorbereidingstijd" title="${this.rangeText(this.preparationTime.length)} voorbereidingstijd" src="src/preparation-time.svg">`;
        }
        htmlString += `<br>`;
        for (let i = 0; i < this.buildUpTime.length; i++) {
            htmlString += `<img class="right" alt="${this.rangeText(this.buildUpTime.length)} opbouwtijd" title="${this.rangeText(this.buildUpTime.length)} opbouwtijd" src="src/build-up-time.svg">`;
        }
        htmlString += `</span>`;

        // display additional information toggle
        htmlString += `<div class="spookinator__toggle--hidden-div">`;
        htmlString += `<br><p><br>${this.description}</p>`;
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

//</script>//0

//<script>//1 display the items with their values
function show(id) {
    document.getElementById(id).classList.remove('spookinator__item--hidden');
}

function hide(id) {
    document.getElementById(id).classList.add('spookinator__item--hidden');
}

function retrieveItemsFromDocument() {
    let children = document.querySelector('#js-spookinator-source-table').children[0];
    let len = children.childElementCount;
    let resultHTML = '';

    for (let i = 1; i < len; i++) {
        let valueToPush = [];
        for (let column = 0; column <= 13; column++) {
            if (column === 2) { // these columns can have multiple entries separated by commas
                valueToPush[column] = children.children[i].children[column].innerHTML.split(',').map(function (item) {
                    return sanitizeInput(item);
                });
            } else if (column === 4 || column === 5) { // these columns contain a ranged input
                valueToPush[column] = sanitizeRangeInput(children.children[i].children[column].innerHTML);
            } else if (children.children[i].children[column]) {
                valueToPush[column] = sanitizeInput(children.children[i].children[column].innerHTML);
            } else {
                console.warn('Did not find column ' + column + ' for item ' + i + ' (' + valueToPush[0] + ').');
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

    document.querySelector('#spookinator__results').innerHTML += resultHTML;
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

    // The following input elements are a three-way checkbox.
    let needsPersons = document.querySelector('input[value="needs-persons"]').getAttribute('state');
    let needsElectricity = document.querySelector('input[value="needs-electricity"]').getAttribute('state');
    let needsDressingClothes = document.querySelector('input[value="needs-dressing-clothes"]').getAttribute('state');
    let needsFacePaint = document.querySelector('input[value="needs-face-paint"]').getAttribute('state');
    let isPortable = document.querySelector('input[value="is-portable"]').getAttribute('state');
    let wheelchairAccessible = document.querySelector('input[value="wheelchair-accessible"]').getAttribute('state');
    let containsGore = document.querySelector('input[value="contains-gore"]').getAttribute('state');
    let pioneering = document.querySelector('input[value="pioneering"]').getAttribute('state');
    let needsHole = document.querySelector('input[value="needs-hole"]').getAttribute('state');

    // In order to perform a case-insensitive search, the case is lowered on both the search input as the item.
    let search = document.getElementById('search').value.toLowerCase();

    // cycle through all items and only add those that match the search parameters
    for (const item of items) {
        if (!preparationTimeX && item.preparationTime.length === 1 || !preparationTimeXX && item.preparationTime.length === 2 || !preparationTimeXXX && item.preparationTime.length === 3) {
            continue;
        }
        if (!buildUpTimeX && item.buildUpTime.length === 1 || !buildUpTimeXX && item.buildUpTime.length === 2 || !buildUpTimeXXX && item.buildUpTime.length === 3) {
            continue;
        }
        if (needsPersons === 'on' && !item.needsPersons || needsPersons === 'off' && item.needsPersons) {
            continue;
        }
        if (needsElectricity === 'on' && !item.needsElectricity || needsElectricity === 'off' && item.needsElectricity) {
            continue;
        }
        if (needsDressingClothes === 'on' && !item.needsDressingClothes || needsDressingClothes === 'off' && item.needsDressingClothes) {
            continue;
        }
        if (needsFacePaint === 'on' && !item.needsFacePaint || needsFacePaint === 'off' && item.needsFacePaint) {
            continue;
        }
        if (isPortable === 'on' && !item.isPortable || isPortable === 'off' && item.isPortable) {
            continue;
        }
        if (wheelchairAccessible === 'on' && !item.wheelchairAccessible || wheelchairAccessible === 'off' && item.wheelchairAccessible) {
            continue;
        }
        if (containsGore === 'on' && !item.containsGore || containsGore === 'off' && item.containsGore) {
            continue;
        }
        if (pioneering === 'on' && !item.pioneering || pioneering === 'off' && item.pioneering) {
            continue;
        }
        if (needsHole === 'on' && !item.needsHole || needsHole === 'off' && item.needsHole) {
            continue;
        }
        if (search && !item.name.toLowerCase().includes(search) && !item.description.toLowerCase().includes(search)
            && !item.requirements.join().toLowerCase().includes(search)) {
            continue;
        }

        foundItems.push(item);
    }

    // show the result
    showItems();
    showCounter();
    generateTrail(document.getElementsByName('posts')[0].value);
}
//</script>//1

//<script>//2 display the programs with their values
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
    let foundElement = document.querySelector('#js-item-counter');
    let foundItemsCount = foundItems.length;

    let lowPreparationTimeCount = foundItems.filter(x => x.preparationTime.length === 1).length;
    let lowBuildUpTimeCount = foundItems.filter(x => x.buildUpTime.length === 1).length;
    let mediumPreparationTimeCount = foundItems.filter(x => x.preparationTime.length === 2).length;
    let mediumBuildUpTimeCount = foundItems.filter(x => x.buildUpTime.length === 2).length;
    let highPreparationTimeCount = foundItems.filter(x => x.preparationTime.length === 3).length;
    let highBuildUpTimeCount = foundItems.filter(x => x.buildUpTime.length === 3).length;
    let needsPersonsCount = foundItems.filter(x => x.needsPersons.length >= 1).length;
    let needsElectricityCount = foundItems.filter(x => x.needsElectricity).length;
    let needsDressingClothesCount = foundItems.filter(x => x.needsDressingClothes).length;
    let needsFacePaintCount = foundItems.filter(x => x.needsFacePaint).length;
    let isPortableCount = foundItems.filter(x => x.isPortable).length;
    let wheelchairAccessibleCount = foundItems.filter(x => x.wheelchairAccessible).length;
    let containsGoreCount = foundItems.filter(x => x.containsGore).length;
    let pioneeringCount = foundItems.filter(x => x.pioneering).length;
    let needsHoleCount = foundItems.filter(x => x.needsHole).length;

    foundElement.innerHTML = foundItemsCount.toString() + ' resultaten' +
        ` <img class="right" alt="Zie meer" src="src/down.svg">` +
        `<span id="spookinator__item-counter__stats">` +
        `<br><span><img alt="Voorbereidingstijd" title="Voorbereidingstijd" src="src/preparation-time.svg"> ` +
        `${lowPreparationTimeCount} / ${mediumPreparationTimeCount} / ${highPreparationTimeCount}` +
        `</span>` +
        `<br><span><img alt="Opbouwtijd" title="Opbouwtijd" src="src/build-up-time.svg"> ` +
        `${lowBuildUpTimeCount} / ${mediumBuildUpTimeCount} / ${highBuildUpTimeCount}` +
        `</span>` +
        `<br><span><img alt="Personen nodig" title="Personen nodig" src="src/needs-persons.svg"> ` +
        `<meter value="${needsPersonsCount}" max="${foundItemsCount}">${needsPersonsCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Electra nodig" title="Electra nodig" src="src/needs-electricity.svg"> ` +
        `<meter value="${needsElectricityCount}" max="${foundItemsCount}">${needsElectricityCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Kleding nodig" title="Kleding nodig" src="src/needs-dressing-clothes.svg"> ` +
        `<meter value="${needsDressingClothesCount}" max="${foundItemsCount}">${needsDressingClothesCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Schmink nodig" title="Schmink nodig" src="src/needs-face-paint.svg"> ` +
        `<meter value="${needsFacePaintCount}" max="${foundItemsCount}">${needsFacePaintCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Draagbaar" title="Draagbaar" src="src/is-portable.svg"> ` +
        `<meter value="${isPortableCount}" max="${foundItemsCount}">${isPortableCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Rolstoel toegankelijk" title="Rolstoel toegankelijk" src="src/wheelchair-accessible.svg"> ` +
        `<meter value="${wheelchairAccessibleCount}" max="${foundItemsCount}">${wheelchairAccessibleCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Bloed en/of gore" title="Bloed en/of gore" src="src/contains-gore.svg"> ` +
        `<meter value="${containsGoreCount}" max="${foundItemsCount}">${containsGoreCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Pionieren" title="Pionieren" src="src/pioneering.svg"> ` +
        `<meter value="${pioneeringCount}" max="${foundItemsCount}">${pioneeringCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `<br><span><img alt="Gegraven gat nodig" title="Gegraven gat nodig" src="src/needs-hole.svg"> ` +
        `<meter value="${needsHoleCount}" max="${foundItemsCount}">${needsHoleCount} / ${foundItemsCount}</meter>` +
        `</span>` +
        `</span>`;

    // only show the ghost when there are no results
    document.getElementById('ghost').classList.toggle('spookinator__item--hidden', foundItemsCount !== 0);

    // trigger reflow to start the css animation
    foundElement.classList.remove('update-counter');
    void foundElement.offsetWidth;
    foundElement.classList.add('update-counter');
}

function generateTrail(trailLength) {
    let trail = foundItems.sort(() => 0.5 - Math.random()).slice(0, trailLength);
    let warningText = '';

    if (foundItems.length < trailLength) {
        warningText += '<div style="text-align: center">Er zijn te weinig resultaten om de spookpad volledig te vullen.</div>';
    }

    document.querySelector('#spookinator__trail--results').innerHTML = trail.map(item => item.html).join(' ') + warningText;
}
//</script>//2

//<script>//3 initial function calls and eventListeners
window.addEventListener('DOMContentLoaded', () => {
    retrieveItemsFromDocument();
    search();
    generateTrail(10);

    // add show info event listener
    document.getElementById('spookinator__info-button').addEventListener("click", function () {
        document.getElementById('spookinator__info').classList.toggle('spookinator__item--hidden');
    });

    // add show trail event listener
    document.getElementById('spookinator__trail-button').addEventListener("click", function () {
        document.getElementById('spookinator__trail').classList.toggle('spookinator__item--hidden');
        document.getElementById('spookinator__results').classList.toggle('spookinator__item--hidden');
    });

    // add search event listeners
    let clickableSearchElements = document.querySelectorAll("input");
    for (let i = 0; i < clickableSearchElements.length; i++) {
        clickableSearchElements[i].addEventListener('click', (e) => {
            if (e.target.getAttribute('state')) {
                // loop through each state in order: on => off => all => ...
                switch (e.target.getAttribute('state')) {
                    case 'on':
                        e.target.setAttribute('state', 'off');
                        break;
                    case 'off':
                        e.target.setAttribute('state', 'all');
                        break;
                    default:
                        e.target.setAttribute('state', 'on');
                        break;
                }
            }

            search();
        });
    }

});
//</script>//3

module.exports = {itemClass}
