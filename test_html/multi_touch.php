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



    allNotClick(null);


    s('body').style.textAlign = 'center';

    append('body', `

    <br><br>

    <div class='inl ta' style='padding: 20px; background: gray;'>
            A
    </div>

    `+spr(' ', 5)+`

    <div class='inl tb' style='padding: 20px; background: gray;'>
            B
    </div>

    `+spr(' ', 5)+`

    <div class='inl tc' style='padding: 20px; background: gray;'>
            C
    </div>

    `);









    function set_handlers(name) {
     // Install event handlers for the given element
     var el=s(name);

     el.ontouchstart = function(){
       // caso de uno solo
       el.style.background = 'yellow'
     };
     el.ontouchmove = function(){
       // 2 al mismo tiempo
       el.style.background = 'pink'
     };

     // 3 bugeo

     // Use same handler for touchcancel and touchend

     el.ontouchcancel = function(){
       el.style.background = 'orange'
     };
     el.ontouchend = function(){
       el.style.background = 'green'
     };

    }

    function init() {
     set_handlers('.ta');
     set_handlers('.tb');
     set_handlers('.tc');
    }

    init();











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
