const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.maplight.org/maplight-api/fec",
  withCredentials: false,
});

exports.calculateAggregation = async (req, res, next) => {
  try {
    const election_year = req.query.election_year || 2020;
    let candidateName = req.params.candidateName;

    const candidateNameVerification = await api.get(
      `/candidate_names/${candidateName}`
    );

    if (candidateNameVerification.data.data.candidate_names.length == 0) {
      throw new Error("No candidate with such name");
    }

    candidateName =
      candidateNameVerification.data.data.candidate_names[0].CandidateName;

    const apiResponse = await api.get(
      `/contributions?candidate_name=${candidateName}&election_cycle=${election_year}`
    );

    if (apiResponse.data.data.rows.length == 0) {
      return res.status(204).json({
        status: "No Content",
        message: "No data is available for the candidate",
      });
    }

    const maplightData = apiResponse.data.data.aggregate_totals[0];
    maplightData.average = Number(
      ((maplightData.total_amount * -1) / maplightData.contributions).toFixed(2)
    );
    maplightData.total_amount = maplightData.total_amount * -1;

    let total, min, max, average;
    total = max = 0;
    min = apiResponse.data.data.rows[0].TransactionAmount * -1;

    for (elem of apiResponse.data.data.rows) {
      let amount = elem.TransactionAmount * -1;
      total += amount;
      min = min < amount ? min : amount;
      max = max > amount ? max : amount;
    }

    average = Number((total / apiResponse.data.data.rows.length).toFixed(2));

    const aggregatedData = {
      min,
      max,
      average,
      total,
    };

    res.status(200).json({
      status: 200,
      search_term: {
        candidate_name: candidateName,
        election_cycle: election_year,
      },
      maplight_aggregation: maplightData,
      aggregated_data: aggregatedData,
    });
  } catch (err) {
    res.status(404).json({
      status: "Error",
      message: err.message,
    });
  }
};
