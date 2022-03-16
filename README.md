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

### Gettting Data Aggregration of A Candidate

Use http://localhost:3000/candidate/candidateName   ---- It will return the data aggregation for the candidate using 2020 election year.

#### Example 

http://localhost:3000/candidate/Donald Trump    -----   The response will be a status code of 200 with the following body
```
{
    "status": "Success",
    "search_term": {
        "candidate_name": "Donald Trump",
        "election_cycle": 2020
    },
    "maplight_aggregation": {
        "total_amount": 584758663.91,
        "contributions": 1716011,
        "average": 340.77
    },
    "aggregated_data": {
        "min": 1,
        "max": 5000,
        "average": 547.6,
        "total": 27380,
        "contributions": 50
    }
}
```

### Gettting Data Aggregration of A Candidate For A Particular Election Year

Use http://localhost:3000/candidate/candidateName?election_year=[year]    ---- It will return the data aggregation for the candidate for that election year. The year available is between 2008 and 2020 inclusive.

#### Example 
http://localhost:3000/candidate/Donald Trump?election_year=2018    ------  The reponse will be a status code of 200 with the following body
````
{
    "status": "Success",
    "search_term": {
        "candidate_name": "Donald Trump",
        "election_cycle": "2018"
    },
    "maplight_aggregation": {
        "total_amount": 39184212.41,
        "contributions": 152203,
        "average": 257.45
    },
    "aggregated_data": {
        "min": 10,
        "max": 5098484.76,
        "average": 102117.86,
        "total": 5105892.76,
        "contributions": 50
    }
}
````

### For Edge Cases

#### A Candidate with No Data For an election year
example -----   http://localhost:3000/candidate/Joseph Biden?election_year=2018   ------ The response will be a status code of 204 with no content in the body

#### When No Candidate Name is Provided
example ------ http://localhost:3000/candidate      --------  The response will be a status code of 404 with the following body
```
{
    "status": "Error",
    "message": "Invalid request, No candidate name was provided"
}
```


