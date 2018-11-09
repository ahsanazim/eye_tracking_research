// on page load
$(document).ready(function() {
    // POST request to our api to extract content
    var targetSiteURL = "https://www.newyorker.com/magazine/2018/10/15/damien-chazelles-moon-shot-in-first-man";
    const URL = "http://localhost:5000/";
    var rawHTML = "<html>" + $("html").html() + "</html>";      // NOTE: used only when you actually have this in extension form going
                                                                // grabs the current page's html
    $.ajax({
        type: "POST",
        url: URL,
        data: targetSiteURL,
        dataType: "text",
        contentType : "text/plain",
        crossDomain: true,
        success: function(result){
            console.log(result.content)
            result = JSON.parse(result)                                         // convert to JSON
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
                    contentHTML += `<span id="${spanNum}">${spanContent}</span>`;       // add current content
                    contentHTML += "<br><br>"                   // then insert line break
                    counter = 1;                                // reinitialize everything
                    spanNum++;
                    spanContent = "";                    
                } else if (ch != "\n") {                // usual case
                    spanContent += ch;                  // add curr char to curr span's content
                    // we have reached the current span's maximum size 
                    if (counter == SPAN_SIZE) {         // reached end of line (ie add span)
                        contentHTML += `<span id="${spanNum}">${spanContent}</span>`;
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

            $("body").append(`${articleHTML}`);
        }
    },
    {
        error: function(error) {
            console.log(`Error: ${error}`);
        }
    });
});