/* Copyright (C) 2015 Menglin Xu, All Rights Reserved */

"use strict";

/**
 * HTMLElement Methods
 */
// addClass
HTMLElement.prototype.addClass = function(className) {
    var elemClassString = this.className.trim(),
        classes = className.trim().split(" "),
        i;
    
    for (i = 0; i < classes.length; i++) {
        // add class if no match is found
        if (!elemClassString.match(new RegExp(classes[i]))) {
            elemClassString += " " + classes[i].trim();
        }
    }
    this.className = elemClassString;
    return this;
};

// removeClass
HTMLElement.prototype.removeClass = function(className) {
    var elemClassString = this.className.trim(),
        classes = className.trim().split(" "),
        i;
    
    for (i = 0; i < classes.length; i++) {
        // remove class by replacing it with an empty string if found
        elemClassString = elemClassString.replace(classes[i].trim(), "");
    }
    this.className = elemClassString;
    return this;
};


/**
 * Calendar Constructor
 */
function Calendar() {

    /**
     * init
     */
    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth(),
        date = today.getDate(),
        day = today.getDay(),
        lastDateOfMonth = new Date(year, month + 1, 0).getDate(),
        firstDayOfMonth = new Date(year, month, 1).getDay(),
        element = document.getElementById("calendar"),
        dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday", "Saturday"];

    /**
     * create method
     */
    this.create = function() {
        var table = createElem("table"),
            thead = createElem("thead"),
            tbody = createElem("tbody"),
            tr, th, td,
            dateNum,
            months = ["January", "February", "March", "April", "May",
                      "June", "July", "August", "September",
                      "October", "November", "December"],
            days = ["S", "M", "T", "W", "T", "F", "S"],
            i, j, k,
            dateElems, activeElem;

        // shorthand for document.createElement method
        function createElem(element, text) {
            var node,
                args = arguments[0],
                key;
            // object argument
            if (typeof args === "object") {
                node = document.createElement(args.element);
                if (args.text) {
                    node.innerHTML = args.text;
                }
                if (typeof args.attributes === "object") {
                    for (key in args.attributes) {
                        node.setAttribute(key, args.attributes[key]);
                    }
                }
            }
            // standard argument(s)
            else {
                node = document.createElement(element);
                if (text) {
                    node.innerHTML = text;
                }
            }
            return node;
        }

        //--- create calendar header ---//
        // left arrow
        tr = createElem({
            element: "tr",
            attributes: {
                class: "calendar-header"
            }
        });
        tr.appendChild(createElem({
            element: "th",
            text: "&lt;",
            attributes: {
                class: "js-calendar-left-arrow arrow"
            }
        }));
        // month and year
        tr.appendChild(createElem({
            element: "th",
            text: months[month] + " " + year,
            attributes: {
                class: "js-calendar-month-year month-year",
                colspan: 5
            }
        }));
        // right arrow
        tr.appendChild(createElem({
            element: "th",
            text: "&gt;",
            attributes: {
                class: "js-calendar-right-arrow arrow"
            }
        }));
        thead.appendChild(tr);
        // days of the week
        tr = createElem("tr");
        for (i = 0; i < days.length; i++) {
            tr.appendChild(createElem("th", days[i]));
        }
        thead.appendChild(tr);
        tr = createElem("tr");
        
        // iterate through the days of the month
        for (dateNum = 0; dateNum < lastDateOfMonth; dateNum++) {
            // insert row at the end of the first week of the month
            if (dateNum === 7 - firstDayOfMonth) {
                tbody.appendChild(tr);
                tr = createElem("tr");
            }
            // insert row at the end of every other week of the month
            else if ((dateNum + firstDayOfMonth) % 7 === 0) {
                tbody.appendChild(tr);
                tr = createElem("tr");
            }
            // insert blank days until first date is reached
            if (dateNum === 0) {
                for (j = 0; j < firstDayOfMonth; j++) {
                    tr.appendChild(createElem("td"));
                }
            }
            // insert date with dataset info
            td = createElem("td", dateNum + 1);
            td.dataset.date = year + "-" + ((month < 10) ? "0" + month : month) + "-" + (dateNum + 1);
            // highlight current date
            if (dateNum + 1 === date) {
                activeElem = td;
                activeElem.addClass("active");
            }
            tr.appendChild(td);
            // insert final row for the last week of month
            if (dateNum + 1 === lastDateOfMonth) {
                tbody.appendChild(tr);
            }
        }
        // append to respective elements
        table.appendChild(thead);
        table.appendChild(tbody);
        element.appendChild(table);
        
        dateElems = tbody.getElementsByTagName("td");
        for (k = 0; k < dateElems.length; k++) {
            dateElems[k].onclick = function() {
                activeElem.removeClass("active");
                activeElem = this;
                activeElem.addClass("active");
            };
        }
    };

}


// call
var calendar = new Calendar();
calendar.create();
