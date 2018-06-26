$(function() {
	var form = $("#formElem");
	var fname = $("#firstname");
	var lname = $("#lastname");
	var address = $("#streetaddress");
	var city = $("#city");
	var state = $("#state");
	var phone = $('#phone');
	var email = $('#email');

	var fieldsetCount = $('#formElem').children().length;
	var current = 1;
	var stepsWidth = 0;
	var widths = new Array();
	$('#steps .step').each(function(i) {
		var $step = $(this);
		widths[i] = stepsWidth;
		stepsWidth += $step.width();
	});
	$('#steps').width(stepsWidth);
	$('#formElem').children(':first').find(':input:first').focus();
	$('#navigation').show();
	$('#navigation a').bind('click', function(e) {
		var $this = $(this);
		var prev = current;
		$this.closest('ul').find('li').removeClass('selected');
		$this.parent().addClass('selected');
		current = $this.parent().index() + 1;
		$('#steps').stop().animate({
			marginLeft: '-' + widths[current - 1] + 'px'
		}, 500, function() {
			if (current == fieldsetCount)
				validateSteps();
			else
				validateStep(prev);
			$('#formElem').children(':nth-child(' + parseInt(current) + ')').find(':input:first').focus();
		});
		e.preventDefault();
	});
	$('#steps fieldset').each(function() {
		$(this).find('input:last').bind('keydown', function(e) {
			var $this = $('#navigation li.selected').next().find('a');
			var prev = current;

			$this.closest('ul').find('li').removeClass('selected');
			$this.parent().addClass('selected');
			current = $this.parent().index() + 1;

			if (e.keyCode == 9) {
				$('#steps').stop().animate({
					marginLeft: '-' + widths[current - 1] + 'px'
				}, 500, function() {
					if (current == fieldsetCount)
						validateSteps();
					else
						validateStep(prev);
					$('#formElem').children(':nth-child(' + parseInt(current) + ')').find(':input:first').focus();
				});

				e.preventDefault();
			}
		});
	});
	function validateSteps() {
		var FormErrors = false;
		for (var i = 1; i < fieldsetCount; ++i) {
			var error = validateStep(i);
			if (error == -1)
				FormErrors = true;
		}
		$('#formElem').data('errors', FormErrors);
	}
	function validateStep(step) {
		if (step == fieldsetCount) return;
		var error = 1;
		var hasError = false;
		$('#formElem').children(':nth-child(' + parseInt(step) + ')').find(':input:#firstname').not('button').each(function() {
			var $this = $(this);
			var fn = $('#firstname').val();
			var fnfilter = /^[a-zA-Z .-]+$/;
			if (!fnfilter.test(fn) || fn.length <= '2') {
				hasError = true;
				$this.css('background-color', '#FFEDEF');
			} else
				$this.css('background-color', '#FFFFFF');
		});
		$('#formElem').children(':nth-child(' + parseInt(step) + ')').find(':input:#lastname').not('button').each(function() {
			var $this = $(this);
			var ln = $('#lastname').val();
			var lnfilter = /^[a-zA-Z .-]+$/;
			if (!lnfilter.test(ln) || ln.length <= '2') {
				hasError = true;
				$this.css('background-color', '#FFEDEF');
			} else
				$this.css('background-color', '#FFFFFF');
		});
		$('#formElem').children(':nth-child(' + parseInt(step) + ')').find(':input:#streetaddress').not('button').each(function() {
			var $this = $(this);
			var add = $('#streetaddress').val();
			var streetfilter = /^[a-zA-Z0-9 #.]+$/;
			if (!streetfilter.test(add) || add.length <= '2') {
				hasError = true;
				$this.css('background-color', '#FFEDEF');
			} else
				$this.css('background-color', '#FFFFFF');
		});
		$('#formElem').children(':nth-child(' + parseInt(step) + ')').find(':input:#city').not('button').each(function() {
			var $this = $(this);
			var c = $('#city').val();
			var cityfilter = /^[a-zA-Z .]+$/;
			if (!cityfilter.test(c) || c.length <= '2') {
				hasError = true;
				$this.css('background-color', '#FFEDEF');
			} else
				$this.css('background-color', '#FFFFFF');
		});
		$('#formElem').children(':nth-child(' + parseInt(step) + ')').find(':input:#state').not('button').each(function() {
			var $this = $(this);
			if (state.val() == "") {
				hasError = true;
				$this.css('background-color', '#FFEDEF');
			} else {
				$this.css('background-color', '#FFFFFF');
			}
		});
		$('#formElem').children(':nth-child(' + parseInt(step) + ')').find(':input:#phone').not('button').each(function() {
			var $this = $(this);
			var regex1 = /^([2-9]{1}\d{2})([2-9]{1}\d{2})\d{4}$/;
			phone = $(this).val();
			phone = phone.replace(/[^0-9]/g, '');
			if (!regex1.test(phone)) {
				hasError = true;
				$this.css('background-color', '#FFEDEF');
			} else {
				area = phone.substring(0, 3);
				prefix = phone.substring(3, 6);
				line = phone.substring(6);
				$this.val('(' + area + ') ' + prefix + '-' + line);
				$this.css('background-color', '#FFFFFF');
			}
		});
		$('#formElem').children(':nth-child(' + parseInt(step) + ')').find(':input:#email').not('button').each(function() {
			var $this = $(this);
			var a = $('#email').val();
			var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
			if (filter.test(a)) {
				$this.css('background-color', '#FFFFFF');
			} else {
				hasError = true;
				$this.css('background-color', '#FFEDEF');
			}
		});
		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		var valclass = 'checked';
		if (hasError) {
			error = -1;
			valclass = 'error';
		}
		$('<span class="' + valclass + '"></span>').insertAfter($link);
		return error;
	}

	function validateFName() {
		var error = 1;
		var hasError = false;
		var $this = $(this);
		var fn = $('#firstname').val();
		var fnfilter = /^[a-zA-Z .-]+$/;
		if (!fnfilter.test(fn) || fn.length <= '2') {
			hasError = true;
			$this.css('background-color', '#FFEDEF');
		} else {
			$this.css('background-color', '#FFFFFF');
		}
	}

	function validateLName() {
		var error = 1;
		var hasError = false;
		var $this = $(this);
		var ln = $('#lastname').val();
		var lnfilter = /^[a-zA-Z .-]+$/;
		if (!lnfilter.test(ln) || ln.length <= '2') {
			hasError = true;
			$this.css('background-color', '#FFEDEF');
		} else {
			$this.css('background-color', '#FFFFFF');
		}
	}

	function validateAddress() {
		var error = 1;
		var hasError = false;
		var $this = $(this);
		var add = $('#streetaddress').val();
		var streetfilter = /^[a-zA-Z0-9 #.]+$/;
		if (!streetfilter.test(add) || add.length <= '2') {
			hasError = true;
			$this.css('background-color', '#FFEDEF');
		} else {
			$this.css('background-color', '#FFFFFF');
		}
	}

	function validateCity() {
		var error = 1;
		var hasError = false;
		var $this = $(this);
		var c = $('#city').val();
		var filter = /^[a-zA-Z .]+$/;
		if (!filter.test(c) || c.length <= '2') {
			hasError = true;
			$this.css('background-color', '#FFEDEF');
		} else {
			$this.css('background-color', '#FFFFFF');
		}
	}

	function validateState() {
		var error = 1;
		var hasError = false;
		var $this = $(this);
		if (state.val() == "") {
			hasError = true;
			$this.css('background-color', '#FFEDEF');
		} else {
			$this.css('background-color', '#FFFFFF');
		}
	}

	function validatePhone() {
		var error = 1;
		var hasError = false;
		var $this = $(this);
		var regex1 = /^([2-9]{1}\d{2})([2-9]{1}\d{2})\d{4}$/;
		phone = $(this).val();
		phone = phone.replace(/[^0-9]/g, '');
		if (!regex1.test(phone)) {
			hasError = true;
			$this.css('background-color', '#FFEDEF');
		} else {
			area = phone.substring(0, 3);
			prefix = phone.substring(3, 6);
			line = phone.substring(6);
			$this.val('(' + area + ') ' + prefix + '-' + line);
			$this.css('background-color', '#FFFFFF');
		}
	}

	function validateEmail() {
		var error = 1;
		var hasError = false;
		var $this = $(this);
		var a = $('#email').val();
		var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
		if (filter.test(a)) {
			$this.css('background-color', '#FFFFFF');
		} else {
			hasError = true;
			$this.css('background-color', '#FFEDEF');
		}
	}
});