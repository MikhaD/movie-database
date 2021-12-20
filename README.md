# movie-database
A tool to help me build and maintain my database of movies & series I have seen and want to see. 

Using web scraping to avoid api rate limiting - Will probably switch to a solution that uses the api at some point so that I can make a web front end for it using svelte

# To Do
- [ ] See if I can make api calls from the client side without cors issues (might need to see the webdevsimplified vid again)
- [ ] Add ability to process a text file of names asynchrenously
- [ ] Maybe figure out how to make my first client-server app, with the web scraping on the server
- [ ] Ask for user input about unsure items in a manner that doesn't block the fetching of subsequent items
- [ ] Queue queries to the user
- [ ] At the end sort the entries by name and write them to a json file
- [ ] Add a filter for not movie (as there is no universal movie filter like there is for series)
- [ ] make code more modular & testable? (This is for myself, so I dont need testing as rigorous as my action)