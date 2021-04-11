var view = (url, view)=>{
  let data_view = {
    client: fs.readFileSync((path+'/view/'+view+'/core.js'), charset),
    plaform: fs.readFileSync((path+'/view/'+view+'/src/plaform.js'), charset),
    init: fs.readFileSync((path+'/view/'+view+'/src/init.js'), charset),
    param: fs.readFileSync((path+'/view/'+view+'/src/param.js'), charset),
    var: fs.readFileSync((path+'/view/'+view+'/src/var.js'), charset),
    render: fs.readFileSync((path+'/view/'+view+'/src/render.js'), charset)
  };
  data_view.client = data_view.client.replace('[[LIB]]',(util+vanillajs+ws_client));
  data_view.client = data_view.client.replace('[[PARAM]]',data_view.param);
  data_view.client = data_view.client.replace('[[VAR]]',data_view.var);
  data_view.client = data_view.client.replace('[[INIT]]',data_view.init);
  data_view.client = data_view.client.replace('[[RENDER]]',data_view.render);
  data_view.client = data_view.client.replace('[[PLATFORM]]',data_view.plaform);
  app.get(url, (req, res) => {
    // reduce
    res.send(reduce((`<script type='text/javascript'>`+data_view.client+`</script>`)));
    res.end();
  });
};
