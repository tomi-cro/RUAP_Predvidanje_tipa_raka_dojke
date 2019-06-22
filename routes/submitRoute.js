const express = require('express');
let request = require('request-promise');
const db = require("../util/database");
var fs = require('fs');

const router = express.Router();

router.post('/check-result', (req, res, next) => {
  const uri = "https://ussouthcentral.services.azureml.net/workspaces/0d13096a09cb4f70b3d8fbbf23dccca9/services/ac05acfa876445cfb09564cc4ff0cddc/execute?api-version=2.0&details=true";
  const apiKey = "U4YqnMILJcihAxlwyRKDdvKyotitMVfgw4Cb9NG+Za/zaSairaZansC01tKIlL0SpwUFMzfX9ecT6e7ddgoBsw==";
  console.log(req.body);
  let data = {
    "Inputs": {
      "input1": {
        "ColumnNames": [
          "id",
          "clumpThickness",
          "uniformityCellSize",
          "uniformityCellShape",
          "marginalAdhesion",
          "singleEpithelialCellsize",
          "bareNuclei",
          "blandChromatin",
          "normalNucleoli",
          "mitoses",
          "class"
        ],
        "Values": [
          [
            "0",
            req.body.clumpThickness,
            req.body.uniformityCellSize,
            req.body.uniformityCellShape,
            req.body.marginalAdhesion,
            req.body.singleEpithelialCellsize,
            req.body.bareNuclei,
            req.body.blandChromatin,
            req.body.normalNucleoli,
            req.body.mitoses,
            "0",
          ]
        ]
      }
    },
    "GlobalParameters": {}
  }
  var responseData = [];
  const options = {
      uri: uri,
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(data),
  }
  request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        responseData = JSON.parse(body);
      } else {
          console.log("The request failed with status code: " + res.statusCode);
      }
  }).then(function printData () {
    console.log(responseData.Results.output1.value.Values);
    data = responseData.Results.output1.value.Values[0]
    const clumpThickness = data[0];
    const uniformityCellSize = data[1];
    const uniformityCellShape = data[2];
    const marginalAdhesion = data[3];
    const singleEpithelialCellsize = data[4];
    const bareNuclei = data[5];
    const blandChromatin = data[6];
    const normalNucleoli = data[7];
    const mitoses = data[8];
    const klasa = data[9];
    const scoredLabels = data[10];
    const scoredProbabilities = data[11];
    db.execute("INSERT INTO data VALUES ("
      + clumpThickness + ", "
      + uniformityCellSize + ", " 
      + uniformityCellShape + ", "
      + marginalAdhesion + ", "
      + singleEpithelialCellsize + ", "
      + bareNuclei + ", "
      + blandChromatin + ", "
      + normalNucleoli + ", "
      + mitoses + ", "
      + klasa + ", "
      + scoredLabels + ", " 
      + scoredProbabilities + ")"
    );
    db.execute(
      'SELECT * FROM data',
      function(err, results, fields) {
        var json = JSON.stringify(results);
        fs.writeFile('./public/data/data.json', json, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
    );
    res.render('main', {pageTitle: 'Home', prediction: scoredLabels, predictionPercent: scoredProbabilities*100 });
  });
});

module.exports = router;