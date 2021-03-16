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

  body {

    text-align: center;

  }

  .test {

    background: red;
    padding: 50px;

  }

  </style>

</head>
<body>
  <script type="text/javascript">

  ((()=>{

    console.log('home init');

    append('body', `

    <br>

    <div class='inl test'>

      test

    </div>

    <div class='inl test'>

      test

    </div>

    <br>

    <div class='inl test'>

      test

    </div>

    <div class='inl test'>

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


    async function loop(time){
    	let loop_index = 0;
    	while(true){
    		await timer(time);
    		console.log(loop_index);
    		loop_index++;
    	}
    }
    loop(1000);



    append('body', spr('<br>...', 10));

    append('body', renderMedia({
      tag: 'video',
      source: true,
  		controls: 'controls',
      download: true,
  		autoplay: '',
  		muted: '',
  		loop: '',
  		class: 'in',
      src_poster: 'https://www.nexodev.org/assets/social.jpg',
  		src: 'http://techslides.com/demos/sample-videos/small.mp4',
      style: `

      width: 400px;
      height: 300px;
      margin: auto;

      `
  	}));

    append('body', renderMedia({
      tag: 'audio',
      source: true,
  		controls: 'controls',
      download: false,
  		autoplay: '',
  		muted: '',
  		loop: 'loop',
  		class: 'in',
      src_poster: '',
  		src: 'https://www.cyberiaonline.com/Paradelous_New_Tech.mp3',
      style: `

      width: 250px;
      margin: auto;

      `
  	}));

    append('body', renderYouTube({
      url: 'https://www.youtube.com/watch?v=jgHfPgcFsOM&list=RD_NGdzZfJi-4&index=4',
      autoplay: '1',
      w: '300px',
      h: '200px',
      class: 'in',
      style: 'margin: auto;'
    }));

    append('body', spr('<br>...', 10));



  })());

  </script>

</body>

</html>
