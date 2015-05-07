var args = arguments[0] || {};




var SIZE = {
    leftViewWidth : 200,
    leftHiddenWidth : 10,
    platformHeight : Ti.Platform.displayCaps.platformHeight, //It doesn't care landscape mode
    platformWidth : Ti.Platform.displayCaps.platformWidth
};

/**
 * iOS : NavigationWindow
 * Android : Window
 * @param {Object} args
 */

var DrawerLayout = function(args){
    var self = this;
    this.topWindow = (OS_IOS)? Ti.UI.iOS.createNavigationWindow():null;
    
    this.drawer = (OS_IOS)?new LeftDrawer(args):require('com.tripvi.drawerlayout').createDrawer({
        leftDrawerWidth : 200,
        centerView : Ti.UI.createView({
            backgroundColor : "transparent"
        }),
        width : Ti.UI.FILL,
        height : Ti.UI.FILL
    });
    
    if(OS_IOS) this.topWindow.add(this.drawer.getView());
};

DrawerLayout.prototype.add = function(view){
    if(view.role=='leftView'){
        //leftDrawer를 만들고 view를 leftDrawer에 추가
        if(OS_IOS){
            this.drawer.setLeftView(view);
        }
        if(OS_ANDROID){
            // this.leftView = view;
            this.drawer.setLeftView(view);
        }
        
    }
    if(view.role =='centerWindow'){
        if(OS_IOS){
            this.topWindow.window = view;
            var self=this;
            // this.drawer.setLeftView(view);
            view.addEventListener('focus', function(e) {
                self.drawer.touchEnabled = true;
            });
            view.addEventListener('blur', function(e) {
                self.drawer.touchEnabled = false;
            });
        }
        if(OS_ANDROID){
            var centerWrap = Ti.UI.createView({
                backgroundColor : 'gray'
            });
            
            var children = view.children;
            view.removeAllChildren();
            _.each(children,function(child){
                centerWrap.add(child);
            });
            this.drawer.setCenterView(centerWrap);
            this.topWindow = view;
            this.topWindow.add(this.drawer);
            
            //Window가 아닌 centerWrap에 추가되도록 한다.
            view.add = function(args){
                return centerWrap.add(args);
            };
            
            view.remove = function(args){
                return centerWrap.remove(args);
            };
        }
    }
};

DrawerLayout.prototype.setCenterView = function(view){
  if(OS_ANDROID){
    this.drawer.setCenterView(view);
  }else{
    this.topWindow.window.removeAllChildren();
    this.topWindow.window.add(view);
  }
}
 
DrawerLayout.prototype.addEventListener = (function(){
    var drawerEvents = ['draweropen', 'drawerclose', 'drawerslide'];
    var windowEvents = ['open','close','focus'];
    return function(eventName,callback){
        if(_.contains(windowEvents,eventName)){
            this.topWindow.addEventListener(eventName,callback);
        }else{
            this.drawer.addEventListener(eventName,callback);
        }
   };
})();

DrawerLayout.prototype.open = function(args){
    args = args || {};
    if(OS_ANDROID){
        // args.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
    }
    this.topWindow.open(args);
};

DrawerLayout.prototype.openWindow = function(window, options) {
    if(OS_IOS){
        this.topWindow.openWindow(window,options);
        return;
    }
    var that = this;

    options = options || {};
    options.swipeBack = (typeof options.swipeBack === 'boolean') ? options.swipeBack : false;
    options.displayHomeAsUp = (typeof options.displayHomeAsUp === 'boolean') ? options.displayHomeAsUp : true;

    if (OS_ANDROID && options.animated !== false) {
        // options.activityEnterAnimation = Ti.Android.R.anim.fade_out;
        options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
    }

    if (options.swipeBack !== false) {
        window.addEventListener('swipe', function(e) {
            if (e.direction === 'right') {
                that.closeWindow(window, options);
            }
        });
    }

    if (OS_ANDROID && options.displayHomeAsUp !== false && !window.navBarHidden) {
        window.addEventListener('open', function() {
            var activity = window.getActivity();
            if (activity) {
                var actionBar = activity.actionBar;
                if (actionBar) {
                    actionBar.displayHomeAsUp = true;
                    actionBar.onHomeIconItemSelected = function() {
                        that.closeWindow(window, options);
                    };
                }
            }
        });
    }
    
    return window.open(options);
};

DrawerLayout.prototype.closeWindow = function(window, options) {
    options = options || {};

    if (OS_ANDROID && options.animated !== false) {
        options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
        options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
    }

    return window.close(options);
};

DrawerLayout.prototype.toggleLeftView = function(args){
    this.drawer.toggleLeftWindow(args);
};

// exports.createDrawerLayout = function(args){
    // return  new DrawerLayout();
// };

if(OS_IOS){
    function LeftDrawer(args){
        args = args || {};
        this._view = {};
        this._view.scrollView = Ti.UI.createScrollableView({
            // backgroundColor:'red',
            clipViews : false,
            disableBounce : true
        });
        var self = this;
        
        this._view.hiddenButton = Ti.UI.createView({
            width : Ti.UI.FILL,
            height : Ti.UI.FILL,
            backgroundColor : 'transparent'
        });
        this._view.hiddenButton.addEventListener('click', function(e) {
            self.toggleLeftWindow();
        });
        this._view.hiddenButton.addEventListener('swipe', function(e) {
            if(e.direction == 'left') self.toggleLeftWindow();
        });
        
        
        var onChangePage = function(e){
            if(e.currentPage==0){
                self._view.scrollView.left = 0;
                self._view.contentView.left = SIZE.leftViewWidth*-1;
                self._view.scrollView.parent.add(self._view.hiddenButton);
                self.trigger('draweropen',e);
                
                
            }else{
                self._view.scrollView.left = SIZE.leftViewWidth*-1;
                self._view.contentView.left = 0;
                self._view.scrollView.parent.remove(self._view.hiddenButton);
                self.trigger('drawerclose',e);
            }
        };
        
        this._view.scrollView.addEventListener('scroll', function(e){
            self._view.bgView.opacity = (1 - e.currentPageAsFloat)*(args.maxOpacity?args.maxOpacity:.7);
            if(e.currentPageAsFloat ==0 || e.currentPageAsFloat ==1){ //missing scrollend bug (드래깅을 끝까지 했을때)
                onChangePage({
                    currentPage : e.currentPageAsFloat 
                });
            }
        });
        this._view.blankView = Ti.UI.createView({
            backgroundColor : 'transparent',
            touchEnabled : false
        });
        this._view.contentView = Ti.UI.createView({
            clipMode : Titanium.UI.iOS.CLIP_MODE_DISABLED,
            backgroundColor : 'transparent',
            left:0
        });
        
        this._view.bgView = Ti.UI.createView({
            backgroundColor : 'black',
            opacity: 0,
            left:0
        });
        this._view.bgView.addEventListener('click', function(e) {
            self.toggleLeftWindow();
        });
        
        this._view.contentView.add(this._view.bgView);
        
        
        Object.defineProperty(this, 'isLeftDrawerOpen', {
            get: function(){
                return this._view.scrollView.currentPage==0;
            }
        });
        
        Object.defineProperty(this, 'touchEnabled', {
            get: function(){
                // alert('get');
                return this._view.scrollView.touchEnabled ;
            },
            set: function(val){
                this._view.scrollView.hitRect = val?SIZE.defaultHitRect:{
                    x:0,y:0,width:0,height:0
                };
            }
        });
    }
    
    _.extend(LeftDrawer.prototype, Backbone.Events,{
        addEventListener: function(){
            this.on(arguments[0],arguments[1]);
        },
        toggleLeftWindow: function(args){
            args = args || {};
            if(!_.isUndefined(args.animated) && args.animated === false){
                this._view.scrollView.currentPage = this._view.scrollView.currentPage?0:1;          
            }else{
                this._view.scrollView.scrollToView(this._view.scrollView.views[this._view.scrollView.currentPage?0:1]); 
            }
        },
        getView: function(){
            return this._view.scrollView;
        },
        setLeftView : (function(){
            
            return function(view){
                // calculate size
                if(view.top){
                    this._view.scrollView.top = view.top;
                    view.top = null; 
                }
                SIZE.leftViewWidth = view.width || SIZE.leftViewWidth;
                SIZE.defaultHitRect = {
                    height: SIZE.platformHeight,
                    width: SIZE.leftViewWidth+SIZE.leftHiddenWidth,
                    x: 0,
                    y: 0
                };
                SIZE.expendHitRect = {
                    height: SIZE.platformHeight,
                    width: SIZE.leftViewWidth+SIZE.platformWidth,
                    x: 0,
                    y: 0 
                };
                
                //appliy layout , size
                this._view.hiddenButton.applyProperties({
                    width : SIZE.platformWidth - SIZE.leftViewWidth,
                    left: SIZE.leftViewWidth
                });
                this._view.scrollView.applyProperties({
                    width : SIZE.leftViewWidth,
                    left : SIZE.leftViewWidth * -1,
                });
                view.applyProperties({
                   // backgroundColor : 'transparent',
                    width : SIZE.leftViewWidth,
                    left : SIZE.leftViewWidth,
                    right : null
                });
                this._view.contentView.width = SIZE.leftViewWidth*2;
                this._view.contentView.add(view);
                this._view.bgView.width = SIZE.leftViewWidth*2+SIZE.platformWidth+SIZE.leftHiddenWidth;
                
                this._view.scrollView.views = [
                    this._view.contentView,
                    this._view.blankView
                ];
                this._view.scrollView.currentPage = 1;
                this._view.scrollView.hitRect = SIZE.defaultHitRect;
            };
        })()
    });
    
}

var drawerLayout = new DrawerLayout();

args.children && drawerLayout.add(args.children);
console.log(args);
if(args.children){
    //만약 centerWidnow와 leftView가 지정되지 않았으면 ERROR 로그 출력
    _.each(args.children,function(child){
        drawerLayout.add(child);
    });
}
_.extend(this, drawerLayout);
$.on = drawerLayout.addEventListener;
Object.defineProperty($, 'isLeftDrawerOpen', {
    get: function(){
        return drawerLayout.drawer.isLeftDrawerOpen;
    }
});
