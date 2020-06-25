# MyNextTrip

An application used to find flight tickets when you know the day of the week for the departure, the duration of the trip and the period for the search, built with Angular 8, Typescript, Bootstrap, CSS and Skyscanner Api.

Backend at https://github.com/MaiaraB/travel-plan

This site is published at https://maiarab.github.io/my-next-trip/

## Installation and Setup Instructions

Clone down this repository. You will need node and npm installed globally on your machine.

Installation:

`npm install`

To Start Server:

`npm start`

To Visit App:

`localhost:4200/flight-search`

## Reflections

This was a two months long personal project. Project goal was using Angular with Typescript, mainly familiarizing myself with consuming APIs using the recently learned framework.

Originally I wanted to build an application to help me find the best weekend to travel to a certain location. I started this process by researching for a free and easy to use flights API that would give me the flight details and fares. Skyscanner API ended up being the best fit and it's available through RapidAPI `https://rapidapi.com/skyscanner/api/skyscanner-flight-search/`. I didn't want to necessarily go through with the booking part, but since the API provides the booking link with the fares, I added it as well. 

I created the project using the angular-cli `ng new` boilerplate to minimize initial setup. Along the process I decided to allow a more broad search in which you can choose the day of the week that you want to leave, how many days you want to spend there and the period for the search (3 months tops). 

One of the main challenges I ran into was figuring out how to process the chunked responses coming from the API requests, since the more broad search made the requests take longer to process and I didn't want to wait for all the search results to be be ready to start showing some flights to the user. At first, my plan was to use Angular HttpClient (as I used to make requests to other API entry points) with the reportProgress option, but the text returned by the HttpDownloadProgressEvent.partialText is always concatenated with previous chunks making it less optimal having to deal with a response of already received text for each chunk that arrives. I then tried using XMLHtttpRequest which worked, but then I decided on using fetch to make it more elegant. I also took some time to learn more about fetch and [promises](https://developers.google.com/web/fundamentals/primers/promises#whats-all-the-fuss-about) in javascript.



