(function ( $ ) {
    var carouselLightbox = {
    	baseClass: ".carousel-main",
        parentClass: ".main",
    	totalImages: 0,
    	activeImageIndex: 0,
    	imgTopOffset : 0,
        divTopPadding: 40,
        divLeftPadding: 20,
        maxWidth: 600,
        maxHeight: 600,

    	init: function(mainObj) {
            this.parentClass = mainObj;
            this.setIndex();
    		this.appendLightboxDiv();
    		this.openLightbox();
    	},

        setIndex: function() {
            var _this = this;

            $(_this.parentClass).each(function() {
                $(this).find(_this.baseClass).each(function(index) {
                    $(this).find('img').attr('data-index', index);
                });
            });
        },

    	appendLightboxDiv: function() {
                $(document.body)
                    .append($('<div/>', { "class": "carouselLightboxOverlay"}))
                    .append($('<div/>', { "class": "carouselLightboxDiv"}));

                var padTop = parseInt($('.carouselLightboxDiv').css('padding-top'));
                var padBottom = parseInt($('.carouselLightboxDiv').css('padding-bottom'));
                var padLeft = parseInt($('.carouselLightboxDiv').css('padding-left'));
                var padRight = parseInt($('.carouselLightboxDiv').css('padding-right'));

                var divTopPadding = padTop + padBottom;
                if (divTopPadding > 0)
                    this.imgTopOffset = divTopPadding;

                var divLeftPadding = padLeft + padRight;
                if (divLeftPadding > 0)
                    this.divLeftPadding = divLeftPadding;

    	},

    	openLightbox: function() {
                var _this = this;
                $(_this.baseClass).unbind('click').bind('click', function(e) {
                    var container = $(".carouselLightboxAddLookbook");
                    if ((!container.is(e.target) 
                            && container.has(e.target).length === 0)) {
                    
                        var offsets = $(this).offset();
                        $('.carouselLightboxDiv')
                        //.css('top', Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + 'px')
                        .show();
                        _this.setHtml(this);
                    }
                });
    	},

    	setHtml: function(obj) {
                var _this = this;
                var imgUrl = $(obj).find('img').attr('src');

                var ImgTitle = "";
                if (typeof $(obj).find('img').attr('title') !== 'undefined')
                    ImgTitle = $(obj).find('img').attr('title');
                
                _this.activeImageIndex = $(obj).find('img').attr('data-index');
                _this.totalImages = $(obj).parent().find(_this.baseClass).length;

                var imageOffset = $(obj).find('img').offset();
                _this.imgTopOffset = imageOffset.top;

                var img = new Image();
                img.onload = function() {
                    var _imgThis = this;
                    $('.carouselLightboxDiv').html("");

                    if (this.width >= _this.maxWidth || this.height >= _this.maxHeight) { 
                        
                        _this.getHeightWidthRatio(_imgThis.width, _imgThis.height, function(newWidth, newHeight){
                            _imgThis.width = parseInt(newWidth);
                            _imgThis.height = parseInt(newHeight);
                        });                    
                    }

                    _this.imgTopOffset = Math.max(0, (($(window).height()/2)) + $(window).scrollTop());
                    //$('.carouselLightboxDiv').css('top',_this.imgTopOffset);

                    $('.carouselLightboxDiv').animate({
                        margin: "-" + (_imgThis.height + (_this.divTopPadding))/2 +"px 0 0 -" + (_imgThis.width + (_this.divLeftPadding))/2 + "px", 
                        width: this.width, 
                        height: this.height
                    }, 400, function() {
                            var newHtml = "<span class='imgTitleCarouselLightbox'>"+ImgTitle+"</span>";
                            newHtml += "<a class='closeCarouselLightbox' href='javascript:;'>&nbsp;</a>";
                            newHtml += "<a class='carouselLightboxPrev' href='javascript:;'>&nbsp;</a>";
                            newHtml += "<ul>";

                            $(obj).parent(_this.parentClass).find(_this.baseClass).each(function(index) {
                                fullImgUrl = $(this).find('img').attr('src');

                                imgTitle = "";
                                if (typeof $(this).find('img').attr('title') !== 'undefined')
                                    imgTitle = $(this).find('img').attr('title');

                                if (index == _this.activeImageIndex) {
                                        newHtml += "<li class='active'><img data-imgtitle='"+ imgTitle +"' src='"+fullImgUrl+"' /></li>";
                                } else {
                                        newHtml += "<li><img data-imgtitle='"+ imgTitle +"' src='"+fullImgUrl+"' /></li>";
                                }
                            });
                            newHtml += "</ul>";
                            newHtml += "<a class='carouselLightboxNext' href='javascript:;'>&nbsp;</a>";

                            $('.carouselLightboxDiv').html(newHtml);

                            $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+')')
                                .css('height', parseInt(_imgThis.height)- (_this.divTopPadding*2)+'px');

                            $('.carouselLightboxOverlay').show();

                            _this.closeLightbox();
                            _this.nextImage();
                            _this.prevImage();
                    });
                }
                img.src = imgUrl;
    	},

    	nextImage: function() {
                var _this = this;

                if (_this.totalImages -1 == _this.activeImageIndex) {
                    $('.carouselLightboxDiv .carouselLightboxNext').addClass('hide');
                }

                $('.carouselLightboxDiv .carouselLightboxNext').unbind('click').bind('click', function() {
                        if (_this.totalImages -1 == _this.activeImageIndex) {
                            $(this).addClass('hide');
                            //_this.activeImageIndex = 0;
                        } else {
                            $(this).removeClass('hide');
                            $('.carouselLightboxDiv .imgTitleCarouselLightbox').text('');
                            _this.activeImageIndex = parseInt(_this.activeImageIndex) + 1;

                            $('.carouselLightboxDiv .carouselLightboxPrev').removeClass('hide');
                        }

                        _this.showImage();
                        _this.nextImage();
                });
    	},

    	prevImage: function() {
                var _this = this;

                if (_this.activeImageIndex <= 0) {
                    $('.carouselLightboxDiv .carouselLightboxPrev').addClass('hide');
                }

                $('.carouselLightboxDiv .carouselLightboxPrev').unbind('click').bind('click', function() {
                    if (_this.activeImageIndex < 0) {
                        $(this).addClass('hide');
                    } else {
                        $(this).removeClass('hide');
                        $('.carouselLightboxDiv .imgTitleCarouselLightbox').text('');
                        _this.activeImageIndex = parseInt(_this.activeImageIndex) - 1;

                        $('.carouselLightboxDiv .carouselLightboxNext').removeClass('hide');
                    }

                    _this.showImage();
                    _this.prevImage();
                });
    	},

    	showImage: function() {
                var _this = this;
                currentImg = $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+') img');

                $('.carouselLightboxDiv ul li').removeClass('active');

                var img = new Image();
                img.onload = function() {
                    var _imgThis = this;
                    if (this.width >= _this.maxWidth || this.height >= _this.maxHeight) {
                        
                        _this.getHeightWidthRatio(_imgThis.width, _imgThis.height, function(newWidth, newHeight){
                            _imgThis.width = parseInt(newWidth);
                            _imgThis.height = parseInt(newHeight);
                        });
                        
                        //this.width = _this.maxWidth;
                        //this.height = _this.maxHeight;
                    }

                    $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+')')
                            .css('height', parseInt(this.height) - (_this.divTopPadding)+'px');

                    $('.carouselLightboxDiv').animate({
                        margin: "-" + (_imgThis.height+(_this.divTopPadding))/2 +"px 0 0 -" + (_imgThis.width+(_this.divLeftPadding))/2 + "px",
                        width: this.width+"px", 
                        height: this.height+"px"
                    }, 400, function() {
                        ImgTitle = $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+') img').attr('data-imgtitle');

                        $('.carouselLightboxDiv .imgTitleCarouselLightbox').text(ImgTitle);
                        $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+')').addClass('active');
                    });
                }
                img.src = currentImg.attr('src');
    	},
            
            getHeightWidthRatio: function(imgWidth, imgHeight, callback) {
                var _this = this;
                
                if(imgWidth > _this.maxWidth){
                    ratio = parseInt(_this.maxWidth) / parseInt(imgWidth);
                    imgHeight = parseInt(imgHeight) * ratio;
                    imgWidth = parseInt(imgWidth) * ratio;
                }

                if(imgHeight > _this.maxHeight){
                    ratio = parseInt(_this.maxHeight) / parseInt(imgHeight);
                    imgWidth = parseInt(imgWidth) * ratio;
                    imgHeight = parseInt(imgHeight) * ratio;
                }
                
                callback(imgWidth, imgHeight);
            },

    	closeLightbox: function() {
                var _this = this;
                $('.closeCarouselLightbox').unbind('click').bind('click', function() {
                    $('.carouselLightboxOverlay, .carouselLightboxDiv').remove();
                    _this.appendLightboxDiv();
                });
                
                
                $('.carouselLightboxOverlay').unbind('click').bind('click', function (e){
                    var container = $(".carouselLightboxDiv");

                    if ((!container.is(e.target) 
                            && container.has(e.target).length === 0)) {
                        $('.carouselLightboxOverlay, .carouselLightboxDiv').remove();
                        _this.appendLightboxDiv();
                    }
                });
    	}
    };


    $.fn.lightboxCarousel = function() {
        if (typeof this.selector !== 'undefined')
            carouselLightbox.init(this.selector);
    };
}( jQuery ));

