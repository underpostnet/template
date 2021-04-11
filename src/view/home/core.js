((()=>{
  [[LIB]]
  un = {
    param: {
      charset: 'utf-8',
      title: 'template - underpost.net',
      background: 'black',
      color: 'white',
      a_color: 'yellow',
      font: {name:'retro-font',url:'http://dev.nexodev.org/static/font/PressStart2P.ttf'},
      favicon: {url:'https://underpost.net/assets/underpost.png',type:'image/png'},
      style: 'http://dev.nexodev.org/static/style/simple.css',
      view_style: 'http://dev.nexodev.org/static/style/home.css',
      callback: 1000,
      movil: 500,
      lang: lang()=='en' ? 0 : 1,
      dir: 'ltr',
      main: [[PARAM]]
    },
    var: {
      w: null,
      main: [[VAR]]
    },
    init: async ()=>{
      s('html').lang = lang();
      s('html').dir = un.param.dir;
      append('head', `<meta charset='`+un.param.charset+`'>`);
      s('title') ? htmls('title', un.param.title) :
      append('head', ('<title>'+un.param.title+'</title>'));
      if(!s('body')){console.log('set body');append('html','<body></body>')}
      append('head', `
      <link rel='icon' type='`+un.param.favicon.type+`' href='`+un.param.favicon.url+`' />
      <meta name ='theme-color' content = '`+un.param.background+`' />
      <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
      <meta name='viewport' content='width=device-width, user-scalable=no' />
      <link href='`+un.param.style+`' rel='stylesheet'>
      <link href='`+un.param.view_style+`' rel='stylesheet'>
      <style>
      @font-face {
        font-family: '`+un.param.font.name+`';
        src: URL('`+un.param.font.url+`') format('truetype');
      }
      body {
        font-family: '`+un.param.font.name+`';
        background: `+un.param.background+`;
        color: `+un.param.color+`;
      }
      a {
        color: `+un.param.a_color+`;
      }
      <style>
      `);
      console.log('init template system lang -> '+['en','es'][un.param.lang]);
      setTimeout(()=>{
        [[INIT]]
        un.rr();
      },0);
    },
    render: [[RENDER]],
    rr: async ()=>{
      if(un.var.w!=window.innerWidth){
        un.var.w=window.innerWidth;
        [[PLATFORM]]
      }
      console.log('callback');
      await timer(un.param.callback);
      un.rr();
    }
  };
  un.init();
})());
