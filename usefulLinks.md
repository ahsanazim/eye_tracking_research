Tokenization:

* https://stackoverflow.com/questions/2456442/how-can-i-highlight-the-line-of-text-that-is-closest-to-the-mouse/2456631#2456631
* https://stackoverflow.com/questions/25529936/how-to-highlight-a-word-given-coordinates



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