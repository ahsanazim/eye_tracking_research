LINKS:
---------------------------
chrome://extensions/
https://texasobserver.org/anatomy-tragedy/
https://dashboard.heroku.com/apps/mysterious-fortress-86319/logs
https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
https://stackoverflow.com/questions/9431050/difference-between-window-width-vs-document-width
https://stackoverflow.com/questions/33770549/viewport-vs-window-vs-document
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY
https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
https://stackoverflow.com/questions/1259585/get-element-at-specified-position-javascript
https://stackoverflow.com/questions/21317476/how-to-use-jquery-in-chrome-extension
https://stackoverflow.com/questions/254302/how-can-i-determine-the-type-of-an-html-element-in-javascript
https://stackoverflow.com/questions/4711023/how-do-i-efficiently-highlight-element-under-mouse-cursor-with-an-overlay
https://stackoverflow.com/questions/203198/event-binding-on-dynamically-created-elements?rq=1
https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
https://stackoverflow.com/questions/12888584/is-there-a-way-to-tell-chrome-web-debugger-to-show-the-current-mouse-position-in
https://stackoverflow.com/questions/25529936/how-to-highlight-a-word-given-coordinates
https://stackoverflow.com/questions/4845215/making-a-chrome-extension-download-a-file
https://stackoverflow.com/questions/2652094/start-an-external-application-from-a-google-chrome-extension
https://github.com/ahsanazim/thesis/blob/master/client/article_1.html

latest:

https://stackoverflow.com/questions/1938356/chrome-browser-action-click-not-working

https://stackoverflow.com/questions/17601615/the-chrome-extension-popup-is-not-working-click-events-are-not-handled

https://stackoverflow.com/questions/11373741/detecting-by-how-much-user-has-scrolled scrollTop

https://websockets.readthedocs.io/en/stable/intro.html
https://stackoverflow.com/questions/5419888/reading-from-a-frequently-updated-file



note file paths are always from ./extension



was in content scripts before:
```
{
    "matches": [
    "<all_urls>"
    ],
    "css": [
    "src/inject/inject.css"
    ]
},
{
    "matches": [
    "<all_urls>"
    ],
    "js": [
    "js/jquery/jquery.js",
    "src/inject/inject.js"
    ]
}
```