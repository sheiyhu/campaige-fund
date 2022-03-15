const chai = require("chai");
const chaiHttp = require("chai-http");
const { it } = require("mocha");
const nock = require("nock");
const app = require("./index");

chai.use(chaiHttp);

describe("candidate", () => {
  const candidateName = "Hillary Clinton";
  const election_year = 2020;
  const candidateNameVerification = {
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
        {
          CandidateName: "Robert Clinton Smith",
          CandidateMaplightID: 12450,
          CandidateLabel: "Robert Clinton Smith (R, NH)",
        },
        {
          CandidateName: "Hillary O'connor Mueri",
          CandidateMaplightID: 48948,
          CandidateLabel: "Hillary O'connor Mueri (D)",
        },
      ],
    },
  };

  const contributions = {
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

  nock("https://api.maplight.org/maplight-api/fec")
    .get(`/candidate_names/${candidateName}`)
    .reply(200, candidateNameVerification)
    .get(
      `/contributions?candidate_name=${candidateName}&election_cycle=${election_year}`
    )
    .reply(200, contributions);

  var expect = chai.expect;

  it("get the data aggregation for a candidate", (done) => {
    chai
      .request(app)
      .get(`/candidate/${candidateName}`)
      .end((err, res) => {
        console.log(res)
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("min");
        expect(res.body).to.have.property("max");
        expect(res.body).to.have.property("average");
        expect(res.body).to.have.property("total");
        done();
      });
  });
});
