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
function Calendar(id) {

    /**
     * init
     */
    var that = this,
        today = new Date(),
        year = today.getFullYear(), selectedYear = year,
        month = today.getMonth(), selectedMonth = month,
        date = today.getDate(), selectedDate = date,
        day = today.getDay(),
        lastDateOfMonth = getLastDateOfMonth(year, month),
        firstDayOfMonth = getFirstDayOfMonth(year, month),
        dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday", "Saturday"],
        monthNames = ["January", "February", "March", "April", "May",
                      "June", "July", "August", "September",
                      "October", "November", "December"],
        mainElement,
        calendarTable = createElem("table"),
        calendarTableBody = createElem("tbody");

    // select and confirm main element id
    if (!(mainElement = document.getElementById(id))) {
        console.assert(mainElement, "Missing or invalid argument 'selector' for Calendar constructor");
        return false;
    }

    /**
     * supplementary methods to retrieve date values
     */
    function getLastDateOfMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    /**
     * shorthand for document.createElement
     */
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

    /**
     * create calendar head
     */
    this.createCalendarHead = function() {
        var mainElem = mainElement,
            table = calendarTable,
            thead = createElem("thead"),
            tr, headLeftArrow, headMain, headRightArrow,
            days = ["S", "M", "T", "W", "T", "F", "S"],
            i;
        
        // adds number to month and then updates calendar
        function addMonthThenUpdate(n) {
            var addYears, addMonths, m;
            // add number to month
            month += n;
            // keep month in the range of 0 and 11
            while (month > 11) {
                month -= 12;
                year++;
            }
            while (month < 0) {
                month += 12;
                year--;
            }
            // update calendar head
            headMain.innerHTML = monthNames[month] + " " + year;
            lastDateOfMonth = getLastDateOfMonth(year, month);
            firstDayOfMonth = getFirstDayOfMonth(year, month);
            // update calendar body
            that.createCalendarBody();
        }

        // table row
        tr = createElem({
            element: "tr",
            attributes: {
                class: "calendar-header"
            }
        });
        // left arrow
        headLeftArrow = createElem({
            element: "th",
            text: "&lt;",
            attributes: {
                class: "arrow"
            }
        });
        // left arrow event handler to update calendar
        headLeftArrow.onclick = function() {
            addMonthThenUpdate(-1);
        };
        tr.appendChild(headLeftArrow);
        // month and year
        headMain = createElem({
            element: "th",
            text: monthNames[month] + " " + year,
            attributes: {
                class: "js-calendar-month-year month-year",
                colspan: 5
            }
        });
        tr.appendChild(headMain);
        // right arrow event handler to update calendar
        headRightArrow = createElem({
            element: "th",
            text: "&gt;",
            attributes: {
                class: "arrow"
            }
        });
        headRightArrow.onclick = function() {
            addMonthThenUpdate(1);
        };
        tr.appendChild(headRightArrow);
        thead.appendChild(tr);
        // days of the week
        tr = createElem("tr");
        for (i = 0; i < days.length; i++) {
            tr.appendChild(createElem("th", days[i]));
        }
        thead.appendChild(tr);
        table.appendChild(thead);
    };

    this.createCalendarHead();

    /**
     * create calendar body
     */
    this.createCalendarBody = function() {
        var mainElem = mainElement,
            table = calendarTable,
            tbody = calendarTableBody,
            tr = createElem("tr"), td,
            dateNum, dateArr,
            i, j,
            dateElems, activeElem;

        // clear table body content
        tbody.innerHTML = "";

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
                for (i = 0; i < firstDayOfMonth; i++) {
                    tr.appendChild(createElem("td"));
                }
            }
            // insert date with dataset info
            td = createElem("td", dateNum + 1);
            td.dataset["date"] = year + "-" + ((month < 10) ? "0" + month : month) + "-" + ((dateNum + 1 < 10) ? "0" + (dateNum + 1) : (dateNum + 1));
            // highlight current date
            if (dateNum + 1 === selectedDate && month === selectedMonth && year === selectedYear) {
                td.addClass("active");
            }
            tr.appendChild(td);
            // insert final row for the last week of month
            if (dateNum + 1 === lastDateOfMonth) {
                tbody.appendChild(tr);
            }
        }
        // append to respective elements
        table.appendChild(tbody);
        mainElem.appendChild(table);

        // add event handlers to calendar dates
        dateElems = tbody.getElementsByTagName("td");
        for (j = 0; j < dateElems.length; j++) {
            // add handler to non-empty elements
            if (dateElems[j].innerHTML) {
                dateElems[j].onclick = function() {
                    // remove active class if applicable
                    activeElem = tbody.getElementsByClassName("active");
                    if (activeElem.length > 0) {
                        activeElem[0].removeClass("active");
                    }
                    this.addClass("active");
                    dateArr = this.dataset["date"].split("-");
                    selectedYear = Number(dateArr[0]);
                    selectedMonth = Number(dateArr[1]);
                    selectedDate = Number(dateArr[2]);
                };
            }
        }
    };

    this.createCalendarBody();

}
