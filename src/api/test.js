app.post('/test', (req, res) => {
  console.log('post request -> /test');
  var_dump(req.body);
  let response = {content: ['API Post Response','API Respuesta Post']};
  res.send(JSON.stringify(response));
  res.end();
});
