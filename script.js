//<!-- The Script for the Spookinator -->
//<!-- Since the platform does not allow large file-size within a plugins-widget, the script of the Spookinator has to be placed in multiple smaller plugins-widgets. -->

//<script>/*0*/// Global initial values
let foundItems = [];

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
        htmlString = `<div id="${this.id}" class="spookinator__item">`;
        htmlString += `<h4>${displayName}</h4>`;

        // display icons
        htmlString += `<span class="left">`;
        htmlString += `<img alt="Uitgevoerd in" title="Uitgevoerd in" src="src/executed-in.svg"> ${this.executedIn}<br>`;
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
            htmlString += `<img class="right" alt="${this.rangeText(this.buildUpTime.length)} voorbereidingstijd" title="${this.rangeText(this.buildUpTime.length)} voorbereidingstijd" src="src/preparation-time.svg">`;
        });
        htmlString += `<br>`;
        Array.from({length: this.buildUpTime.length}, (x, i) => {
            htmlString += `<img class="right" alt="${this.rangeText(this.buildUpTime.length)} opbouw tijd" title="${this.rangeText(this.buildUpTime.length)} opbouw tijd" src="src/build-up-time.svg">`;
        });
        htmlString += `</span>`;

        // display additional information
        htmlString += `<br><hr><span class="spookinator__item--hidden">`;
        htmlString += `<p>${this.description}</p>`;
        htmlString += this.requirements.join(', ');
        htmlString += `</span>`;

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

//</script>

//<script>/*1*/// display the items with their values
function show(id) {
    document.getElementById(id).classList.remove('spookinator__item--hidden');
}

function hide(id) {
    document.getElementById(id).classList.add('spookinator__item--hidden');
}

// get all items given in the html
function setItems() {
    let children = document.querySelector('[js-spookinator-source-table]').children[0];
    let len = children.childElementCount;
    let resultHTML = '';

    for (let i = 1; i < len; i++) {
        let valueToPush = [];
        for (let column = 0; column <= 10; column++) {
            if (column === 2 || column === 3) { // only columns 2 and 3 can have multiple entries separated by commas
                valueToPush[column] = children.children[i].children[column].innerHTML.split(',').map(function (item) {
                    return sanitizeInput(item);
                });
            } else {
                valueToPush[column] = sanitizeInput(children.children[i].children[column].innerHTML);
            }
        }

        // filter items without a name
        if (!valueToPush[0]) {
            continue;
        }

        let item = new itemClass(i, ...valueToPush);
        foundItems.push(item);
        resultHTML += item.html;
    }

    document.querySelector('[js-spookinator-results]').innerHTML += resultHTML;
}

function showCounter() {
    let foundElement = document.querySelector('[js-item-counter]');
    foundElement.innerHTML = (foundItems.length).toString() + ' resultaten';
    foundElement.classList.remove('update-counter');
    void foundElement.offsetWidth; // trigger reflow to start the css animation
    foundElement.classList.add('update-counter');
}

// initial function calls and eventListeners
window.addEventListener('DOMContentLoaded', () => {
    setItems();
    showCounter();
});
//</script>

module.exports = {itemClass}