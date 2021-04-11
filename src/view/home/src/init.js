console.log('Init View -> Home');

append('body', `


<br>

<br>

<div class='in' style='text-align: center; font-size: 8px;'>

<div class='inl' style='font-size: 20px; padding: 10px'>

`+['Hello World', 'Hola Mundo'][un.param.lang]+`

</div>

<br>

<br>

<img class='in' style='margin: auto;' src='/static/img/underpost-social.jpg'>

<br>

<br>

<div class='inl api-test-button'>

API TEST

</div>

`+spr('<br>', 10)+`

<a target='_blank' href='https://underpost.net/'>Powered By <b>UNDER</b>post.net</a>

</div>

`);

s('.api-test-button').onclick = ()=>{
  postData('/test', { content: 'test' })
  .then(res => {
    alert(res.content[un.param.lang]); // JSON data parsed by `data.json()` call
  });
};
