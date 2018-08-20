var CLS_EACHFIELD = "st-eachfield";
var CLS_ROW = "st-row";
var CLS_EACHFIELD_ROW = CLS_EACHFIELD + ' ' + CLS_ROW;
var CLS_LABEL_AREA = "st-label-area";
var CLS_INPUT_AREA = "st-input-area";
var CLS_INPUT = "form-control";
var CLS_ERROR_MSG = "st-error-msg";
var CLS_LABEL = "st-label-txt";
var CLS_CHECKBOX = "st-checkbox";
var CLS_DATE_PICKER = "st-date-picker" + " " + CLS_INPUT;
var CLS_COMBO_BOX = "custom-select";

$.jMaskGlobals.watchDataMask = true;

$(document).ready(function(){
	UiUtil.DisplayMsgHide();
	$(document).ready($('button#ttxcvtyl').click(function(){
		var newimg=$('span',this).css('background-image');
		var fileonly = getFileNameFromPath(newimg);
		var cmpimg='arr_white.gif';
		if (fileonly === cmpimg)
			newimg='url(img/arrv_white.gif)';
		else 
			newimg='url(img/arr_white.gif)';
		$('span',this).css('background-image',newimg);
	}));
}); 
function getFileNameFromPath(path) {
	var pos = path.indexOf('(') + 1;
	path = path.slice(pos, -1);
	path = path.replace(/["']{1}/gi, '');
	var ary = path.split('/');
	return ary[ary.length - 1];
}; 
function displayMsg(type, mesg) {
	var msgPlace = document.getElementById('msgArea');
	if (msgPlace !== undefined && msgPlace !== null) {
		if (mesg !== undefined) {
			msgPlace.innerHTML = mesg;
		} else {
			msgPlace.innerHTML = 'Error message is not correctly set, undefine value';
		}

		var msgIcon = document.getElementById('msgImage');
		msgIcon.setAttribute('src', 'img/imgInfo.gif');
		if (type.toLowerCase() === 'error') {
			msgIcon.setAttribute('src', 'img/exclamation.gif');
		}
	}
}
function blinkError(errorStatus, errorMsg, errorField) {
	if (errorMsg === undefined) {
		displayMsg('error', "Server responded with undefine error message, please report to <a href='mailto:shujutech@gmail.com'>shujutech@gmail.com</a>");
		return;
	}

	displayMsg(errorStatus, "System error, " + errorMsg + ", please report to <a href='mailto:shujutech@gmail.com'>shujutech@gmail.com</a>");
	if (UiUtil.NotUndefineNotNull(errorField)) {
		var allLabel = document.getElementsByTagName('LABEL');
		for(var cntr = 0; cntr < allLabel.length; cntr++){
			for(var cntrError = 0; cntrError < errorField.length; cntrError++){
				if (allLabel[cntr].innerHTML.indexOf(errorField[cntrError]) !== -1) {
					var parentDiv = allLabel[cntr].parentNode;
					for(var count = 0; count < parentDiv.childNodes.length; count++) {
						if (parentDiv.childNodes[count].tagName === 'IMG') {
							//var img = parentDiv.childNodes[count];
							//img.setAttribute('src', 'img/imgErrorBlink.gif');
							//$(img).css("display", "");
						}
					}
				}
			}
		}
	}
}
function setErrStr(xhr, err) {
	//var errMsg = "readyState: " + xhr.readyState+ "\nstatus: " + xhr.status + "\nresponseText: " + xhr.responseText;
	var errMsg = "readyState: " + xhr.readyState + ", \nstatus: " + xhr.status + ", \nerror: " + err;
	return(errMsg);
}
function getVarByJsonPath(fromObject, fieldFullName) {
	var pthAry = fieldFullName.split('.');
	var result = fromObject;
	for (var cntr = 0; cntr < pthAry.length; cntr++) {
		var key = pthAry[cntr];
		if (key.indexOf("[") === -1) {
			result = result.data[key];
		} else {
			var idxPt = key.match(/\[(.*?)\]/g);
			var nmePt = key.substr(0, key.indexOf(idxPt));
			var idxPt = idxPt[0].split('[')[1].split(']')[0];
			result = result.data[nmePt].dataset[idxPt];
			if (result === undefined) break;
		}
	}
	return(result);
}
$(document).ready(function(){
	$('.lityjtno').click(function () {
		$('.lityjtno').css('background', 'url(img/loading.gif) no-repeat center center');
	});
}); 
function getNotCloneElement(aElementId) {
	var normJqVar = aElementId.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.');
	var escJqVar = "[id='" + normJqVar + "']";
	var dupSlider = $(escJqVar);
	for(var cntr = 0; cntr < dupSlider.length; cntr++) {
		if (dupSlider[cntr].areaEdit !== undefined) {
			return(dupSlider[cntr]);
		}
	}
};
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function removeTime(aDateTime) {
var aryDateTime = aDateTime.split(' ');
var dateOnly = aryDateTime[0];
return(dateOnly);
};
function removeTimeFromDataset(aDataset, aTargetField) {
	for(var idx in aDataset) {
		var startDateTime = getVarByJsonPath(aDataset[idx], aTargetField);
		if (startDateTime !== undefined) {
			var startDateOnly = removeTime(startDateTime.data);
			startDateTime.data = startDateOnly;
		}
	}
};
function FormatMoney(aStrMoney) {
	if (aStrMoney === undefined) return("");
	var currency;
	var amount;
	var arySplit = aStrMoney.split(/[ ]+/);
	if (arySplit.length !== 0) {
		currency = arySplit[0];
		amount = arySplit[1];
	} else {
		currency = aStrMoney.substring(0, 3);
		amount = aStrMoney.substring(3);
	}

	if (UiUtil.NotUndefineNotNull(amount)) {
		var amountDecimal = DecimalPlace(amount);
		var result = currency + " " + NumberWithComma(amountDecimal);
		return(result);
	} else {
		return("<Error>");
	}
}
function MakeObjData(aValue) {
	var result = {};
	result.data = aValue;
	return(result);	
}
function DecimalPlace(aNum) {
	var strNum = aNum.toString();
	var pureNum = strNum.replace(/,/g , "");
	var result = parseFloat(Math.round(pureNum * 100) / 100).toFixed(2);
	return(result);
};
function Str2Num(aStr) {
	var result = Number(aStr.replace(/[^0-9\.]+/g,""));
	return(result);
};
function NumberWithComma(aNum) {
	return aNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


// https://stackoverflow.com/questions/2655925/how-to-apply-important-using-css
(function($) {    
  if ($.fn.style) {
    return;
  }

  // Escape regex chars with \
  var escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // For those who need them (< IE 9), add support for CSS functions
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
      this.setAttribute(styleName, value);
      var priority = typeof priority != 'undefined' ? priority : '';
      if (priority != '') {
        // Add priority manually
        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
            '(\\s*;)?', 'gmi');
        this.cssText =
            this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
      }
    };
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
          'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }

  // The style function
  $.fn.style = function(styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node
    if (typeof node == 'undefined') {
      return this;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
      if (typeof value != 'undefined') {
        // Set style property
        priority = typeof priority != 'undefined' ? priority : '';
        style.setProperty(styleName, value, priority);
        return this;
      } else {
        // Get style property
        return style.getPropertyValue(styleName);
      }
    } else {
      // Get CSSStyleDeclaration
      return style;
    }
  };
})(jQuery);



/*
 * 
 * 
 * Start of using UiUtil as the namespace instead of just 
 * global function above. We migrate it over to use the UiUtil
 * namespace gradually.
 * 
 * 
*/

var UiUtil = {};
UiUtil.ImgErrorBlink = "img/imgErrorBlink.gif";
UiUtil.Months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

UiUtil.SpecialCharReplace = function(aFunctionName) {
	var result = aFunctionName.replace(/ /g, "_");
	result = result.replace(/\[/g, "bracketo");
	result = result.replace(/\]/g, "bracketc");
	result = result.replace(/\./g, "dot");
	return(result);
};
UiUtil.SpecialCharUnplace = function(aFunctionName) {
	var result = aFunctionName.replace(/bracketo/g, "[");
	result = result.replace(/bracketc/g, "]");
	result = result.replace(/dot/g, ".");
	return(result);
};
UiUtil.ScriptAddWithRemove = function(strScript, idName) {
	var tmp = UiUtil.ScriptAdd(strScript);
	tmp.setAttribute("id", idName);
	//this.sourceToBeRemove.push(idName);
};
UiUtil.ScriptAdd = function(strScript) {
	var head = document.getElementsByTagName('head')[0];
	var scpt = document.createElement('script');
	scpt.type = 'text/javascript';
	scpt.appendChild(document.createTextNode(strScript));
	head.appendChild(scpt);
	return(scpt);
};
UiUtil.GetJsonPath = function(aBasePath, fieldName) {
	if (aBasePath !== "" && fieldName !== "") {
		aBasePath += ".";
	}
	aBasePath += fieldName;
	return(aBasePath);
};
UiUtil.DialogMaxLen = function(aMsg) {
	var result = "";
	var strAry = aMsg.match(/\b(.{1,70})/g);	
	var eachStr;
	for(eachStr of strAry) {
		if (result !== "") {
			result += "<br>" + eachStr;
		} else {
			result += eachStr;
		}
	}

	return(result);
};
UiUtil.DialogStr2Html = function(msgHtml) {
	if (typeof msgHtml === "string") {
		var properLenStr = UiUtil.DialogMaxLen(msgHtml);
		msgHtml = "<div style='display: block'>" + properLenStr + "</div>";
	}

	return(msgHtml)
};
UiUtil.DialogWaitStart = function(aWaitMsg) {
	var waitMsg = "<div style='margin-top: 20px; min-width: 500px'></div>" 
	+ "<div style='margin: auto' class='loadersmall'></div>" 
	+ "<div style='width: 100%; text-align: center; font-size: 20px; padding-top: 20px'>Please wait...</div>";
	if (UiUtil.NotUndefineNotNullNotBlank(aWaitMsg)) {
		waitMsg += "<div style='width: 100%; text-align: center; font-size: 13px; padding-top: 7px; font-weight: 300'>" + aWaitMsg + "<div>";
	}
	swal({
		title: waitMsg
		, html: "<div id='st-swal-dialog-wait' style='display: none'></div>"
		, allowOutsideClick: false
		, timer: 30000
		, showCancelButton: false
		, showConfirmButton: false 
	});
};
UiUtil.DialogWaitStop = function() {
	if ($("#st-swal-dialog-wait").length !== 0) {
		swal.close();
	}
};
UiUtil.DialogYesNo = function(titleHtml, msgHtml, jsYes, jsNo) {
	var strType = undefined;
	if (typeof msgHtml === "string") {
		msgHtml = UiUtil.DialogStr2Html(msgHtml);
		strType = 'question';
	}
	swal({
		title: titleHtml
		, html: msgHtml
		, type: strType
		, showConfirmButton: true
		, showCancelButton: true
		, confirmButtonText: 'Yes'
		, cancelButtonText: 'No'
		, focusConfirm: true
		, allowOutsideClick: false
	})
	.then((value) => {
		if (UiUtil.DialogAnswerOk(value)) {
			if (UiUtil.NotUndefineNotNullNotBlank(jsYes)) {
				jsYes();
			}
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(jsNo)) {
				jsNo();
			}
		}
	});
};
UiUtil.DialogAnswerOk = function(value) {
	var result = false;
	if (UiUtil.NotUndefineNotNullNotBlank(value.value)) {
		if (value.value === true) {
			result = true;
		}
	}

	return(result);	
};
UiUtil.DialogOkCancel = function(titleHtml, msgHtml, jsOk, jsCancel, firstInput) {
	var strType = undefined;
	if (typeof msgHtml === "string") {
		msgHtml = UiUtil.DialogStr2Html(msgHtml);
		strType = 'question';
	}
	swal({
		title: titleHtml
		, html: msgHtml
		, type: strType
		, showConfirmButton: true
		, showCancelButton: true
		, focusConfirm: false 
		, allowOutsideClick: false
		, onOpen: function() {
			if (UiUtil.NotUndefineNotNullNotBlank(firstInput)) {
				$(firstInput).focus();
			}
		}
	})
	.then((value) => {
		if (UiUtil.DialogAnswerOk(value)) {
			if (UiUtil.NotUndefineNotNullNotBlank(jsOk)) {
				jsOk();
			}
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(jsCancel)) {
				jsCancel();
			}
		}
	});
};
UiUtil.DialogError = function(msgHtml, jsAction) {
	UiUtil.DialogInfo("Error", msgHtml, jsAction);
};
UiUtil.DialogInfo = function(titleHtml, msgHtml, jsAction) {
	msgHtml = UiUtil.DialogStr2Html(msgHtml);
	swal({
		title: titleHtml
		, html: msgHtml
		, showConfirmButton: true
		, showCancelButton: false 
		, focusConfirm: true
		, allowOutsideClick: false
	})
	.then((value) => {
		if (UiUtil.NotUndefineNotNullNotBlank(jsAction)) {
			jsAction();
		}
	});
};
UiUtil.IsNum = function(aDgtMth) {
	var strDgtMth = aDgtMth;
	if (typeof aDgtMth !== "string") {
		strDgtMth = "" + aDgtMth; // convert to string
	}
	var isNum = /^\d+$/.test(strDgtMth);
	return(isNum);
};
UiUtil.MthAbbrv = function(aDgtMth) {
	var isNum = UiUtil.IsNum(aDgtMth); 
	if (isNum) {
		var intDgtMth = parseInt(aDgtMth);
		if (intDgtMth >= 0 &&intDgtMth <= 11) {
			return(UiUtil.Months[intDgtMth].substr(0,3));
		} else {
			return("");
		}
	} else {
		return("");
	}
};
UiUtil.MthNum = function(aStrMth) {
	for(var cntr = 0; cntr < UiUtil.Months.length; cntr++) {
		var strMth = UiUtil.Months[cntr];
		var abbrvMth = strMth.substr(0, 3);
		if (abbrvMth === aStrMth) {
			return(cntr + 1);
		}
	}
};
UiUtil.PadZero = function(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
};
UiUtil.DisplayDateToDate = function(aStrDate) {
	var result = new Date();
	if (UiUtil.NotUndefineNotNullNotBlank(aStrDate)) {
		var aryDate = aStrDate.split("-");
		var day = aryDate[0];
		var mth = aryDate[1];
		var yer = aryDate[2];
		var numMth = UiUtil.MthNum(mth);
		var dateISO = yer + "-" + UiUtil.PadZero(numMth, 2) + "-" + day;
		result = new Date(dateISO);
	}

	return(result);
};
UiUtil.DateMonthStart = function(aDate) {
	var result = new Date(aDate.getFullYear(), aDate.getMonth(), 1);
	return(result);
};
UiUtil.DateMonthEnd = function(aDate) {
	var result = new Date(aDate.getFullYear(), aDate.getMonth() + 1, 0);
	return(result);
};
UiUtil.DateForDisplay = function(aDate) {
	var date = aDate;
	if (aDate === undefined || aDate === null) {
		date = new Date();
	} 
	var numDay = date.getDate();
	var numMth = date.getMonth(); // starts from 0
	var numYear = date.getFullYear();
	var result = UiUtil.PadZero(numDay, 2) + "-" + UiUtil.MthAbbrv(numMth) + "-" + numYear;
	return(result);
};
UiUtil.InputFieldForBE = function(aDivName) {
	var input = $("#" + aDivName).find("input");
	return(input.val());
};
UiUtil.ComboBoxForBE = function(aDivName) {
	var input = $($('#' + aDivName).find('select')[0]);
	return(input.val());
};
UiUtil.DatePickerToStrDate = function(aDivName) {
	var aryInput = $("#" + aDivName).find("input");
	var day = aryInput[0].value;
	var mth = aryInput[1].value; // starts from 1
	var yer = aryInput[2].value;
	var result = day + "-" + UiUtil.MthAbbrv(parseInt(mth) - 1) + "-" + yer;
	return(result);
};
UiUtil.SetDatePickerValue = function(aDivName, aDateValue) {
	var aryInput = $("#" + aDivName).find("input");
	aryInput[0].value = UiUtil.PadZero(aDateValue.getDate(), 2);
	aryInput[1].value = UiUtil.PadZero(aDateValue.getMonth() + 1, 2);
	aryInput[2].value = aDateValue.getFullYear();
};
UiUtil.GetDatePickerValue = function(aDivName) {
	var aryInput = $("#" + aDivName).find("input");
	var day = aryInput[0].value;
	var mth = aryInput[1].value; // starts from 1
	var yer = aryInput[2].value;
	var result = new Date(yer, parseInt(mth) - 1, day);
	return(result);
};
UiUtil.GetRandom5 = function() {
	return(Math.floor(Math.random()*90000) + 10000);
};
UiUtil.GenElementId = function(aId, aFieldFqn, aPrefix) {
	// generate element id according to slideIndex and field Fqn
	var genId;
	if (UiUtil.NotUndefineNotNullNotBlank(aId)) {
		genId = aId;
	} else if (UiUtil.NotUndefineNotNullNotBlank(aFieldFqn)) {
		var fqnName = UiUtil.SpecialCharReplace(aFieldFqn);
		if (UiUtil.NotUndefineNotNullNotBlank(aPrefix)) {
			genId = aPrefix + fqnName;
		} else {
			genId = "wt_" + fqnName;
		}
	} else {
		genId = "wt_rd" + UiUtil.GetRandom5();
	}
	
	return(genId);
};
UiUtil.GetFieldId = function(aElementId) {
	var result = UiUtil.SpecialCharUnplace(aElementId);
	return (aElementId.substr(3));
};
UiUtil.MaskNumberWithWidth = function(aSize) {
	var theMask = "###,###,###,###,###,###,##0";
	if (UiUtil.NotUndefineNotNullNotBlank(aSize)) {
		theMask = "0";
		for(var cntr = 1; cntr < parseInt(aSize); cntr++) {
			if (theMask.length % 3 === 0) {
				theMask = "," + theMask;
			}
			theMask = "#" + theMask;
		}
	}
	return(theMask);
};
UiUtil.CreateTextField = function(displayLabel, aValue, aSize, aId, aFieldType, aFieldMask, aFieldFqn) {
	var inputTxt = UiUtil.CreateTextFieldNoLabel(aId, aValue);

	var elementId = UiUtil.GenElementId(aId, aFieldFqn);
	inputTxt.setAttribute("id", elementId);

	if (aSize !== undefined) {
		inputTxt.setAttribute("size", aSize);
	}

	// mask according to given mask or data type
	if (UiUtil.NotUndefineNotNull(aFieldMask)) {
		inputTxt.setAttribute("data-mask", aFieldMask);
		var maskPlaceholder = aFieldMask.replace(/0/g , " ");
		maskPlaceholder = maskPlaceholder.replace(/#/g , " ");
		inputTxt.setAttribute("placeholder", maskPlaceholder);
	} else {
		if (UiUtil.NotUndefineNotNull(aFieldType)) {
			if (aFieldType === "integer") {
				var theMask = UiUtil.MaskNumberWithWidth(aSize);
				inputTxt.setAttribute("data-mask", theMask);
			}
		}
	}

	var widgetGrp = UiUtil.CreateTextFieldWithLabel(displayLabel, inputTxt);
	return(widgetGrp);
};
UiUtil.CheckJsonBlank = function(aJson, aName, aErrorMsg) {
	var result = false;
	var strVal = UiUtil.GetValueByJsonPath(aJson, aName);	
	if (UiUtil.IsBlank(strVal)) {
		result = true;
		UiUtil.DialogInfo('Invalid input', aErrorMsg, function(){}); // no support for focus unless generated input-area got predictable id
	}
	return(result);
};
UiUtil.CheckBlank = function(aElement, aErrorMsg) {
	var result = false;
	if (UiUtil.IsBlank(aElement.val())) {
		result = true;
		UiUtil.DialogInfo('Invalid input', aErrorMsg, function(){ aElement.focus();});
	}
	return(result);
};
UiUtil.IsJsonBlank = function(aJson, aName) {
	var result = false;
	var strVal = UiUtil.GetValueByJsonPath(aJson, aName);	
	if (UiUtil.IsBlank(strVal)) {
		result = true;
	}
	return(result);
};
UiUtil.IsBlank = function(aValue) {
	if (typeof aValue === 'undefined') {
		return(true);
	} else if (aValue === null) {
		return(true);
	} else if (aValue.trim() === "") {
		return(true);
	} else {
		return(false);
	}
};
UiUtil.IsFunction = function(functionToCheck) {
	if (UiUtil.NotUndefineNotNull(functionToCheck)) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
	return(false);
};
UiUtil.IsFunction = function(functionToCheck) {
	if (UiUtil.NotUndefineNotNull(functionToCheck)) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
	return(false);
};
UiUtil.NotUndefineNotNull = function(aVar) {
	if ((typeof aVar !== 'undefined') && (aVar !== null) && aVar !== "undefined") {
		return(true);
	}
	return(false);
};
UiUtil.NotUndefineNotNullNotBlank = function(aVar) {
	if (UiUtil.NotUndefineNotNull(aVar)) {
		if (typeof aVar === "string") {
			if (aVar.trim().length !== 0) {
				return(true);
			} else {
				return(false);
			}
		} else {
			return(true);
		}
	}
	return(false);
};
UiUtil.DisplayMsgHide = function() {
	if (UiUtil.NotUndefineNotNull($("#msgArea"))) {
		if (UiUtil.NotUndefineNotNullNotBlank($("#msgArea").html())) {
			$("#msgImage").css("display", "");
			$("#msgArea").css("display", "");
		} else {
			$("#msgImage").css("display", "none");
			$("#msgArea").css("display", "none");
		}
	}
};
UiUtil.DisplayMsg = function(type, mesg) {
	if (UiUtil.NotUndefineNotNull(mesg) === false) return;
	var msgPlace = document.getElementById('msgArea');
	if (UiUtil.NotUndefineNotNull(msgPlace)) {
		if (mesg !== undefined) {
			msgPlace.innerHTML = mesg;
		} else {
			msgPlace.innerHTML = 'Error message is not correctly set, undefine value';
		}

		var msgIcon = document.getElementById('msgImage');
		msgIcon.setAttribute('src', 'img/imgInfo.gif');
		if (type.toLowerCase() === 'error') {
			msgIcon.setAttribute('src', 'img/exclamation.gif');
		}
	}
	UiUtil.DisplayMsgHide();
};
UiUtil.DialogReport2Us = function(aMsg, aAfterAck) {
	UiUtil.DialogBlink(aMsg, aAfterAck);
};
UiUtil.DialogBlink = function(aMsg, aAfterAck) {
	var respond = {};
	respond.status = 'error';
	respond.msg = aMsg;
	UiUtil.BlinkError(respond, aAfterAck);
};
UiUtil.BlinkError = function(respond, aAfterAck) {
	var errorStatus = respond.status;
	var errorMsg = respond.msg;
	var errorField = respond.errorField;
	if (!UiUtil.NotUndefineNotNullNotBlank(errorMsg)) {
		strErrorMsg = 'System error', "Undefine error, please report to <a href='mailto:shujutech@gmail.com'>shujutech@gmail.com</a>";
	} else {
		if (errorMsg.length > 253) {
			strErrorMsg = errorMsg.substring(0, 253).trim() + ".."; // kiv, maybe should only truncate msg part and retain the email part
		} else {
			strErrorMsg = errorMsg;
		}
	}

	UiUtil.DisplayMsg(errorStatus, strErrorMsg);
	UiUtil.DialogInfo('Error', strErrorMsg, aAfterAck);	
	if (UiUtil.NotUndefineNotNull(errorField)) { // place error marker at all error fields
		var allLabel = document.getElementsByTagName('LABEL');
		for(var cntr = 0; cntr < allLabel.length; cntr++){
			for(var cntrError = 0; cntrError < errorField.length; cntrError++){
				if (allLabel[cntr].innerHTML.indexOf(errorField[cntrError]) !== -1) {
					var parentDiv = allLabel[cntr].parentNode;
					for(var count = 0; count < parentDiv.childNodes.length; count++) {
						if (parentDiv.childNodes[count].tagName === 'IMG') {
							//var img = parentDiv.childNodes[count];
							//img.setAttribute('src', 'img/imgErrorBlink.gif');
							//$(img).css("display", "");
						}
					}
				}
			}
		}
	}
};
UiUtil.IsValidJson = function(json) {
	try {
		JSON.parse(json);
		return true;
	} catch (ex) {
			return false;
	}
};
UiUtil.SetErrStr = function(xhr, err, errorThrown) {
	var errMsg = "";
	if (UiUtil.NotUndefineNotNullNotBlank(errorThrown)) {
		errMsg = errorThrown.split('\n')[0];
	} else {
		var theString = xhr.responseText;
		if (UiUtil.NotUndefineNotNullNotBlank(theString)) {
			errMsg = theString.split('\n')[0];
		} else {
			errMsg = "Unknow error, internet connection problem";
		}
	}
	return(errMsg);
};
UiUtil.CallBackendJson = function (aUrl, aMsg, aSuccFunc, aFailFunc, aFinallyFunc, aNoOkMsg) {
	if (UiUtil.NotUndefineNotNullNotBlank(aMsg) === false) {
		console.log("WARN, calling to UiUtil.CallBackend with empty JSON value in aMsg");
		return;
	}

	var result = {status:'error', msg:'Fail to make ajax call'};
	if (true) {
		$.ajax({
			type:'post',
			url:aUrl,
			dataType: 'json',
			data:aMsg,
			success:function(respond, textStatus, jqXHR) {
				if (respond.status.toLowerCase() === 'ok') {
					if (aNoOkMsg !== true) UiUtil.DisplayMsg(respond.status, respond.msg);
					aSuccFunc(respond, textStatus, jqXHR);
					if (UiUtil.NotUndefineNotNull(aFinallyFunc)) {
						aFinallyFunc(respond, textStatus, jqXHR);
					}
				} else {
					var afterAck = function(respond) {
						if (UiUtil.NotUndefineNotNull(aFailFunc)) {
							aFailFunc(respond, textStatus, jqXHR);
						}
						if (UiUtil.NotUndefineNotNull(aFinallyFunc)) {
							aFinallyFunc(respond, textStatus, jqXHR);
						}
					};
					UiUtil.BlinkError(respond, afterAck);
				}
				result = respond;
			},
			error:function(xhr, err, errorThrown) {
				var respond = {};
				respond.msg = UiUtil.SetErrStr(xhr, err);
				respond.status = 'error';
				respond.errorField = 'null';
				var afterAck = function(respond) {
					if (UiUtil.NotUndefineNotNull(aFailFunc)) {
						aFailFunc(respond, errorThrown, xhr);
					}
					if (UiUtil.NotUndefineNotNull(aFinallyFunc)) {
						aFinallyFunc();
					}
					if (xhr.getResponseHeader('Transfer-Encoding') === "chunked") {
						if (UiUtil.NotUndefineNotNullNotBlank(aMsg)) {
							console.log("WARN, possible multiple concurrent backend call with invalid JSON value in aMsg, ignoring it, do nothing: " + aMsg);
						} else {
							console.log("WARN, possible multiple concurrent backend call with empty JSON value in aMsg, ignoring it, do nothing");
						}
					}
				};
				console.log("WARN, possible multiple concurrent backend call, ignoring it, do nothing");
				if (UiUtil.NotUndefineNotNullNotBlank(respond.msg)) {
					UiUtil.BlinkError(respond, afterAck);
				}
			}
		});
	} else {
		UiUtil.DialogInfo("Error", "Cannot do backend call, invalid JSON: " + aMsg);
		aFinallyFunc();
	}
	return(result);
};
UiUtil.CallBackend = function (aUrl, aMsg, aSuccFunc, aFailFunc, aFinallyFunc, aNoOkMsg) {
	return(UiUtil.CallBackendJson(aUrl, aMsg, aSuccFunc, aFailFunc, aFinallyFunc, aNoOkMsg));
};
UiUtil.BeAction = function(aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) { 
	UiUtil.DialogWaitStart();
	var theUrl = aUrl + '?type=' + aActionKeyword;
	var requestParam = {parentOid: this.parentOid, data: JSON.stringify(aData)};
	if (UiUtil.NotUndefineNotNull(aMoreData)) {
		Object.assign(requestParam, aMoreData);
	}
	UiUtil.CallBackend(theUrl, requestParam, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aSuccFunc)) {
			aSuccFunc(respond, textStatus, jqXHR); 
		}
	}
	, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aFailFunc)) {
			aFailFunc(respond, textStatus, jqXHR); 
		}
	}
	, function() { 
		UiUtil.DialogWaitStop(); 
	}
	, true 
	);
};
UiUtil.BeActionHtml= function(aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) { 
	UiUtil.DialogWaitStart();
	var theUrl = aUrl + '?type=' + aActionKeyword;
	var requestParam = {parentOid: this.parentOid, data: JSON.stringify(aData)};
	if (UiUtil.NotUndefineNotNull(aMoreData)) {
		Object.assign(requestParam, aMoreData);
	}
	UiUtil.CallBackendHtml(theUrl, requestParam, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aSuccFunc)) {
			aSuccFunc(respond, textStatus, jqXHR); 
		}
	}
	, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aFailFunc)) {
			aFailFunc(respond, textStatus, jqXHR); 
		}
	}
	, function() { 
		UiUtil.DialogWaitStop(); 
	}
	, true 
	);
};
UiUtil.JsonAssignment = function(fromObject, fieldFullName, newValue) {
	var jsonVar = UiUtil.GetVarByJsonPath(fromObject, fieldFullName);
	jsonVar.data = newValue;
	return(jsonVar);
};
UiUtil.UseEnterEsc = function(aFunc) {
	$(document).keypress(function(evt) {
		if(evt.which === 13) {
			$(':focus').blur();
			if ($('#modal-9').css('visibility') === 'visible') {
				stopInfoNifty();
			} else {
				aFunc();
			}
		} 
	});
	$(document).keyup(function(evn) {
		if (evn.keyCode == 27) { 
				if ($('#modal-9').css('visibility') === 'visible') {
					stopInfoNifty();
				}
		}
	});
};
UiUtil.loadHRef = function(strHref) {
	showWait();
	window.location = strHref;
};
UiUtil.loadHRefNewTab = function(strHref) {
	window.open(strHref, '_blank');
};
UiUtil.GetPrevObj = function(aName) {
	var result;
	var strData = localStorage.getItem(aName);
	if (UiUtil.NotUndefineNotNull(strData)) {
		result = JSON.parse(strData);
	}
	return(result);
};
UiUtil.StoreObj = function(aName, newObj) {
	if (UiUtil.NotUndefineNotNull(newObj)) {
		localStorage.setItem(aName, JSON.stringify(newObj));
	} else {
		localStorage.setItem(aName, undefined);
	}
};
UiUtil.StorePrevObj = function(aName, aObj) {
	var newObj = jQuery.extend(true, {}, aObj);
	if (UiUtil.NotUndefineNotNull(newObj)) {
		localStorage.setItem(aName, JSON.stringify(newObj));
	}
};
UiUtil.BackNavi = function(aBeforeEdit, aAfterEdit) {
	var beforeEdit = JSON.stringify(aBeforeEdit);
	var afterEdit = JSON.stringify(aAfterEdit);
	if (beforeEdit !== afterEdit) {
		UiUtil.DialogWaitStop();
		//$("#wait-loading").css("display", "none"); // this for only one element
		$('[id="wait-loading"]').css("display", "none"); // for mutiple element with the same id
		return("All changes will be lost...");
	} else {
		return(null);
	}
};
UiUtil.IsFunction = function(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
UiUtil.CallFunctionOrGoto = function(aOnCancelGoto) {
	if (UiUtil.NotUndefineNotNull(aOnCancelGoto)) {
		if (UiUtil.IsFunction(aOnCancelGoto)) {
			aOnCancelGoto();
		} else {
			UiUtil.loadHRef(aOnCancelGoto);
		}
	} else {
		UiUtil.DialogWaitStart();
		window.history.go(-1);
	}
};
UiUtil.CancelEdit = function(aOnCancelGoto) {
	if (UiUtil.NotUndefineNotNull(window.onbeforeunload)) {
		var changeAlertMsg = window.onbeforeunload();
		if (changeAlertMsg !== null) {
			UiUtil.DialogOkCancel('Confirm to Cancel', 'You have made changes, confirm to cancel?', function() {
				window.onbeforeunload = null;
				UiUtil.CallFunctionOrGoto(aOnCancelGoto);
			});
		} else {
			window.onbeforeunload = null;
			UiUtil.CallFunctionOrGoto(aOnCancelGoto);
		}
	}
};
UiUtil.GetAryByJsonPath = function(aJsnVar, aFqn) {
	var result = aJsnVar;
	if (UiUtil.NotUndefineNotNullNotBlank(aFqn)) {
		result = UiUtil.GetVarByJsonPath(aJsnVar, aFqn);
	}
	return(result.dataset);
};
UiUtil.GetVarByJsonPath = function(aJsnVar, aFqn) {
	var pthAry = aFqn.split('.');
	var result = aJsnVar;
	for (var cntr = 0; cntr < pthAry.length; cntr++) {
		var key = pthAry[cntr];
		if (key.indexOf("[") === -1) {
			result = result.data[key];
		} else {
			var idxPt = key.match(/\[(.*?)\]/g);
			var nmePt = key.substr(0, key.indexOf(idxPt));
			var idxPt = idxPt[0].split('[')[1].split(']')[0];
			result = result.data[nmePt].dataset[idxPt];
			if (result === undefined) break;
		}
	}
	return(result);
};
UiUtil.GetValueByJsonPath = function(aJsnVar, aFqn) {
	if (aFqn === 'objectId') {
		return(aJsnVar.objectId);
	} else if (aFqn === 'clasz') {
		return(aJsnVar.clasz);
	} else if (aFqn === 'delete') {
		return(aJsnVar.delete);
	} else {
		var jsnVar = UiUtil.GetVarByJsonPath(aJsnVar, aFqn);
		return(jsnVar.data);
	}
};
UiUtil.GetValueIsDeleted = function(aJsnVar) {
	var isDeleted = UiUtil.GetValueByJsonPath(aJsnVar, "delete");
	if (UiUtil.NotUndefineNotNullNotBlank(isDeleted)) {
		return(isDeleted);
	} else {
		return(false);
	}
};
UiUtil.GetNotCloneElement = function(aElementId) {
	var normJqVar = aElementId.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.');
	var escJqVar = "[id='" + normJqVar + "']";
	var dupSlider = $(escJqVar);
	for(var cntr = 0; cntr < dupSlider.length; cntr++) {
		if (dupSlider[cntr].areaEdit !== undefined) {
			return(dupSlider[cntr]);
		}
	}
};
UiUtil.SetValByJsonPath = function(aJsnVar, aFqn, aValue) {
	var aryVar = UiUtil.GetVarByJsonPath(aJsnVar, aFqn);
	aryVar.data = aValue;
};
UiUtil.ValidateEmail = function(aEmailAddr) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(aEmailAddr);
};
UiUtil.GetSystemData = function(aFieldName) {
	return(function(jsObj) { 
		return(UiUtil.MakeObjData(UiUtil.GetVarByJsonPath(jsObj, aFieldName))); 
	});
};
UiUtil.MakeObjData = function(aValue) {
	var result = {};
	result.data = aValue;
	return(result);	
};
UiUtil.RemoveArrayElement = function(array, element) {
    return array.filter(e => e !== element);
};
UiUtil.GetActiveSlideElement = function(aElementId ) {
	/*
	var normJqVar = aElementId.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.');
	var escJqVar = "[id='" + normJqVar + "']";
	var dupSlider = $(escJqVar);
	for(var cntr = 0; cntr < dupSlider.length; cntr++) {
		var parentTop = $(dupSlider[cntr]).offsetParent().position().top;
		var wkStyle = $(dupSlider[cntr]).offsetParent().offsetParent()[0].style;
		if (typeof WebKitCSSMatrix !== 'undefined') {
			var matrix = new WebKitCSSMatrix(wkStyle.webkitTransform);
			var masterSliderTop = matrix.m42;
		
			if (Math.floor(parentTop) !== 0 && Math.floor(masterSliderTop) !== 0) {
				var delta = (Math.floor(parentTop) + Math.floor(masterSliderTop));
				if (delta < 5 && delta > -5) {
					return(dupSlider[cntr]);
				}
			}
		}
	}
	*/
	return(document.getElementById(aElementId));
};
UiUtil.SetDatePicker = function(aDate, txtDay, txtMth, txtYear, txtHour, txtMin, txtSec) {
	if (aDate !== undefined) {
		var day = aDate.substr(0, 2);
		var mthTmp = aDate.substr(3, 3);
		var yer = aDate.substr(7, 4);
		var mth = "";
		if (mthTmp !== undefined && mthTmp !== "") {
			mth = new Date(Date.parse(mthTmp +" 1, " + yer)).getMonth()+1;
		}
	
		txtDay.setAttribute("value", day);
		txtMth.setAttribute("value", mth);
		txtYear.setAttribute("value", yer);

		var hour = aDate.substr(12, 2);
		var min = aDate.substr(15, 2);
		var sec = aDate.substr(18, 2);
		txtHour.setAttribute("value", hour);
		txtMin.setAttribute("value", min);
		txtSec.setAttribute("value", sec);
	}
};
UiUtil.changeDatePicker = function(targetVar, aThis) { 
	var nmBase = aThis.id.substr(0, aThis.id.indexOf('_'));
	var nmDay = document.getElementById(nmBase + "_d");
	var nmMth = document.getElementById(nmBase + "_m");
	var nmYer = document.getElementById(nmBase + "_y");
	var nmHour = document.getElementById(nmBase + "_h");
	var nmMin = document.getElementById(nmBase + "_mt");
	var nmSec = document.getElementById(nmBase + "_s");

	targetVar = UiUtil.AssignDatePicker(nmDay, nmMth, nmYer, nmHour, nmMin, nmSec);
};
UiUtil.AssignDatePicker = function(nmDay, nmMth, nmYer, nmHour, nmMin, nmSec) { 
	var strDate = "";
	if (UiUtil.IsNum(nmDay.value)
	&& UiUtil.IsNum(nmMth.value)
	&& UiUtil.IsNum(nmYer.value)
	) {
		strDate = nmDay.value + "-" + UiUtil.MthAbbrv(parseInt(nmMth.value) - 1) + "-" + nmYer.value; 
		if (UiUtil.IsNum(nmHour.value)
		&& UiUtil.IsNum(nmMin.value)
		&& UiUtil.IsNum(nmSec.value)
		) {
			strDate += " "  + nmHour.value + ":" + nmMin.value + ":" + nmSec.value; 
		}
	}
	return(strDate);
};
UiUtil.CreateTextFieldNoLabel = function(id, aValue) {
	var inputTxt = document.createElement("input");
	inputTxt.areaEdit = this;
	inputTxt.setAttribute("class", CLS_INPUT);
	inputTxt.setAttribute("type", "text");
	if (aValue !== undefined) {
		inputTxt.setAttribute("value", aValue);
	}
	if (id !== undefined && id !== "") {
		inputTxt.setAttribute("id", id);
	}
	return(inputTxt);
};
UiUtil.CreateDatePicker = function(displayLabel, fieldVar, aNameOrVar, thisName, aUseSpanPicker, aShowTime, aFieldFqn) {
	var spanDay = document.createElement("span");
	var dtElementId = UiUtil.GenElementId(undefined, aFieldFqn);

	$("#fd-y_" + dtElementId).remove();

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dd_"); // prefix with date day
	var tfDay = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfDay.setAttribute("size", 2);
	tfDay.setAttribute("class", CLS_DATE_PICKER);
	tfDay.setAttribute("data-mask", "00");
	spanDay.appendChild(tfDay);

	var slashDay = document.createElement("span");
	slashDay.setAttribute("class", "symbol");
	slashDay.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dm_"); // prefix with date month
	var spanMth = document.createElement("span");
	var tfMth = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfMth.setAttribute("size", 2);
	tfMth.setAttribute("class", CLS_DATE_PICKER);
	tfMth.setAttribute("data-mask", "00");
	spanMth.appendChild(tfMth);

	var slashMth = document.createElement("span");
	slashMth.setAttribute("class", "symbol");
	slashMth.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dy_"); 
	var spanYear = document.createElement("span");
	var tfYear = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfYear.setAttribute("size", 4);
	tfYear.setAttribute("class", CLS_DATE_PICKER);
	tfYear.setAttribute("data-mask", "0000");
	spanYear.appendChild(tfYear);

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dh_"); 
	var spanHour = document.createElement("span");
	var tfHour = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfHour.setAttribute("size", 2);
	tfHour.setAttribute("class", CLS_DATE_PICKER);
	tfHour.setAttribute("data-mask", "00");
	spanHour.appendChild(tfHour);

	var slashHour = document.createElement("span");
	slashHour.setAttribute("class", "symbol");
	slashHour.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "di_"); 
	var spanMin = document.createElement("span");
	var tfMin = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfMin.setAttribute("size", 2);
	tfMin.setAttribute("class", CLS_DATE_PICKER);
	tfMin.setAttribute("data-mask", "00");
	spanMin.appendChild(tfMin);

	var slashMin = document.createElement("span");
	slashMin.setAttribute("class", "symbol");
	slashMin.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "ds_"); 
	var spanSec = document.createElement("span");
	var tfSec = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfSec.setAttribute("size", 4);
	tfSec.setAttribute("class", CLS_DATE_PICKER);
	tfSec.setAttribute("data-mask", "00");
	spanSec.appendChild(tfSec);

	UiUtil.SetDatePicker(fieldVar.data, tfDay, tfMth, tfYear, tfHour, tfMin, tfSec);

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn); 
	var spanPicker= document.createElement("span");
	spanPicker.setAttribute("id", dtElementId);
	$(spanPicker).css("margin", "auto");

	var jsPicker = document.createElement("script");
	jsPicker.setAttribute("type", "text/javascript");

	var dpkId = "'id': '" + tfYear.id + "'";
	if (aUseSpanPicker === true) {
		jsPicker.innerHTML = "\n" + "//<![CDATA[  " + "\n"
		+ " var opts = {" + dpkId + ", formElements:{'" + tfYear.id + "':'%Y','" + tfMth.id + "':'%m','" + tfDay.id + "':'%d'}, showWeeks:false, positioned: '" + spanPicker.id + "'};"
		+ "	datePickerController.createDatePicker(opts);"
		+ "\n" + "//]]>" + "\n";
	} else {
		jsPicker.innerHTML = "\n" + "//<![CDATA[  " + "\n"
		+ "	var opts = {" + dpkId + ", formElements:{'" + tfYear.id + "':'%Y','" + tfMth.id + "':'%m','" + tfDay.id + "':'%d'}, showWeeks:false};"
		+ "	datePickerController.createDatePicker(opts);"
		+ "\n" + "//]]>" + "\n";
	}

	var parent = document.createElement("parentwrapper");
	parent.appendChild(spanDay);
	parent.appendChild(slashDay);
	parent.appendChild(spanMth);
	parent.appendChild(slashMth);
	parent.appendChild(spanYear);
	parent.appendChild(jsPicker);
	parent.appendChild(spanPicker);


	var spanTime = document.createElement("span");
	if (aShowTime === true) {
		$(spanTime).css("display", "");
	} else {
		$(spanTime).css("display", "none");
	}
	parent.appendChild(spanTime);
	spanTime.appendChild(spanHour);
	spanTime.appendChild(slashHour);
	spanTime.appendChild(spanMin);
	spanTime.appendChild(slashMin);
	spanTime.appendChild(spanSec);
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, parent);

	var chgLabel = result.getElementsByTagName("label")[0];
	var dtFormat = document.createElement("span");
	dtFormat.style.fontWeight = "normal";
	dtFormat.innerHTML = " (DD/MM/YYYY)";
	chgLabel.appendChild(dtFormat);

	return(result);
};
UiUtil.CreateCheckBox = function(displayLabel, aValue) {
	var inputTxt = document.createElement("input");
	inputTxt.setAttribute("class", CLS_CHECKBOX);
	inputTxt.setAttribute("type", "checkbox");
	if (aValue.data !== undefined) {
		if (aValue.data === 'true') {
			$(inputTxt).prop("checked", true);
		} else {
			$(inputTxt).prop("checked", false);
		}
	} else {
		$(inputTxt).prop("checked", false);
	}

	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, inputTxt);
	return(result);
};
UiUtil.IsNumeric = function(num) {
  return !isNaN(num);
};
UiUtil.CallBackendHtml = function (aUrl, aMsg, aSuccFunc, aFailFunc, aFinallyFunc, aNoOkMsg) {
	if (UiUtil.NotUndefineNotNullNotBlank(aMsg) === false) {
		console.log("WARN, calling to UiUtil.CallBackend with empty HTML value in aMsg");
		return;
	}

	var result = {status:'error', msg:'Fail to make ajax call'};
	$.ajax({
		type:'post',
		url:aUrl,
		dataType: 'html',
		data:aMsg,
		success:function(respond, textStatus, jqXHR) {
			if (respond.startsWith("Error")) {
				var errorobj = {};
				errorobj.status = 'error';
				errorobj.msg = respond.split('\n')[0];

				var afterAck = function(respond) {
					if (UiUtil.NotUndefineNotNull(aFailFunc)) {
						aFailFunc(respond);
					}
					if (UiUtil.NotUndefineNotNull(aFinallyFunc)) {
						aFinallyFunc();
					}
				};
				UiUtil.BlinkError(errorobj, afterAck);
			} else {
				if (UiUtil.NotUndefineNotNull(aSuccFunc)) {
					aSuccFunc(respond, textStatus, jqXHR);
				}
				if (UiUtil.NotUndefineNotNull(aFinallyFunc)) {
					aFinallyFunc();
				}
			}

			if (UiUtil.NotUndefineNotNull(aFinallyFunc)) {
				aFinallyFunc(respond, textStatus, jqXHR);
			}
		},
		error:function(xhr, err, errorThrown) {
			var respond = {};
			respond.msg = UiUtil.SetErrStr(xhr, err);
			respond.status = 'error';
			respond.errorField = 'null';
			var afterAck = function(respond) {
				if (UiUtil.NotUndefineNotNull(aFailFunc)) {
					aFailFunc(respond, errorThrown, xhr);
				}
				if (UiUtil.NotUndefineNotNull(aFinallyFunc)) {
					aFinallyFunc();
				}
				if (xhr.getResponseHeader('Transfer-Encoding') === "chunked") {
					if (UiUtil.NotUndefineNotNullNotBlank(aMsg)) {
						console.log("WARN, possible multiple concurrent backend call with invalid HTML value in aMsg, ignoring it, do nothing: " + aMsg);
						//UiUtil.loadHRef(window.location.pathname);
					} else {
						console.log("WARN, possible multiple concurrent backend call with empty HTML value in aMsg, ignoring it, do nothing");
					}
				}
			};
			console.log("WARN, possible multiple concurrent backend call, ignoring it, do nothing");
			if (UiUtil.NotUndefineNotNullNotBlank(respond.msg)) {
				UiUtil.BlinkError(respond, afterAck);
			}
		}
	});
	return(result);
};
UiUtil.FormatDate = function(aDateTime) {
	var dateTime = aDateTime.split(" ");
	return(dateTime[0]);
};
UiUtil.NavigateMonth = function(aDirection, aDateStart, aIdMth) {
	var jsDateInput = aDateStart;
	var numMth = jsDateInput.getMonth(); 
	if (aDirection === 'add') {
		numMth++;
	} else if (aDirection === 'minus') {
		numMth--;
	} else if (aDirection === 'static') {
	} else {
		UiUtil.DialogInfo('Error', "Internal application/javascript error!");
		return;	
	}
	var jsDateOutput = new Date(jsDateInput.getFullYear(), numMth, jsDateInput.getDate());

	var strMth = UiUtil.MthAbbrv(jsDateOutput.getMonth());
	$('#' + aIdMth).html(strMth);

	var jsDateStart = UiUtil.DateMonthStart(jsDateOutput);
	UiUtil.SetDatePickerValue('st-dp-dateFrom', jsDateStart);
	var jsDateEnd = UiUtil.DateMonthEnd(jsDateOutput);
	UiUtil.SetDatePickerValue('st-dp-dateEnd', jsDateEnd);
};
UiUtil.ExtractScript = function(scriptList) {
	var fullScript = "";
	for(var cntr = 0; cntr < scriptList.length; cntr++) { 
		var eachScript = scriptList[cntr]; 
		var scriptText = $(eachScript).html().replace("<![CDATA[", "").replace("]]>", "").replace(/\//g, '').trim(); 
		//var scriptText = $(eachScript).html().replace("<!--[CDATA[", "").replace("]]-->", "").replace(/\//g, '').trim(); 
		fullScript += scriptText;
	}
	if (UiUtil.NotUndefineNotNullNotBlank(fullScript)) fullScript += ";";
	return(fullScript);
};
UiUtil.DialogPeriodRange = function(aTitleHeader, aTitleBody, aDateStart, aDateEnd, onOk, onCancel) {
	UiUtil.DialogWaitStart();
	var dateStart;
	if (aDateStart === undefined) 
		dateStart = UiUtil.DateForDisplay(UiUtil.DateMonthStart(new Date()));
	else
		dateStart = UiUtil.DateForDisplay(UiUtil.DateMonthStart(aDateStart));
	var divDateStart = UiUtil.CreateDatePicker('From', dateStart, dateStart, "UiUtil", true , false);

	var dateEnd;
	if (aDateEnd === undefined) 
		dateEnd = UiUtil.DateForDisplay(UiUtil.DateMonthEnd(new Date()));
	else 
		dateEnd = UiUtil.DateForDisplay(UiUtil.DateMonthEnd(aDateEnd));
	var divDateEnd = UiUtil.CreateDatePicker('To', dateEnd, dateEnd, "UiUtil", true , false);

	$(divDateStart).attr('id', 'st-dp-dateFrom');
	$(divDateStart).css('cssText', 'float: left: width: 40%; display: inline-block !important; text-align: left; margin-right: 20px');
	$(divDateStart).find('label').css('font-weight', 'normal');

	$(divDateEnd).attr('id', 'st-dp-dateEnd');
	$(divDateEnd).css('cssText', 'float: left: width: 40%; display: inline-block !important; text-align: left; margin-right: 20px');
	$(divDateEnd).find('label').css('font-weight', 'normal');
	
	if (UiUtil.NotUndefineNotNullNotBlank(aTitleBody)) {
		var divTitle = document.createElement('div');
		divTitle.innerHTML = aTitleBody;
		$(divTitle).css('width', '100%');
		$(divTitle).css('font-size', 'larger');
		$(divTitle).css('font-style', 'italic');
		$(divTitle).css('margin-bottom', '17px');
		$(divTitle).css('margin-top', '10px');
	}

	var iMonthLeft = document.createElement('i');
	$(iMonthLeft).attr('id', 'st-dp-iMonthLeft');
	iMonthLeft.setAttribute("class", "fa fa-chevron-circle-left");
	$(iMonthLeft).css('cssText', 'margin: 0px !important; font-size: larger; cursor: pointer');
	$(document).ready(function() {
		$("#st-dp-iMonthLeft").click(function() { UiUtil.NavigateMonth('minus', UiUtil.GetDatePickerValue('st-dp-dateFrom'), 'monthAbbrv'); });
	});
	var iMonthRight = document.createElement('i');
	$(iMonthRight).attr('id', 'st-dp-iMonthRight');
	iMonthRight.setAttribute("class", "fa fa-chevron-circle-right");
	$(iMonthRight).css('cssText', 'margin: 0px !important; font-size: larger; cursor: pointer');
	$(document).ready(function() {
		$("#st-dp-iMonthRight").click(function() { UiUtil.NavigateMonth('add', UiUtil.GetDatePickerValue('st-dp-dateFrom'), 'monthAbbrv'); });
	});
	var spanMonthAbbrv = document.createElement('span');
	spanMonthAbbrv.setAttribute("class", "unselectable");
	$(spanMonthAbbrv).css('padding-left', '6px');
	$(spanMonthAbbrv).css('padding-right', '6px');
	$(spanMonthAbbrv).css('font-family', 'monospace');
	$(spanMonthAbbrv).attr('id', 'monthAbbrv');
	spanMonthAbbrv.innerHTML = "JAN";

	var divControl = document.createElement('div');
	divControl.appendChild(iMonthLeft);
	divControl.appendChild(spanMonthAbbrv);
	divControl.appendChild(iMonthRight);
	var divMonthNavg = UiUtil.CreateTextFieldWithLabel("", divControl);
	$(divMonthNavg).css('float', 'left');
	$(divMonthNavg).css('width', '20%');
	$(divMonthNavg).css('margin-top', '29px');

	var divCol = document.createElement('div');
	$(divCol).css('float', 'left');
	$(divCol).css('display', 'flex');
	$(divCol).css('align-items', 'center');
	$(divCol).css('width', '100%');
	divCol.appendChild(divDateStart);
	divCol.appendChild(divDateEnd);
	divCol.appendChild(divMonthNavg);
	
	var divPeriod = document.createElement('div');
	if (UiUtil.NotUndefineNotNullNotBlank(aTitleBody)) {
		divPeriod.appendChild(divTitle);
	}
	$(divPeriod).css('float', 'left');
	divPeriod.appendChild(divCol);

	var jsFunc = new Function();
	
	UiUtil.DialogOkCancel(aTitleHeader, divPeriod, onOk, onCancel, jsFunc);
	UiUtil.NavigateMonth('static', UiUtil.DisplayDateToDate(dateStart), 'monthAbbrv');
	UiUtil.DialogWaitStop();
};
UiUtil.GetDatePickerData = function(aParentName, aChildName) { 
	var fieldFqn = UiUtil.ComposeFqn(aParentFqnName, aChildName);
	var nmDay = UiUtil.GenElementId(undefined, fieldFqn, "dd_");
	var nmMth = UiUtil.GenElementId(undefined, fieldFqn, "dm_");
	var nmMth = UiUtil.GenElementId(undefined, fieldFqn, "dy_");
	var nmHour = UiUtil.GenElementId(undefined, fieldFqn, "dh_");
	var nmMin = UiUtil.GenElementId(undefined, fieldFqn, "di_");
	var nmSec = UiUtil.GenElementId(undefined, fieldFqn, "ds_");
	var strDate = UiUtil.AssignDatePicker(nmDay, nmMth, nmYer, nmHour, nmMin, nmSec);

	return(strDate);
};
UiUtil.NumberWithComma = function(aNum) {
	return aNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
UiUtil.AddStyle = function(cssStr) {
	if (UiUtil.StyleExist(cssStr) === false) {
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = cssStr;
		} else {
			style.appendChild(document.createTextNode(cssStr));
		}
		head.appendChild(style);
	}
};
UiUtil.StyleExist = function(strStyle) {
	var ssList = document.styleSheets; 
	if (!ssList) return false;
	for (var i = 0; i < ssList.length; i++) {
		var ss = ssList[i]; 
		if (!ss) continue;
		if (UiUtil.XTraverseStyleSheet(ss, strStyle)) return true;
	}
	return false;
};
UiUtil.XTraverseStyleSheet = function(ss, strStyle) {
	if (!ss) return false;
	var rls = UiUtil.XGetCSSRules(ss) ; if (!rls) return false;
	var str2 = UiUtil.StdCssStr(strStyle);
	for (var j = 0; j < rls.length; j++) {
		var cr = rls[j];
		if (cr.selectorText) {
			var str1 = UiUtil.StdCssStr(cr.cssText);
			if (str1 === str2) {
				return true; 
			} else {
				if (cr.cssText === str2) {
					return true;
				}
			}
		}
		if (cr.type && cr.type === 3 && cr.styleSheet) xTraverseStyleSheet(cr.styleSheet, strStyle);
	}
	if (ss.imports) {
		for (var j = 0 ; j < ss.imports.length; j++) {
			if (xTraverseStyleSheet(ss.imports[j], strStyle)) return true;
		}
	}
	return false;
};
UiUtil.StdCssStr = function(strCss) {
	var body = strCss.match(/[^{}]+(?=\})/g); // standardise body section string
	var tmp = document.createElement("div");
	tmp.style.cssText = body[0];

	var tgtCss = strCss.substr(0, strCss.indexOf(body) -1); // get the targeted css name
	var result = tgtCss + '{ ' + tmp.style.cssText + ' }';
	
	return(result);
};
UiUtil.XGetCSSRules = function(ss) { 
	return ss.rules ? ss.rules : ss.cssRules; 
};
UiUtil.HrefCssAdd = function(cssPath) {
	if (UiUtil.HrefCssExist(cssPath) === false) {
		var lnk = document.createElement("link");
		lnk.setAttribute("href", cssPath);
		lnk.setAttribute("rel", "stylesheet");
		lnk.setAttribute("type", "text/css");
		document.head.appendChild(lnk);
	}
};
UiUtil.HrefCssExist = function(cssPath) {
	var ss = document.styleSheets;
	for (var cntr = 0, max = ss.length; cntr < max; cntr++) {
		var fullUrl = getFullUrl(cssPath);
		if (ss[cntr].href === fullUrl) return(true);
	}	
	return(false);
};
UiUtil.CreateComboBox = function(displayLabel, aFieldFqn) {
	var input = document.createElement("select");
	var genId = UiUtil.GenElementId(undefined, aFieldFqn);
	if (UiUtil.NotUndefineNotNullNotBlank(genId)) {
		input.setAttribute("id", genId);
	}
	input.setAttribute("class", CLS_COMBO_BOX);
	input.displayLabel = displayLabel;
	var result = input;
	if (displayLabel !== undefined) {
		result = UiUtil.CreateTextFieldWithLabel(displayLabel, input);
	}
	return(result);
};
UiUtil.PopulateComboBoxWithName = function(cmb, jsonObj, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (jsonObj !== undefined) {
		$.each(jsonObj, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = name; 
			opt.innerHTML = name; 
			if (name === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.PopulateComboBoxWithValue = function(cmb, choices, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (choices !== undefined) {
		$.each(choices, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = value; 
			opt.innerHTML = value; 
			if (value === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.DecodeUnescape = function(input) {
	if (/&amp;|&quot;|&#39;|'&lt;|&gt;/.test(input)) {
		var doc = new DOMParser().parseFromString(input, "text/html");
		return doc.documentElement.textContent;
	}
	return input;
};
UiUtil.CamelCaseToTitleCase = function(camelCase){
	if (camelCase == null || camelCase == "") {
	  return camelCase;
	}
	
	camelCase = camelCase.trim();
	var newText = "";
	for (var i = 0; i < camelCase.length; i++) {
	  if (/[A-Z]/.test(camelCase[i])
	      && i != 0
	      && /[a-z]/.test(camelCase[i-1])) {
	    newText += " ";
	  }
	  if (i == 0 && /[a-z]/.test(camelCase[i]))
	  {
	    newText += camelCase[i].toUpperCase();
	  } else {
	    newText += camelCase[i];
	  }
	}
	
	return newText;
};
UiUtil.TitleCaseToCamelCase = function(titleCase){
	var noSpace = titleCase.replace(/ /g,"");
	return noSpace.charAt(0).toLowerCase() + noSpace.slice(1);
};
UiUtil.CreateTextFieldWithLabel = function(displayLabel, inputField) {
	var parent = document.createElement("div");
	parent.setAttribute("class", CLS_EACHFIELD_ROW);

	var labelArea = document.createElement("div");
	labelArea.setAttribute("class", CLS_LABEL_AREA);
	var label = document.createElement("label");
	label.innerHTML = displayLabel;
	label.setAttribute('class', CLS_LABEL);
	var err = document.createElement("img");
	err.setAttribute("src", UiUtil.ImgErrorBlink);
	$(err).css("display", "none");
	$(err).css("margin-bottom", "5px");
	var msg = document.createElement("span");
	msg.setAttribute("class", CLS_ERROR_MSG);
	$(msg).css("display", "none");
	labelArea.appendChild(label);
	labelArea.appendChild(err);
	labelArea.appendChild(msg);

	var inputArea = document.createElement("div");
	inputArea.setAttribute("class", CLS_INPUT_AREA);

	if (inputField.tagName === "parentwrapper") {
		for(var cntr = 0; cntr < inputField.childNodes.length; cntr++) { 
			inputArea.appendChild(inputField.childNodes[cntr]);
		}
	} else {
		inputArea.appendChild(inputField);
	}
	parent.appendChild(labelArea);
	parent.appendChild(inputArea);
	
	return(parent);
};
UiUtil.Json2Money = function(result, strValue) {
	var arr = strValue.split(' ');
	if (typeof arr[0] !== 'undefined') {
		result.currency = arr[0];
		if (typeof arr[1] !== 'undefined') {
			var dolcent = arr[1].split('.');
			if (typeof dolcent[0] !== 'undefined') {
				result.dollar = dolcent[0];
				if (typeof dolcent[1] !== 'undefined') {
					result.cent = dolcent[1];
				}
			}
		}
	}
};
UiUtil.HandleDollar = function(el, ev, centid) {
	var code = ev.keyCode;
	if (code === 190) {
		$("#" + centid).focus();
	}
};
UiUtil.HandleCent = function(el, ev, centid) {
	// do nothing
};
UiUtil.CreateMoney = function(displayLabel, jsonMoney, aFieldFqn) {
	var	mnyName = UiUtil.GenElementId(undefined, aFieldFqn);
	var mnyValue = {};
	mnyValue.currency = '';
	mnyValue.dollar = '';
	mnyValue.cent = '';

	UiUtil.Json2Money(mnyValue, jsonMoney.data);

	var crcy = UiUtil.CreateComboBox(undefined);
	UiUtil.PopulateComboBoxWithValue(crcy, jsonMoney.currencies, mnyValue.currency);
	crcy.setAttribute("id", mnyName);

	var spCrcy = document.createElement("span");
	spCrcy.setAttribute("class", "symbol");
	spCrcy.appendChild(crcy);

	var theMask = UiUtil.MaskNumberWithWidth();
	var spDlr = document.createElement("span");
	var tfDlr = UiUtil.CreateTextFieldNoLabel(mnyName + "_dl", mnyValue.dollar);
	tfDlr.setAttribute("style", "text-align:right");
	tfDlr.setAttribute("data-mask", theMask);
	tfDlr.setAttribute("data-mask-reverse", "true");
	spDlr.appendChild(tfDlr);

	var decPoint = document.createElement("span");
	decPoint.setAttribute("class", "symbol");
	decPoint.innerHTML = ".";

	var spCnt = document.createElement("span");
	var tfCnt = UiUtil.CreateTextFieldNoLabel(mnyName + "_ct", mnyValue.cent);
	tfCnt.setAttribute("style", "text-align:right");
	tfCnt.setAttribute("data-mask", "00");
	tfCnt.setAttribute("size", 2);
	spCnt.appendChild(tfCnt);

	tfDlr.setAttribute("onkeyup", "UiUtil.HandleDollar(this, event, \"" + tfCnt.id + "\")");
	tfCnt.setAttribute("onkeyup", "UiUtil.HandleCent(this, event)");

	var parent = document.createElement("parentwrapper");
	parent.appendChild(spCrcy);
	parent.appendChild(spDlr);
	parent.appendChild(decPoint);
	parent.appendChild(spCnt);
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, parent);

	return(result);
};
UiUtil.SetValueNoBr = function(aElementId, aWidget) { 
	if (aWidget.value !== "<br>") { // ignore this damn <br> html element place in by HtmlEditor widget
		$("#" + aElementId).val(aWidget.value);
	}
};
UiUtil.SetValue = function(aObj2Edit, aFqn, aWidget) { 
	UiUtil.JsonAssignment(aObj2Edit, aFqn, aWidget.value);
};
UiUtil.CreateHtmlField = function(displayLabel, aValue, aFieldFqn) {
	var inputTxt = document.createElement("textarea");
	var genId = UiUtil.GenElementId(undefined, aFieldFqn);
	inputTxt.setAttribute("id", genId);
	
	inputTxt.innerHTML = aValue.data;
	inputTxt.style.width = "750px";
	inputTxt.style.height = "100px";

	var divArea = UiUtil.CreateTextFieldWithLabel(displayLabel, inputTxt);

	var result = document.createElement("div");
	result.appendChild(divArea);

	//var fieldId = UiUtil.GetFieldId(genId);
	var jsNicE = document.createElement("script");
	jsNicE.setAttribute("type", "text/javascript");
	jsNicE.innerHTML = "\n" + "//<![CDATA[  "
	+ "\n" + "var htmlEditor = new nicEditor({fullPanel : true}).panelInstance('" + inputTxt.id + "');"
	+ "\n" + "htmlEditor.addEvent('blur', function() {"
	+ "\n" + "var jsVar = {};"
	+ "\n" + "jsVar.value = this.nicInstances[0].getContent();"
	+ "\n" + "UiUtil.SetValueNoBr('" + genId + "', jsVar);"
	+ "\n" + "});"
	+ "\n" + "//]]>" + "\n";
	var jsexe = document.createElement("jsnice"); // cannot append directly on the body, the script will not execute, why?
	jsexe.appendChild(jsNicE);
	divArea.appendChild(jsexe);

	return(result);
};
UiUtil.PopulateComboBoxWithName = function(cmb, jsonObj, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (jsonObj !== undefined) {
		$.each(jsonObj, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = name; 
			opt.innerHTML = name; 
			if (name === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.PopulateComboBoxWithValue = function(cmb, choices, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (choices !== undefined) {
		$.each(choices, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = value; 
			opt.innerHTML = value; 
			if (value === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.GetPhoneData = function(aParentName, aChildName) {
	var fieldFqn = UiUtil.ComposeFqn(aParentFqnName, aChildName);
	var idCountry = UiUtil.GenElementId(undefined, fieldFqn, "pc_"); // prefix with telephone country code
	var idNdc = UiUtil.GenElementId(undefined, fieldFqn, "pa_");
	var idNo = UiUtil.GenElementId(undefined, fieldFqn, "pn_"); // prefix with telephone number

	var phoneData = idCountry.value + "-" + idNdc.value + "-" + idNo.value; 
	return(phoneData);
};
UiUtil.CreateTelephone = function(displayLabel, jsonTelephone, aFieldFqn) {
	var listAreaCode = UiUtil.CreateComboBox(undefined);
	var tpBase = UiUtil.GenElementId(undefined, aFieldFqn, "pa_"); // prefix with phone area code
	listAreaCode.setAttribute("id", tpBase);
	var result = UiUtil.CreatePhone(displayLabel, jsonTelephone, listAreaCode, tpBase, aFieldFqn);
	return(result);
};
UiUtil.CreateMobilePhone = function(displayLabel, jsonMobile, aFieldFqn) {
	var listNdc = UiUtil.CreateComboBox(undefined);
	var mpBase = UiUtil.GenElementId(undefined, aFieldFqn, "pa_");
	listNdc.setAttribute("id", mpBase);
	var result = UiUtil.CreatePhone(displayLabel, jsonMobile, listNdc, mpBase, aFieldFqn);
	return(result);
};
UiUtil.CreatePhone = function(displayLabel, jsonMobile, listNdc, mpBase, aFieldFqn) {
	var strArray = jsonMobile.data.split("-");
	var codeCtry = strArray[0];
	var codeNdc = strArray[1];
	var codeSubNo = strArray[2];

	var listCountry = UiUtil.CreateComboBox(undefined);
	var ctryId = UiUtil.GenElementId(undefined, aFieldFqn, "pc_"); // prefix with telephone country code
	listCountry.setAttribute("id", ctryId);
	UiUtil.PopulateComboBoxWithName(listCountry, jsonMobile.countrycode, codeCtry);

	var spCountry = document.createElement("span");
	spCountry.setAttribute("class", "st-symbol");
	spCountry.appendChild(listCountry);

	var spNdc = document.createElement("span");
	spNdc.setAttribute("class", "st-symbol");
	spNdc.appendChild(listNdc);

	var spNo = document.createElement("span");
	var tfNoId = UiUtil.GenElementId(undefined, aFieldFqn, "pn_"); // prefix with telephone number
	var tfNo = UiUtil.CreateTextFieldNoLabel(tfNoId);
	if (codeSubNo !== undefined) {
		tfNo.setAttribute("value", codeSubNo);
	}
	spNo.appendChild(tfNo);

	var funcName = UiUtil.GenElementId(undefined, aFieldFqn, "pf_");
	var scrptDyn = UiUtil.CreateDynamicList(funcName, listNdc.id, jsonMobile.countrycode);
	UiUtil.ScriptAddWithRemove(scrptDyn, funcName);
	var chgFunc = funcName + "(this.value)";
	listCountry.setAttribute("onchange", chgFunc);

	UiUtil.PopulateComboBoxWithValue(listNdc, jsonMobile.countrycode[codeCtry], codeNdc); // to populate the selected NDC

	var phoneId = UiUtil.GenElementId(undefined, aFieldFqn); // prefix with telephone country code
	var parent = document.createElement("parentwrapper");
	parent.appendChild(spCountry);
	parent.appendChild(spNdc);
	parent.appendChild(spNo);
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, parent);
	result.setAttribute("id", phoneId);

	return(result);
};
UiUtil.PopulateMasterChildCmbx = function(childCmb, childFqn, aValue, aObj2Edit) {
	var parentCmb = $(childCmb).parents('.' + CLS_EACHFIELD).prev().find('select');
	if (parentCmb.length !== 0) {
		var targetObj = UiUtil.GetVarByJsonPath(aObj2Edit, childFqn);
		$(childCmb).empty();
		var parentCurrentValue = $(parentCmb).find('option:selected').text();
		$.each(targetObj.option, function(master, child) {
			if (master === parentCurrentValue) {
				UiUtil.PopulateComboBoxWithValue(childCmb, child, aValue.data);
				return(false);
			}
		});
	}
};
UiUtil.CreateDynamicList = function(masterId, childId, jsonMaster) {
	var StrSwitchStart = "var arr; var option; function " + masterId + "(val)"
	+ " {"
	+ " var slc_all = $('select[id=" + childId + "]'" + ");"
	+ " for(var cntr=0; cntr < slc_all.length; cntr++) {"
	+ " 	var slc_target = slc_all[cntr];"
	+ " 	slc_target.options.length = 0;"
	+ " 	switch (val) {";
	var StrCase = "case 'REPLACE_SELECTED_COUNTRY':"
	+ " 	arr = new Array(REPLACE_NDC_LIST_BY_COUNTRY);"
	+ " 	slc_target.disabled = false;"
	+ " 	for (var i=0;i<arr.length;i++) {"
	+ " 	option = new Option(arr[i],arr[i]);"
	+ " 	slc_target.options[i] = option;"
	+ " 	}"
	+ " 	break;";
	var StrSwitchEnd = "default:"
	+ " 	slc_target.disabled = false;"
	+ " 	slc_target.options.length = 0;"
	+ " 	break;"
	+ " 	}"
	+ " }"
	+ " }";

	var strCase = "";
	$.each(jsonMaster, function(name, value) {
		strCase += StrCase.replace("REPLACE_SELECTED_COUNTRY", name);
		var strAry = "";
		for(var cntr = 0; cntr < value.length; cntr++) {
			if (strAry !== "") {
				strAry += ", ";
			}
			strAry += "'" + value[cntr] + "'";
		}
		strCase = strCase.replace("REPLACE_NDC_LIST_BY_COUNTRY", strAry) + " ";
	});

	var result = StrSwitchStart + strCase + StrSwitchEnd;
	return(result);
};
UiUtil.SetComboBoxWithValue = function(cmb, choices, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (choices !== undefined) {
		$.each(choices, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = value; 
			opt.innerHTML = value; 
			if (value === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.FilterChildComboBox = function(aObj2Edit, parentCmbx, strChildFqn) {
	var childCmbx = $(parentCmbx).parents('.' + CLS_EACHFIELD).next().find('select');
	if (childCmbx.length === 0) return;
	var targetObj = UiUtil.GetVarByJsonPath(aObj2Edit, strChildFqn);
	childCmbx.empty();
	$.each(targetObj.option, function(master, child) {
		if (master === parentCmbx.value) {
			UiUtil.SetComboBoxWithValue(childCmbx[0], child, '');
			return(false);
		}
	});
};
UiUtil.EmptyChildComboBox = function(aWidget) {
	if (aWidget.toBeEmpty !== undefined) {
		for (var cntr = 0; cntr < aWidget.toBeEmpty.length; cntr++) {
			$(aWidget.toBeEmpty[cntr]).empty();
		}
	}
};
UiUtil.SetupMasterChildComboBox = function(cmb, theUiForm, fieldFqn, childFqn) {
	cmb.setAttribute("onchange", "UiUtil.SetValue(" + theUiForm + ".obj2Edit, '" + fieldFqn + "', this)" 
	+ "; " + "UiUtil.FilterChildComboBox(" + theUiForm + ".obj2Edit" + ", this, '" + childFqn + "')" 
	+ "; UiUtil.EmptyChildComboBox(this)");
	cmb.setAttribute("onblur", "UiUtil.SetValue(" + theUiForm + ".obj2Edit, '" +  fieldFqn + "', this)");
};
UiUtil.CreateVerticalSlider = function(aMasterDiv, aSliderList, aNextButton) {
	var largestHeight = 0;
	for(var cntr = 0; cntr < aSliderList.length; cntr++) {
		var eachSlider = aSliderList[cntr];
		if ($(eachSlider).outerHeight() > largestHeight) {
			largestHeight = $(eachSlider).outerHeight() + 3;
		}
	}
	
	var totalSliderHeight = 0;
	var sliderTopOffset = new Array();
	for(var cntr = 0; cntr < aSliderList.length; cntr++) {
		var eachSlider = aSliderList[cntr];
		$(eachSlider).outerHeight(largestHeight + "px");
		$(eachSlider).width("100%");
		eachSlider.sliderIndex = cntr;
		sliderTopOffset[cntr] = totalSliderHeight;
		totalSliderHeight += $(eachSlider).outerHeight();
	};
	
	var fullHeightDiv = document.createElement("div");
	$(fullHeightDiv).outerHeight(totalSliderHeight);
	
	$(fullHeightDiv).append(aSliderList);
	$(aMasterDiv).outerHeight(largestHeight + "px");
	$(aMasterDiv).css("overflow", "hidden");
	aMasterDiv.setAttribute("class", "st-slider-master");
	$(aMasterDiv).append(fullHeightDiv);

	var current = 0;
	$($(fullHeightDiv).children()[current]).find(':input:first').focus(); 
	$(aNextButton).bind('click', function(evt) {
		var prev = current;
		for(var cntrSlider = 0; cntrSlider < aSliderList.length; cntrSlider++) {
			var eachSlider = aSliderList[cntrSlider];
			if ($(eachSlider).hasClass("selected")) {
				current = eachSlider.sliderIndex;
				break;
			}
		}
		
		if (current === 0) {
			$(aSliderList[0]).removeClass('selected');
			$(aSliderList[1]).addClass('selected');
		} else if (current + 1 === aSliderList.length) {
			$(aSliderList[0]).addClass('selected');
			$(aSliderList[aSliderList.length - 1]).removeClass('selected');
			current = -1;
		} else {
			$(aSliderList[current]).removeClass('selected');
			$(aSliderList[current + 1]).addClass('selected');
		}

		$(fullHeightDiv).stop().animate({
			marginTop: '-' + sliderTopOffset[current + 1] + 'px'
		}, 500, function() {
			current++;
			$($(fullHeightDiv).children()[current]).find(':input:first').focus(); 
		});
		evt.preventDefault();
	});

	// clicking on the tab (on the last input of each fieldset), 
	// makes the form slide to the next step
	var lastSlider = aSliderList[aSliderList.length - 1];
	$(aSliderList).each(function() {
		var eachSlider = this;
		$(this).find(':input:last').bind('keydown', function(evt) {
			if (evt.keyCode == 9){
				if (eachSlider === lastSlider) {
					// do nothing, tab to the next element
				} else {
					$(aNextButton).click();
					evt.preventDefault();
				}
			}
		});
	});
	
	var newSlider = {};
	newSlider[0] = fullHeightDiv;
	newSlider.masterDiv = aMasterDiv;
	newSlider.sliderList = aSliderList;
	newSlider.nextBtn = aNextButton;
	
	newSlider.reloadSlider = function() {};

	newSlider.getSlideCount = function() {
		return(newSlider.sliderList.length);
	};
	newSlider.getCurrentSlide = function() {
		for(var cntrSlider = 0; cntrSlider < newSlider.length; cntrSlider++) {
			var eachSlider = aSliderList[cntrSlider];
			if ($(eachSlider).hasClass("selected")) {
				current = eachSlider.sliderIndex;
				break;
			}
		}
		return(current);
	};
	

	return(newSlider);
};
UiUtil.FlipUpDown = function(aElemId) {
	var result;
	if ($("#" + aElemId).css("display") !== "none") {
		$("#" + aElemId).slideUp("slow");
		result = "up";
	} else {
		$("#" + aElemId).slideDown("slow");
		result = "down";
	}

	return(result);
};
UiUtil.IsUiMaster = function(each) {
	var result = false;
	if (each.uimaster === true) {
		result = true;
	}
	return(result);
};
UiUtil.IsSystemField = function(aName) {	
	var result = false;
	if (aName === "uimaster") {
		result = true;
	} else if (aName === "objectId") {
		result = true;
	} else if (aName === "clasz") {
		result = true;
	}
	return(result);
};
UiUtil.IsCustomWidget = function(aValue) {
	var result = true;
	if (aValue.type === "mobilephone" ) {
	} else if (aValue.type === "datetime" || aValue.type === "date" ) {
	} else if (aValue.type === "html" ) {
	} else if (aValue.type === 'telephone' ) {
	} else if (aValue.type === 'money' ) {
	} else if (aValue.type === 'boolean' ) {
	} else if (aValue.type === 'salary' ) {
	} else if (aValue.type === 'country' ) {
	} else if (aValue.type === 'state' ) {
	} else if (aValue.type === 'city' ) {
	} else {
		result = false;
	}

	return(result);
};
UiUtil.ComposeFqn = function(aParent, aChild) {
	var result;
	if (UiUtil.NotUndefineNotNullNotBlank(aParent)) {
		if (UiUtil.NotUndefineNotNullNotBlank(aChild)) {
			result = aParent + "." + aChild;
		} else {
			result = aParent;
		}
	} else {
		result = aChild;
	}

	return(result);
};
UiUtil.AssignData = function(aPopulateTarget, aParentFqnName, fieldName, fieldValue) {
	var fieldFqn = UiUtil.ComposeFqn(aParentFqnName, fieldName);
	var elementId = UiUtil.GenElementId(undefined, fieldFqn);
	var theElement = $("#" + elementId);
	if (UiUtil.NotUndefineNotNullNotBlank(theElement) && UiUtil.NotUndefineNotNullNotBlank(theElement.val())) {
		if (aPopulateTarget === "toScreen") {
			fieldValue.data = theElement.val();
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(fieldValue.data)) {
				theElement.val(fieldValue.data);
			}
		}
	}

	var valueToPrint = fieldValue.data;
	console.log("Found field: " + fieldFqn + ", element id: " + elementId + ", value: " + valueToPrint);
};
UiUtil.PopulateData = function(aJsonObj) {
	var avoidRecursive = [];
	avoidRecursive.push({clasz: aJsonObj.clasz, Oid: aJsonObj.objectId});
	//UiUtil.PopulateDataRecursion(aJsonObj, "", "", avoidRecursive, "toScreen");
	UiUtil.PopulateDataRecursion(aJsonObj, "", "", avoidRecursive, "toJsonObj");
}
UiUtil.PopulateDataRecursion = function(aJsonObj, aParentFqnName, aObjName, aAvoidRecursive, aPopulateTarget) {
	aParentFqnName = UiUtil.GetJsonPath(aParentFqnName, aObjName);
	for (var cntr in aAvoidRecursive) {
		if (aAvoidRecursive[cntr].Oid === String(aJsonObj.objectId) && aAvoidRecursive[cntr].clasz === aJsonObj.clasz) {
			return;
		}
	}

	for(var key in aJsonObj.data) {
		if (aJsonObj.data[key].dontDisplay !== undefined) continue;
		var fieldName = key;
		var fieldValue  = aJsonObj.data[fieldName];
		if (UiUtil.IsSystemField(fieldName) === false) {
			if (UiUtil.IsCustomWidget(fieldValue)) { // custom widget values probably cannot be assign directly
				if (fieldValue.type === "mobilephone" ) {
					var phoneData = UiUtil.GetPhoneData(aParentFqnName, fieldName);
					UiUtil.AssignData(aPopulateTarget, aParentFqnName, fieldName, {data: phoneData});
				} else if (fieldValue.type === 'telephone' ) {
					var phoneData = UiUtil.GetPhoneData(aParentFqnName, fieldName);
					UiUtil.AssignData(aPopulateTarget, aParentFqnName, fieldName, {data: phoneData});
				} else if (fieldValue.type === "datetime" || fieldValue.type === "date" ) {
					var dateData = UiUtil.GetDatePickerData(aParentName, fieldName);
					UiUtil.AssignData(aPopulateTarget, aParentFqnName, fieldName, {data: dateData});
				} else if (fieldValue.type === "html" ) {
				} else if (fieldValue.type === 'money' ) {
				} else if (fieldValue.type === 'boolean' ) {
				} else if (fieldValue.type === 'salary' ) {
				} else if (fieldValue.type === 'country' ) {
				} else if (fieldValue.type === 'state' ) {
				} else if (fieldValue.type === 'city' ) {
				}
			} else if ((fieldValue.data !== undefined && typeof(fieldValue.data) !== 'object') || fieldValue.lookup === true) { // atomic fields
				UiUtil.AssignData(aPopulateTarget, aParentFqnName, fieldName, fieldValue);
			} else { // handle object fields i.e. fieldobject and fieldobjectbox
				if ((fieldValue.dataset !== undefined || typeof(fieldValue.data) === 'object') && (fieldValue.lookup === undefined || fieldValue.lookup === false)) {
					if ($.isArray(fieldValue.dataset)) { // its fieldobjectbox
						for (cntrObj = 0; cntrObj < fieldValue.dataset.length; cntrObj++) {
							var aryIdx = "[" + cntrObj + "]";
							if (UiUtil.IsUiMaster(fieldValue.dataset[cntrObj])) {
								aAvoidRecursive.push({clasz: fieldValue.dataset[cntrObj].clasz, Oid: fieldValue.dataset[cntrObj].objectId});
								UiUtil.PopulateDataRecursion(fieldValue.dataset[cntrObj], aParentFqnName, fieldName + aryIdx, aAvoidRecursive, cntrObj);
								aAvoidRecursive.pop();
							} else if (UiUtil.IsCustomWidget(fieldValue.dataset[cntrObj])) {
								// do nothing
							} else {
								aAvoidRecursive.push({clasz: fieldValue.dataset[cntrObj].clasz, Oid: fieldValue.dataset[cntrObj].objectId});
								UiUtil.PopulateDataRecursion(fieldValue.dataset[cntrObj], aParentFqnName, fieldName + aryIdx, aAvoidRecursive, cntrObj);
								aAvoidRecursive.pop();
							}
						}
					} else { // its fieldobject
						if (UiUtil.IsCustomWidget(fieldValue)) {
							// do nothing
						} else {
							aAvoidRecursive.push({clasz: fieldValue.data.clasz, Oid: fieldValue.data.objectId});
							UiUtil.PopulateDataRecursion(fieldValue, aParentFqnName, fieldName, aAvoidRecursive, 0);
							aAvoidRecursive.pop();
						}
					}
				}
			}
		} else {
			// do nothing to system field
		}
	}
};
UiUtil.doNothing = function() {}; 