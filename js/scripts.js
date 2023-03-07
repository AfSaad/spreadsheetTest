$(document).ready(function() {
	
	/* scroll */
	
	$("a[href^='#']").click(function(){
		var _href = $(this).attr("href");
		$("html, body").animate({scrollTop: $(_href).offset().top+"px"});
		return false;
	});

	/* timer */

	function update() {
		var Now = new Date(), Finish = new Date();
		Finish.setHours( 23);
		Finish.setMinutes( 59);
		Finish.setSeconds( 59);
		if( Now.getHours() === 23  &&  Now.getMinutes() === 59  &&  Now.getSeconds === 59) {
			Finish.setDate( Finish.getDate() + 1);
		}
		var sec = Math.floor( ( Finish.getTime() - Now.getTime()) / 1000);
		var hrs = Math.floor( sec / 3600);
		sec -= hrs * 3600;
		var min = Math.floor( sec / 60);
		sec -= min * 60;
		$(".timer .hours").text( pad(hrs));
		$(".timer .minutes").text( pad(min));
		$(".timer .seconds").text( pad(sec));
		setTimeout( update, 200);
	}
	function pad(s) { return ('00'+s).substr(-2) }
	update();

	/* sliders */

	$('.reviews_slider').slick({
		  dots: false,
		  infinite: true,
		  speed: 500,
		  fade: false,
		  cssEase: 'linear'
	});

	$('.reviews').slick({
		  dots: false,
		  infinite: true,
		  speed: 200,
		  fade: false,
		  cssEase: 'linear'
	}); 

	/* forms */

    $('form').validate({
        rules: {
            name: {
                required: true,
                maxlength: 200
            },
            phone: {
                required: true,
                maxlength: 200
            },
            address: {
                required: true,
                maxlength: 1000
            }
        },
        errorElement: 'p',
        errorClass: 'error-text',
        highlight: function(element) {
            $(element).addClass('has-error')
        },
        unhighlight: function(element) {
            $(element).removeClass('has-error')
        },
        submitHandler: function(form) {
			var formElement = $(form);
			var formData = new FormData(form);
			var product = $('meta[name="product"]').attr('content');
			formData.append('product', product);
			var btn = formElement.find('.submit-btn');
			btn.attr('disabled', true);
			btn.html('<span>جاري إرسال الطلب...</span>');
			$.ajax({
                url: '/api',
                type: 'POST',
                data: formData,
                contentType: false,
                cache: false,
                processData: false
            }).done(function() {
				window.location.href = '/success.html';
            }).fail(function() {
                alert("Oops!, Something went wrong !");
            });

            return false;
        }
    });

});