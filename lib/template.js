module.exports = {
    HTML_home : function(title, list, body, create){
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

            
            
                <!--paragraph / 단락-->

                <!-- <p style="margin-top:45px;">
                </p> -->
            </body>
        </html>
        `;
    },
    List_guestbook : function(sqlData){
        var list = '<ul>';
        var i = 0;
        while(i < sqlData.length){
            list = list + `<br>${sqlData[i].title} <br>
            <p>${sqlData[i].description}</p>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    },
    List : function(sqlData){
        var list = '<ul>';
        var i = 0;
        while(i < sqlData.length){
            list = list + `<li><a href="/?id=${sqlData[i].id}">${sqlData[i].name}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    },
    HTML_friend : function(title, list, body, create, guestbooks){
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
                <p>
                ${create}
                </p>

                ${body}

                ${guestbooks}
            
            
                <!--paragraph / 단락-->

                <!-- <p style="margin-top:45px;">
                </p> -->
            </body>
        </html>
        `;
    }
}