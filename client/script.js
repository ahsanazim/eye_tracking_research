// on page load
$(document).ready(function() {
    // POST request to our api to extract content
    var targetSiteURL = "https://www.newyorker.com/magazine/2018/10/15/damien-chazelles-moon-shot-in-first-man";
    const URL = "http://localhost:5000/";
    $.ajax({
        type: "POST",
        url: URL,
        data: targetSiteURL,
        dataType: "text",
        contentType : "text/plain",
        crossDomain: true,
        success: function(result){
            result = JSON.parse(result)                                         // convert to JSON
            const titleHTML = `<h1 class="title">${result.title}</h1>`;
            const subHeadHTML = ``;

            // get paras as html by generating & cleaning paragraphs
            var paras = result.content.split("\n")                              // newlines mean para separators
            paras = paras.filter(para => para.length > 0);                      // some empty strings therein
            var parasHTML = '<p>' + paras.join('</p><p>') + '</p>';             // wrap each string in array with para tags
            
            // var contentHTML = `div id="content">${parasHTML}</div>`          // put whatever you want in here, not used currently


            var imgHTML = `<img src="${result.img_src}" alt="N/A">`

            const articleHTML = `<div class="article">${titleHTML}${imgHTML}${subHeadHTML}${parasHTML}</div>`;      // wrap everything

            $("body").append(`${articleHTML}`);
        }
    },
    {
        error: function(error) {
            console.log(`Error: ${error}`);
        }
    });
});