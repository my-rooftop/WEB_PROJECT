var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    return list;
}


function templateHTML_home(title, list, body, create){
    return `
    <!doctype html>
    <html>
        <head><!--본문 설명-->
            <title>Jeaho's first Web page!!!</title>
            <meta charset="utf-8"> <!-- 여기는 본문에 대해서 설명하는 부분 / 아래는 내용-->
        </head>
        
        
        <body><!--본문-->
            <h1><a href = /?id=home>JeaHo's blog</a></h1><!--강조-->  

            My friends, 구규승.
            <br>
            ${create}
            <ul><!--목록구분 unordered-->
                ${list}
            </ul>
            ${body}


            <!--<img src="data/group_photo.png" width="50%">
            <img src="data/group_photo2.png" width="50%">-->
            <br>
            <strong>제 친구들을 소개합니다!</strong><br>

        
        
            <!--paragraph / 단락-->
            <img src="pictures/hoyane.png" width="50%"></p>
            <!-- <p style="margin-top:45px;">
            </p> -->
        </body>
    </html>
    `;
}

function templateHTML_friend(title, list, body, create){
    return `
    <!doctype html>
    <html>
        <head><!--본문 설명-->
            <title>Jeaho's first Web page!!!</title>
            <meta charset="utf-8"> <!-- 여기는 본문에 대해서 설명하는 부분 / 아래는 내용-->
        </head>
        
        
        <body><!--본문-->
            <h1><a href = /?id=home>JeaHo's blog</a></h1><!--강조-->  

            <ul><!--목록구분 unordered-->
                ${list}
            </ul>
            ${body}
        
            <p>
            ${create}
            </p>
        
        
            <!--paragraph / 단락-->
            <img src="pictures/hoyane.png" width="50%"></p>
            <!-- <p style="margin-top:45px;">
            </p> -->
        </body>
    </html>
    `;
}




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
                var list = templateList(filelist);
                var template = templateHTML_home(title, list, `<h2>${title}</h2>${description}`, `<strong><a href="/create_friend">친구추가</a></strong>`);
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir(`./data`, 'utf8', function(err, filelist){
                var title = queryData.id;
                var list = templateList(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    var template = templateHTML_friend(title, list, `<h2>${title}</h2>${description}`, `<strong><a href="/create_guestbook">방명록남기기</a></strong> <strong><a href="/update?id=${title}">소개수정하기</a></strong> 
                    <form action="delete_process" method = "post" > 
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>`);
                    response.writeHead(200);
                    response.end(template);
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
              var list = templateList(filelist);
              var template = templateHTML_friend(name, list,
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
              response.end(template);
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
            var list = templateList(filelist);
            var template = templateHTML_home(title, list, `
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
            response.end(template);
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