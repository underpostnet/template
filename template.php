<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title> simple template - underpost.net </title>
  <link rel='icon' type='image/png' href='https://underpost.net/assets/underpost.png' />
  <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
  <meta name='viewport' content='width=device-width, user-scalable=no' />
  <script>
  <?php $path = 'c:/dd/deploy_area/client';
  echo file_get_contents($path.'/vanilla.js');
  echo file_get_contents($path.'/util.js'); ?>
  </script>
  <style><?php echo file_get_contents($path.'/style/simple.css'); ?></style>
</head>
<body>
  <script>
  ((()=>{ MAIN = {
    param: {
      callback: 1000,
      movil: 500
    },
    var: {
      lang: lang()=='en' ? 0 : 1,
      dir: 'ltr',
      w: null
    },
    init: ()=>{
      s('html').lang = lang();
      s('html').dir = MAIN.var.dir;
      console.log('init template system lang -> '+MAIN.var.lang);
      MAIN.render.init();
      MAIN.rr();
    },
    render: {
      init: ()=>{
        append('body', `

        `+[`Hello <a href='' >World</a>`,`Hola <a href='' >Mundo</a>`][MAIN.var.lang]+`

        `);
      }
    },
    rr: async ()=>{
      if(MAIN.var.w!=window.innerWidth){
        MAIN.var.w=window.innerWidth;
        if(MAIN.var.w>MAIN.param.movil){
          console.log('render -> resize desktop -> '+MAIN.var.w);
        }else{
          console.log('render -> resize movil -> '+MAIN.var.w);
        }
      }
      console.log('callback');
      await timer(MAIN.param.callback);
      MAIN.rr();
    }
  };MAIN.init();
})());
</script>
</body>
</html>
