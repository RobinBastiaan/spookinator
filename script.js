// The Script for the Spookinator
// Since the platform does not allow large file-size within a plugins-widget, the script of the Spookinator has to be placed in multiple smaller plugins-widgets.

//<script>//0 Global initial values
let items = [];
let foundItems = [];
let trail = [];
let maxRange = 3;

class itemClass {
    constructor(id, name, description, requirements, personsNeeded, preparationTime, buildUpTime, needsElectricity, needsDressingClothes, needsFacePaint, isPortable, wheelchairAccessible, containsGore, pioneering, needsHole, theme) {
        this.id = 'item' + id;
        this.name = name;
        this.description = description;
        this.requirements = requirements;
        this.personsNeeded = personsNeeded;
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
        this.theme = theme;
        this.html = this.buildHtml();
        this.trailHtml = this.buildHtml(true);
    }

    buildHtml(isTrail = false) {
        let displayName = this.name.split(/(?=[A-Z])/).join('<wbr>');
        let htmlString;

        // display main information
        htmlString = `<div id="${isTrail ? 'trail-' : ''}${this.id}" class="spookinator__item spookinator__toggle" tabindex="1">`;
        htmlString += `<h4>${displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h4>`;

        // display icons
        htmlString += `<span class="left">`;
        if (this.personsNeeded.length === 1) {
            htmlString += `<img alt="${this.personsNeeded.length} persoon nodig" title="${this.personsNeeded.length} persoon nodig" src="src/person-needed.svg">`;
        } else if (this.personsNeeded.length > 1) {
            htmlString += `<img alt="${this.personsNeeded.length} personen nodig" title="${this.personsNeeded.length} personen nodig" src="src/persons-needed.svg">`;
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
    return input
        .trim() // Remove leading and trailing spaces
        .replace(/&amp;/g, '&') // Replace '&amp;' with '&'
        .replace(/&nbsp;/g, ' ') // Replace '&nbsp;' with a space
        .replace(/\s+/g, ' ') // Replace multiple spaces and newlines with a single space
        .replace(/\n/g, ''); // Remove newline characters
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
        for (let column = 0; column <= 14; column++) {
            if (column === 2 || column === 14) { // these columns can have multiple entries separated by commas
                valueToPush[column] = children.children[i].children[column].innerHTML.split(',').map(function (item) {
                    let str = sanitizeInput(item);
                    return str.charAt(0).toUpperCase() + str.slice(1); // Capitalize the first letter.
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

// Use this script to generate the JSON data for the API.
function generateJSON() {
    console.log(JSON.stringify(items, (key, value) => {
        if (key === 'id' || key === 'html' || key === 'trailHtml') {
            return undefined;
        }

        if (key === 'personsNeeded') {
            return value.length;
        }

        if (['needsElectricity', 'needsDressingClothes', 'needsFacePaint', 'isPortable', 'wheelchairAccessible', 'containsGore', 'pioneering', 'needsHole'].includes(key)) {
            return !!value;
        }

        return value;
    }));
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
    let personsNeeded = document.querySelector('input[value="persons-needed"]').getAttribute('state');
    let needsElectricity = document.querySelector('input[value="needs-electricity"]').getAttribute('state');
    let needsDressingClothes = document.querySelector('input[value="needs-dressing-clothes"]').getAttribute('state');
    let needsFacePaint = document.querySelector('input[value="needs-face-paint"]').getAttribute('state');
    let isPortable = document.querySelector('input[value="is-portable"]').getAttribute('state');
    let wheelchairAccessible = document.querySelector('input[value="wheelchair-accessible"]').getAttribute('state');
    let containsGore = document.querySelector('input[value="contains-gore"]').getAttribute('state');
    let pioneering = document.querySelector('input[value="pioneering"]').getAttribute('state');
    let needsHole = document.querySelector('input[value="needs-hole"]').getAttribute('state');

    let theme = document.querySelector('select[name="theme"]').value;

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
        if (personsNeeded === 'on' && !item.personsNeeded || personsNeeded === 'off' && item.personsNeeded) {
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
        if (theme !== 'Alles' && theme !== 'Zonder thema' && !item.theme.join().includes(theme) || theme === 'Zonder thema' && item.theme.join() !== '') {
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
    generateTrail();
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
    let personsNeededCount = foundItems.filter(x => x.personsNeeded.length >= 1).length;
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
        `<br><span><img alt="Personen nodig" title="Personen nodig" src="src/persons-needed.svg"> ` +
        `<meter value="${personsNeededCount}" max="${foundItemsCount}">${personsNeededCount} / ${foundItemsCount}</meter>` +
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

function generateTrail() {
    let trailLength = document.getElementsByName('posts')[0].value;
    let persons = document.getElementsByName('persons')[0].value;
    persons = persons > trailLength ? trailLength : persons; // Make sure persons is not bigger then trailLength
    let trailWithPersons = foundItems.filter(item => item.personsNeeded).sort(() => 0.5 - Math.random()).slice(0, persons);
    let trailWithoutPersons = foundItems.filter(item => !item.personsNeeded).sort(() => 0.5 - Math.random()).slice(0, trailLength - persons);
    trail = alternateCombine(trailWithPersons, trailWithoutPersons);
    let warningText = '';

    if (trail.length < trailLength || trailWithPersons.length < persons || trailWithoutPersons.length < trailLength - persons) {
        warningText += '<div style="text-align: center; color: #9f212b">';
        warningText += 'Er zijn te weinig resultaten om het spookpad volledig te vullen.';
        if (trailWithPersons.length < persons) {
            let missingWithPersons = persons - trailWithPersons.length;
            if (missingWithPersons === 1) {
                warningText += ' Er mist ' + missingWithPersons + ' post met personen.';
            } else {
                warningText += ' Er missen ' + missingWithPersons + ' posten met personen.';
            }
        }
        if (trailWithoutPersons.length < trailLength - persons) {
            let missingWithoutPersons = trailLength - persons - trailWithoutPersons.length;
            if (missingWithoutPersons === 1) {
                warningText += ' Er mist ' + missingWithoutPersons + ' post zonder personen.';
            } else {
                warningText += ' Er missen ' + missingWithoutPersons + ' posten zonder personen.';
            }
        }
        warningText += '</div>';
    }

    document.querySelector('#spookinator__trail--results').innerHTML = warningText + trail.map(item => item.trailHtml).join(' ');
}

function alternateCombine(array1, array2) {
    let result = [];
    let i, l = Math.min(array1.length, array2.length);

    for (i = 0; i < l; i++) {
        result.push(array1[i], array2[i]);
    }
    result.push(...array1.slice(l), ...array2.slice(l));

    return result;
}

//</script>//2

function downloadTrailPdf() {
    const doc = new window.jspdf.jsPDF('l', 'pt', 'a4'),
        pageWidth = doc.internal.pageSize.getWidth(),
        pageHeight = doc.internal.pageSize.getHeight(),
        fontSize = 12,
        lineHeight = fontSize + 2,
        xMargin = 15,
        yMargin = 60,
        indentation = 5,
        columnWidth = (pageWidth - xMargin * 2) / 3;
    let column = 1,
        line = 1,
        trailLength = document.getElementsByName('posts')[0].value,
        persons = document.getElementsByName('persons')[0].value;

    addFooterText(doc, pageWidth, xMargin, pageHeight);
    doc.text('Spoodpad met ' + trailLength + ' posten voor ' + persons + ' personen.', xMargin, yMargin);
    line = line + 2;

    // Iterate over the JSON data and add to PDF.
    trail.forEach((item) => {
        doc.setFontSize(fontSize);

        let descriptionText = doc.splitTextToSize(item.description, columnWidth - xMargin * 2),
            requirementsTextLength = 0,
            requirementsText = [];

        item.requirements.forEach(requirement => {
            let requirementText = doc.splitTextToSize(requirement, columnWidth - xMargin * 2);
            requirementsTextLength += requirementText.length;
            requirementsText.push(requirementText);
        });

        // Check if the line position exceeds the page height, and add a new page if necessary.
        if ((line + descriptionText.length + requirementsTextLength) * fontSize >= pageHeight - yMargin * 3) {
            line = 1;
            if (column === 3) {
                doc.addPage();
                column = 1;

                addFooterText(doc, pageWidth, xMargin, pageHeight);
            } else {
                column++;
            }
        }

        // Add name as bold text.
        doc.setFontSize(fontSize);
        doc.setFont('Helvetica', 'bold');
        doc.text(item.name, xMargin + (column - 1) * columnWidth, yMargin + (line - 1) * lineHeight);
        doc.text(item.personsNeeded.length > 0 ? '(bemand)' : '(onbemand)', xMargin + (column - 1) * columnWidth + doc.getTextWidth(item.name) + 5, yMargin + (line - 1) * lineHeight);
        line++;

        // Add description as normal text.
        doc.setFont('Helvetica', 'normal');
        doc.text(descriptionText, xMargin + (column - 1) * columnWidth, yMargin + (line - 1) * lineHeight);
        line += descriptionText.length;

        // Add requirements as normal text.
        doc.setFont('Helvetica', 'normal');
        requirementsText.forEach((requirementText, index) => {
            // For the first line of each requirement, draw a checkbox as a small square.
            doc.rect(xMargin + (column - 1) * columnWidth + indentation, yMargin + (line - 1) * lineHeight - 6, 4, 4);

            requirementText.forEach((requirementPart) => {
                doc.text(requirementPart, xMargin + (column - 1) * columnWidth + indentation + 9, yMargin + (line - 1) * lineHeight);
                line++;
            });
        });

        line++;
    });

    // Disclaimer.
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Disclaimer: Je bent altijd zelf aansprakelijk voor ongevallen of schade die kan ontstaan tijdens het gebruik van deze tool.', xMargin * 5, pageHeight - xMargin);

    doc.save('spookpad.pdf');
}

//<script>//3 initial function calls and eventListeners
window.addEventListener('DOMContentLoaded', () => {
    retrieveItemsFromDocument();
    search();
    generateTrail();

    // add show info event listener
    document.getElementById('spookinator__info-button').addEventListener("click", function () {
        this.classList.toggle('spookinator__toggle-button--active');
        document.getElementById('spookinator__info').classList.toggle('spookinator__item--hidden');
    });
    document.getElementById('spookinator__info-button').addEventListener("keypress", function () {
        this.classList.toggle('spookinator__toggle-button--active');
        document.getElementById('spookinator__info').classList.toggle('spookinator__item--hidden');
    });

    // add show trail event listener
    document.getElementById('spookinator__trail-button').addEventListener("click", function () {
        this.classList.toggle('spookinator__toggle-button--active');
        document.getElementById('spookinator__trail').classList.toggle('spookinator__item--hidden');
        document.getElementById('spookinator__results').classList.toggle('spookinator__item--hidden');
    });
    document.getElementById('spookinator__trail-button').addEventListener("keypress", function () {
        this.classList.toggle('spookinator__toggle-button--active');
        document.getElementById('spookinator__trail').classList.toggle('spookinator__item--hidden');
        document.getElementById('spookinator__results').classList.toggle('spookinator__item--hidden');
    });

    // add regenerate trail event listener
    document.getElementById('spookinator__regenerate-button').addEventListener("click", function () {
        generateTrail();
    });
    document.getElementById('spookinator__regenerate-button').addEventListener("keypress", function () {
        generateTrail();
    });

    // add download trail pdf event listener
    document.getElementById('spookinator__download-pdf').addEventListener("click", function () {
        downloadTrailPdf();
    });document.getElementById('spookinator__download-pdf').addEventListener("keypress", function () {
        downloadTrailPdf();
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

function addFooterText(doc, pageWidth, xMargin, pageHeight) {
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10);
    const footerText = 'Gegenereerd op spookpad.nl',
        xPosition = pageWidth - doc.getTextWidth(footerText) - xMargin * 2,
        yPosition = pageHeight - xMargin;

    // Add the footer text at the bottom right.
    doc.textWithLink(footerText, xPosition, yPosition, {url: 'https://spookpad.nl/'});
    doc.textWithLink('Pagina ' + doc.internal.getNumberOfPages(), xMargin, yPosition, {url: 'https://spookpad.nl/'});
}

//</script>//3

// module.exports = {itemClass}
