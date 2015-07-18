var myFirebaseRef = new Firebase("https://crackling-inferno-4296.firebaseio.com/");

var message = document.getElementById('text');
var islogin = false;
var isusedName = true;
var userList = myFirebaseRef.child('userList');
var messageList = myFirebaseRef.child('messageList')
var btnSend = document.getElementById('send');
var btnQuit = document.getElementById('quit');
var talkbox = document.getElementById('talkbox');
var userlist = document.getElementById('userlist');
var username;

userList.on("value", function (temp) {
    while (isusedName) {
        username = prompt("请输入你的用户名", "username");
        isusedName = temp.hasChild(username);
        if (isusedName) {
            alert("该用户已经在线，请尝试新的用户名");
        }
        else {
            var myname = userList.child(username);
            myname.set('1');
            islogin = true;
            alert("已登入");
        }
    }
});

btnSend.onclick = function () {
    sendMessage();
}

btnQuit.onclick = function () {
    if (!islogin) {
        alert("没有登录，不需要退出");
        return;
    }
    userList.child(username).remove();
    islogin = false;
    isusedName = true;
    alert("已登出");
    var delName = document.getElementById(username);
    delName.remove();
}

function sendMessage() {
    //alert(message.value);
    if (!islogin) {
        alert("您还没有登录");
        userList.on("value", function (temp) {
            while (isusedName) {
                username = prompt("请输入你的用户名", "username");
                isusedName = temp.hasChild(username);
                if (isusedName) {
                    alert("该用户已经在线，请尝试新的用户名");
                }
                else {
                    var myname = userList.child(username);
                    myname.set('1');
                    islogin = true;
                    alert("已登入");
                }
            }
        })
    }
    else {
        var ms = message.value;
        if (ms == '') {
            alert("不能发送空消息");
        }
        else {
            var d = new Date();
            var time = (1+d.getMonth()) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            messageList.push({ userName: username, message: ms, mstime:time });
            message.value = '';
        }
    }
};

messageList.limitToLast(10).on("child_added", function (snapshot) {
    //GET DATA
    var data = snapshot.val();
    var usernamedata = data.userName || "anonymous";
    var messagedata = data.message;
    var timedata = data.mstime;

    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var newmessage = document.createElement('p');
    newmessage.innerHTML = "<strong>" + usernamedata + ' </strong><i> ' + timedata + '</i>' +':'+ '<p>' +messagedata + '</p>';
    newmessage.style.marginLeft = '30px';
    newmessage.style.marginBottom = '5px';

    //ADD MESSAGE
    talkbox.appendChild(newmessage);


    //SCROLL TO BOTTOM OF MESSAGE LIST
    talkbox.scrollTop = talkbox.scrollHeight;
});

userList.on("child_added", function (snapshot) {
    var usernamedata = snapshot.key();

    var newuseronline = document.createElement('p');
    newuseronline.innerHTML = usernamedata;
    newuseronline.id = usernamedata;

    if (usernamedata == username) {
        newuseronline.style.color = '#FF0000'
    }

    userlist.appendChild(newuseronline);
});

window.onbeforeunload = function () {
    userList.child(username).remove();
    islogin = false;
    isusedName = true;
    var delName = document.getElementById(username);
    delName.remove();
}

