# Introduction to Backbone.js

## DDD North

### Running the application

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