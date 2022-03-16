const chai = require("chai");
const chaiHttp = require("chai-http");
const { it } = require("mocha");
const nock = require("nock");
const app = require("./index");

chai.use(chaiHttp);

describe("candidate", () => {
  let candidateName = "Hillary";
  let election_year = 2020;

  const candidateNameVerificationOne = {
    data: {
      candidate_names: [
        {
          CandidateName: "Hillary Clinton",
          CandidateMaplightID: 4545,
          CandidateLabel: "Hillary Clinton (D, President)",
        },
        {
          CandidateName: "Hillary Scholten",
          CandidateMaplightID: 48184,
          CandidateLabel: "Hillary Scholten (D)",
        },
      ],
    },
  };

  const candidateNameVerificationTwo = {
    data: {
      candidate_names: [
        {
          CandidateName: "Joseph Biden",
          CandidateMaplightID: 4533,
          CandidateLabel: "Joseph Biden (D, President)",
        },
        {
          CandidateName: "Patrick Joseph Toomey",
          CandidateMaplightID: 7544,
          CandidateLabel: "Patrick Joseph Toomey (R, PA)",
        },
      ],
    },
  };

  const contributionsOne = {
    data: {
      aggregate_totals: [
        {
          total_amount: -1000,
          contributions: 1,
        },
      ],
      rows: [
        {
          ElectionCycle: 2020,
          TransactionDate: "2020-08-31",
          TransactionAmount: -1000,
          DonorName: "IUPAT DISTRICT COUNCIL 82 PAC",
          DonorOrganization: "IUPAT DISTRICT COUNCIL 82 PAC",
          CandidateName: "Hillary Clinton",
          CandidateMaplightID: 4545,
          CandidateFECID: "P00003392",
        },
      ],
    },
  };

  const contributionsTwo = {
    data: {
      aggregate_totals: [
        {
          total_amount: 0,
          contributions: 0,
        },
      ],
      rows: [],
    },
  };

  const mock = nock("https://api.maplight.org/maplight-api/fec")
    .persist()
    .get("/candidate_names/Hillary")
    .thrice()
    .reply(200, candidateNameVerificationOne)
    .get("/contributions?candidate_name=Hillary Clinton&election_cycle=2020")
    .thrice()
    .reply(200, contributionsOne)
    .persist()
    .get(`/candidate_names/Biden`)
    .thrice()
    .reply(200, candidateNameVerificationTwo)
    .get(`/contributions?candidate_name=Joseph Biden&election_cycle=2020`)
    .thrice()
    .reply(200, contributionsTwo);

  var expect = chai.expect;

  it("get the data aggregation for a candidate", (done) => {
    chai
      .request(app)
      .get(`/candidate/${candidateName}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.maplight_aggregation).to.have.property("average", 1000);
        expect(res.body.maplight_aggregation).to.have.property(
          "total_amount",
          1000
        );
        expect(res.body.maplight_aggregation).to.have.property(
          "contributions",
          1
        );
        expect(res.body.aggregated_data).to.have.property("min", 1000);
        expect(res.body.aggregated_data).to.have.property("max", 1000);
        expect(res.body.aggregated_data).to.have.property("total", 1000);
        expect(res.body.aggregated_data).to.have.property("average", 1000);
        expect(res.body.aggregated_data).to.have.property("contributions", 1);
        done();
      });
  });

  it("empty contributions data", (done) => {
    Name = "Biden";
    election_year = 2018;

    chai
      .request(app)
      .get(`/candidate/${Name}`)
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });

  it("No candidate Name is provided", (done) => {
    Name = "";
    election_year = 2020;

    chai
      .request(app)
      .get(`/candidate/${Name}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'Invalid request, No candidate name was provided');
        done();
      });
  });
});
