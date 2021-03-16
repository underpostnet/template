<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>underpost.net</title>
  <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
  <meta name='viewport' content='width=device-width, user-scalable=no' />
  <link rel='icon' href='/cloud/template/favicon.ico' type='image/x-icon' />
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


  .border {
      height: 100px;
      width: 100px;
      background: linear-gradient(90deg, blue 50%, transparent 50%),
                  linear-gradient(90deg, blue 50%, transparent 50%),
                  linear-gradient(0deg, blue 50%, transparent 50%),
                  linear-gradient(0deg, blue 50%, transparent 50%);
      background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
      background-size: 16px 4px, 16px 4px, 4px 16px, 4px 16px;
      background-position: 0% 0%, 100% 100%, 0% 100%, 100% 0px;
      border-radius: 5px;
      padding: 10px;
      animation: dash 5s linear infinite;
  }

  @keyframes dash {
      to {
          background-position: 100% 0%, 0% 100%, 0% 0%, 100% 100%;
      }
  }


  </style>

</head>
<body>
  <script type="text/javascript">

  ((()=>{

    console.log('home init');

    append('body', `

    <div class='border'>

    test

    </div>



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
