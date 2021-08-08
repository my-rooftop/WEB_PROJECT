var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var mysql = require('mysql');

var DB = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'tatamo4532',
    database:'friends'
});
DB.connect();



var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log("path",pathname);
    // console.log("queryData.id", queryData.id);

    if(pathname === '/'){
        if(queryData.id === undefined || queryData.id === 'home' ){
            DB.query(`SELECT * FROM introduce`, function(error, introduces){
                if(error){
                    throw error;
                }
                var title = 'Welcome';
                var description = 'Hello, Welcome to my web page ^-^';
                var list = template.List(introduces);
                var html = template.HTML_home(title, 
                    list, 
                    `<h2>${title}</h2>${description}`, 
                    `<strong><a href="/create">추가하기</a></strong>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            DB.query(`SELECT * FROM introduce`, function(error, introduces){
                if(error){
                    throw error;
                }
                DB.query(`SELECT * FROM introduce WHERE id=?`, [queryData.id],function(error2, introduce){
                    if(error2){
                        throw error2;
                    }
                    DB.query(`SELECT * FROM guestbook WHERE name=?`, [introduce[0].name], function(error3, guestbooks){
                        console.log(introduce);
                        var name = introduce[0].name;
                        var description = introduce[0].description;
                        var list = template.List(introduces);
                        var list_guestbook = template.List_guestbook(guestbooks);
                        var html = template.HTML_friend(name, 
                            list, 
                            `<h2>${name}</h2>${description}`, 
                            `
                            <strong><a href="/create_guestbook?id=${queryData.id}">방명록남기기</a></strong>
                            <strong><a href="/update?id=${queryData.id}">소개수정하기</a></strong>
                            <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${queryData.id}">
                                <input type="submit" value="(주의)소개삭제하기">
                            </form>`, list_guestbook);
                        response.writeHead(200);
                        response.end(html);
                    });
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
            DB.query(`DELETE FROM introduce WHERE id = ?`, [post.id], function(error, result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    }else if(pathname === '/update'){
        DB.query(`SELECT * FROM introduce`, function(error, introduces){
            if(error){
                throw error;
            }
            DB.query(`SELECT * FROM introduce WHERE id = ?`, [queryData.id], function(error2, introduce){
                if(error2){
                    throw error2;
                }
                var title = 'Update friend information';
                var list = template.List(introduces);
                var html = template.HTML_friend(title, list,
                    `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${introduce[0].id}">
                    <p><input type="text" name="name" placeholder="name" value="${introduce[0].name}"></p>
                    <p><textarea name="description" placeholder="description">${introduce[0].description}</textarea></p>
                    <p><input type="submit"></p>
                    </form>`,
                    `<strong><a href="/create">추가하기</a></strong>`);
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
            DB.query(`UPDATE introduce SET name = ?, description = ?, author_id = 1 WHERE id = ?`,[post.name, post.description, post.id], function(error, result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/?id=${post.id}`});
                response.end();
            });
        });
    } else if(pathname === '/create'){
        DB.query(`SELECT * FROM introduce`, function(error, introduces){
            var title = 'Add friend';
            var list = template.List(introduces);
            var html = template.HTML_home(title, list,
                `<form action="/create_process" method="post">
                 <p><input type="text" name="name" placeholder="name"></p>
                 <p><textarea name="description" placeholder="description"></textarea></p>
                 <p><input type="submit"></p>
                 </form>`,
                 `<strong><a href="/create">추가하기</a></strong>`);
            response.writeHead(200);
            response.end(html);
        });
    } else if( pathname === '/create_process') {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            // console.log(post);
            DB.query(`INSERT INTO introduce (name, description, created, author_id) VALUES(?, ?, NOW(), ?)`,[post.name, post.description, 1], function(error, result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/?id=${result.insertId}`});
                response.end();
            });
        });
    } else if(pathname === '/create_guestbook') {
        DB.query(`SELECT * FROM introduce`, function(error, introduces){
            if(error){
                throw error;
            }
            DB.query(`SELECT * FROM introduce WHERE id = ?`, [queryData.id],function(error, introduce){
                if(error){
                    throw error;
                }
                DB.query(`SELECT * FROM guestbook`, function(error, guestbook){
                    if(error){
                        throw error;
                    }
                    var title = queryData.id;
                    var list = template.List(introduces);
                    var html = template.HTML_friend(title, list,
                        `<form action="/create_guestbook_process" method="post">
                        <input type="hidden" name="id" value="${introduce[0].id}">
                        <p><input type="text" name="title" placeholder="제목"></p>
                        <p><textarea name="description" placeholder="내용"></textarea></p>
                        <p><input type="submit"></p>
                        </form>`,
                        `방명록을 작성해주세요.`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        });
    } else if(pathname === '/create_guestbook_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            DB.query(`SELECT * FROM introduce WHERE id = ?`, [post.id],function(error, introduce){
                if(error){
                    throw error;
                }
                DB.query(`INSERT INTO guestbook (name, author, author_id, created, title, description) VALUES(?, ?, ?, NOW(), ?, ?)`, [introduce[0].name, 1, 1, post.title, post.description], function(error, result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/?id=${post.id}`});
                    response.end();
                });
            });
        });
    } else {
        console.log('passpoint1');
        response.writeHead(404);
        response.end('Not found');
    }

});

app.listen(5000);