var browserWindowWidth = window.innerWidth;
var browserWindowHeight = window.innerHeight;
var startBnt = document.getElementById('start');
startBnt.style.backgroundImage = "url(res/start.png)"
startBnt.style.left = (browserWindowWidth - 150) / 2 + 'px';
var bgMusic = document.createElement('audio');
var gunShot = document.createElement('audio');
var canvas = document.getElementById("myCanvas");
var painter = canvas.getContext("2d");
var gameoverBox;

var helpBox = document.createElement('div');
helpBox.id = 'helpBox';
helpBox.innerHTML = '<p>' + '丢失，在下一发中缩小目标半径' + '</p>' +
    '<p>' + '精准，在下一发中增大目标半径' + '</p>' +
    '<p>' + '暴击，下一发一击必杀' + '</p>' +
    '<p>' + '霰弹，在下一发中击落屏幕中所有鸟' + '</p>';
helpBox.style.top = (browserWindowHeight - 600) / 2 + 'px';
helpBox.style.left = (browserWindowWidth - 1400) / 2 + 'px';
document.getElementsByTagName('body')[0].appendChild(helpBox);


var flag = false;

canvas.style.left = (browserWindowWidth - 800) / 2 + 'px';
canvas.style.top = (browserWindowHeight - 600) / 2 + 'px';

document.getElementById('startBG').style.left = (browserWindowWidth - 800) / 2 + 'px';
document.getElementById('startBG').style.top = (browserWindowHeight - 600) / 2 + 'px';
document.getElementById('startBG').style.backgroundImage = "url(res/bg1.jpg)";

var ready0, ready1, ready2, ready3, 
    ready_buff0, ready_buff1, ready_buff2, ready_buff3, ready_buff4;
var image0, image1, image2, image3,
    image_buff0, image_buff1, image_buff2, image_buff3, image_buff4;


image0 = new Image();
ready0 = false;
image0.onload = function () {
    ready0 = true;
};
image0.src = "res/bird0.png";

image1 = new Image();
ready1 = false;
image1.onload = function () {
    ready1 = true;
};
image1.src = "res/bird1.png";

image2 = new Image();
ready2 = false;
image2.onload = function () {
    ready2 = true;
};
image2.src = "res/bird2.png";

image3 = new Image();
ready3 = false;
image3.onload = function () {
    ready3 = true;
};
image3.src = "res/bird3.png";

image_buff0 = new Image();
ready_buff0 = false;
image_buff0.onload = function(){
    ready_buff0 = true;
};
image_buff0.src = "res/Buff_Miss.png";

image_buff1 = new Image();
ready_buff1 = false;
image_buff1.onload = function(){
    ready_buff1 = true;
};
image_buff1.src = "res/Buff_Precise.png";

image_buff2 = new Image();
ready_buff2 = false;
image_buff2.onload = function(){
    ready_buff2 = true;
};
image_buff2.src = "res/Buff_Hit.png";

image_buff3 = new Image();
ready_buff3 = false;
image_buff3.onload = function(){
    ready_buff3 = true;
};
image_buff3.src = "res/Buff_Shrapnel.png";

image_buff4 = new Image();
ready_buff4 = false;
image_buff4.onload = function(){
    ready_buff4 = true;
};
image_buff4.src = "res/Buff_Bonus.png";


var radius = 30;//射击判定半径
var speed = 1;//200帧每秒，每帧移动的像素点
var time = 0;//计时
var interval;//定时器
var candidate = new Array(3);//三个预定位置
var appearTime = new Array(60);//每只鸟的出现时间
var appearNum = new Array(120);//每个时间点出现的鸟的个数
var buffState = -1;
var buffLast = 0;
var buffUsed = -1;
var buffSiteX, buffSiteY;
var score = 0;

function bird(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = 0;
    this.speed = 1;
    this.hp = 1;
    this.pathYa = 20;
    this.pathYb = 0.002;
    this.pathZa = 0.0008;
}

//开始游戏【接口】
function play() {
    buffState = -1;
    buffLast = 0;
    buffUsed = -1;

    time = 0;
    //初始化鸟的位置及其他属性
    candidate[0] = new bird(0, 100, 1);
    candidate[1] = new bird(0, 200, 1);
    candidate[2] = new bird(0, 300, 1);

    //决定一局的鸟出现顺序
    for (var i = 0; i < 120; i++) {
        appearNum[i] = 0;
    }
    for (var i = 0; i < 60; i++) {
        appearTime[i] = Math.floor(Math.random() * 120);
        appearNum[appearTime[i]] += 1;
    }
    interval = setInterval(draw, 5);
}
//play();

//游戏结束【接口】
//setTimeout(stop, 60000);
function stop() {
    painter.clearRect(0, 0, 800, 600);
    clearInterval(interval);
    //alert('gameover');
}

    //绘制界面
function draw(){
    painter.clearRect(0, 0, 800, 600);

    if(time % 500 == 0){
        for(var j = 0; j < appearNum[time / 500]; j++){
            for(var i = j; i < 3; i++){
                if(candidate[i].x != 0) continue;
                candidate[i].id = Math.floor(Math.random() * 4);
                if(candidate[i].id == 3) candidate[i].hp = 2;
                else candidate[i].hp = 1;
                candidate[i].speed = 1;
                candidate[i].pathYa = 20 + Math.floor(Math.random() * 10);
                candidate[i].pathYb = 0.001 * Math.floor(Math.random() * 3 + 1);
                candidate[i].pathZa = 0.0008 * Math.floor(Math.random() * 2 + 1);
                candidate[i].z = pathZ(candidate[i].pathZa);
                if(ready0 && ready1 && ready2 && ready3){
                    switch(candidate[i].id){
                        case 0: painter.drawImage(image0, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                            break;
                        case 1: painter.drawImage(image1, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                            break;
                        case 2: painter.drawImage(image2, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                            break;
                        case 3: painter.drawImage(image3, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                    }
                }
                candidate[i].x += candidate[i].speed;
                break;
            }
        }
    }

    for(var i = 0; i < 3; i++){
         if(candidate[i].x != 0){
             candidate[i].z = pathZ(candidate[i].pathZa);
             if(ready0 && ready1 && ready2 && ready3){
                    switch(candidate[i].id){
                        case 0: painter.drawImage(image0, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                            break;
                        case 1: painter.drawImage(image1, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                            break;
                        case 2: painter.drawImage(image2, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                            break;
                        case 3: painter.drawImage(image3, candidate[i].x, candidate[i].y + pathY(candidate[i].pathYa, candidate[i].pathYb), 80 * candidate[i].z, 80 * candidate[i].z);
                    }
             }
             candidate[i].x += candidate[i].speed;
             if(candidate[i].x > 800) candidate[i].x = 0;
         }
    }

    if(buffLast > 0){
         if(ready_buff0 && ready_buff1 && ready_buff2 && ready_buff3 && ready_buff4){
                switch(buffUsed){
                    case 0: painter.drawImage(image_buff0, buffSiteX, buffSiteY);
                            break;
                    case 1: painter.drawImage(image_buff1, buffSiteX, buffSiteY);
                            break;
                    case 2: painter.drawImage(image_buff2, buffSiteX, buffSiteY);
                            break;
                    case 3: painter.drawImage(image_buff3, buffSiteX, buffSiteY);
                            break;
                    case 4: painter.drawImage(image_buff4, buffSiteX, buffSiteY);
                    default:break;
               }
         }
         buffLast -= 5;
         if(buffLast == 0) buffUsed = -1;
    }

    time += 5;
}

//射击事件【接口】
function shoot(x, y){
    score = 0;
    if(buffState == -1){
        for(var i = 0; i < 3; i++){
            if(candidate[i].x > 0){
                if((x - 40 * candidate[i].z - candidate[i].x) * (x - 40 * candidate[i].z - candidate[i].x) + (y - 40 * candidate[i].z - candidate[i].y) * 
                    (y - 40 * candidate[i].z - candidate[i].y) < radius * radius * candidate[i].z * candidate[i].z){
                    candidate[i].hp--;
                    if(candidate[i].hp <= 0){
                        candidate[i].x = 0;
                        if(buffState == -1) buffState = harvest(candidate[i].id);
                        
                        if(candidate[i].id == 3) score += 3;
                        else score++;
                    }
                }
            }
        }
        if(buffState == 4){
            buffLast = 500;
            buffUsed = 4;
            buffSiteX = x + 50;
            buffSiteY = y + 50;
        }
    }
    else if(buffState == 0){//丢失buff
        for(var i = 0; i < 3; i++){
            if(candidate[i].x > 0){
                if((x - 40 * candidate[i].z - candidate[i].x) * (x - 40 * candidate[i].z - candidate[i].x) + (y - 40 * candidate[i].z - candidate[i].y) * 
                    (y - 40 * candidate[i].z - candidate[i].y) < radius * radius * candidate[i].z * candidate[i].z){
                    if(Math.random() > 0.5){ 
                        buffUsed = 0;
                        buffLast = 500;
                        buffSiteX = x + 50;
                        buffSiteY = y + 50;
                    } 
                    else candidate[i].hp--;
                    if(candidate[i].hp <= 0){
                        candidate[i].x = 0;
                        if(candidate[i].id == 3) score += 3;
                        else score++;
                    }
                }
            }
        }
        
        buffState = -1;
    }
    else if(buffState == 1){//精准buff
        for(var i = 0; i < 3; i++){
            if(candidate[i].x > 0){
                if((x - 40 * candidate[i].z - candidate[i].x) * (x - 40 * candidate[i].z - candidate[i].x) + (y - 40 * candidate[i].z - candidate[i].y) * 
                    (y - 40 * candidate[i].z - candidate[i].y) < 4 * radius * radius * candidate[i].z * candidate[i].z){
                    buffLast = 500;
                    buffUsed = 1;
                    buffSiteX = x + 50;
                    buffSiteY = y + 50;                        
                    candidate[i].hp--;
                    if(candidate[i].hp <= 0){
                        candidate[i].x = 0;
                        if(candidate[i].id == 3) score += 3;
                        else score++;                            
                    }
                }
            }
        }
        buffState = -1;        
    }
    else if(buffState == 2){//暴击buff
        for(var i = 0; i < 3; i++){
            if(candidate[i].x > 0){
                if((x - 40 * candidate[i].z - candidate[i].x) * (x - 40 * candidate[i].z - candidate[i].x) + (y - 40 * candidate[i].z - candidate[i].y) * 
                    (y - 40 * candidate[i].z - candidate[i].y) < radius * radius * candidate[i].z * candidate[i].z){
                    buffLast = 500;
                    buffUsed = 2;
                    buffSiteX = x + 50;
                    buffSiteY = y + 50;
                    candidate[i].x = 0;
                    if(candidate[i].id == 3) score += 3;
                    else score++;
                }
            }
        }
        buffState = -1;        
    }
    else if(buffState == 3){//霰弹buff
        buffLast = 500;
        buffSiteX = x + 50;
        buffSiteY = y + 50;
        for(var i = 0; i < 3; i++){
            if(candidate[i].x > 0){
                candidate[i].x = 0;
                if(candidate[i].id == 3) score += 3;
                else score++;
            }
        }
        buffUsed = 3;
        buffState = -1;        
    }
    return score;
}

//buff【接口】
function getBuffState(){
    if(buffState <= 3) return buffState;
    else{
        buffState = -1;
        return 4;//加子弹5发
    }
}

//收获buff计算
function harvest(id){
    switch(id){
        case 1: 
            if(Math.random() < 0.7) return 0;
            else return -1;
        case 2:
            if(Math.random() < 0.4) return 1;
            else if(Math.random() > 0.6) return 2;
            else return -1;
        case 3:
            if(Math.random() < 0.4) return 3;
            else if(Math.random() > 0.6) return 4;
            else return -1;
        default: return -1;
    }

}


//路线
function pathY(a, b) {
    return (a * Math.sin(b * time));
}
function pathZ(a) {
    return (0.75 + 0.25 * Math.sin(a * time));
}



bgMusic.src = 'res/2.mp3';
bgMusic.autoplay = 'autoplay';
bgMusic.controls = 'controls';
document.getElementsByTagName('body')[0].appendChild(bgMusic);

gunShot.src = 'res/gunShot.mp3';
document.getElementsByTagName('body')[0].appendChild(gunShot);



var T;

var gameClass = {
    gameWindow: document.createElement('div'),
    infoBox: document.createElement('div'),
    timerBox: document.createElement('p'),
    post: document.createElement('img'),
    buff:document.createElement('p'),
    score: 0,
    bullet: 20,
    isGameStart: false,
    gunPostionX: 0,
    gunPostionY: 0,
    timeLeft:60,

    update: function () {
        this.infoBox.innerHTML = '<p>' + '得分：' + this.score + '</p>' + '<p>' + '子弹：' + this.bullet + '</p>';
        this.infoBox.appendChild(this.timerBox);
        this.infoBox.appendChild(this.buff);
    },
    create: function () {
        this.score = 0;
        this.bullet = 20;

        this.gameWindow.id = 'gameWindow';
        this.gameWindow.style.left = (browserWindowWidth - 800) / 2 + 'px';
        this.gameWindow.style.top = (browserWindowHeight - 600) / 2 + 'px';
        this.gameWindow.style.backgroundImage = "url(res/bg0.jpg)";
        document.getElementsByTagName('body')[0].appendChild(this.gameWindow);

        this.infoBox.id = 'infoBox';
        this.infoBox.style.left = (browserWindowWidth + 810) / 2 + 'px';
        this.infoBox.style.top = (browserWindowHeight - 600) / 2 + 'px';
        document.getElementsByTagName('body')[0].appendChild(this.infoBox);
        this.update();
        
        this.infoBox.appendChild(this.timerBox);
        this.buff.style.color = '#FF0000';
        this.infoBox.appendChild(this.buff);
        //this.timerBox.id = 'timerBox';
        //this.timerBox.style.left = this.infoBox.style.left;
        //this.timerBox.style.top = (browserWindowHeight - 400) / 2 + 'px';
        //this.timerBox.style.height = '200px'
        //document.getElementsByTagName('body')[0].appendChild(this.timerBox);

        this.post.id = 'post';
        this.post.src = 'res/star.png';
        this.post.style.left = this.gameWindow.style.left;
        this.post.style.top = this.gameWindow.style.top;
        document.getElementsByTagName('body')[0].appendChild(this.post);


        //


        //
    },
    gameStart: function () {
        this.timeLeft = 60;
        this.isGameStart = true;
        play();
        T = setInterval("gameClass.timer()", 1000);
    },

    gameOver: function () {
        clearInterval(T);
        stop();
        gameClass.isGameStart = false;
        //alert('游戏结束，你的得分是:' + gameClass.score);
        startBnt.style.top = '55%';
        gameoverBox = document.createElement('div');
        gameoverBox.id = 'gameoverBox';
        gameoverBox.style.left = (browserWindowWidth - 300) / 2 + 'px';
        gameoverBox.style.top = (browserWindowHeight / 2) + 'px';
        gameoverBox.innerHTML = '<p>游戏结束！</p><p>得分为：' + gameClass.score + '</p>';
        document.getElementsByTagName('body')[0].appendChild(gameoverBox);
        flag = true;
        gameoverBox.onmousedown = function (e) {
            if (flag) {
                gameoverBox.remove();
                flag = false;
                return;
            }
        };
    },

    timer: function () {
        if (this.timeLeft == 0) {
            this.timerBox.innerHTML = '剩余时间:' + this.timeLeft + 's';
            this.gameOver();
            return;
        }
        this.timerBox.innerHTML = '剩余时间:' + this.timeLeft + 's';
        this.timeLeft--;
    }
}

startBnt.onclick = function () {
    gameClass.create();
    clearInterval(T);
    stop();
    startBnt.style.top = (browserWindowHeight + 610) / 2 + 'px';
    startBnt.style.backgroundImage = 'url(res/restart.png)';
    if (document.getElementById('startBG') != null) {
        document.getElementById('startBG').remove();
    }
    gameClass.gameStart();
}

gameClass.post.onmousedown = function (e) {
    if (!gameClass.isGameStart) {
        alert('请重开始游戏');
        return;
    }

    e = window.event || e;
    if (gameClass.bullet > 0) {
        gunShot.load();
        gunShot.play();
        gameClass.bullet--;
        gameClass.gunPostionX = e.clientX - (browserWindowWidth - 800) / 2;
        gameClass.gunPostionY = e.clientY - (browserWindowHeight - 600) / 2;

        gameClass.score += shoot(gameClass.gunPostionX, gameClass.gunPostionY);
        var i = getBuffState();
        if (i == -1) {
            gameClass.buff.innerHTML = '';
        }
        else if (i == 0) {
            gameClass.buff.innerHTML = '丢失';
        }
        else if (i == 1) {
            gameClass.buff.innerHTML = '精准';
        }
        else if (i == 2) {
            gameClass.buff.innerHTML = '暴击';
        }
        else if (i == 3) {
            gameClass.buff.innerHTML = '霰弹';
        }
        else if (i == 4) {
            gameClass.bullet += 5;
        }
        //gameClass.score += f(gameClass.gunPostionX, gameClass.gunPostionY);
        //if (f) {
        //    gameClass.bullet += 5;
        //}
    }
    gameClass.update();
    if (gameClass.bullet == 0) {
        gameClass.gameOver();
    }
}

document.onmousemove = function (e) {
    if ((e.clientX > (browserWindowWidth - 800) / 2) && (e.clientX < (browserWindowWidth + 800) / 2) && (e.clientY > (browserWindowHeight - 600) / 2) && (e.clientY < (browserWindowHeight + 600) / 2)) {
        e = window.event || e;
        gameClass.post.style.left = e.clientX - 25 + 'px';
        gameClass.post.style.top = e.clientY - 25 + 'px';
    }
}

gameClass.post.onmousemove = function (e) {
    if ((e.clientX > (browserWindowWidth - 800) / 2) && (e.clientX < (browserWindowWidth + 800) / 2) && (e.clientY > (browserWindowHeight - 600) / 2) && (e.clientY < (browserWindowHeight + 600) / 2)) {
        e = window.event || e;
        gameClass.post.style.left = e.clientX - 25 + 'px';
        gameClass.post.style.top = e.clientY - 25 + 'px';
    }
}

gameClass.post.ondragstart = function (e) {
    return false;
}

