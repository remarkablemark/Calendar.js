/* Copyright (C) 2015 Menglin Xu, All Rights Reserved */

"use strict";

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
        element = document.getElementById("calendar");
    
    /**
     * create method
     */
    this.create = function() {
        var table = createElem("table"),
            thead = createElem("thead"),
            tbody = createElem("tbody"),
            tr, th, td,
            dateNum,
            months = ["January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December"],
            days = ["S", "M", "T", "W", "T", "F", "S"],
            i, j;
        
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
        tr = createElem("tr");
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
        tbody.appendChild(tr);
        tr = createElem("tr");
        // append to table head
        table.appendChild(thead);
        
        // iterate through the days of the month
        for (dateNum = 0; dateNum < lastDateOfMonth; dateNum++) {
            //--- insert a new row at the end of every week --//
            // last week of month
            if (dateNum + 1 === lastDateOfMonth) {
                tbody.appendChild(tr);
            }
            // every other week of month
            else if (dateNum === 7 - firstDayOfMonth) {
                tbody.appendChild(tr);
                tr = createElem("tr");
            }
            // first week of month
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
            // add class for easier querying
            td.setAttribute("class", "js-calendar-date");
            // highlight current date
            if (dateNum + 1 === date) {
                td.setAttribute("class", "active");
            }
            tr.appendChild(td);
        }
        // append to respective elements
        table.appendChild(tbody);
        element.appendChild(table);
    };
    
}

// call
var calendar = new Calendar();
calendar.create();
