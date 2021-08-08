var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var DB = require('./lib/db.js');
var introduce_template = require('./lib/introduce.js')


var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log("path",pathname);
    // console.log("queryData.id", queryData.id);

    if(pathname === '/'){
        if(queryData.id === undefined || queryData.id === 'home' ){
            introduce_template.home(request, response);
        } else {
            introduce_template.page(request, response);
        }
    }else if(pathname ==='/delete_process'){
        introduce_template.delete_process(request, response);
    }else if(pathname === '/update'){
        introduce_template.update(request, response);
    } else if(pathname ==='/update_process'){
        introduce_template.update_process(request, response);
    } else if(pathname === '/create'){
        introduce_template.create(request, response);
    } else if( pathname === '/create_process') {
        introduce_template.create_process(request, response);
    } else if(pathname === '/create_guestbook') {
        introduce_template.create_guestbook(request, response);
    } else if(pathname === '/create_guestbook_process'){
        introduce_template.create_guestbook_process(request, response);
    } else {

        response.writeHead(404);
        response.end('Not found');
    }

});

app.listen(5000);