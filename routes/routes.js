const appRouter = (app, fs) => {
  // variables
  const dataPath = './json-data/campaign.json';

  // READ
  app.get('/campaigns', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });
  app.post('/campaign', (req, res) => {
    let newCamp = req.body;
    console.log(newCamp);
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      let JSONData = JSON.parse(data);
      JSONData.push(newCamp);
      fs.writeFile(dataPath, JSON.stringify(JSONData), function (err) {
        if (err) throw err;
        res.send(JSONData);
      });
    });
  });
  app.delete('/campaign/:id', (req, res) => {
    let newCamp = req.params.id;
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      let JSONData = JSON.parse(data);
      JSONData = JSONData.filter(item=>{
        return item.campaignID !== newCamp;
      })
      fs.writeFile(dataPath, JSON.stringify(JSONData), function (err) {
        if (err) throw err;
        res.send(JSONData);
      });
    });
  });
  app.put('/campaign', (req, res) => {
    let newCamp = req.body;
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      let JSONData = JSON.parse(data);
      if(JSONData.find(item=>item.campaignID == newCamp.campaignID)){
        JSONData = JSONData.map(item=>{
          return item.campaignID === newCamp.campaignID?newCamp:item;
        })
      }else{
        JSONData.push(newCamp);
      }
      fs.writeFile(dataPath, JSON.stringify(JSONData), function (err) {
        if (err) throw err;
        res.send(JSONData);
      });
    });
  });
};

module.exports = appRouter;