;(function(){
  'use strict';
  var drawApp = {
    canvas: document.getElementById("canvas"),
    width: '',
    height: '',
    ctx: function() { return canvas.getContext("2d"); } ,
    colorPicker: document.getElementById('js-colors'),
    previousMousePos: false,
    mouseDown: false,
    imageSaved: false,
    toll: 'pen', // pen or erase
    color: function() { return this.colorPicker.value || 'red'; },
    lineWidthSelect: document.getElementById('line-width-select'),
    lineWidthInput: document.getElementById('line-width-input'),
    eraseSizeSelect: document.getElementById('erase-size'),
    lineWidth: function() {
      return this.lineWidthInput.value ? this.lineWidthInput.value : this.lineWidthSelect.value;
    },
    clearBtn: document.getElementById('js-clear'),
    eraseBtn : document.getElementById('js-erase'),
    penBtn : document.getElementById('js-pen'),
    addColorBtn : document.getElementById('js-add-color'),
    colorListBtns : document.getElementById('js-color-list'),
    saveImageBtn : document.getElementById('js-save-image'),

    supportsCanvas: function() {
      return this.canvas.getContext ? true : false;
    },

    getMousePos: function (canvas, e) {
       // necessary to take into account CSS boudaries
       var rect = this.canvas.getBoundingClientRect();
       return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
       };
    },

    drawLine: function (x1,y1,x2,y2,opt) {
        opt = opt || {};
        opt.color = opt.color || this.color;
        opt.lineWidth = opt.lineWidth || this.lineWidth;
        var ctx = this.ctx();

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = opt.color;
        ctx.lineJoin = "round";
        ctx.lineCap = 'round';
        ctx.lineWidth = opt.lineWidth;
        ctx.stroke();
    },
    clearLine: function(x, y, size) {
      var w,h, ctx = this.ctx();

      if (size === 'small') {
        w = 10; h = 10;
      } else if (size === 'medium') {
        w = 20; h = 20;
      } else if (size === 'big') {
        w = 50; h = 50;
      }
      ctx.clearRect(x,y,w,h);
    },

    addNewColor: function(color) {
      var colorsList = this.colorListBtns;
      var listEl = document.createElement('li');
      var colorBtn = document.createElement('button');
          colorBtn.className = 'text-hide color-list__item';
          colorBtn.innerHTML = color;
          colorBtn.style.backgroundColor = color;
          colorBtn.setAttribute('value', color);

      listEl.appendChild(colorBtn);
      colorsList.appendChild(listEl);

    },

    handleEvents: function() {
      var that = this,
          ctx = this.ctx();

      that.canvas.addEventListener('mousedown', function(e){
          that.previousMousePos = that.getMousePos(canvas, e);
          that.mouseDown = true;
      });
      that.canvas.addEventListener('mousemove', function(e){
        var mousePos = that.getMousePos(canvas, e);
        //Draw lines
        if(that.mouseDown) {

          if (that.toll === 'pen') {
            that.drawLine(that.previousMousePos.x, that.previousMousePos.y,mousePos.x, mousePos.y);
          } else if (that.toll === 'erase') {
            that.clearLine(mousePos.x, mousePos.y, that.eraseSizeSelect.value);
          }

          that.previousMousePos = mousePos;
        }
      });
      that.canvas.addEventListener('mouseup', function(e){
          that.mouseDown = false;
      });
      that.canvas.addEventListener('mouseleave', function(e){
          that.mouseDown = false;
      });

      that.colorListBtns.addEventListener('click', function(e){

        if (e.target && e.target.nodeName.toLowerCase() === 'button') {
          var newColor = e.target.value;
          that.color = newColor;
        }
      });

      that.addColorBtn.addEventListener('click', function(e){
        var colorValue = that.colorPicker.value;

        that.addNewColor(colorValue);
      });

      that.lineWidthSelect.addEventListener('change', function(e){
        that.lineWidth = this.value;
      });

      that.lineWidthInput.addEventListener('change', function(e){
        that.lineWidth = this.value;
      });

      that.eraseBtn.addEventListener('click', function(e){
        that.toll = 'erase';
        that.canvas.setAttribute('data-erase-size', that.eraseSizeSelect.value);
        that.canvas.classList.remove('pen');
        that.canvas.classList.add('erase');
      });

      that.eraseSizeSelect.addEventListener('change', function(e){
          that.canvas.setAttribute('data-erase-size', this.value);
      });

      that.penBtn.addEventListener('click', function(e){
        that.toll = 'pen';
        that.canvas.classList.remove('erase');
        that.canvas.classList.add('pen');
        that.canvas.setAttribute('data-erase-size', '');
      });

      that.clearBtn.addEventListener('click', function(e){

        if (window.confirm("Are you sure ? This will delete all your current progress")) {
            ctx.clearRect(0,0,that.width,that.height);
        }
      });

      that.saveImageBtn.addEventListener('click', function(e){

        if (!that.imageSaved) {
          e.preventDefault();

          var dataURL = canvas.toDataURL('image/png');
          this.href = dataURL;
          this.download = 'image-' + parseFloat(Math.random() * 10, 10).toFixed(5) + '.png';
          that.imageSaved = true;
          that.saveImageBtn.click();
        } else {
          that.imageSaved = false;
        }


      });
    },

    init: function() {
      if (!this.supportsCanvas()) {
        return;
      }
      var that = this,
          w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0];
          this.width = w.innerWidth || e.clientWidth || g.clientWidth;
          this.height = w.innerHeight|| e.clientHeight|| g.clientHeight;


      this.canvas.setAttribute('width', this.width - 30 + 'px');
      this.canvas.setAttribute('height', this.height - 200 + 'px');



      jsColorPicker('input.color',{
        customBG: '#000000',
        readOnly: true,
        // patch: false,
        init: function(elm, colors) { // colors is a different instance (not connected to colorPicker)
          elm.style.backgroundColor = elm.value;
          elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#000000' : '#ffffff';
        },
        renderCallback: function(colors, mode){
          var newColor = '#' + colors.HEX;
          that.color = newColor;
          that.colorPicker.style.backgroundColor = newColor;
          that.colorPicker.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#000' : '#fff';
          that.colorPicker.setAttribute('value', newColor);

          },
      });

      this.handleEvents();


    }
  };

  drawApp.init();

}());
