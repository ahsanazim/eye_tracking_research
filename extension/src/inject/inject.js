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

        // generate content spans by TOKENIZING
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

        document.onmousemove = function(e){
            var x = e.pageX;
            var y = e.pageY;
            console.log(x, y)

            // var locs = [];
            // var elems = $(".line");
            // Array.from(elems).forEach(function (el) {
            //     var rect = el.getBoundingClientRect();
            //     var span_x = (rect.left + rect.right) / 2;
            //     var span_y = (rect.top + rect.bottom) / 2;
            //     locs.push(`${span_x} ${span_y}`)
            // });
            // console.log(locs)

            // var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            // while (x > w) {
            //     x -= w;
            // }
            while (y > h) {
                y -= h;
            }
            var elems = $("span");
            Array.from(elems).forEach(function (el) {
                $(el).css("background-color", "green");
            });
            el = document.elementFromPoint(x, y)
            if (el.nodeName.toLowerCase() == "span") {
                $(el).css("background-color", "yellow");
            }

            // OR
        
            // var distances = [];
            // var elems = $("span");
            // Array.from(elems).forEach(function (el) {
            //     var rect = el.getBoundingClientRect();
            //     var span_x = (rect.left + rect.right) / 2;
            //     var span_y = (rect.top + rect.bottom) / 2;
            //     var a = x - span_x;
            //     var b = y - span_y;
            //     var c = Math.sqrt( a*a + b*b );
            //     distances.push(c);
            // });
        
            // var closest = 0;
            // for (i=0; i<distances.length;i++) {
            //     if (distances[i] < distances[closest]) {
            //          closest = i;
            //     }
            // }
            // console.log(distances, x, y)
            // // elems[i].addClass("higlighted");)
            // Array.from(elems).forEach(function (el) {
            //     $(el).css("background-color", "green");
            // });
            // $(elems[closest]).css("background-color", "yellow");
        
        
            // var element = document.elementFromPoint(x, y);
            // if (element.nodeName.toLowerCase() == "span") {
            //     $(element).css("background-color", "yellow");
            // }
        }
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
