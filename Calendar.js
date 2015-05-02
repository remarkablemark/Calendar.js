/* Copyright (C) 2015 Menglin Xu, All Rights Reserved */

"use strict";

function Calendar() {
    
    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth(),
        date = today.getDate(),
        day = today.getDay(),
        lastDateOfMonth = new Date(year, month + 1, 0).getDate(),
        firstDayOfMonth = new Date(year, month, 1).getDay(),
        element = document.getElementById("calendar");
    
    this.create = function() {
        var el = element,
            tr = document.createElement("tr"),
            th, td,
            dateNum,
            days = ["S", "M", "T", "W", "T", "F", "S"],
            i, j;
        
        // create calendar header
        for (i = 0; i < days.length; i++) {
            th = document.createElement("th");
            th.innerHTML = days[i];
            tr.appendChild(th);
        }
        el.appendChild(tr);
        tr = document.createElement("tr");
        
        // iterate through the days of the month
        for (dateNum = 0; dateNum < lastDateOfMonth; dateNum++) {
            // insert a new row at the end of every week
            // last week of month
            if (dateNum + 1 === lastDateOfMonth) {
                el.appendChild(tr);
            }
            // every other week of month
            else if (dateNum === 7 - firstDayOfMonth) {
                el.appendChild(tr);
                tr = document.createElement("tr");
            }
            // first week of month
            else if ((dateNum + firstDayOfMonth) % 7 === 0) {
                el.appendChild(tr);
                tr = document.createElement("tr");
            }
            // insert blank days until first date is reached
            if (dateNum === 0) {
                for (j = 0; j < firstDayOfMonth; j++) {
                    tr.appendChild(document.createElement("td"));
                }
            }
            // insert date
            td = document.createElement("td");
            td.innerHTML = dateNum + 1;
            tr.appendChild(td);
        }
    };
    
}

var calendar = new Calendar();
calendar.create();
