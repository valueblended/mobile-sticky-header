(function($, getNamespace){
	var StickyHeader = function(customOptions){
		var defaultOptions = {
			element: null,
			actionDelay: 300
		};
		var options = $.extend({}, defaultOptions, customOptions);

		if(options.element === null){
			throw new Error('element must be specified');
		}

		var $header = $(options.element);

		// enforce css required for the header to function like a sticky header

		var distanceTravelledInSameDirection = 0;
		var lastScrollTop = 0;
		var scrollDifference = 0;
		var directionChange = 'no';

		var updateSameScrollDistance = function(){
		  scrollDifference = $(window).scrollTop() - lastScrollTop;
		  
		  lastScrollTop = $(window).scrollTop();

		  if(distanceTravelledInSameDirection > 0 && scrollDifference < 0){
		    distanceTravelledInSameDirection = 0;
		    
		    directionChange = 'up';
		  }else if(distanceTravelledInSameDirection < 0 && scrollDifference > 0){//could be OR, whatever!
		    distanceTravelledInSameDirection = 0;
		    
		    directionChange = 'down';
		  }else{
		    directionChange = 'no';
		  }
		   
		  distanceTravelledInSameDirection += scrollDifference;
		};

		var scrollTimeout = null;
		var scrollJustStarted = true;

		var onScrollTimeout = function(){
		  scrollJustStarted = true;
		  
		  onStoppedScrolling();
		};

		var onWindowScroll = function(){
		  updateSameScrollDistance();//has side effects!
		  
		  clearTimeout(scrollTimeout);
		  scrollTimeout = setTimeout(onScrollTimeout, options.actionDelay);
		  
		  if(scrollJustStarted){
		    scrollJustStarted = false;
		    
		    onScrollStart();
		  }else{
		    onScrolling();
		  }
		  
		  if(directionChange == 'down'){
		    onFirstScrollDown();
		  }else if (directionChange == 'up'){
		    onFirstScrollUp();
		  }
		};

		var onFirstScrollDown = function(){
		  
		  $header.css('top', $header.offset().top + 'px');
		  $header.css('position', 'absolute');
		};

		var onFirstScrollUp = function(){
		  
		  if($header.offset().top + $header.height() < $(window).scrollTop()){//assuming position is set to absolute    
		    $header.css('position', 'absolute');
		    $header.css('top', $(window).scrollTop() - $header.height() + 'px');
		  }
		  
		};

		var onStoppedScrolling = function(){
		  
		  $header.css('top', $header.offset().top + 'px');
		  $header.css('position', 'absolute');

		  if($header.offset().top + $header.height()/2 < $(window).scrollTop()){
		    
		    if($header.offset().top > 0){
		    
		      $header.animate({
		        top: $(window).scrollTop() - $header.height()
		      });
		    }
		  }else{
		    
		    $header.animate({
		      top: $(window).scrollTop()
		    });
		  }
		};

		var onScrolling = function(){//executed after first scroll down and first scroll up, on next scroll after scroll start
		  
		  if(scrollDifference < 0){
		    
		    if($header.offset().top > $(window).scrollTop()){
		      $header.css('position', 'fixed');
		      $header.css('top', 0);
		    }
		  }
		};

		var onScrollStart = function(){
		  $header.stop();
		};

		$(window).on('scroll', onWindowScroll);
	};
	
	getNamespace('com.valueblended').StickyHeader = StickyHeader;
})(jQuery, com.gottocode.getNamespace);