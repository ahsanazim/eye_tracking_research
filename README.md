## Architecture:

### Main components:

* Chrome Extension (i.e. client)
* Content Extraction API Server
* Local Websocket Server
* Talon (software) wrapper on Tobii hardware
* Tobii 4C Eye Tracking Hardware

### Chrome Extension (client)

Located in the current repo, specifically in the `./extension` subdirectory. 

Chrome Extension that can be activated on any web page to provide an eye-tracking powered reading-aid.

### Content Extraction API Server

Located in the following repo: [https://github.com/ahsanazim/eye_tracking_research_server](https://github.com/ahsanazim/eye_tracking_research_server) 

Extracts content from provided URL. Client POST's a URL to the server, server responds with content extracted from said URL. Deployed to Heroku.

### Local Websocket Server

Located in the following repo: [https://github.com/ahsanazim/eye_tracking_research_tobii_server](https://github.com/ahsanazim/eye_tracking_research_tobii_server)

Communicates with Talon software to send gaze coordinate data onward continuously to chrome extension client.

### Talon (software) wrapper on Tobii hardware

Not deployed, has to be dowloaded from [https://talonvoice.com/](https://talonvoice.com/)

We add a few lines of code to one of the default log-file generating python files. This code is not deployed.

Talon software is necessary because Tobii does not work with Mac systems out of the box. The company's focus is currently on the PC market. This third-party alternative is, to my knowledge, currently the best way to use Tobii hardware with Mac systems.


### Tobii 4C Eye Tracking Hardware

Hardware can be purchased from: [https://gaming.tobii.com/product/tobii-eye-tracker-4c/](https://gaming.tobii.com/product/tobii-eye-tracker-4c/)

## Directory Contents:

Primary:

* `./extension` - chrome extension, i.e. the client. Currently the primary client.

Secondary:

* `./client` - local equivalent of the chrome extension client functionality. Works on pre-set web page contents.
* `./server` - local equivalent of the deployed Content Extraction API server
* other files self-explanatory

## Running:

### PRIMARY


* get local websocket server started
    * `cd  ~/Developer/eye_tracking_tobii_server`
    * `python server.py`
* go to `chrome://extensions` and reload the extension by clicking *Load Unpacked*, and selecting/opening the `extension` folder.
* go to any web page (examples below) and switch the extension on by clicking the relevant icon and 

#### Example web pages

* [http://www.wired.com/2012/07/ff_stevejobs/](http://www.wired.com/2012/07/ff_stevejobs/)
* [https://www.newyorker.com/magazine/2018/10/15/damien-chazelles-moon-shot-in-first-man](https://www.newyorker.com/magazine/2018/10/15/damien-chazelles-moon-shot-in-first-man)

#### Alternates

There are a few alternate permutations for the architecture. These are *not* guaranteed to be up to date:

* local content extraction server + local client
* local content extraction server + chrome extension

Local server:

* `cd ./server` and run `python api.py`

Local client:

* `cd ./client` and run `python -m http.server`
* go to `http://localhost:8000` in browser

