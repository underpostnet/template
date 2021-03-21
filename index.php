<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>underpost.net</title>
  <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
  <meta name='viewport' content='width=device-width, user-scalable=no' />
  <link rel='icon' href='/cloud/favicon.ico' type='image/x-icon' />
  <script>
  <?php

  $path = 'c:/dd/deploy_area/client';

  echo file_get_contents($path.'/vanilla.js');
  echo file_get_contents($path.'/util.js');

  ?>
  </script>

  <style>
  <?php

  echo file_get_contents($path.'/style/underpost.css');

  ?>
  </style>

</head>
<body>
  <script type="text/javascript">

  ((()=>{

    console.log('home init');

    append('body', `

    hola mundo

    `);

    function rr(){

      if( (data.lastW!=s('body').clientWidth) || (data.lastH!=s('body').clientHeight) ){

        data.lastW=s('body').clientWidth;
        data.lastH=s('body').clientHeight;

        if(data.lastW>500){

          data.movil = false;

        }else{

          data.movil = true;

        }

        console.log('movil -> '+data.movil);

        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------



        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------

      }

    }

    var data = {

      movil: false,
      lastH: null,
      lastW: null

    };
    rr();
    setInterval(function(e){
      rr();
    }, 100);

  })());

  </script>

</body>

</html>
