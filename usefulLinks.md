Python 
* [https://realpython.com/python-virtual-environments-a-primer/#using-different-versions-of-python](https://realpython.com/python-virtual-environments-a-primer/#using-different-versions-of-python)
* [https://stackoverflow.com/questions/31684375/automatically-create-requirements-txt](https://stackoverflow.com/questions/31684375/automatically-create-requirements-txt)

Heroku:

see the git repository where server is pushed

Extensions:

* [https://developer.chrome.com/extensions/overview](https://developer.chrome.com/extensions/overview)
* [https://developer.chrome.com/extensions/content_scripts#pi](https://developer.chrome.com/extensions/content_scripts#pi)
* (http://extensionizr.com/)[http://extensionizr.com/]
* [chrome://extensions/](chrome://extensions/)


Talon:

* Site:
    * [https://talonvoice.com/docs/](https://talonvoice.com/docs/)
    * [https://github.com/talonvoice/examples/blob/master/eye_mon_snap.py](https://github.com/talonvoice/examples/blob/master/eye_mon_snap.py)
    * [https://talonvoice.slack.com](https://talonvoice.slack.com)
    * [https://github.com/dwiel/talon_community/tree/master/misc](https://github.com/dwiel/talon_community/tree/master/misc)
    * [https://old.reddit.com/r/EyeTracking/comments/8p92vf/has_anyone_tried_using_tobii_products_on_mac/](https://old.reddit.com/r/EyeTracking/comments/8p92vf/has_anyone_tried_using_tobii_products_on_mac/)
    * [https://www.youtube.com/playlist?list=PL2wTcyeSmhsbPZYt65mRiKSeuq6WU-rXZ](https://www.youtube.com/playlist?list=PL2wTcyeSmhsbPZYt65mRiKSeuq6WU-rXZ)
* Commands
    * `tail -f ~/.talon/talon.log` for debug log, log file also there
    * `cd ~/.talon/user` contains user added scripts for which print statement prints to debug log
        * `eye_mon_swap.py` is a useful file, currently printing to debug log
    * `~/.talon/bin/repl` talon REPL





CORS and such: 
[https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content)


Tokenization:

* https://stackoverflow.com/questions/2456442/how-can-i-highlight-the-line-of-text-that-is-closest-to-the-mouse/2456631#2456631
* https://stackoverflow.com/questions/25529936/how-to-highlight-a-word-given-coordinates

tokenize by paragraphs:
```javascript
// get paras as html by generating & cleaning paragraphs
var paras = result.content.split("\n")                              // newlines mean para separators
paras = paras.filter(para => para.length > 0);                      // some empty strings therein
var parasHTML = '<p>' + paras.join('</p><p>') + '</p>';             // wrap each string in array with para tags

// var contentHTML = `div id="content">${parasHTML}</div>`          // put whatever you want in here, not used currently
```



Code Deleted before:

```python
# https://github.com/goose3/goose3
# https://programminghistorian.org/en/lessons/creating-apis-with-python-and-flask


from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from goose3 import Goose

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.config["DEBUG"] = True

@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def content_extractor():
    if request.method == 'GET':
        return "<h1>Yes, the server's running</h1>"
    if request.method == 'POST':
        # to handle the absurd CORS problems - figure out how to do JSON
        data = str(request.data, encoding='utf-8')

        # actual content extraction
        url = data
        g = Goose()
        article = g.extract(url=url)
        res_dict = {
            'title': article.title,
            'content': article.cleaned_text
        }
        response = jsonify(res_dict)
        return response
```


```javascript
$(document).ready(function() {
    // POST request to our api to extract content
    var targetSiteURL = "https://www.newyorker.com/news/news-desk/is-deep-learning-a-revolution-in-artificial-intelligence";
    const URL = "http://localhost:5000/";
    $.ajax({
        type: "POST",
        url: URL,
        data: targetSiteURL,
        dataType: "text",
        contentType : "text/plain",
        crossDomain: true,
        success: function(result){
            result = JSON.parse(result)
            const titleHTML = `<h1 class="title">${result.title}</h1>`;
            const subHeadHTML = ``;
            const contentHTML = `<div class="content">${result.content}</div>`;
            //$("#content-container").replaceWith(`<div id="article">${titleHTML}${subHeadHTML}${contentHTML}</div>`);
            console.log(`${titleHTML}${subHeadHTML}${contentHTML}`)
            $("body").append(`${titleHTML}${subHeadHTML}${contentHTML}`);
        }
    },
    {
        error: function(error) {
            console.log(`Error: ${error}`);
        }
    });
});
```


CSS:

height auto stuff

why height auto instead of 100% for html and body:

[https://stackoverflow.com/questions/15943009/difference-between-css-height-100-vs-height-auto](https://stackoverflow.com/questions/15943009/difference-between-css-height-100-vs-height-auto)
[https://stackoverflow.com/questions/31765879/flexbox-parent-container-not-growing-along-with-its-children-content-inside-is](https://stackoverflow.com/questions/31765879/flexbox-parent-container-not-growing-along-with-its-children-content-inside-is)

[https://stackoverflow.com/questions/38170964/height-100-when-parent-height-is-auto](https://stackoverflow.com/questions/38170964/height-100-when-parent-height-is-auto)

100% prevents growing along with children

