((()=>{
  [[LIB]]
  un = {
    param: {
      charset: 'utf-8',
      title: 'template - underpost.net',
      background: 'black',
      color: 'white',
      font: 'https://underpost.net/fonts/retro/PressStart2P.ttf',
      favicon: 'https://underpost.net/assets/underpost.png',
      style: 'https://raw.githubusercontent.com/underpostnet/underpost-library/master/style/simple.css',
      callback: 1000,
      movil: 500,
      main: [[PARAM]]
    },
    var: {
      lang: lang()=='en' ? 0 : 1,
      dir: 'ltr',
      w: null,
      main: [[VAR]]
    },
    init: ()=>{
      s('html').lang = lang();
      s('html').dir = un.var.dir;
      append('head', `<meta charset="`+un.param.charset+`">`);
      s('title') ? htmls('title', un.params.title) :
      append('head', ('<title>'+un.params.title+'</title>'));
      append('head', `
      <link rel='icon' type='image/png' href='`+un.param.favicon+`' />
      <meta name ='theme-color' content = '`+un.param.background+`' />
      <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
      <meta name='viewport' content='width=device-width, user-scalable=no' />
      <link href='`+un.param.style+`' rel='stylesheet'>
      <style>
      @font-face {
        font-family: 'retro-font';
        src: URL('`+un.param.font+`') format('truetype');
      }
      <style>
      `);
      console.log('init template system lang -> '+['en','es'][un.var.lang]);
      [[INIT]]
      un.rr();
    },
    render: [[RENDER]],
    rr: async ()=>{
      if(un.var.w!=window.innerWidth){
        un.var.w=window.innerWidth;
        if(un.var.w>un.param.movil){
          console.log('render -> resize desktop -> '+un.var.w);
          [[DEKSTOP]]
        }else{
          console.log('render -> resize movil -> '+un.var.w);
          [[MOVIL]]
        }
      }
      console.log('callback');
      await timer(un.param.callback);
      un.rr();
    }
  };
  un.init();
})());
