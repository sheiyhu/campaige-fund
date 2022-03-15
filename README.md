# campaige-fund

## Installation

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command]

```console
$ npm install
```

### Running The App

To run the app, first install the dependencies, then run `npm run dev`:

```console
$ npm install
$ npm run dev
```

### Running Tests

To run the test suite, first install the dependencies, then run `npm test`:

Make sure the port 3000 is free.

```console
$ npm install
$ npm test
```

### Using The Api

To use the api, first install the dependencies, then run `npm run dev` .
The app will be serve on localhost with port 3000.

# Gettting Data aggregration of A Candidate

Use http://localhost:3000/candidate/candidateName ---- It will return the data aggregation for the candidate using 2020 election year.

# Gettting Data aggregration of A Candidate For A Particular Election Year

Use http://localhost:3000/candidate/candidateName?election_year=[year] ---- It will return the data aggregation for the candidate for that election year. The year available is between 2008 and 2020 inclusive.
