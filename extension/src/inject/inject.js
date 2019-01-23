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

        // array of arrays with last 10 x,y positions of gaze tracker
        var coords_q = [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]];
        var data = [];    // array of [line_num, timestamp] objects
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
                console.log(received_msg);          // uncomment to log all coordinates
                var tokens = received_msg.split('|');
                if (tokens[0] === 'during') {
                    // get normalized gaze position
                    var tobii_x = tokens[1];
                    var tobii_y = tokens[2];
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
                    x = x_sum / avg_denom;
                    y = y_sum / avg_denom;
                    // add an offset to deal with slight innacuracy (one line' worth)
                    // y += 28;
                    // draw dot at current gaze position    DO NOT DELETE!!!! -- uncomment whenever you need tracer
                    /*
                    var dot_color = 'green';
                    var dot_size = '5px';
                    $("body").append(
                    $('<div></div>')
                        .css('position', 'absolute')
                        .css('top', y + 'px')
                        .css('left', x + 'px')
                        .css('width', dot_size)
                        .css('height', dot_size)
                        .css('background-color', dot_color)
                    );
                    */
                    
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


// https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
// https://stackoverflow.com/questions/35969974/foreach-is-not-a-function-error-with-javascript-array
// https://stackoverflow.com/questions/10935888/highlight-element-that-is-closest-to-middle-of-viewport
// raw html not needed anymore
// var rawHTML = "<html>" + $("html").html() + "</html>";      // NOTE: used only when you actually have this in extension form going
                                                            // grabs the current page's html
