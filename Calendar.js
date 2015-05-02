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
        mainElement = document.getElementById(id),
        metaTable = createElem("table"),
        metaHeadElement, metaBodyElement,
        calendarTable = createElem("table"),
        calendarTableBody = createElem("tbody"),
        createMetaDisplay, createCalendarHead, createCalendarBody;


    // confirm main element id
    if (!mainElement) {
        console.assert(mainElement, "Missing or invalid argument 'selector' for Calendar constructor");
        return false;
    }

    // lambda that creates the tables within a table
    (function(){
        var mainElem = mainElement,
            metaElem = metaTable,
            calendarElem = calendarTable,
            table = createElem("table"),
            tr = createElem("tr"),
            td1 = createElem("td"),
            td2 = createElem("td");

        td1.className = "meta-cell";
        td2.className = "calendar-cell";
        td1.appendChild(metaElem);
        td2.appendChild(calendarElem);
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
        mainElem.appendChild(table);
    })();

    // styling for main element
    mainElement.style.textAlign = "center";
    mainElement.style.height = "220px";
    mainElement.style.overflow = "hidden";


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
     * meta display creator
     */
    createMetaDisplay = function() {
        var table = metaTable,
            head, body,
            tr;

        // day of the week
        tr = createElem("tr");
        head = createElem({
            element: "td",
            text: dayNames[selectedDate],
            attributes: {
                class: "meta-head"
            }
        });
        metaHeadElement = head;
        tr.appendChild(head);
        table.appendChild(tr);

        // date of the month
        tr = createElem("tr");
        body = createElem({
            element: "td",
            text: date,
            attributes: {
                class: "meta-body"
            }
        });
        metaBodyElement = body;
        tr.appendChild(body);
        table.appendChild(tr);
    };
    createMetaDisplay();


    /**
     * calendar head creator
     */
    createCalendarHead = function() {
        var table = calendarTable,
            thead = createElem("thead"),
            tr, headLeftArrow, headMain, headRightArrow,
            days = ["S", "M", "T", "W", "T", "F", "S"],
            select, option, input, editingInput,
            i, j;

        // updates calendar body given month and year
        function updateCalendarBody(year, month) {
            lastDateOfMonth = getLastDateOfMonth(year, month);
            firstDayOfMonth = getFirstDayOfMonth(year, month);
            createCalendarBody();
        }

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
            // update calendar head and body
            select.getElementsByTagName("option")[month].selected = true;
            input.value = year;
            updateCalendarBody(year, month);
        }

        // changes month or year value and then updates calendar
        function changeValueThenUpdate(param) {
            var arg = param;
            if (typeof arg === "object") {
                if (arg.hasOwnProperty("month")) {
                    month = Number(arg.month);
                }
                else if (arg.hasOwnProperty("year")) {
                    year = Number(arg.year);
                }
                else {
                    return;
                }
            }
            updateCalendarBody(year, month);
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
            attributes: {
                class: "header-month-year",
                colspan: 5
            }
        });
        // allow month to be selectable
        select = createElem({
            element: "select",
            attributes: {
                class: "header-month"
            }
        });
        // insert all the select options with the month names and values
        for (j = 0; j < 12; j++) {
            option = createElem({
                element: "option",
                text: monthNames[j],
                attributes: {
                    value: j
                }
            });
            // select the month
            if (j === month) {
                option.selected = true;
            }
            select.appendChild(option);
        }
        // update calendar when new option is selected
        select.onchange = function() {
            month = this.value;
            changeValueThenUpdate({ month: month });
        };
        headMain.appendChild(select);

        // allow year to be editable
        input = createElem({
            element: "input",
            attributes: {
                class: "header-year",
                type: "text",
                maxlength: "4"
            }
        });
        input.value = year;
        // prevent arrow keys from conflicting with input editing
        input.onkeydown = function() { editingInput = true; };
        // update calendar when valid year is inputted
        input.onkeyup = function() {
            var inputYear = Number(this.value) || year;
            // break if the year has not changed
            if (inputYear === year) { return; }
            // otherwise update year and calendar
            else if (String(inputYear).length === 4) {
                year = inputYear;
                changeValueThenUpdate({ year: year });
            }
            // give control back to arrow keys in changing months after a delay
            setTimeout(function() { editingInput = false; }, 500);
        };
        headMain.appendChild(input);

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
        // key press event handler
        document.onkeyup = function(event) {
            event = event || window.event;
            // break operation if currently editing input
            if (editingInput) { return; }
            // left arrow
            if (event.keyCode === 37 || event.keyCode === 40) {
                addMonthThenUpdate(-1);
            }
            // right arrow
            else if (event.keyCode === 39 || event.keyCode === 38) {
                addMonthThenUpdate(1);
            }
        };
        // days of the week
        tr = createElem({
            element: "tr",
            attributes: {
                class: "header-day-names"
            }
        });
        for (i = 0; i < days.length; i++) {
            tr.appendChild(createElem("th", days[i]));
        }
        thead.appendChild(tr);
        table.appendChild(thead);
    };
    createCalendarHead();


    /**
     * calendar body creator
     */
    createCalendarBody = function() {
        var table = calendarTable,
            tbody = calendarTableBody,
            tr = createElem("tr"), td,
            dateNum, dateArr,
            i, j, k,
            dateElems, activeElem,
            metaHead = metaHeadElement,
            metaBody = metaBodyElement;

        // clear table body content
        tbody.innerHTML = "";

        // iterate through the days of the month
        for (dateNum = 0; dateNum < lastDateOfMonth; dateNum++) {
            // insert row at the end of the first week of the month
            if (dateNum === 7 - firstDayOfMonth) {
                tbody.appendChild(tr);
                tr = createElem("tr");
            }
            // insert row at the end of every week of the month except for the first
            else if ((dateNum + firstDayOfMonth) % 7 === 0 &&
                     dateNum !== firstDayOfMonth) {
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
            td.dataset["date"] = year + "-" +
                                 ((month < 10) ? "0" + month : month) + "-" +
                                 ((dateNum + 1 < 10) ? "0" + (dateNum + 1) : (dateNum + 1));
            // highlight current date
            if (dateNum + 1 === selectedDate &&
                month === selectedMonth &&
                year === selectedYear) {
                td.addClass("active");
            }
            tr.appendChild(td);
            // insert final row for the last week of month
            if (dateNum + 1 === lastDateOfMonth) {
                tbody.appendChild(tr);
                // add empty rows to keep calendar from constantly resizing
                k = tbody.getElementsByTagName("tr").length - 4;
                for (k; k < 6; k++) {
                    tbody.appendChild(createElem("tr"));
                }
            }
        }
        table.appendChild(tbody);

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
                    // update meta cell with day and date
                    metaHead.innerHTML = dayNames[new Date(selectedYear,
                                                           selectedMonth,
                                                           selectedDate).getDay()];
                    metaBody.innerHTML = selectedDate;
                };
            }
        }
    };
    createCalendarBody();


    /**
     * get selected year
     */
    this.getSelectedYear = function() {
        // return 4 digit year
        return selectedYear;
    };


    /**
     * get selected month
     */
    this.getSelectedMonth = function() {
        // return month integer from 1 - 12
        return selectedMonth + 1;
    };


    /**
     * get selected date
     */
    this.getSelectedDate = function() {
        // return date integer from 1 - 31
        return selectedDate;
    };


}
