# Restaurant Reviews Website Project

This is a project for Udacity's Front-End Development program.  It demonstrates responsive layout, accessibility, and asynchronous Javascript with a service worker.

## Dependencies

*   ./css/styles.css
*   ./data/restaurants.json
*   ./img/*.jpg
*   ./js/dbhelper.js
*   ./js/main.js
*   ./js/restaurant-info.js
*   ./js/sworkercontrol.js
*   ./index.html
*   ./restaurant.html
*   ./sw.js


## To serve the webpages (verbatim from rubric)

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
3. Explore the provided code, and start making a plan to implement the required features in three areas: responsive design, accessibility and offline use.
4. Write code to implement the updates to get this site on its way to being a mobile-ready website.

##  Notes

As it is a requirement of the project, I've made virtually everything focusable via "tabindex='0'".  This is confusing to me, since the course material clearly states that adding focus to every element is undesirable.  It's stated in the section on using screen readers properly -- Lesson 4, "Navigating Content" of Section 3 of this course -- which I had to watch multiple times as I tried to figure out how to use the keyboard with ChromeVox.

My service worker wasn't caching properly in the previous 2 submissions.  I believe I've found the bugs and fixed them.



