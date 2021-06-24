const header = {
  loader: async () =>{
    header.init.renderCss();
    header.init.renderHtml();
    header.init.onEvent();
  },
  init: {
    renderHtml: async ()=>{
      append('body', `
            <main class='abs center'>
                  <div class='abs center txt'>
                        <img src='/img/favicon.ico'>
                        `+spr('<br>', 2)+`
                        `+[`Hello <a href='' >World</a>`,`Hola <a href='' >Mundo</a>`][data.const.lang]+`
                  </div>
            </main>
      `);
      s('main').style.border = '2px solid white';
    },
    renderCss: async ()=>{

      let style_txt = `
      <style>
        h1, h2 {
          display: none;
        }
        .txt:hover {
          color: red;
        }
        main {
          font-family: 'retro-font'
        }
      </style>
      `;
      append('body', style_txt);
    },
    onEvent: async ()=>{
      s('main').onclick = ()=>{
        alert(header.service.getMainContent());
      }
    }
  },
  service: {
    getMainContent: ()=>{
      return s('main').innerHTML
    }
  },
  render: async () =>{
    s('body').style.width = data.var.w+'px';
    s('body').style.height = data.var.h+'px';
    if(data.var.h>data.var.w){
      s('main').style.height = data.var.w*0.95+'px';
      s('main').style.width = data.var.w*0.95+'px';
    }else{
      s('main').style.height = data.var.h*0.95+'px';
      s('main').style.width = data.var.h*0.95+'px';
    }
  }
}
