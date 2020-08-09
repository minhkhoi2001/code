Bizweb.money_format = "{{amount_no_decimals_with_comma_separator}} đ";
Bizweb.optionsMap = {};
Bizweb.optionsMapQuickview = {};

function updatePricing() {
    var regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
    var unitPriceTextMatch = $('.product .price').text().match(regex);
    if (!unitPriceTextMatch) {
        regex = /([0-9]+[.|,][0-9]+)/g;
        unitPriceTextMatch = $('.product .price').text().match(regex);
    }
    if (unitPriceTextMatch) {
        var unitPriceText = unitPriceTextMatch[0];
        var unitPrice = unitPriceText.replace(/[.|,]/g, '');
        var quantity = parseInt($('#quantity').val());
        var totalPrice = unitPrice * quantity;
        var totalPriceText = Bizweb.formatMoney(totalPrice, window.money_format);
        totalPriceText = totalPriceText.match(regex)[0];
        var regInput = new RegExp(unitPriceText, "g");
        var totalPriceHtml = $('.product .price').html().replace(regInput, totalPriceText);
        $('.product .total-price span').html(totalPriceHtml);
    }
}

function updatePricingQuickView() {
    var regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
    var unitPriceTextMatch = jQuery('.quick-view-product .price').text().match(regex);
    if (!unitPriceTextMatch) {
        regex = /([0-9]+[.|,][0-9]+)/g;
        unitPriceTextMatch = jQuery('.quick-view-product .price').text().match(regex);
    }
    if (unitPriceTextMatch) {
        var unitPriceText = unitPriceTextMatch[0];
        var unitPrice = unitPriceText.replace(/[.|,]/g, '');
        var quantity = parseInt(jQuery('.quick-view-product input[name=quantity]').val());
        var totalPrice = unitPrice * quantity;
        var totalPriceText = Bizweb.formatMoney(totalPrice, window.money_format);
        totalPriceText = totalPriceText.match(regex)[0];
        var regInput = new RegExp(unitPriceText, "g");
        var totalPriceHtml = jQuery('.quick-view-product .price').html().replace(regInput, totalPriceText);
        jQuery('.quick-view-product .total-price span').html(totalPriceHtml);
    }
}

function updateOptionsInSelector(t) {
    switch (t) {
        case 0:
            var n = "root";
            var r = $(".single-option-selector:eq(0)");
            break;
        case 1:
            var n = $(".single-option-selector:eq(0)").val();
            var r = $(".single-option-selector:eq(1)");
            break;
        case 2:
            var n = $(".single-option-selector:eq(0)").val();
            n += " / " + $(".single-option-selector:eq(1)").val();
            var r = $(".single-option-selector:eq(2)")
    }
    var i = r.val();
    r.empty();
    var s = Bizweb.optionsMap[n];
    if (typeof s != "undefined") {
        for (var o = 0; o < s.length; o++) {
            var u = s[o];
            var a = $("<option></option>").val(u).html(u);
            r.append(a)
        }
    }
    $('.swatch[data-option-index="' + t + '"] .swatch-element').each(function() {
        if ($.inArray($(this).attr("data-value"), s) !== -1) {
            $(this).removeClass("soldout").show().find(":radio").removeAttr("disabled", "disabled").removeAttr("checked")
        } else {
            $(this).addClass("soldout").hide().find(":radio").removeAttr("checked").attr("disabled", "disabled")
        }
    });
    if ($.inArray(i, s) !== -1) {
        r.val(i)
    }
    r.trigger("change")
};

function linkOptionSelectors(t) {
    for (var n = 0; n < t.variants.length; n++) {
        var r = t.variants[n];
        if (r.available) {
            Bizweb.optionsMap["root"] = Bizweb.optionsMap["root"] || [];
            Bizweb.optionsMap["root"].push(r.option1);
            Bizweb.optionsMap["root"] = Bizweb.uniq(Bizweb.optionsMap["root"]);
            if (t.options.length > 1) {
                var i = r.option1;
                Bizweb.optionsMap[i] = Bizweb.optionsMap[i] || [];
                Bizweb.optionsMap[i].push(r.option2);
                Bizweb.optionsMap[i] = Bizweb.uniq(Bizweb.optionsMap[i])
            }
            if (t.options.length === 3) {
                var i = r.option1 + " / " + r.option2;
                Bizweb.optionsMap[i] = Bizweb.optionsMap[i] || [];
                Bizweb.optionsMap[i].push(r.option3);
                Bizweb.optionsMap[i] = Bizweb.uniq(Bizweb.optionsMap[i])
            }
        }
    }
    updateOptionsInSelector(0);
    if (t.options.length > 1)
        updateOptionsInSelector(1);
    if (t.options.length === 3)
        updateOptionsInSelector(2);
    $(".single-option-selector:eq(0)").change(function() {
        updateOptionsInSelector(1);
        if (t.options.length === 3)
            updateOptionsInSelector(2);
        return true
    });
    $(".single-option-selector:eq(1)").change(function() {
        if (t.options.length === 3)
            updateOptionsInSelector(2);
        return true
    })
}
var responsiveflag = false;
$(document).ready(function() {
    $(".swatch :radio").change(function() {
        var t = $(this).closest(".swatch").attr("data-option-index");
        var n = $(this).val();
        $(this).closest("form").find(".single-option-selector").eq(t).val(n).trigger("change")
    });
    setLeftColumn();
    setRightColumn();
    productZoom();
    iniQuickView();
    iniWishlist();
    responsiveResize();
    $(window).resize(responsiveResize);
    offCanvas();
    setLeftColumn();
    floatHeader();
    floatTopbar();
    backtotop();
    panelTool();
    changeFloatHeader();
    changeLayoutMode();
    changeHeaderStyle();
    addFilterEffect();
    $('#page').click(function() {
        if ($("body").hasClass("off-canvas-active")) {
            $('[data-toggle="offcanvas"]').click();
        } else if ($("body").hasClass("off-canvas-lefht-active")) {
            $('[data-toggle="offcanvas-left"]').click();
        }
    });
    $(".offcanvas-mainnav").click(function(e) {
        e.stopPropagation();
    });
    $(".hover-bimg").mouseenter(function() {
        $(this).closest('.product-image-container').find('.product_img_link').first().find('img').first().attr('src', $(this).data('bimg'));
    });
    $(".hover-bimg").click(function() {
        $(this).closest('.ap-more-info').toggleClass("hidden-more");
    });
    $(".product-block").hover(function() {}, function() {
        $(this).find(".ap-more-info").removeClass("hidden-more");
    });
    $('.verticalmenu .dropdown-toggle').prop('disabled', true);
    $('.verticalmenu .dropdown-toggle').data('toggle', '');
    $(".verticalmenu .caret").click(function() {
        var $parent = $(this).parent().parent();
        $parent.toggleClass('open')
        return false;
    });
    if ($(document).width() > 990) $('.verticalmenu').addClass('active-hover');
    else $('.verticalmenu').removeClass('active-hover');
    $(window).resize(menuleftResize);
    scrollSliderBarMenu();
    $('.slide').on('slide.bs.carousel', function() {
        $(this).css('overflow', 'hidden');
    })
    $('.slide').on('slide.bs.carousel', function() {
        $(this).css('overflow', 'visible');
    })
    $('[data-toggle="tooltip"]').tooltip();
    addCheckedSwatch();
    $('.thumb_item').on('click', function() {
        $(this).each(function() {
            $(this).removeClass('shown');
        });
        $(this).toggleClass('shown');
    })
});
$(window).load(function() {
    productImage();
});
var product = {};
var currentLinkQuickView = '';
var option1 = '';
var option2 = '';

function setButtonNavQuickview() {
    $("#quickview-nav-button a").hide();
    $("#quickview-nav-button a").attr("data-index", "");
    var listProducts = $(currentLinkQuickView).closest(".slide").find("a.quick-view");
    if (listProducts.length > 0) {
        var currentPosition = 0;
        for (var i = 0; i < listProducts.length; i++) {
            if ($(listProducts[i]).data("handle") == $(currentLinkQuickView).data("handle")) {
                currentPosition = i;
                break;
            }
        }
        if (currentPosition < listProducts.length - 1) {
            $("#quickview-nav-button .btn-next-product").show();
            $("#quickview-nav-button .btn-next-product").attr("data-index", currentPosition + 1);
        }
        if (currentPosition > 0) {
            $("#quickview-nav-button .btn-previous-product").show();
            $("#quickview-nav-button .btn-previous-product").attr("data-index", currentPosition - 1);
        }
    }
    $("#quickview-nav-button a").click(function() {
        $("#quickview-nav-button a").hide();
        var indexLink = parseInt($(this).data("index"));
        if (!isNaN(indexLink) && indexLink >= 0) {
            var listProducts = $(currentLinkQuickView).closest(".slide").find("a.quick-view");
            if (listProducts.length > 0 && indexLink < listProducts.length) {
                $(listProducts[indexLink]).trigger("click");
            }
        }
    });
}

function iniQuickView() {
    $(document).on("click", "#thumblist_quickview li", function() {
        changeImageQuickView($(this).find("img:first-child"), "#product-featured-image-quickview");
    });
    $(document).on('click', '.quick-view', function(e) {
        var producthandle = $(this).data("handle");
        currentLinkQuickView = $(this);
        Bizweb.getProduct(producthandle, function(product) {
            var qvhtml = $("#quickview-modal").html();
            $(".quick-view-product").html(qvhtml);
            var quickview = $(".quick-view-product");
            var productdes = product.content.replace(/(<([^>]+)>)/ig, "");
            var featured_image = product.featured_image;
			if(featured_image == null){
					featured_image = 'http://bizweb.dktcdn.net/thumb/grande/assets/themes_support/noimage.gif';
				}
			
			
            productdes = productdes.split(" ").splice(0, 30).join(" ") + "...";
            quickview.find(".view_full_size img").attr("src", featured_image);
            quickview.find(".view_full_size img").attr("alt", product.name);
            quickview.find(".view_full_size a").attr("title", product.name);
            quickview.find(".view_full_size a").attr("href", product.url);
			quickview.find(".product-contact").html('');
			
			if (product.price < 1){
					quickview.find(".ajax_addtocart").fadeOut();
					quickview.find(".price").html('Giá: Liên Hệ');
				
					quickview.find(".compare-price").html(''); 
					quickview.find("quantity_wanted_p").css("display", "none");
				}else{
					quickview.find(".price").html(Bizweb.formatMoney(product.price, window.money_format ));
				
					quickview.find('.ajax_addtocart').show();
					quickview.find(".compare-price").html(Bizweb.formatMoney(product.compare_at_price_max, window.money_format )).show();
					quickview.find("quantity_wanted_p").css("display", "block");
					
				}
			
            
            quickview.find(".product-item").attr("id", "product-" + product.id);
            quickview.find(".variants").attr("id", "product-actions-" + product.id);
            quickview.find(".variants select").attr("id", "product-select-" + product.id);
            quickview.find(".product-info .qwp-name").text(product.name);
            quickview.find(".product-info .brand").append("<span>Nhà sản xuất: </span>" + product.vendor);
            if(product.available){
                  	quickview.find(".product-info .availability").html("<p class=\"available instock\">Còn hàng</p>");
                }else{
                  	quickview.find(".product-info .availability").html("<p class=\"available outstock\">Hết hàng</p>");
					quickview.find(".ajax_addtocart.btn").html( "Hết Hàng" ).prop( "disabled", true );
                }
            
			if(product.variants[0].sku){
				quickview.find(".product-info .product-sku").append("<p>Mã sản phẩm: <span>" + product.variants[0].sku + "</span></p>");
			 }else{
				 quickview.find(".product-info .product-sku").append("<b>Mã sản phẩm: </b>Đang cập nhật");
			 }
            quickview.find(".product-description").text(productdes);
            if (product.compare_at_price_max > product.price) {
                    quickview.find(".compare-price").html(Bizweb.formatMoney(product.compare_at_price_max, window.money_format )).show();
                    quickview.find(".price").addClass("on-sale")
                }
                else {
                    quickview.find(".compare-price").html("");
                    quickview.find(".price").removeClass("on-sale")
                }
				if (!product.available) {
					
					quickview.find(".add_to_cart_detail").text("Sold Out").addClass("disabled").attr("disabled", "disabled");
					quickViewVariantsSwatch(product, quickview);
					if(product.variants.length > 1){

						quickview.find("select, .dec, .inc").show();

					}else{
						quickview.find("select, .dec, .inc").hide();
					}
					if (product.price == 0){
					quickview.find(".quantity_wanted_p").css("display", "none");
					}else{
					quickview.find(".quantity_wanted_p").css("display", "block");
					}
				}
				else {
					quickViewVariantsSwatch(product, quickview);
					if (product.price == 0){
					quickview.find(".quantity_wanted_p").css("display", "none");
					}else{
					quickview.find(".quantity_wanted_p").css("display", "block");
					}
				}
			
            $("#quick-view-product").fadeIn(500);
            $(".view_scroll_spacer").removeClass("hidden");
            loadQuickViewSlider(product, quickview);
            $(".quick-view").fadeIn(500);
            if ($(".quick-view .total-price").length > 0) {
                $(".quick-view input[name=quantity]").on("change", updatePricingQuickView)
            }
            updatePricingQuickView();
            $(".js-qty__adjust").on("click", function() {
                var el = $(this),
                    id = el.data("id"),
                    qtySelector = el.siblings(".js-qty__num"),
                    qty = parseInt(qtySelector.val().replace(/\D/g, ''));
                var qty = validateQty(qty);
                if (el.hasClass("js-qty__adjust--plus")) {
                    qty = qty + 1;
                } else {
                    qty = qty - 1;
                    if (qty <= 1) qty = 1;
                }
                qtySelector.val(qty);
                updatePricingQuickView();
            });
            $(".js-qty__num").on("change", function() {
                updatePricingQuickView();
            });
        });
        return false;
    });
}

function loadQuickViewSlider(n, r) {
    productImage();
    var loadingImgQuickView = $('.loading-imgquickview');
    var s = Bizweb.resizeImage(n.featured_image, "grande");
    r.find(".quickview-featured-image").append('<a href="' + n.url + '"><img src="' + s + '" title="' + n.title + '"/><div style="height: 100%; width: 100%; top:0; left:0 z-index: 2000; position: absolute; display: none; background: url(' + window.loading_url + ') 50% 50% no-repeat;"></div></a>');
    if (n.images.length > 0) {
        var o = r.find(".more-view-wrapper ul");
        for (i in n.images) {
            var u = Bizweb.resizeImage(n.images[i], "grande");
            var a = Bizweb.resizeImage(n.images[i], "compact");
            var f = '<li><a href="javascript:void(0)" data-imageid="' + n.id + '" data-image="' + n.images[i] + '" data-zoom-image="' + u + '" ><img src="' + a + '" alt="Proimage" /></a></li>';
            o.append(f)
        }
        o.find("a").click(function() {
            var t = r.find("#product-featured-image-quickview");
            if (t.attr("src") != $(this).attr("data-image")) {
                t.attr("src", $(this).attr("data-image"));
                loadingImgQuickView.show();
                t.load(function(t) {
                    loadingImgQuickView.hide();
                    $(this).unbind("load");
                    loadingImgQuickView.hide()
                })
            }
        });
        o.owlCarousel({
            navigation: true,
            items: 3,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [979, 3],
            itemsTablet: [768, 3],
            itemsTabletSmall: [540, 3],
            itemsMobile: [360, 3]
        }).css("visibility", "visible")
    } else {
        r.find(".quickview-more-views").remove();
        r.find(".quickview-more-view-wrapper-jcarousel").remove()
    }
    productImage();
}

function updateQuantity() {
    $('.js-qty__adjust').on('click', function() {
        var el = $(this),
            id = el.data('id'),
            qtySelector = el.siblings('.js-qty__num'),
            qty = parseInt(qtySelector.val().replace(/\D/g, ''));
        var qty = validateQty(qty);
        if (el.hasClass('js-qty__adjust--plus')) {
            qty = qty + 1;
        } else {
            qty = qty - 1;
            if (qty <= 1) qty = 1;
        }
        qtySelector.val(qty);
        updatePricing();
    });
}
validateQty = function(qty) {
    if ((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {} else {
        qty = 1;
    }
    return qty;
};
var convertToSlug = function(e) {
    return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
}

function quickViewVariantsSwatch(t, quickview) {
    if (t.variants.length > 1) {
        for (var r = 0; r < t.variants.length; r++) {
            var i = t.variants[r];
            var s = '<option value="' + i.id + '">' + i.title + "</option>";
            quickview.find("form.variants > select").append(s)
        }
        var ps = "product-select-" + t.id;
        new Bizweb.OptionSelectors(ps, {
            product: t,
            onVariantSelected: selectCallbackQuickView
        });
        if (t.options.length == 1) {
            $(".selector-wrapper:eq(0)").prepend("<label>" + t.options[0].name + "</label>")
        }
        quickview.find("form.variants .selector-wrapper label").each(function(n, r) {
            $(this).html(t.options[n].name)
        })
    } else {
        quickview.find("form.variants > select").remove();
        var v = '<input type="hidden" name="variantId" value="' + t.variants[0].id + '">';
        quickview.find("form.variants").append(v)
    }
}
$(document).on('click', '.quick-view', function(e) {
    e.preventDefault();
});
$(document).on('click', '.quickview-close, #quick-view-product .quickview-overlay', function(e) {
    $("#quick-view-product").fadeOut(500);
});

function displayImage(domAAroundImgThumb)
{
	if (domAAroundImgThumb.attr('href'))
	{
		var new_src = domAAroundImgThumb.attr('href').replace('1024x1024', 'large');
		var new_title = domAAroundImgThumb.attr('title');
		var new_href = domAAroundImgThumb.attr('href');
		if ($('#bigpic').attr('src') != new_src)
		{
			$('#bigpic').attr({
				'src' : new_src,
				'alt' : new_title,
				'title' : new_title
			});
		}
		$('#views_block li a').removeClass('shown');
		$(domAAroundImgThumb).addClass('shown');
	}
}
function productZoom(status){
  	if(status == 'enable') {
  		$("#proimage").elevateZoom({
          	
            zoomType: "window",
            cursor: 'pointer',
          	
            gallery:'thumbs_list', 
            galleryActiveClass: 'active', 
            imageCrossfade: true,
          	scrollZoom : true,
          	onImageSwapComplete: function() {
              	$(".zoomWrapper div").hide()
            },
            loadingIcon: loadIcon
        });
        $("#proimage").bind("click", function(e) {
            var ez = $('#proimage').data('elevateZoom');	
            $.fancybox(ez.getGalleryList()); 
            return false; 
        });
    }
  	else{
    	$(document).on('click', '#thumblist .thumb_item a', function(){
            if ($(this).attr('href'))
            {
                var new_src = $(this).data('image');
                var new_title = $(this).attr('title');
                var new_href = $(this).attr('href');
                if ($('#proimage').attr('src') != new_src)
                {
                    $('#proimage').attr({
                        'src' : new_src,
                        'alt' : new_title,
                        'title' : new_title
                    });
                }
            }
        });
    }

}

function productImage() {
    $('#thumblist').owlCarousel({
        navigation: true,
        items: 3,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 3],
        itemsTabletSmall: [540, 3],
        itemsMobile: [360, 3]
    });
	$('.thumbs_list').serialScroll({
        items:'li:visible',
        prev:'.view_scroll_left',
        next:'.view_scroll_right',
        axis:'y',
        start:0,
        stop:true,
        duration:700,
        step: 1,
        lazy: true,
        lock: false,
        force:false,
        cycle:false
    });
    $('#thumblist_quickview').width(parseInt($('#thumblist_quickview >li').outerWidth(true) * $('#thumblist_quickview >li').length) + 'px').css('marginRight');
    $('#thumbs_list_quickview').serialScroll({
        items: 'li:visible',
        prev: '.view_scroll_left',
        next: '.view_scroll_right',
        axis: 'x',
        start: 0,
        stop: true,
        duration: 500,
        step: 1,
        lazy: true,
        lock: false,
        force: false,
        cycle: true
    });
    $('.thumbs_list_frame_2').height(parseInt($('.thumbs_list_frame_2 >li').outerHeight(true) * $('.thumbs_list_frame_2 >li').length) + 'px').css('marginBottom');
    $('.thumbs_list_2').serialScroll({
        items: 'li:visible',
        prev: '.view_scroll_left',
        next: '.view_scroll_right',
        axis: 'y',
        start: 0,
        stop: true,
        duration: 500,
        step: 1,
        lazy: true,
        lock: false,
        force: false,
        cycle: true
    });
    if (!!$.prototype.fancybox) {
        $('li:visible .fancybox, .fancybox.shown').fancybox({
            'hideOnContentClick': true,
            'openEffect': 'elastic',
            'closeEffect': 'elastic'
        });
    }
}

function iniWishlist() {
    $(".wishlist button.btn-wishlist").click(function(e) {
        e.preventDefault();
        var d = $(this).parent();
        $.ajax({
            type: "POST",
            url: "/contact",
            data: d.serialize(),
            beforeSend: function() {},
            success: function(n) {
                d.html('<a class="btn btn-outline-inverse btn-wishlist" href="/pages/wish-list">Go to Wishlist</a>');
                if (!!$.prototype.fancybox)
                    $.fancybox.open([{
                        type: 'inline',
                        autoScale: true,
                        minHeight: 30,
                        content: '<p class="fancybox-error">' + 'Added to your wishlist.' + '</p>'
                    }], {
                        padding: 0
                    });
                else
                    alert('Added to your wishlist.');
            },
            error: function() {}
        })
    });
}

function scrollCompensate() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";
    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;
    document.body.removeChild(outer);
    return (w1 - w2);
}

function responsiveResize() {
    compensante = scrollCompensate();
    if (($(window).width() + scrollCompensate()) <= 767 && responsiveflag == false) {
        accordionFooter('enable');
        responsiveflag = true;
    } else if (($(window).width() + scrollCompensate()) >= 768) {
        accordionFooter('disable');
        responsiveflag = false;
    }
}

function setLeftColumn() {
    $('body').append($('<div class="over-cover" style="display:none"></div><div class="drag-target"></div>'));
    $('.drag-target').click(function() {
        $('#left_column').addClass('side-nav');
        $('.over-cover').show();
    });
}

function offCanvas() {
    $('[data-toggle="offcanvas"]').click(function(e) {
        var menuCanvas = $(this).data('target');
        $(this).toggleClass('open');
        $(menuCanvas).toggleClass('active');
        $('body').toggleClass('off-canvas-active');
        var heightCanvas = $(window).height();
        $(menuCanvas).css({
            'min-height': heightCanvas
        });
        e.stopPropagation();
    });
    $('.off-canvas-nav').click(function() {
        $('[data-toggle="offcanvas"]').click();
    });
    $('[data-toggle="offcanvas-left"]').click(function(e) {
        var menuCanvas = $(this).data('target');
        $(this).toggleClass('open');
        $(menuCanvas).toggleClass('active');
        $('body').toggleClass('off-canvas-left-active');
        var heightCanvas = $(window).height();
        $(menuCanvas).css({
            'min-height': heightCanvas
        });
        e.stopPropagation();
    });
}

function accordion(status) {
    leftColumnBlocks = $('#left_column');
    if (status == 'enable') {
        if (!$('#left_column').hasClass('accordion')) {
            $('#right_column .block .title_block, #left_column .block .title_block').on('click', function() {
                $(this).toggleClass('active').parent().find('.block_content').stop().slideToggle('medium');
            });
        }
        $('#right_column, #left_column').addClass('accordion');
    } else {
        $('#right_column .block .title_block, #left_column .block .title_block').removeClass('active').off().parent().find('.block_content').removeAttr('style').slideDown('fast');
        $('#left_column, #right_column').removeClass('accordion');
    }
}

function accordionFooter(status) {
    if (status == 'enable') {
        if (!$('#footer').hasClass('accordion')) {
            $('#footer .footer-block h4').on('click', function() {
                $(this).toggleClass('active').parent().find('.block_content').stop().slideToggle('medium');
            })
        }
        $('#footer').addClass('accordion').find('.block_content').slideUp('fast');
    } else {
        $('.footer-block h4').removeClass('active').off().parent().find('.block_content').removeAttr('style').slideDown('fast');
        $('#footer').removeClass('accordion');
    }
}

function processFloatHeader(headerAdd, scroolAction) {
    if (headerAdd) {
        $("#header").addClass("navbar-fixed-top");
        $("#page").css("padding-top", $("#header").height());
        var hideheight = $("#header").height() + 120;
        var pos = $(window).scrollTop();
        if (scroolAction && pos >= hideheight) {
            $("#topbar").addClass('hide-bar');
            $(".hide-bar").css("margin-top", -$("#topbar").height());
            $(".header-bottom").css("display", "none");
        } else {
            $("#topbar").css("margin-top", 0);
            $(".header-bottom").css("display", "block");
        }
    } else {
        $("#header").removeClass("navbar-fixed-top");
        $("#page").css("padding-top", '');
        $("#header-main").removeClass('hidden');
        $("#apollo-menu").removeClass('hidden');
        $("#topbar").css("margin-top", 0);
    }
}

function processFloatTopbar(topbarAdd, scroolAction) {
    if (topbarAdd) {
        $("#header").addClass("navbar-fixed-top");
        $("#page").css("padding-top", $("#header").height());
        var hideheightBar = $("#header").height() + 120;
        var pos = $(window).scrollTop();
        if (scroolAction && pos >= hideheightBar) {
            $("#header-main").addClass('hidden');
            $("#apollo-menu").addClass('hidden');
        } else {
            $("#header-main").removeClass('hidden');
            $("#apollo-menu").removeClass('hidden');
        }
    } else {
        $("#header").removeClass("navbar-fixed-top");
        $("#page").css("padding-top", '');
        $("#header-main").removeClass('hidden');
        $("#apollo-menu").removeClass('hidden');
        $("#topbar").css("margin-top", 0);
    }
}

function floatHeader() {
    $(window).resize(function() {
        if (!$("body").hasClass("keep-header") || $(window).width() <= 990) {
            return;
        }
        if ($(window).width() <= 990) {
            processFloatHeader(0, 0);
        } else if ($(window).width() > 990) {
            if ($("body").hasClass("keep-header"))
                processFloatHeader(1, 1);
        }
    });
    $(window).scroll(function() {
        if (!$("body").hasClass("keep-header")) return;
        if ($(window).width() > 990) {
            processFloatHeader(1, 1);
        }
    });
}

function floatTopbar() {
    $(window).resize(function() {
        if (!$("body").hasClass("keep-topbar") || $(window).width() <= 990) {
            return;
        }
        if ($(window).width() <= 990) {
            processFloatTopbar(0, 0);
        } else if ($(window).width() > 990) {
            if ($("body").hasClass("keep-topbar"))
                processFloatTopbar(1, 1);
        }
    });
    $(window).scroll(function() {
        if (!$("body").hasClass("keep-topbar")) return;
        if ($(window).width() > 990) {
            processFloatTopbar(1, 1);
        }
    });
}

function backtotop() {
    $("#back-top").hide();
    $(function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
        $('#back-top a').click(function() {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });
}

function panelTool() {
    $('#paneltool .panelbutton').click(function() {
        $('#paneltool .paneltool').toggleClass('active');
    });
}

function changeFloatHeader() {
    $('#floatHeader').click(function() {
        if ($('body').hasClass('keep-header')) {
            $('body').removeClass('keep-header');
            processFloatHeader(0, 0);
        } else {
            processFloatTopbar(0, 0);
            $('body').addClass('keep-header');
            $('body').removeClass('keep-topbar');
            $("#floatTopbar").prop("checked", false);
        };
    });
    $('#floatTopbar').click(function() {
        if ($('body').hasClass('keep-topbar')) {
            $('body').removeClass('keep-topbar');
            processFloatTopbar(0, 0);
        } else {
            processFloatHeader(0, 0);
            $('body').addClass('keep-topbar');
            $('body').removeClass('keep-header');
            $("#floatHeader").prop("checked", false);
        };
    });
}

function changeLayoutMode() {
    $('.dynamic-update-layout').click(function() {
        var currentLayoutMode = $('.dynamic-update-layout.selected').data('layout-mode');
        if (!$(this).hasClass('selected')) {
            $('.dynamic-update-layout').removeClass('selected');
            $(this).addClass('selected');
            selectedLayout = $(this).data('layout-mode');
            $('body').removeClass(currentLayoutMode);
            $('body').addClass(selectedLayout);
        }
    });
}

function changeHeaderStyle() {
    $('.dynamic-update-header').click(function() {
        var currentHeaderMode = $('.dynamic-update-header.selected').data('header-style');
        if (!$(this).hasClass('selected')) {
            $('.dynamic-update-header').removeClass('selected');
            $(this).addClass('selected');
            selectedHeaderStyle = $(this).data('header-style');
            $('body').removeClass(currentHeaderMode);
            $('body').addClass(selectedHeaderStyle);
        }
    });
}

function addFilterEffect() {
    //if this page is collection page
        if($('.catalog_filters').length){
            $('.advanced-filter').each(function(){
                dataGroup = $(this).data('group');
                if(dataGroup != "Vendor"){
                    activeFilter='';
                    if($(this).hasClass('active-filter')) 
                        activeFilter=' checked="checked"';
                    
                    $('a', $(this)).each(function(){
                        var dataHandle = $(this).parent().data("handle");
                        $('<input class="chkval" type="checkbox" name='+dataGroup+activeFilter+' value="'+dataHandle+'"/>').insertBefore($(this));
                        $(this).click(function(event){
                           chkVal = $(this).parent().find('.chkval');
                            	$(this).closest('ul').find('.chkval').not($(this).parent().find('.chkval')).removeProp("checked");
                              chkVal.prop("checked", !chkVal.prop("checked"));
                            	$(this).closest('ul').find('.advanced-filter').not($(this).parent()).removeClass("active-filter");
                              $(this).parent().toggleClass("active-filter");
                              FilterLoadResult();
                            return false;
                        });
                    })
                }
            });
        }
    $("#SortBy").change(function(event) {
        event.preventDefault();
        var url = window.location.href;
        url = replaceUrlParam(url, 'sortby', $(this).val());
        processCollectionAjax(url);
        return false;
    });
    $(".change-view").click(function(event) {
        event.preventDefault();
        if ($(this).hasClass('change-view--active')) return false;
        $(".change-view").removeClass('change-view--active');
        $(this).addClass('change-view--active');
        var url = window.location.href;
        url = replaceUrlParam(url, 'view', $(this).data('view'));
        processCollectionAjax(url);
        $('.product_list').removeClass('list').removeClass('grid').addClass($(this).data('view'));
        return false;
    });
    pagingCollection();
}

function pagingCollection() {
    activeNumber = parseInt($('.pagination li.active span').html());
    $('.content_sortPagiBar .pagination a').click(function() {
        var pageNumber = 0;
        if ($(this).parent().hasClass('pagination_previous')) {
            pageNumber = activeNumber - 1;
        } else if ($(this).parent().hasClass('pagination_next')) {
            pageNumber = activeNumber + 1;
        } else {
            pageNumber = parseInt($(this).html());
        }
        if (pageNumber > 0) {
            var url = window.location.href;
            url = replaceUrlParam(url, 'page', pageNumber);
            processCollectionAjax(url);
        }
        return false;
    });
}

function FilterLoadResult() {
    var url = window.location.href;
    var constraint = '';
    $('.chkval').each(function() {
        if ($(this).is(":checked"))
            constraint += !constraint ? $(this).val().toLowerCase() : "+" + $(this).val().toLowerCase();
    });
    url = replaceUrlParam(url, 'constraint', constraint);
    processCollectionAjax(url);
}

function processCollectionAjax(url) {
    $.ajax({
        type: 'GET',
        url: url,
        data: {},
        beforeSend: function() {
            $('.product_list').addClass('loading');
        },
        complete: function(data) {
            $('.product_list').html($(".product_list", data.responseText).html());
            $('#pagination').remove();
            $('.content_sortPagiBar').html($(".content_sortPagiBar", data.responseText).html());
            $('.product_list').removeClass('loading');
            history.pushState({
                page: url
            }, url, url);
            pagingCollection();
        }
    });
}

function menuleftResize(removeOpen) {
    if ($(document).width() > 990) {
        $('.verticalmenu .dropdown').removeClass('open');
        $('.verticalmenu').addClass('active-hover');
    } else {
        $('.verticalmenu').removeClass('active-hover');
    }
}

function scrollSliderBarMenu() {
    var menuElement = $(".float-vertical");
    var columnElement = null;
    var maxWindowSize = 990;
    if ($(menuElement).hasClass('float-vertical-right'))
        columnElement = $("#right_column");
    else if ($(menuElement).hasClass('float-vertical-left'))
        columnElement = $("#left_column");
    if ($(columnElement).length && $(window).width() >= maxWindowSize) showOrHideSliderBarMenu(columnElement, menuElement, 1);
    $(".float-vertical-button").click(function() {
        if ($(menuElement).hasClass('active')) showOrHideSliderBarMenu(columnElement, menuElement, 0);
        else showOrHideSliderBarMenu(columnElement, menuElement, 1);
    });
    var lastWidth = $(window).width();
    $(window).resize(function() {
        if ($(window).width() != lastWidth) {
            if ($(window).width() < maxWindowSize) {
                if ($(menuElement).hasClass('active')) showOrHideSliderBarMenu(columnElement, menuElement, 0);
            } else {
                if ($(columnElement).length && !$(menuElement).hasClass('active')) showOrHideSliderBarMenu(columnElement, menuElement, 1);
            }
            lastWidth = $(window).width();
        }
    });
}

function showOrHideSliderBarMenu(columnElement, menuElement, active) {
    if (active) {
        $(menuElement).addClass('active');
        if ($(columnElement).length && $(window).width() >= 990)
            columnElement.css('padding-top', ($('.block_content', $(menuElement)).height() - 90) + 'px');
    } else {
        $(menuElement).removeClass('active');
        if ($(columnElement).length) columnElement.css('padding-top', '');
    }
}

function addCheckedSwatch() {
    $('.swatch .color label').on('click', function() {
        $('.swatch .color').each(function() {
            $(this).find('label').removeClass('checkedBox');
        });
        $(this).addClass('checkedBox');
    });
}

function setLeftColumn() {
    if ($("#left_column").length > 0) {
        if ($(".over-cover").length == 0) {
            $('body').append($('<div class="over-cover"></div><div class="drag-target-left"><div class="drag-panel-left"></div></div>'));
            $('body').append($('<a href="javascript:;" data-activates="slide-out" class="button-collapse-left"><i class="mdi-navigation-menu"></i></a>'));
        }
        $(".button-collapse-left").click(function() {
            $(".drag-target-left, .button-collapse-left").addClass("hide");
            $("body").addClass("move-left-to-right");
            $('#left_column').css("left", "-400px");
            setTimeout(function() {
                $("#left_column").parent().addClass("side-nav-container-left");
                $("#left_column").addClass("side-nav-left");
            }, 200);
        });
        $(".over-cover").click(function() {
            $(".drag-target-left, .button-collapse-left").removeClass("hide");
            $("#left_column").parent().removeClass("side-nav-container-left");
            $("#left_column").removeClass("side-nav-left");
            $("body").removeClass("move-left-to-right");
            $(".box-left-menu").addClass("menu-close");
            $('#left_column').css("left", "");
        });
        $(".drag-target-left").click(function() {
            console.log("drag-target click");
            $(".button-collapse-left").trigger("click");
        });
    }
}

function setRightColumn() {
    if ($("#right_column").length > 0) {
        if ($(".over-cover").length == 0) {
            $('body').append($('<div class="over-cover"></div><div class="drag-target-right"><div class="drag-panel-right"></div></div>'));
            $('body').append($('<a href="javascript:;" data-activates="slide-out" class="button-collapse-right"><i class="mdi-navigation-menu"></i></a>'));
        }
        $(".button-collapse-right").click(function() {
            $(".drag-target-right, .button-collapse-right").addClass("hide");
            $("body").addClass("move-right-to-left");
            $('#right_column').css("right", "-400px");
            setTimeout(function() {
                $("#right_column").parent().addClass("side-nav-container-right");
                $("#right_column").addClass("side-nav-right");
            }, 200);
        });
        $(".over-cover").click(function() {
            $(".drag-target-right, .button-collapse-right").removeClass("hide");
            $("#right_column").parent().removeClass("side-nav-container-right");
            $("#right_column").removeClass("side-nav-right");
            $("body").removeClass("move-right-to-left");
            $(".box-right-menu").addClass("menu-close");
            $('#right_column').css("right", "");
        });
        $(".drag-target-right").click(function() {
            console.log("drag-target click");
            $(".button-collapse-right").trigger("click");
        });
    }
}

function replaceUrlParam(url, paramName, paramValue) {
    var pattern = new RegExp('(' + paramName + '=).*?(&|$)'),
        newUrl = url.replace(pattern, '$1' + paramValue + '$2');
    if (newUrl == url) {
        newUrl = newUrl + (newUrl.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
    }
    return newUrl;
}