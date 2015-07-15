var i = 0;
var j = 0;
var images = new Array();
var im = new Array();
var flag = false;
var half = parseInt(document.documentElement.clientWidth / 2);
while ((j * 4 + i) < 21) {
    im[j * 4 + i] = document.createElement('img');
    var s = j * 4 + i + 1;
    im[j * 4 + i].src = 'image/' + s + '.jpg';
    im[j * 4 + i].style.width = '250px';
    if (i == 3) {
        i = 0;
        j++;
    }
    else {
        i++;
    }
}

i = 0;
j = 0;

function imgitem() {
    this.p_i = 0;
    this.p_j = 0;
    this.imglink;
    this.imgbox = document.createElement('div');
    //this.img = document.createElement('img');
    this.p_x = 0;
    this.p_y = 0;
    this.h = 0;
    this.init = function (arg) {
        this.p_i = arg.i;
        this.p_j = arg.j;
        this.imglink = arg.imglink;
        this.imglink = im[j * 4 + i].src;
        this.p_x = half - 500 + 255 * this.p_i;
        if (this.p_j == 0) {
            this.p_y = 100;
        }
        else {
            this.p_y = parseInt(images[this.p_j * 4 - 4 + i].imgbox.offsetHeight) + images[this.p_j * 4 - 4 + i].p_y + 5;
        }
        this.show();
    };
    this.show = function () {
        this.imgbox.style.position = 'absolute';
        this.imgbox.style.width = '250px';
        this.imgbox.style.left = this.p_x + 'px';
        this.imgbox.style.top = this.p_y + 'px';
        this.imgbox.id = 'img' + this.p_i + this.p_j;
        //this.imgbox.style.border = '1px solid #999999';	
        //this.imgbox.appendChild(this.img);
        document.getElementsByTagName('body')[0].appendChild(this.imgbox);
        document.getElementById(('img' + this.p_i + this.p_j)).appendChild(im[j * 4 + i]);

    };

}

function createimg() {
    debugger;
    var sTop = document.documentElement.scrollTop + document.body.scrollTop + document.documentElement.clientHeight;
    var x = 0;
    for (var k = 0; k < 4; k++) {
        if (x < (images[j * 4 - 4 + k].imgbox.offsetTop + images[j * 4 - 4 + k].imgbox.offsetHeight)) {
            x = images[j * 4 - 4 + k].imgbox.offsetTop + images[j * 4 - 4 + k].imgbox.offsetHeight;
        }
    }
    while (sTop > (x - 30)) {
        if ((j * 4 + i) < 21) {
            for (i = 0; i < 4; i++) {
                images[j * 4 + i] = new imgitem();
                images[j * 4 + i].init({ i: i, j: j, imglink: 'image/1.jpg' });
            }
            j++;
            for (var k = 0; k < 4; k++) {
                if (x < (images[j * 4 - 4 + k].imgbox.offsetTop + images[j * 4 - 4 + k].imgbox.offsetHeight)) {
                    x = images[j * 4 - 4 + k].imgbox.offsetTop + images[j * 4 - 4 + k].imgbox.offsetHeight;
                }
            }
            //break;
        }
        else {
            break;
        }
    }
}

window.onload = function () {
    while ((j * 4 + i) < 9) {
        for (i = 0; i < 4; i++) {
            images[j * 4 + i] = new imgitem();
            images[j * 4 + i].init({ i: i, j: j, imglink: 'image/1.jpg' });
        }
        j++;
    }
    debugger;
    createimg();
}

window.onscroll = function () {
    createimg();
}
window.onmouseup = function (evt) {
    evt = window.event || evt;
    if (flag == false) {
        var x = evt.clientX;
        var y = evt.clientY + document.documentElement.scrollTop + document.body.scrollTop;
        var m_i = parseInt((x - document.documentElement.clientWidth / 2 + 500) / 255);
        if (m_i < 4) {
            for (var m_j = 0; m_j < j; m_j++) {
                if ((images[m_j * 4 + m_i].p_y < y) && (images[m_j * 4 + m_i].p_y + parseInt(images[m_j * 4 + m_i].imgbox.offsetHeight) > y)) {
                    var s = m_j * 4 + m_i + 1;
                    var linn = 'image/' + s + '.jpg';
                    var bigimg = document.createElement('div');
                    bigimg.style.position = "fixed";
                    bigimg.style.border = '4px solid #999999';
                    bigimg.style.width = '500px';
                    bigimg.style.top = '3%';
                    bigimg.style.left = (document.documentElement.clientWidth - 550) / 2 + 'px';
                    bigimg.style.zIndex = '1';
                    bigimg.style.backgroundColor = '#FFFFFF';
                    bigimg.id = 'bigig';
                    document.getElementsByTagName('body')[0].appendChild(bigimg);
                    var igg = document.createElement('img');
                    bigimg.appendChild(igg);
                    igg.setAttribute("src", linn);
                    igg.style.width = '500px';
                    var pll = document.createElement('p');
                    pll.innerHTML = data.images[s - 1].text;
                    pll.align = 'center';
                    pll.style.backgroundColor = '#FFFFFF';
                    bigimg.appendChild(pll);
                    flag = true;
                    break;
                }
            }
        }
    }
    else {
        document.getElementById('bigig').remove();
        flag = false;
    }
}