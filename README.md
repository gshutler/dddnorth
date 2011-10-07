# DDD North - Introduction to Backbone.js

## Running the application

 1. Clone the repository
 
 2. [Install Ruby](http://www.ruby-lang.org/en/downloads/)
 
     * I wrote it against 1.9.2 but it may work against 1.8.7, I've not used 
       anything new
       
 3. [Install bundler](http://gembundler.com/)
 
 4. `bundle install`
 
 5. `ruby server.rb`
 
 6. Go to [http://localhost:4567/](http://localhost:4567/) in your browser
 
     * I only tested the application in Chrome so it might not work in other 
       browsers at all, patches gratefully received

Be aware that this is a demonstration application so it's running against an
in-memory database of sorts (an array) and you will lose any data you put into
it when you stop the server.

## Frameworks

### Backbone.js

[Backbone](http://documentcloud.github.com/backbone/) supplies structure to JavaScript-heavy applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing application over a RESTful JSON interface.

### Underscore.js

[Underscore](http://documentcloud.github.com/underscore/) is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), but without extending any of the built-in JavaScript objects. It's the tie to go along with jQuery's tux.

### jQuery

[jQuery](http://jquery.com/) is a fast and concise JavaScript Library that simplifies HTML document traversing, event handling, animating, and Ajax interactions for rapid web development.

### ICanHaz.js

[ICanHaz](http://icanhazjs.com/) is a simple & powerful client-side templating for jQuery or Zepto.js leveraging [mustache](http://mustache.github.com/).