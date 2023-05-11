# Zoover FullStack assessment

## Requirements

This is an assignment that requires setting up a database and import data, create a REST api server and creating a good web UI visual performing a set of mathematical calculations and a web UI for visualization. A ready server that returns a collection of reviews for one single accommodation is provided and this acco page needs to be implemented.

2 JSON files that contain a collection of accommodations and reviews are provided. It is expected that the calculations be performed on the server side using Node.js.

Use those reviews to perform the following tasks:

1. Create a data import tool
A set of JSON files is provided, containing:
- List of accommodations [accommodations.json]
- List of reviews related to accommodations [reviews.json]
Write a program in any language you prefer to import the JSON data inside an instance of
PostgreSQL database, defining the data structure as you prefer.
We recommend using this docker image for quick setup of the database:
https://hub.docker.com/_/postgres

2. Data service
Write a python web service exposing RESTful API for allowing data read from the
PostgreSQL database. Required operations are:
- List all of accommodations
- Get single accommodation
- List all reviews for an accommodation
- Get a single review for an accommodation

3. Calculations : Fix the `/:accommodationId` route to load reviews for the selected accommodation in `server/routes/reviews.js`. Fix the missing `getReviewWeight` function in `_util.js` to do the required job in the server folder (don't worry it is just a JavaScript function). Each review has to have a weight value in the calculations. The weight value can be calculated as follows: when the review is older than 5 years its weight value defaults to 0.5. Otherwise it equals: 1 - (current_year - year_of_review)\*0.1

Keep in mind that each review has to have a weight value in the calculations.
The weight value can be calculated as follows:
when the review is older than 5 years its weight value defaults to 0.5. Otherwise it equals: 1 - (current_year - year_of_review)\*0.1

4. Build a UI to visualize the calculated rating values of the accommodation along with the list of reviews. It is up to you to choose how to serve reviews from the server; the choice will influence the assessment though. The following functionality is required:

   - filter by traveledWith value.
   - sort by travel date or review submission date.
   - (Nice to implement) implement a pagination functionality.

## How to use

- Just run `yarn install` in the root folder will install all dependencies for the client and the server as it is a monorepo
- Then run `yarn start`, which will run the client and the server parallel using lerna
- Client should be available at http://localhost:3000 and server for checking the end points should be at http://localhost:8080
- There are 2 endpoint that you can use from the server
  - `/reviews/:accommodationId` which should get all the reviews for the selected accommodation id
  - `/reviews/average/:accommodationId` which get the average calculations that you are going to implement

## General Note

We expect UI design to be responsive, it's nice to have code in TypeScript if possible (not a must), use React function components instead of classes, and Hooks whenever useful, show your code quality.

Here is an [inspiration design](inspiration-design.png) for you, but feel free to make it as you want, the most important thing is to have a good visual for the data

Solution can be uploaded to a github/bitbucket repository, providing a README file
documenting how to run it.

The solution should be production ready (scalable, clean code, etc….) or near production ready, also it will be appreciated if you can use some advanced language features like decorations in Python.
