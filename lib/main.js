(function () {
    var Scooby = function () {
        this.domVideo = document.createElement('video');
        this.domCanvas = document.createElement('canvas');
        this.ctx = this.domCanvas.getContext('2d');
        this.domVideo.autoplay = 'autoplay';
        this.domVideo.width = this.domCanvas.width = this.WIDTH;
        this.domVideo.height = this.domCanvas.height = this.HEIGHT;
        this.domRight = document.getElementById('right-iris');
        this.domLeft = document.getElementById('left-iris');
        this.rX = this.IRIS_OFFSET / this.WIDTH;
        this.rY = this.IRIS_OFFSET / this.HEIGHT;
        document.body.appendChild(this.domVideo);
        document.body.appendChild(this.domCanvas);
        this.getUserMedia();
        this.detectFaces = this.detectFaces.bind(this);
        this.detectHandler = this.detectHandler.bind(this);
    };
    Scooby.prototype = {
        IRIS_OFFSET: 80
      , HEIGHT: 120
      , WIDTH: 160
      , getUserMedia: function () {
            var cbSuccess = this.cbSuccess.bind(this)
              , cbError = this.cbError.bind(this);
            if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia('video', cbSuccess, cbError);
            } else if (navigator.getUserMedia) {
                navigator.getUserMedia({video: true}, cbSuccess, cbError);
            } else {
                this.noSupport();
            }
        }
      , cbSuccess: function (stream) {
            this.domVideo.src = navigator.webkitGetUserMedia 
              ? webkitURL.createObjectURL(stream)
              : stream;
        }
      , cbError: function (err) {
            console.log(err);
        }
      , noSupport: function () {
            console.log('getUserMedia is not supported');
        }
      , detectHandler: function (r) {
            if (r.length > 0) {
                var ctx = this.domCanvas.getContext('2d')
                  , f = r[0]
                  , x = f.x + (f.width / 2)
                  , y = f.y + (f.height / 2)
                  , tX = Math.round((this.WIDTH - x) * this.rX, 10)
                  , tY = Math.round(y * this.rY, 10)
                  , t = tX + 'px, ' + tY + 'px';
                this.domLeft.style.WebkitTransform = 'translate3d(' + t + ', 0)';
                this.domRight.style.WebkitTransform = 'translate3d(' + t + ', 0)';
            }
            setTimeout(this.detectFaces, 100);
        }
      , detectFaces: function () {
            var w = this.domVideo.clientWidth
              , h = this.domVideo.clientHeight
              , comp;
            this.ctx.drawImage(this.domVideo, 0, 0, 640, 480, 0, 0, w, h);
            comp = ccv.detect_objects({
                canvas: this.domCanvas
              , cascade: cascade
              , interval: 5
              , min_neighbors: 1
            });
            this.detectHandler(comp);
        }
      , start: function () {
            this.detectFaces();
        }
    };

    var scoob = new Scooby();
    scoob.start();
}());