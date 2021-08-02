var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');


var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log("path",pathname);
    // console.log("queryData.id", queryData.id);

    if(pathname === '/'){
        if(queryData.id === undefined || queryData.id === 'home' ){
            fs.readdir(`./data`, 'utf8', function(err, filelist){
                var title = 'Welcome';
                var description = 'Hello, Welcome to my web page ^-^';
                var list = template.List(filelist);
                var html = template.HTML_home(title, list, `<h2>${title}</h2>${description}`, `<strong><a href="/create_friend">친구추가</a></strong>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir(`./data`, 'utf8', function(err, filelist){
                var title = queryData.id;
                var list = template.List(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    var html = template.HTML_friend(title, list, `<h2>${title}</h2>${description}`, `<strong><a href="/create_guestbook">방명록남기기</a></strong> <strong><a href="/update?id=${title}">소개수정하기</a></strong> 
                    <form action="delete_process" method = "post" > 
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }else if(pathname ==='/delete_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(){
                response.writeHead(302, {Location : `/`});
                response.end();
            });
        });
    }else if(pathname === '/update'){
        fs.readdir('./data', function(error, filelist){
            fs.readFile(`./data/${queryData.id}`, 'utf8', function(err, introduce){
              var name = queryData.id;
              var list = template.List(filelist);
              var html = template.HTML_friend(name, list,
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${name}">
                  <p><input type="text" name="name" placeholder="name" value="${name}"></p>
                  <p>
                    <textarea name="introduce" placeholder="introduce">${introduce}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                ``
              );
              response.writeHead(200);
              response.end(html);
            });
          });
    } else if(pathname ==='/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var name = post.name;
            var introduce = post.introduce;
            fs.rename(`data/${id}`, `data/${name}`, function(error){
                fs.writeFile(`data/${name}`, introduce, 'utf8', function(err){
                  response.writeHead(302, {Location: `/?id=${name}`});
                  response.end();
                })
              });
        });
    } else if(pathname === '/create_friend'){
        fs.readdir('./data', function(error, filelist){
            var title = 'WEB - create';
            var list = template.List(filelist);
            var html = template.HTML_home(title, list, `
                <form action ="http://localhost:3000/create_friend_process" method="post">
                    친구의 이름과 소개글을 작성해주세요.
                    <p><input type="text" name = "name" placeholder="name"></p>
                    <p>
                        <textarea name="introduce" placeholder="introduce"></textarea>
                    </p> 
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `, ``);
            response.writeHead(200);
            response.end(html);
        });
    } else if( pathname === '/create_friend_process') {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var name = post.name;
            var introduce = post.introduce ;
            
            fs.writeFile(`./data/${name}`, introduce, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${name}`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }

});

app.listen(3000);