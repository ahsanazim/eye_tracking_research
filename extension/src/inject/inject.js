/* this page is currently being injected into *all* web pages */

/* comands you can run to test that the content script is running:
console.log("COMINGGGGGGGGGGGGGGGG");
// https://stackoverflow.com/questions/40874759/chrome-get-url-of-active-content-script-tab
alert(location.href);
*/

// POST request to our api to extract content
var targetSiteURL = location.href
// const URL = "http://localhost:5000/";                                // local server
const URL = "https://mysterious-fortress-86319.herokuapp.com/"          // remote api hosted on heroku
$.ajax({
    type: "POST",
    url: URL,
    data: targetSiteURL,
    dataType: "text",
    contentType : "text/plain",
    crossDomain: true,
    success: function(result){
        console.log("arrived");
        console.log(result);
        console.log(result.content);
        result = JSON.parse(result);                                        // convert to JSON
        const titleHTML = `<h1 class="title">${result.title}</h1>`;
        const subHeadHTML = ``;

        /**************************************************************
         * 
         *                  REPLACE PAGE CONTENT
         * 
         **************************************************************/
        var contentHTML = "";
        var rawContentStr = result.content;
        var spanContent = "";
        var counter = 0;
        var spanNum = 0;
        var SPAN_SIZE = 93
        for (var i = 0; i < rawContentStr.length; i++) {
            var ch = rawContentStr.charAt(i);
            // seen a newline, hence new paragraph
            if ((ch == "\n") && (spanContent != "")) {       // double check since we get \n chars back to back
                contentHTML += `<span class="line" id="${spanNum}">${spanContent}</span>`;       // add current content
                contentHTML += "<br><br>"                   // then insert line break
                counter = 1;                                // reinitialize everything
                spanNum++;
                spanContent = "";                    
            } else if (ch != "\n") {                // usual case
                spanContent += ch;                  // add curr char to curr span's content
                // we have reached the current span's maximum size 
                if (counter == SPAN_SIZE) {         // reached end of line (ie add span)
                    contentHTML += `<span class="line" id="${spanNum}">${spanContent}</span>`;
                    counter = -1;                   // reinitialize
                    spanNum++;
                    spanContent = "";
                }
                counter++;
            }
        }
        // for any leftover content
        if (spanContent != "") {
            contentHTML += `<span id="${spanNum}">${spanContent}</span>`;
        }
        // surround spans with a container div
        contentHTML = `<div class="content">${contentHTML}</div>`

        var imgHTML = `<img src="${result.img_src}" alt="N/A">`;

        const articleHTML = `<div class="article">${titleHTML}${imgHTML}${subHeadHTML}${contentHTML}</div>`;      // wrap everything

        const newPage = `<head>
                            <title>Eye Tracking Research</title>
                            <link rel="stylesheet" type="text/css" href="./newPage.css">
                        </head>
                        <body>
                            ${articleHTML}
                        </body>`

        $("html").html(newPage);


        /**************************************************************
         * 
         *                      WEBSOCKET
         * 
         **************************************************************/

        // for raw coordinates:
        // array of arrays with last 10 x,y positions of gaze tracker
        var coords_q = [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]];
        var data = [];    // array of [line_num, timestamp] objects

        // for line highlighting:
        var spanID = 0;
        // var oldX = Infinity;
        // var all_q = [];         // holds *all* x coords seen
        // var timePassed = false;     // flag for when enough time has passed b/w
        //                             // cycles of negative gradients

        //////////////////////////////////
        // for quadrant-based highlighting
        var startX = 0;
        var quadLen = 200;
        var quadRanges = [0, 0, 0, 0];
        // establish quadrant ranges
        for(var i = 0; i < quads.length; i++) {
            quadRanges[i] = startX + (quadLen * i);
        }
        var quadFreqs = [];
        for(var i = 0; i < spanNum; i++) {
            quadFreqs.push([0, 0, 0, 0])
        }

        //////////////////////////////////

        if ("WebSocket" in window) {
            //alert("WebSocket is supported by your Browser!");
            
            // Let us open a web socket
            var ws = new WebSocket("ws://localhost:8765/hello");

            ws.onopen = function() {
                // Web Socket is connected, send data using send()
                ws.send("Socket Opened");
                //alert("Message is sent...");
            };

            ws.onmessage = function (evt) { 
                var received_msg = evt.data;
                // console.log(received_msg);          // uncomment to log all coordinates
                var tokens = received_msg.split('|');
                if (tokens[0] === 'during') {

                    ///////////////////////////////////////////////////////////
                    // GET AND TRANSFOR GAZE COORDINATES
                    ///////////////////////////////////////////////////////////

                    // get normalized gaze position
                    var tobii_x = parseInt(tokens[1]);
                    var tobii_y = parseInt(tokens[2]);
                    var x = tobii_x;
                    var y = tobii_y
                    var x = tobii_x + window.screenLeft + (window.outerWidth - window.innerWidth);
                    var y = tobii_y + window.screenTop - (window.outerHeight - window.innerHeight);

                    // smoothing -- compute stabilized x and y coords
                    // use coords_q as queue sliding over past 10 x,y positions
                    // mean of these is our current position1

                    var x_sum = 0.0;
                    var y_sum = 0.0;
                    var avg_denom = 0.0; // needed b/c of initial cases where coords_q not filled fully
                    coords_q.push([x,y]);
                    coords_q.shift();
                    for(var i = 0; i < coords_q.length; i++) {
                        if (coords_q[i][0] !== -1) {
                            x_sum += parseFloat(coords_q[i][0]);
                            y_sum += parseFloat(coords_q[i][1]);
                            avg_denom += 1;
                        }
                    }
                    // final x,y coords
                    x = x_sum / avg_denom;
                    y = y_sum / avg_denom;
                    
                    
                    // all_q.push(x);      // for slider based highlighting


                    ///////////////////////////////////////////////////////////
                    // HIGHLIGHTING MECHANISM: quadrant-based
                    ///////////////////////////////////////////////////////////

                    var currSpanId = -1;

                    // find id of current span
                    el = document.elementFromPoint(x, y);
                    // if element under pointer is one of our spans
                    if (el != null){
                        var isSpan = (el.nodeName.toLowerCase() == "span");
                        var isOurClass = ($(el).attr('class') == "line");
                        if (isSpan && isOurClass) {
                            // extract and set id of our pointer
                            currSpanId = $(el).attr('id');
                            currSpanId = parseInt(currSpanId);      
                        }
                    }

                    // iterate through various quadrant markers
                    for(var i = 0; i < quadRanges.length; i++) {
                        // found the quadrant point is in
                        if ((startX < x) && (x < quadRanges[i])) {
                            // increment counter for quad num in relevant span
                            quadFreqs[currSpanID][i] += 1;
                        }
                    }

                    // rehighlight page based on updated frequencies


                    ///////////////////////////////////////////////////////////
                    // HIGHLIGHTING MECHANISM: use a 'slider'
                    ///////////////////////////////////////////////////////////

                    // // ATTEMPT # 1

                    // // highlight first line
                    // if (spanID == 0) {
                    //     var firstLineSpan = $('span#0');
                    //     $(firstLineSpan).css("background-color", "yellow");
                    // }

                    // // shift slider to next line - `hasNegativeGradient` does all the work
                    // if (hasNegativeGradient(all_q)) {
                    //     console.log(all_q.slice(Math.max(all_q.length - 10, 1)));
                    //     console.log("moving to newline", x);
                    //     // first set all lines back to default color (to overwrite prev line)
                    //     var elems = $("span");                      // all spans
                    //     Array.from(elems).forEach(function (el) {
                    //         $(el).css("background-color", "white");
                    //     });
                    //     // highlight new line
                    //     spanID += 1;
                    //     console.log(spanID);
                    //     var currSpanElement = $('span#' + spanID.toString());
                    //     console.log(currSpanElement);
                    //     $(currSpanElement).css("background-color", "yellow");
                    // }

                    // // ATTEMPT # 2

                    // console.log("simple", x, oldX);
                    // if (x < oldX - 50) {
                    //     console.log(x, oldX);
                    //     // first set all lines back to default color (to overwrite prev line)
                    //     var elems = $("span");                      // all spans
                    //     Array.from(elems).forEach(function (el) {
                    //         $(el).css("background-color", "green");
                    //     });
                    //     // highlight new line
                    //     spanID += 1;
                    //     console.log(spanID);
                    //     var currSpanElement = $('span#' + spanID.toString());
                    //     console.log(currSpanElement);
                    //     $(currSpanElement).css("background-color", "yellow");
                    // }
                    // oldX = x;           // update previous x coord marker



                    
                    ///////////////////////////////////////////////////////////
                    // HIGHLIGHTING MECHANISM: go straight for the current line
                    ///////////////////////////////////////////////////////////
                    // highlight the relevant line (unhighlighting everything else)
                    // var elems = $("span");
                    // el = document.elementFromPoint(x, y);
                    // // if its a span
                    // if ((el != null) && (el.nodeName.toLowerCase() == "span")) {
                    //     // set all lines back to default color (to overwrite prev line)
                    //     Array.from(elems).forEach(function (el) {
                    //         $(el).css("background-color", "green");
                    //     });
                    //     console.log("SUCCESS", x, y);
                    //     // set our current span to desired color
                    //     $(el).css("background-color", "yellow");
                    //     console.log(el);
                    // } else {
                    //     console.log("failure", x, y);
                    //     console.log(el);
                    // }

                }
            };

            ws.onclose = function() { 
                // websocket is closed.
                // alert("Connection is closed..."); 
            };

            window.onbeforeunload = function(event) {
                // Close the connection, if open.
                if (ws.readyState === WebSocket.OPEN) {
                    // TODO: conceptual thing - why was doc.getElembyid not giving
                    // correct result unless you toggled?
                    var infoToSend = {
                    article: '1',
                    user: '1',
                    hlight: $("#hlighterCenter").css("visibility"),
                    data: data
                    };
                    ws.send(JSON.stringify(infoToSend));
                    ws.close();
                };
            }
        }
        else {
            // The browser doesn't support WebSocket
            alert("WebSocket NOT supported by your Browser!");
        }



        /**************************************************************
         * 
         *              MOUSE-BASED HIGHLIGHTING
         * 
         **************************************************************/
        /*
        document.onmousemove = function(e){
            // mouse coordinates
            var x = e.pageX;
            var y = e.pageY;

            // correct y coordinate for scrolling
            y -= $(window).scrollTop();

            // highlight the relevant line (unhighlighting everything else)
            var elems = $("span");
            Array.from(elems).forEach(function (el) {
                $(el).css("background-color", "white");
            });
            el = document.elementFromPoint(x, y)
            if (el.nodeName.toLowerCase() == "span") {
                $(el).css("background-color", "yellow");
            }
        }
        */
    }
},
{
    error: function(error) {
        console.log(`Error: ${error}`);
    }
});


/**
 * Returns true if elements in a certain window of an
 * array are sorted in descending order.
 * This is equivalent, in our use case, to the graph
 * of x-coordinates having a negative gradient in a 
 * given window (thus representing line change as
 * eyes scan right to left across a page, as opposed
 * to the usual left to right in reading).
 * @param {array} arr
 */
function hasNegativeGradient(arr) {
    // mark the window you want to check
    var highIdx = arr.length - 1;
    var lowIdx = arr.length - 10;

    // TRYING SOMETHING DIFFERENT:
    // this is still inducing problems
    if ((arr[highIdx] < 300) && (arr[highIdx - 30] > 600)) {
        return true;
    } else {
        return false;
    }


    if (lowIdx < 1) {           // array not long enough for checking
        return false;
    }
    // check given window for any pair that violates condition
    for (var i = highIdx; i > lowIdx; i--) {
        if (arr[i] > arr[i - 1]) {
            return false;
        }
    }
    // condition never violated
    // elements in our current window are in descending order
    return true;
}

function hasPositiveGradient(arr) {
    // mark the window you want to check
    var highIdx = arr.length - 1;
    var lowIdx = arr.length - 10;
    if (lowIdx < 1) {           // array not long enough for checking
        return true;
    }
    // check given window for any pair that violates condition
    for (var i = highIdx; i > lowIdx; i--) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    // condition never violated
    // elements in our current window are in descending order
    return true;
}
  



// https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
// https://stackoverflow.com/questions/35969974/foreach-is-not-a-function-error-with-javascript-array
// https://stackoverflow.com/questions/10935888/highlight-element-that-is-closest-to-middle-of-viewport
// raw html not needed anymore
// var rawHTML = "<html>" + $("html").html() + "</html>";      // NOTE: used only when you actually have this in extension form going
                                                            // grabs the current page's html
