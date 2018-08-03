var CLS_EACHFIELD = "st-eachfield";
var CLS_ROW = "st-row";
var CLS_EACHFIELD_ROW = CLS_EACHFIELD + ' ' + CLS_ROW;
var CLS_LABEL_AREA = "st-label-area";
var CLS_INPUT_AREA = "st-input-area";
var CLS_ERROR_MSG = "st-error-msg";
var CLS_LABEL = "st-label-txt";
var CLS_INPUT = "form-control";
var CLS_FIELDSET= "st-fs01";
var CLS_ARRAY_WIDGET = "st-array-widget";
var CLS_ARRAY_BTN = "st-array-btn";

UiForm.prototype.rawObj = {};
UiForm.prototype.obj2Edit = {};
UiForm.prototype.parentOid = undefined;
UiForm.prototype.locationId = '';
UiForm.prototype.allSlider = [];
UiForm.prototype.forPrint = false;
UiForm.prototype.myName = '';
UiForm.prototype.baseUrl = '';
UiForm.prototype.sourceToBeRemove = [];

var bxSliderMode = 'fade';
var bxSliderMasterName = 0;
if (typeof UiUtil === 'undefined' || UiUtil === null) {
	UiUtil = {}; // to avoid nb warning
}
function UiForm() {
};
UiForm.prototype.setValue = function(aFqn, aWidget) { 
	UiUtil.JsonAssignment(this.obj2Edit, aFqn, aWidget.value);
};
UiForm.prototype.setValueBoolean = function(aFqn, aWidget) { 
	var value = "false";
	if ($(aWidget).prop("checked") === true) {
		value = "true";
	}

	// need the below if to avoid original null value being set to false when nothing actually change, impacted onbeforeunload
	if (!(UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetValueByJsonPath(this.obj2Edit, aFqn)) === false && value === "false")) { // don't do anything if obj2Edit value is null/blank and checkbox value is false
		UiUtil.JsonAssignment(this.obj2Edit, aFqn, value); 
	}
};
UiForm.prototype.assignValue = function(aIndex, aWidget, aFqn) { 
	if (UiUtil.NotUndefineNotNull(this.rawObj)) {
		if (UiUtil.NotUndefineNotNull(this.rawObj.dataset)) {
			if (UiUtil.NotUndefineNotNull(this.rawObj.dataset[aIndex])) {
				var editObj  = this.rawObj.dataset[aIndex];
				UiUtil.JsonAssignment(editObj, aFqn, aWidget.value); 
			}
		}
	}
};
UiForm.prototype.getValue = function(aIndex, aFqn) { 
	var editObj  = this.rawObj.dataset[aIndex];
	var varObj = UiUtil.GetVarByJsonPath(editObj, aFqn);
	return(varObj.data);
};
UiForm.prototype.beAction= function(aIndex, aActionKeyword, aUrl, aBeSucc) { 
	var editObj  = this.rawObj.dataset[aIndex];
	UiUtil.BeAction(editObj, aActionKeyword, aUrl, aBeSucc);
};
UiForm.prototype.setValueNoBr = function(aFqn, aWidget) { 
	if (aWidget.value !== "<br>") { // ignore this damn <br> html element place in by HtmlEditor widget
		this.setValue(aFqn, aWidget);
	}
};
UiForm.prototype.emptyChildComboBox = function(aWidget) {
	if (aWidget.toBeEmpty !== undefined) {
		for (var cntr = 0; cntr < aWidget.toBeEmpty.length; cntr++) {
			$(aWidget.toBeEmpty[cntr]).empty();
		}
	}
};
UiForm.prototype.filterChildComboBox = function(parentCmbx, strChildFqn) {
	var childCmbx = $(parentCmbx).parents('.' + CLS_EACHFIELD).next().find('select');
	if (childCmbx.length === 0) return;
	var targetObj = UiUtil.GetVarByJsonPath(this.obj2Edit, strChildFqn);
	childCmbx.empty();
	var thisUiForm = this;
	$.each(targetObj.option, function(master, child) {
		if (master === parentCmbx.value) {
			thisUiForm.setComboBoxWithValue(childCmbx[0], child, '');
			return(false);
		}
	});
};
UiForm.GetHtmlEditorValue = function(aHtmlEditor) {
	aHtmlEditor.nicInstances[0].saveContent();
	var jsVar = aHtmlEditor.nicInstances[0].content;
	return(jsVar);
};
// new version is above this line


function UiForm(aVarName) { 
	this.myName = aVarName; // use in html pages to call function for this object
};
UiForm.prototype.displayObject = function(aLocationId, aObj2Edit, aTitle) {
	var tmpAry = {};
	tmpAry.meta = aObj2Edit.meta;
	if (tmpAry.meta === undefined) tmpAry.meta = {};
	if (tmpAry.meta.desc === undefined) {
		tmpAry.meta.desc = 'undefined';
		if (aTitle !== undefined) {
			tmpAry.meta.childName = aTitle;
		}
	}
	tmpAry.dataset = [];
	tmpAry.dataset.push(aObj2Edit);
	this.displayUiForm(aLocationId, tmpAry, 0);
};
UiForm.prototype.displayUiForm = function(aLocationId, aObj2Edit, aIdx, aBaseUrl) {
	if (aLocationId === undefined || aLocationId === null) {
		alert("The UiForm constructor takes two arguments:\n- name (string)\n- json object\n\nGot instead " + (typeof aLocationId) + " and " + (typeof aObj2Edit) + ".");
		return;
	}
	if (aObj2Edit === undefined || aObj2Edit === null) {
		alert("The UiForm constructor takes two arguments:\n- name (string)\n- json object\n\nGot instead " + (typeof aLocationId) + " and " + (typeof aObj2Edit) + ".");
		return;
	}
	if (aObj2Edit.dataset === undefined || aObj2Edit.dataset === null) {
		alert("The UiForm constructor takes a JSON object that must contain dataset field");
		return;
	}
	this.baseUrl = aBaseUrl;
	this.locationId = aLocationId;
	this.rawObj = aObj2Edit;
	this.obj2Edit = aObj2Edit.dataset[aIdx];
	var datasetName = aObj2Edit.meta.childName;
	if (datasetName === undefined) {
		datasetName = 'Undefined';
	}

	var masterDiv = document.createElement('div');
	this.allSlider = [];

	var btnSetTop = document.createElement("fieldset");
	btnSetTop.style.paddingBottom = '0px';
	btnSetTop.style.border = 'none';
	btnSetTop.style.textAlign = 'right';
	var btnSaveTop = this.createButton('Save', 'btnSaveTop');
	var btnCancelTop = this.createButton('Cancel', 'btnCancelTop');
	btnCancelTop.style.marginRight = '2px';
	btnSaveTop.setAttribute('onclick', this.myName + '.saveObject()');
	btnCancelTop.setAttribute('onclick', this.myName + '.cancelEdit()');
	btnSetTop.appendChild(btnCancelTop);
	btnSetTop.appendChild(btnSaveTop);
	masterDiv.appendChild(btnSetTop);

	var setSeqNum = {value: '', prefix: '', startNum: 0, cls: CLS_FIELDSET}; // for numbering fieldset, uses object to for pass by ref
	var childSet = this.createChildSet(masterDiv, datasetName, false, UiForm.plusOne(setSeqNum));
	var avoidRecursive = [];
	avoidRecursive.push({clasz: this.obj2Edit.clasz, Oid: this.obj2Edit.objectId});
	this.editAreaRecursion(this.obj2Edit, masterDiv, childSet, "", "", 0, true, avoidRecursive, setSeqNum, false);

	var btnSetBottom = document.createElement("fieldset");
	btnSetBottom.style.marginTop = '5px';
	btnSetBottom.style.border = 'none';
	btnSetBottom.style.textAlign = 'right';
	var btnSaveBottom = this.createButton('Save', 'btnSaveBottom');
	var btnCancelBottom = this.createButton('Cancel', 'btnCancelBottom');
	btnCancelBottom.style.marginRight = '2px';
	btnSaveBottom.setAttribute('onclick', this.myName + '.saveObject()');
	btnCancelBottom.setAttribute('onclick', this.myName + '.cancelEdit()');
	btnSetBottom.appendChild(btnCancelBottom);
	btnSetBottom.appendChild(btnSaveBottom);
	masterDiv.appendChild(btnSetBottom);

	var masterDivPage = UiUtil.GetActiveSlideElement(this.locationId);
	$(masterDivPage).empty();
	masterDivPage.appendChild(masterDiv);

	this.setOk(masterDivPage);
	var thisUiForm = this;
	var funcSlow = function() {
		for(var eachSlider in thisUiForm.allSlider) { 
			var slideNxt = '';
			if (thisUiForm.allSlider[eachSlider].getSlideCount() > 1) slideNxt = 'Next>>';
			var nextId = thisUiForm.allSlider[eachSlider].nextBtnId;
			thisUiForm.allSlider[eachSlider].reloadSlider({mode:bxSliderMode, pager: false, nextSelector:"#" + nextId, controls: true, prevText:'', nextText: slideNxt}); 
		}
		thisUiForm.objBeforeEdit = jQuery.extend(true, {}, thisUiForm.obj2Edit);
	};
	setTimeout(funcSlow, 100);
	return(masterDivPage);
};
UiForm.prototype.editAreaRecursion = function(aObj2Display, aMasterSet, aChildSet, aParentFqnName, aObjName, aObjIdx, aUnestedFeel, aAvoidRecursive, aSetNum, aNoChildSet) {
	if(aNoChildSet === undefined) aNoChildSet = false;
	var cntrField = 0;
	aParentFqnName = getJsonPath(aParentFqnName, aObjName);
	var rootSet = null;
	for (var cntr in aAvoidRecursive) {
		if (aAvoidRecursive[cntr].Oid === String(aObj2Display.objectId) && aAvoidRecursive[cntr].clasz === aObj2Display.clasz) {
			return;
		}
	}

	for(var key in aObj2Display.data) {
		if (aObj2Display.data[key].dontDisplay !== undefined) continue;
		var fieldName = key;
		var fieldValue  = aObj2Display.data[fieldName];
		var titleStr = $(aChildSet.getElementsByTagName('legend')).text();
		if (this.isSystemField(fieldName) === false) {
			if (this.useCustomWidget(fieldName, fieldValue, aChildSet, aParentFqnName)) {
				// do nothing
				cntrField++;
			} else if ((fieldValue.data !== undefined && typeof(fieldValue.data) !== 'object') || fieldValue.lookup === true) { // atomic fields
				var fieldType = fieldValue.type;
				var labelName = fieldName;
				var inputField = this.createWidget(aObjIdx, labelName, fieldValue, aParentFqnName, fieldType);
				if (inputField !== null) {
					if (aChildSet === null && rootSet === null && aNoChildSet === false) { // create new rootSet when order sequence grouping changes i.e. displayPosition 
						if (aUnestedFeel === true)	
							rootSet = this.createChildSet(aMasterSet, fieldName, true, UiForm.plusOne(aSetNum));
						else
							rootSet = this.createChildSet(aChildSet, fieldName, true, UiForm.plusOne(aSetNum));
						titleStr = $(rootSet.getElementsByTagName('legend')).text();
					} else {
						rootSet = aChildSet;
					}
					rootSet.appendChild(inputField);
					cntrField++;
				}
			} else { // handle object fields i.e. fieldobject and fieldobjectbox
				if ((fieldValue.dataset !== undefined || typeof(fieldValue.data) === 'object') && (fieldValue.lookup === undefined || fieldValue.lookup === false)) {
					rootSet = null; // displayPosition change, so new grouping for coming atomic fields, if any
					var newSet = aChildSet;
					titleStr = $(newSet.getElementsByTagName('legend')).text();

					var nextUnestedFeel = false;
					if ($.isArray(fieldValue.dataset)) { // its fieldobjectbox
						var nextNum = jQuery.extend({}, aSetNum);
						if (aNoChildSet === false) {
							if (aUnestedFeel === true) {
								nextNum = UiForm.plusOne(aSetNum);
							} else {
								nextNum = UiForm.nextLevelNumbering(aSetNum);
								nextUnestedFeel = true;
								aUnestedFeel = true;
							}
							newSet = this.createChildSet(aMasterSet, fieldName, true, nextNum);
							titleStr = $(newSet.getElementsByTagName('legend')).text();
						}
						var slideId = this.createIdStr(titleStr, '_slide');
						var slideNxt = this.createIdStr(titleStr, '_nxt');

						var nxtbtn = $(newSet).find("[id^=nextbtn]"); 
						var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
						var deletebtn = $(newSet).find("[id^=deletebtn]"); //.find('#deletebtn')[0];

						var divForSlideMaster = document.createElement('div');
						divForSlideMaster.setAttribute('id', slideId);
						newSet.appendChild(divForSlideMaster);
						var strClsz = fieldValue.clasz;
						var cntrObj;
						var cntrSlide = 0;
						for (cntrObj = 0; cntrObj < fieldValue.dataset.length; cntrObj++) {
							var aryIdx = "[" + cntrObj + "]";
							if (this.isUiMaster(fieldValue.dataset[cntrObj])) {
								aAvoidRecursive.push({clasz: fieldValue.dataset[cntrObj].clasz, Oid: fieldValue.dataset[cntrObj].objectId});
								this.editAreaRecursion(fieldValue.dataset[cntrObj], aMasterSet, newSet, aParentFqnName, fieldName + aryIdx, cntrObj, nextUnestedFeel, aAvoidRecursive, nextNum, false);
								aAvoidRecursive.pop();
							} else if (this.useCustomWidget(fieldName, fieldValue.dataset[cntrObj], divForSlideMaster, aParentFqnName)) {
								// do nothing
							} else {
								var divForSlideChild = document.createElement('div');
								divForSlideMaster.appendChild(divForSlideChild);
								aAvoidRecursive.push({clasz: fieldValue.dataset[cntrObj].clasz, Oid: fieldValue.dataset[cntrObj].objectId});
								fieldValue.dataset[cntrObj].slideNo = cntrSlide++;
								this.editAreaRecursion(fieldValue.dataset[cntrObj], aMasterSet, divForSlideChild, aParentFqnName, fieldName + aryIdx, cntrObj, nextUnestedFeel, aAvoidRecursive, nextNum, false);
								aAvoidRecursive.pop();
							}
						}

						this.setupAryCtrl(cntrObj, newbtn, deletebtn, nxtbtn, strClsz, titleStr, slideId, slideNxt, newSet, aParentFqnName, fieldName); // can refactor this at ediatAreaRecursion later
					} else { // its fieldobject
						var nextNum = jQuery.extend({}, aSetNum);
						if (this.isUiMaster(fieldValue) && aNoChildSet === false) {
							if (aUnestedFeel === true) {
								nextNum = UiForm.plusOne(aSetNum);
							} else {
								nextNum = UiForm.nextLevelNumbering(aSetNum);
								nextUnestedFeel = true;
								aUnestedFeel = true;
							}
							newSet = this.createChildSet(aMasterSet, fieldName, true, nextNum);
							titleStr = $(newSet.getElementsByTagName('legend')).text();
						}
	
						if (this.useCustomWidget(fieldName, fieldValue, newSet, aParentFqnName)) {
							// do nothing
						} else {
							aAvoidRecursive.push({clasz: fieldValue.data.clasz, Oid: fieldValue.data.objectId});
							this.editAreaRecursion(fieldValue, aChildSet, newSet, aParentFqnName, fieldName, 0, nextUnestedFeel, aAvoidRecursive, nextNum, false);
							aAvoidRecursive.pop();
						}

						if (this.isUiMaster(fieldValue)) {
							if ($(newSet).find('.' + CLS_EACHFIELD).length !== 0) {
								var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
								var elem = $(this.doHref('', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								newbtn[0].appendChild(elem);

								var delbtn = $(newSet).find("[id^=deletebtn]")[0]; // .find('#deletebtn')[0];
								elem = $(this.doHref('[Delete]', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								delbtn.appendChild(elem);
							} else {
								var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
								var elem = $(this.doHref('[New]', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								newbtn[0].appendChild(elem);

								var delbtn = $(newSet).find("[id^=deletebtn]")[0]; //.find('#deletebtn')[0];
								elem = $(this.doHref('', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								delbtn.appendChild(elem);
							}
						}
					}
				}
			}
		}
	}
};
UiForm.prototype.useCustomWidget = function(aName, aValue, aSet, aBasePath) {
	var result = true;
	if (this.forPrint === false) {
		var targetedFqn = getJsonPath(aBasePath, aName);
		if (aValue.type === "mobilephone" ) {
			var mbl = this.createMobilephone(aName, aValue, targetedFqn);
			if (mbl !== undefined) {
				aSet.appendChild(mbl);
			}
		} else if (aValue.type === 'telephone' ) {
			var tel = this.createTelephone(aName, aValue, targetedFqn);
			if (tel !== undefined) {
				aSet.appendChild(tel);
			}
		} else if (aValue.type === 'money' ) {
			var mny = UiUtil.CreateMoney(aName, aValue, targetedFqn);
			if (mny !== undefined) {
				aSet.appendChild(mny);
			}
		} else if (aValue.type === 'boolean' ) {
			var chkbxArea = UiUtil.CreateCheckBox(aName, aValue);
			var chkbx = chkbxArea.getElementsByTagName("input")[0];
			chkbx.setAttribute("onchange", this.myName + ".setValueBoolean('" + targetedFqn + "', this)");
			aSet.appendChild(chkbxArea);
		} else if (aValue.type === 'salary' ) {
		} else if (aValue.type === 'country' ) {
			var inputArea = UiUtil.CreateComboBox(aName);
			var cmb = inputArea.getElementsByTagName("select")[0];
			cmb.toBeEmpty = [];
			var childFqn = targetedFqn.replace('Country', 'State'); // change targetedFqn last field to state
			UiForm.populateComboBoxWithName(cmb, aValue.option, aValue.data);
			//cmb.setAttribute("onchange", this.myName + ".setValue('" + targetedFqn + "', this);" + " " + this.myName +  ".filterChildComboBox(this, '" + childFqn + "');" + " "+ this.myName + " .emptyChildCombox(this)");
			//cmb.setAttribute("onblur", this.myName + ".setValue('" + targetedFqn + "', this)");
			aSet.appendChild(inputArea);
		} else if (aValue.type === 'state' ) {
			var inputArea = UiUtil.CreateComboBox(aName);
			var cmb = inputArea.getElementsByTagName("select")[0];
			cmb.toBeEmpty = [];
			var childFqn = targetedFqn.replace('State', 'City');
			//cmb.setAttribute("onchange", this.myName + ".setValue('" + targetedFqn + "', this);" + " " + this.myName + " .filterChildComboBox(this, '" + childFqn + "');" + " "  + this.myName + "  .emptyChildComboBox(this)");
			//cmb.setAttribute("onblur", this.myName + ".setValue('" + targetedFqn + "', this)");
			aSet.appendChild(inputArea);
			UiForm.populateMasterChildCmbx (cmb, targetedFqn, aValue);
		} else if (aValue.type === 'city' ) {
			var inputArea = UiUtil.CreateComboBox(aName);
			var cmb = inputArea.getElementsByTagName("select")[0];
			//var childFqn = targetedFqn.replace('City', 'State');
			//cmb.setAttribute("onchange", this.myName + ".setValue('" + targetedFqn + "', this);");
			//cmb.setAttribute("onblur", this.myName + ".setValue('" + targetedFqn + "', this)");
			aSet.appendChild(inputArea);
			UiForm.populateMasterChildCmbx (cmb, targetedFqn, aValue);

			var cmbState = $(cmb).parents('.' + CLS_EACHFIELD).prev().find('select');
			if (cmbState.length !== 0) {
				var cmbCountry = cmbState.parents('.' + CLS_EACHFIELD).prev().find('select');
				if (cmbCountry.length !== 0) {
					cmbCountry[0].toBeEmpty.push(cmb);
				}
			}
	} else {
			result = false;
		}
	} else {
		if (aValue.type === undefined) {
			result = false;
		} else {
			var printTxt = document.createElement("span");
			printTxt.setAttribute("class", "print-field");
			printTxt.innerHTML = aValue.data;
			var printField = UiUtil.CreateTextFieldWithLabel(aName, printTxt);
			aSet.appendChild(printField);
		}
	}
	return(result);
};
UiForm.emptyChildCmbx = function(aWidget) {
	if (aWidget.toBeEmpty !== undefined) {
		for (var cntr = 0; cntr < aWidget.toBeEmpty.length; cntr++) {
			$(aWidget.toBeEmpty[cntr]).empty();
		}
	}
};
UiForm.filterChildCmbx = function(parentCmbx, strChildFqn) {
	var childCmbx = $(parentCmbx).parents('.' + CLS_EACHFIELD).next().find('select');
	if (childCmbx.length === 0) return;
	var targetObj = UiUtil.GetVarByJsonPath(parentCmbx.UiForm.obj2Edit, strChildFqn);
	childCmbx.empty();
	$.each(targetObj.option, function(master, child) {
		if (master === parentCmbx.value) {
			UiForm.populateComboBoxWithValue(childCmbx[0], child, '');
			return(false);
		}
	});
};
UiForm.populateMasterChildCmbx = function(childCmb, childFqn, aValue) {
	var parentCmb = $(childCmb).parents('.' + CLS_EACHFIELD).prev().find('select');
	if (parentCmb.length !== 0) {
		var targetObj = UiUtil.GetVarByJsonPath(childCmb.UiForm.obj2Edit, childFqn);
		$(childCmb).empty();
		var parentCurrentValue = $(parentCmb).find('option:selected').text();
		$.each(targetObj.option, function(master, child) {
			if (master === parentCurrentValue) {
				UiForm.populateComboBoxWithValue(childCmb, child, aValue.data);
				return(false);
			}
		});
	}
};
UiForm.prototype.createWidget = function(aObjIdx, fieldName, fieldValue, aBasePath, fieldType) {
	var widgetGrp = null;
	if (this.forPrint === false) {
		var fieldFqnName = getJsonPath(aBasePath, fieldName);
		if (fieldValue.lookup === true) {
			widgetGrp = UiUtil.CreateComboBox(fieldName, aObjIdx);
			var cmb = widgetGrp.getElementsByTagName("select")[0];
			UiForm.populateComboBoxWithName(cmb, fieldValue.option, fieldValue.data);
			cmb.UiForm = this;
		} else if (fieldValue.type === "datetime" ||fieldValue.type === "date" ) {
			widgetGrp = UiUtil.CreateDatePicker(fieldName, fieldValue, fieldFqnName, this.myName, true, false, aObjIdx);
		} else if (fieldValue.type === "html" ) {
			widgetGrp = UiUtil.CreateHtmlField(fieldName, fieldValue, fieldFqnName);
		} else {
			widgetGrp = UiUtil.CreateTextField(fieldName, fieldValue.data, fieldValue.size, aObjIdx, undefined, fieldType);
			var txtField = widgetGrp.getElementsByTagName("input")[0];
			txtField.UiForm = this;
		}
		if (this.obj2Edit.objectId !== -1) {
			this.setUpdateableOnWidget(fieldValue, widgetGrp);
		}
		this.setChangeableOnWidget(fieldValue, widgetGrp);
	} else {
		var printTxt = document.createElement("span");
		printTxt.setAttribute("class", "print-field");
		printTxt.innerHTML = fieldValue.data;
		widgetGrp = UiUtil.CreateTextFieldWithLabel(fieldName, printTxt);
	}
	
	return(widgetGrp);
};
UiForm.prototype.createChildSet = function(masterSet, setName, isArray, seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) setName = seqNum.value + '. ' + setName; 
	var childSet = this.createFieldset(setName);
	if (typeof seqNum !== 'undefined' && seqNum !== null) $(childSet).addClass(seqNum.cls);
	if (isArray) {
		var aryCtrl = document.createElement('div');
		aryCtrl.setAttribute('id', 'st-aryctrl');
		aryCtrl.setAttribute('class', CLS_ARRAY_WIDGET);

		var spNext= document.createElement('span');
		spNext.setAttribute('class', CLS_ARRAY_BTN);
		spNext.setAttribute('id', 'nextbtn_' + UiUtil.GetRandom5());
		spNext.innerHTML = '';

		var spDelete = document.createElement('span');
		spDelete.setAttribute('class', CLS_ARRAY_BTN);
		spDelete.setAttribute('id', 'deletebtn_' + UiUtil.GetRandom5());
		spDelete.innerHTML = '';

		var spNew = document.createElement('span');
		spNew.setAttribute('class', CLS_ARRAY_BTN);
		spNew.setAttribute('id', 'newbtn_' + UiUtil.GetRandom5());
		spNew.innerHTML = '';

		aryCtrl.appendChild(spNext);
		aryCtrl.appendChild(spDelete);
		aryCtrl.appendChild(spNew);

		childSet.appendChild(aryCtrl);
	}
	var appdObj = masterSet.appendChild(childSet);
	var prevObj = $(appdObj).prev()[0]; // place a div for spacing top margin purpose
	if (prevObj !== undefined) {
		if (prevObj.tagName.toLowerCase() === 'div') {
			var divMrg = document.createElement('div');
			divMrg.style.marginTop = "20px";
			$(prevObj).after(divMrg);
		}
	}
	return(childSet);
};
UiForm.prototype.setupAryCtrlButton = function(aTargetField, aFieldsetTitle, aSlideId, aSlideNxt, aBasePath, aTargetName) {
	var setMaster = UiUtil.GetActiveSlideElement(this.locationId);
	var setChild = $(setMaster).find('legend').filter(':contains("' + aFieldsetTitle + '")');
	setChild = $(setChild).parent()[0];
	var btn1 = $(setChild).children('#st-aryctrl').children('[id^=newbtn]');
	var btn2 = $(setChild).children('#st-aryctrl').children('[id^=deletebtn]');
	var btn3 = $(setChild).children('#st-aryctrl').children('[id^=nextbtn]');
	var totalMember = 0;
	for (var cntr = 0; cntr < aTargetField.dataset.length; cntr++) {
		if (aTargetField.dataset[cntr].delete === undefined) {
			totalMember++;
		}
	}
	this.setupAryCtrl(totalMember, btn1, btn2, btn3, aTargetField.clasz, aFieldsetTitle, aSlideId, aSlideNxt, setChild, aBasePath, aTargetName); // can refactor this at ediatAreaRecursion later
};
UiForm.prototype.setupAryCtrl = function(cntrObj, newbtn, deletebtn, nxtbtn, strClsz, fieldsetName, slideId, slideNxt, slideSet, basePath, targetName) {
	var strNext = 'Next>>';
	if (cntrObj === 0) {
		strNext = '';
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('', strClsz, fieldsetName, basePath, targetName);
		}
	} else if (cntrObj === 1) {
		strNext = '';
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName);
		}
	} else if (cntrObj > 1) {
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName);
		}
		if (typeof nxtbtn[0] !== 'undefined') {
			nxtbtn[0].setAttribute('id', slideNxt);
			nxtbtn[0].innerHTML = strNext;
		}
	} else {
	}

	var idxSlider = -1;
	for (var cntr = 0; cntr < this.allSlider.length; cntr++) {
		if (this.allSlider[cntr][bxSliderMasterName].id === slideId) {
			idxSlider = cntr;
			break;
		}
	}

	if (idxSlider === -1) {
		var btn = newbtn[0];
		btn.allSlider = this.allSlider; // create and park allSlider variable in the button

		var slideScript = document.createElement('script');
		slideScript.setAttribute('type', 'text/javascript');
		
		/*
		slideScript.innerHTML = "\n" + "//<![CDATA[ " + "\n"
		+ "	$(document).ready(function(){ sliderVar = $('#" + slideId + "').bxSlider({ticker:false, mode:'" + bxSliderMode + "', controls:true, pager:false, nextSelector:'#" + slideNxt + "', nextText:'" + strNext + "'});" 
		+ "sliderVar.nextBtnId = '" + slideNxt + "';"
		+ "var parkBtn = UiUtil.GetActiveSlideElement('" + btn.id + "');"
		+ "parkBtn.allSlider.push(sliderVar); " 
		+ "});"
		+ "\n" + "//]]>" + "\n";
		*/
		slideScript.innerHTML = "\n" + "//<![CDATA[ " + "\n"
		+ "	$(document).ready(function(){ " 
		+ "var masterSlider = document.getElementById('" + slideId + "');"
		+ "var nextBtn = document.getElementById('" + slideNxt + "');"
		+ "var sliderList = $(masterSlider).children();"
		+ "sliderVar = UiUtil.CreateVerticalSlider(masterSlider, sliderList, nextBtn);"
		+ "sliderVar.nextBtnId = '" + slideNxt + "';"
		+ "var parkBtn = UiUtil.GetActiveSlideElement('" + btn.id + "');"
		+ "parkBtn.allSlider.push(sliderVar); " 
		+ "});"
		+ "\n" + "//]]>" + "\n";

		slideSet.appendChild(slideScript);
	} else {
		this.allSlider[idxSlider].reloadSlider({mode:bxSliderMode, controls:true, pager:false, nextSelector:'#' + slideNxt, nextText:strNext});
	} 
};
UiForm.prototype.doHref = function(innerLabel, strClsz, titleStr, basePath, fieldName) {
	var clickAction;
	var result = '';
	if (innerLabel.indexOf('New') >= 0) {
		clickAction =	this.myName + "." + "newFieldObject('" + strClsz + "', '" + titleStr + "', '" + basePath + "', '" + fieldName + "');";
		result = '<a href="javascript:void(0)" onclick="' + clickAction + 'return false;">' + innerLabel + '</a>';
	} else if (innerLabel.indexOf('Delete') >= 0) {
		clickAction =	this.myName + "." + "deleteFieldObject('" + titleStr + "', '" + basePath + "', '" + fieldName + "');";
		result = '<a href="javascript:void(0)" onclick="' + clickAction + 'return false;">' + innerLabel + '</a>';
	} else {
		result = '<a href="javascript:void(0)">' + innerLabel + '</a>';
	}
	return(result);
};
UiForm.prototype.isSystemField = function(aName) {	
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
UiForm.prototype.createIdStr = function(fieldName, postfix) {
	var strId = fieldName.replace(/\s+/g, '_') + postfix;
	strId = strId.split('.').join('');
	return(strId);
};
UiForm.prototype.isUiMaster = function(each) {	
	var result = false;
	if (each.uimaster === true) {
		result = true;
	}
	return(result);
};
UiForm.prototype.createFieldset = function(displayLabel) {
	var fset = document.createElement("fieldset");
	var lgnd = document.createElement("legend");
	lgnd.innerHTML = displayLabel;
	fset.appendChild(lgnd);

	return(fset);
};
UiForm.prototype.createButton = function(btnLabel, btnId) {
	var newBtn = document.createElement('button');
	newBtn.innerHTML = btnLabel;
	newBtn.style.cursor = 'pointer';
	newBtn.style.width = '80px';
	newBtn.setAttribute('id', btnId);
	return(newBtn);
};
UiForm.prototype.createTelephone = function(displayLabel, jsonTelephone, jsonPath) {
	var listAreaCode = UiUtil.CreateComboBox(undefined);
	var tpBase = UiUtil.GetRandom5();
	listAreaCode.setAttribute("id", tpBase + "_mid");
	var result = this.createPhone(displayLabel, jsonTelephone, listAreaCode, tpBase, jsonPath);
	return(result);
};
UiForm.prototype.createMobilephone = function(displayLabel, jsonMobile, jsonPath) {
	var listNdc = UiUtil.CreateComboBox(undefined);
	var mpBase = UiUtil.GetRandom5();
	listNdc.setAttribute("id", mpBase + "_mid");
	var result = this.createPhone(displayLabel, jsonMobile, listNdc, mpBase, jsonPath);
	return(result);
};
UiForm.prototype.createPhone = function(displayLabel, jsonMobile, listNdc, mpBase, jsonPath) {
	var strArray = jsonMobile.data.split("-");
	var codeCtry = strArray[0];
	var codeNdc = strArray[1];
	var codeSubNo = strArray[2];

	var listCountry = UiUtil.CreateComboBox(undefined);
	var ctryId = mpBase + "_ctry";
	listCountry.setAttribute("id", ctryId);
	UiForm.populateComboBoxWithName(listCountry, jsonMobile.countrycode, codeCtry);
	//listCountry.setAttribute("onchange", "UiForm.changePhone('" + jsonPath + "' , this)");
	//listCountry.setAttribute("onblur", "UiForm.changePhone('" + jsonPath + "' , this)");

	var spCountry = document.createElement("span");
	spCountry.setAttribute("class", "st-symbol");
	spCountry.appendChild(listCountry);

	var spNdc = document.createElement("span");
	spNdc.setAttribute("class", "st-symbol");
	spNdc.appendChild(listNdc);
	//listNdc.setAttribute("onchange", "UiForm.changePhone('" + jsonPath + "' , this)");
	//listNdc.setAttribute("onblur", "UiForm.changePhone('" + jsonPath + "' , this)");

	var spNo = document.createElement("span");
	var tfNo = UiUtil.CreateTextFieldNoLabel(mpBase + "_mn");
	if (codeSubNo !== undefined) {
		tfNo.setAttribute("value", codeSubNo);
	}
	//tfNo.setAttribute("onchange", "UiForm.changePhone('" + jsonPath + "' , this)");
	//tfNo.setAttribute("onblur", "UiForm.changePhone('" + jsonPath + "' , this)");
	spNo.appendChild(tfNo);

	var funcName = "mphn_" + mpBase;
	var scrptDyn = this.createDynamicList(funcName, listNdc.id, jsonMobile.countrycode);
	this.scriptAddWithRemove(scrptDyn, funcName);
	var chgFunc = funcName + "(this.value)";
	listCountry.setAttribute("onchange", chgFunc);

	UiForm.populateComboBoxWithValue(listNdc, jsonMobile.countrycode[codeCtry], codeNdc); // to populate the selected NDC

	var parent = document.createElement("parentwrapper");
	parent.appendChild(spCountry);
	parent.appendChild(spNdc);
	parent.appendChild(spNo);
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, parent);

	return(result);
};

UiForm.HandleMoney = function(aStrToHandle) {
	var result = "";
	if (UiUtil.NotUndefineNotNullNotBlank(aStrToHandle)) {
		var strToHandle = ('' + aStrToHandle).replace(/[^0-9.]/g, "");
		if (UiUtil.NotUndefineNotNullNotBlank(strToHandle)) {
			var partDollar = "0";
			var partCent = "00";
			var gotDot = strToHandle.indexOf('.');
			if (gotDot >= 0) {
				partDollar = strToHandle.substr(0, strToHandle.indexOf('.'));
				partDollar = partDollar.replace(/\D/g, ''); // no more other dot
				partCent = strToHandle.substr(strToHandle.indexOf('.') + 1);
				partCent = partCent.replace(/\D/g, '');
				if (partCent.length > 2) {
					partCent = partCent.substr(0, 2);
				}
				partDollar = UiForm.numberWithComma(partDollar);
				result = partDollar + "." + partCent;
			} else {
				result = UiForm.numberWithComma(strToHandle);
			}
		}
	}
	return(result);
};
UiForm.FormatMoney = function(aStrToHandle) {
	var result = UiForm.HandleMoney('' + aStrToHandle);
	var gotDot = ('' + result).indexOf('.');
	if (gotDot < 0) {
		result += ".00";
	} else {
		var centPart = result.substr(result.indexOf('.') + 1);
		if (centPart.length === 1) {
			result += "0";
		}
	}
	return(result);
};
UiForm.numberWithComma = function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
UiForm.populateComboBoxWithName = function(cmb, jsonObj, chosen) {
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
UiForm.changeValueBoolean = function(aFqn, aWidget) { 
	if (UiUtil.NotUndefineNotNull(aWidget.UiForm) === false) {
		return;
	}
	var value = "false";
	if ($(aWidget).prop("checked") === true) {
		value = "true";
	}
	UiUtil.JsonAssignment(aWidget.UiForm.obj2Edit, aFqn, value); 
};
UiForm.changeValue = function(aFqn, aWidget) { 
	if (UiUtil.NotUndefineNotNull(aWidget.UiForm) === false) {
		return;
	}
	UiUtil.JsonAssignment(aWidget.UiForm.obj2Edit, aFqn, aWidget.value); 
};
UiForm.changeHtmlField = function(aFqn, aWidget) { 
	if (UiUtil.NotUndefineNotNull(aWidget.UiForm) === false) {
		return;
	}
	// ignore this damn <br> html element place in by HtmlEditor widget
	if (aWidget.value !== "<br>") {
		UiForm.changeValue(aFqn, aWidget);
	}
};
UiForm.changePhone = function(jsonPath, aThis) {
	if (UiUtil.NotUndefineNotNull(aThis.UiForm) === false) {
		return;
	}
	var parentLgnd = $($(aThis).parents('fieldset')[0]).children('legend');
	var slideId = aThis.UiForm.createIdStr(parentLgnd.text(), '_slide');
	var idxSlide;
	for (var cntr = 0; cntr < aThis.UiForm.allSlider.length; cntr++) {
		if (aThis.UiForm.allSlider[cntr][bxSliderMasterName].id === slideId) {
			idxSlide = cntr;
			break;
		}
	}

	var nmBase = aThis.id.substr(0, aThis.id.indexOf('_'));
	if (idxSlide !== undefined) {
		var kidi;
		var kids = aThis.UiForm.allSlider[idxSlide].children();
		for (var cntr = 0; cntr < kids.length; cntr++) {
			if ($(kids[cntr]).find(aThis).length !== 0) {
				kidi = $(kids[cntr]);
				break;
			}
		}
		var ctryNm = kidi.find('#' + nmBase + '_ctry')[0];
		var NdcNm = kidi.find('#' + nmBase + '_mid')[0];
		var NoNm = kidi.find('#' + nmBase + '_mn')[0];
		aThis.UiForm.changePhoneAsgn(jsonPath, ctryNm, NdcNm, NoNm);
	} else {
		var nmCtry = UiUtil.GetActiveSlideElement(nmBase + "_ctry");
		var nmNdc = UiUtil.GetActiveSlideElement(nmBase + "_mid");
		var nmNo = UiUtil.GetActiveSlideElement(nmBase + "_mn");
		aThis.UiForm.changePhoneAsgn(jsonPath, nmCtry, nmNdc, nmNo);
	}
};
UiForm.prototype.changePhoneAsgn = function(jsonPath, nmCtry, nmNdc, nmNo) { 
	var strMobileNo = nmCtry.value+ "-" + nmNdc.value + "-" + nmNo.value; 
	UiUtil.JsonAssignment(this.obj2Edit, jsonPath, strMobileNo); 
};
UiForm.changeMoney = function(jsonPath, aThis) { 
	if (UiUtil.NotUndefineNotNull(aThis.UiForm) === false) {
		return;
	}
	var nmBase = aThis.id.substr(0, aThis.id.indexOf('_'));
	var nmCy = UiUtil.GetActiveSlideElement(nmBase + "_cy");
	var nmDl = UiUtil.GetActiveSlideElement(nmBase + "_dl");
	var nmCt = UiUtil.GetActiveSlideElement(nmBase + "_ct");

	if (!nmDl.value.trim() && !nmCt.value.trim()) {
		var strAmt = ""; 
		UiUtil.JsonAssignment(aThis.UiForm.obj2Edit, jsonPath, strAmt); 
	} else {
		var strAmt = nmCy.value + " " + nmDl.value + "." + nmCt.value; 
		UiUtil.JsonAssignment(aThis.UiForm.obj2Edit, jsonPath, strAmt); 
	}
};
UiForm.prototype.changeDatePicker = function(jsonName, aThis) { 
	if (UiUtil.NotUndefineNotNull(this.obj2Edit) === false) {
		return;
	}

	var nmBase = aThis.id.substr(0, aThis.id.indexOf('_'));
	var nmDay = UiUtil.GetActiveSlideElement(nmBase + "_d");
	var nmMth = UiUtil.GetActiveSlideElement(nmBase + "_m");
	var nmYer = UiUtil.GetActiveSlideElement(nmBase + "_y");
	var nmHour = UiUtil.GetActiveSlideElement(nmBase + "_h");
	var nmMin = UiUtil.GetActiveSlideElement(nmBase + "_mt");
	var nmSec = UiUtil.GetActiveSlideElement(nmBase + "_s");

	var strDate = UiUtil.AssignDatePicker(nmDay, nmMth, nmYer, nmHour, nmMin, nmSec);

	if (this.obj2Edit !== undefined) {
		UiUtil.JsonAssignment(this.obj2Edit, jsonName, strDate); 
	}
};
UiForm.prototype.addStyle = function(cssStr) {
	if (this.styleExist(cssStr) === false) {
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
UiForm.prototype.styleExist = function(strStyle) {
	var ssList = document.styleSheets; 
	if (!ssList) return false;
	for (var i = 0; i < ssList.length; i++) {
		var ss = ssList[i]; 
		if (!ss) continue;
		if (this.xTraverseStyleSheet(ss, strStyle)) return true;
	}
	return false;
};
UiForm.prototype.xTraverseStyleSheet = function(ss, strStyle) {
	if (!ss) return false;
	var rls = this.xGetCSSRules(ss) ; if (!rls) return false;
	var str2 = this.stdCssStr(strStyle);
	for (var j = 0; j < rls.length; j++) {
		var cr = rls[j];
		if (cr.selectorText) {
			var str1 = this.stdCssStr(cr.cssText);
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
UiForm.prototype.stdCssStr = function(strCss) {
	var body = strCss.match(/[^{}]+(?=\})/g); // standardise body section string
	var tmp = document.createElement("div");
	tmp.style.cssText = body[0];

	var tgtCss = strCss.substr(0, strCss.indexOf(body) -1); // get the targeted css name
	var result = tgtCss + '{ ' + tmp.style.cssText + ' }';
	
	return(result);
};
UiForm.prototype.xGetCSSRules = function(ss) { 
	return ss.rules ? ss.rules : ss.cssRules; 
};
UiForm.prototype.hrefCssAdd = function(cssPath) {
	if (hrefCssExist(cssPath) === false) {
		var lnk = document.createElement("link");
		lnk.setAttribute("href", cssPath);
		lnk.setAttribute("rel", "stylesheet");
		lnk.setAttribute("type", "text/css");
		document.head.appendChild(lnk);
	}
};
UiForm.prototype.hrefCssExist = function(cssPath) {
	var ss = document.styleSheets;
	for (var cntr = 0, max = ss.length; cntr < max; cntr++) {
		var fullUrl = getFullUrl(cssPath);
		if (ss[cntr].href === fullUrl) return(true);
	}	
	return(false);
};
UiForm.prototype.setUpdateableOnWidget = function(fieldValue, widgetSet) {
	if (fieldValue.updateable !== undefined) {
		if (fieldValue.data !== undefined) {
			var nodesChild = widgetSet.getElementsByTagName('*');
			for(var cntr = 0; cntr < nodesChild.length; cntr++){
				nodesChild[cntr].setAttribute('updateable', '');
			}
		}
	}
};
UiForm.prototype.setChangeableOnWidget = function(fieldValue, widgetSet) {
	if (fieldValue.changeable !== undefined) {
		if (fieldValue.data !== undefined) {
			var nodesChild = widgetSet.getElementsByTagName('*');
			for(var cntr = 0; cntr < nodesChild.length; cntr++){
				nodesChild[cntr].setAttribute('changeable', '');
			}
		}
	}
};
UiForm.prototype.setOk = function(errormsg) {
	var ok = document.createComment("000");
	errormsg.appendChild(ok);
};
UiForm.prototype.createDynamicList = function(masterId, childId, jsonMaster) {
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
UiForm.prototype.removeNode = function(parentNode) {
	while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
	}
};
UiForm.prototype.setupCtrl = function(cntrObj, strClsz, titleStr, basePath, fieldName) {
	var setMaster = document.getElementById(this.locationId);
	var setChild = $(setMaster).find('legend').filter(':contains("' + titleStr + '")');
	setChild = $(setChild).parent()[0];
	var nwbtn = $(setChild).find('[id^=newbtn]')[0];
	var dlbtn = $(setChild).find('[id^=deletebtn]')[0];
	if (cntrObj === 0) {
		if (nwbtn !== undefined) {
			nwbtn.innerHTML = this.doHref('[New]', strClsz, titleStr, basePath, fieldName);
		}
		if (dlbtn !== undefined){
			dlbtn.innerHTML = this.doHref('', strClsz, titleStr, basePath, fieldName);
		} 
	} else {
		if (nwbtn !== undefined) {
			nwbtn.innerHTML = this.doHref('', strClsz, titleStr, basePath, fieldName);
		} 
		if (dlbtn !== undefined) {
			dlbtn.innerHTML = this.doHref('[Delete]', strClsz, titleStr, basePath, fieldName);
		}
	}
};
UiForm.prototype.newFieldObject = function(fieldClasz, fieldsetTitle, basePath, targetName) {
	UiUtil.DialogWaitStart();
	var tempScrollTop = $(window).scrollTop();
	var inpClasz = fieldClasz;
	var fieldFqnName = getJsonPath(basePath, targetName);
	var thisUiForm = this; // once gointo ajax call, this is no this prototype anymore
	var requestParam = {targetClasz: JSON.stringify(inpClasz), fieldFqn: fieldFqnName};
	UiUtil.BeAction(requestParam, 'newField', this.baseUrl, function(jsonObject) {
		if (jsonObject !== null) {
			var setMaster = document.getElementById(thisUiForm.locationId);
			var setChild = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle + '")');
			var titleStr = $(setChild).text();
			var afterNumIdx = titleStr.indexOf(' ');
			var prefixStr = titleStr.substr(0, afterNumIdx - 1); // don't want the dot

			setChild = $(setChild).parent()[0];
			var targetField = UiUtil.GetVarByJsonPath(thisUiForm.obj2Edit, fieldFqnName);
			delete targetField.delete; // remove delete marker for new field
			var subSeqNum = {value: '', prefix: prefixStr, startNum: 0, cls: 'fs02'}; // for numbering fieldset, uses object to for pass by ref
			if (targetField.dataset !== undefined) {
				var slideId = thisUiForm.createIdStr(fieldsetTitle, '_slide');
				var slideNxt = thisUiForm.createIdStr(fieldsetTitle, '_nxt');
				targetField.dataset.push(jsonObject.dataset[0]);

				var idxSlide; // find the slide in allSlider, i.e. its index
				for (var cntr = 0; cntr < thisUiForm.allSlider.length; cntr++) {
					if (thisUiForm.allSlider[cntr][bxSliderMasterName].id === slideId) {
						idxSlide = cntr;
						break;
					}
				}

				// create the div for the new child field and append to allSlider
				var cntr = targetField.dataset.length - 1;
				var divForSlideChild = document.createElement('div');
				thisUiForm.allSlider[idxSlide][bxSliderMasterName].appendChild(divForSlideChild);
				var avoidRecursive = new Array();
				avoidRecursive.push({clasz: thisUiForm.rawObj.meta.ParentClass, Oid: thisUiForm.rawObj.meta.ParentOid});
				targetField.dataset[cntr].slideNo = thisUiForm.allSlider[idxSlide].getSlideCount();
				thisUiForm.editAreaRecursion(targetField.dataset[cntr], setChild, divForSlideChild, basePath, targetName + '[' + cntr + ']', cntr, true, avoidRecursive, subSeqNum, false);
				thisUiForm.setupAryCtrlButton(targetField, fieldsetTitle, slideId, slideNxt, basePath, targetName);
				var funcSlow = function() { thisUiForm.allSlider[idxSlide].goToSlide(thisUiForm.allSlider[idxSlide].getSlideCount() - 1); };
				setTimeout(funcSlow, 100);
				//$(divForSlideChild).find(':input:first').focus();
			} else {
				jQuery.extend(true, targetField, jsonObject.dataset[0]);
				var avoidRecursive = new Array();
				avoidRecursive.push({clasz: thisUiForm.rawObj.meta.ParentClass, Oid: thisUiForm.rawObj.meta.ParentOid});
				thisUiForm.editAreaRecursion(targetField, setChild, setChild, basePath, targetName, 0, true, avoidRecursive, subSeqNum, false);
				thisUiForm.setupCtrl(1, targetField.clasz, fieldsetTitle, basePath, targetName);
			}
			$(window).scrollTop(tempScrollTop);
		} else {
			displayMsg('error', 'Fail to create field: ' + fieldsetTitle);
		}
	}
	, undefined
	);
};
UiForm.prototype.deleteFieldObject = function(fieldsetTitle, basePath, fieldName) {
	var fieldFqnName = getJsonPath(basePath, fieldName);
	var targetField = UiUtil.GetVarByJsonPath(this.obj2Edit, fieldFqnName);
	var fieldBrief = '';
	if (targetField.dataset !== undefined) {
		var slideId = this.createIdStr(fieldsetTitle, '_slide');
		var idxSlide;
		var idxObject;
		for (var cntr = 0; cntr < this.allSlider.length; cntr++) {
			if (this.allSlider[cntr][bxSliderMasterName].id === slideId) {
				idxSlide = cntr;
				idxObject = this.allSlider[cntr].getCurrentSlide();
				break;
			}
		}
		fieldBrief = this.getFieldBrief(targetField.dataset[idxObject]); // get a string to briefly describe to the user about the record about to delete
	} else {
		fieldBrief = this.getFieldBrief(targetField);
	}

	var sendDelRq = this.sendDeleteFieldObject(this, fieldsetTitle, basePath, fieldName);
	UiUtil.DialogOkCancel('Confirm to Delete', 'Confirm to delete ' + fieldBrief + '?', sendDelRq);
};
UiForm.prototype.getFieldBrief = function(aDisplayField) {
	var result = '';
	var cntr = 0;
	var targetField = aDisplayField.data;
	for (var key in targetField) { 
		if (key !== 'cbjectId' && key !== 'clasz') {
			if (result !== "") result += ', ';
			result += '"' + key + '"' + ': ' + this.getObjStrPart(targetField[key].data); // arbitrary traverse the object and get any string to it
			cntr++;
		}
		if (cntr > 1) break; // only describe 2 field, 0 and 1
	}
	return(result);
};
UiForm.prototype.getObjStrPart = function(aObject) {
	var result = '';
	if (typeof aObject !== 'object') result = aObject;
	for (var key in aObject) { 
		if (key !== 'cbjectId' && key !== 'clasz') {
			if (aObject[key].data !== undefined) {
				result = this.getObjStrPart(aObject[key].data);
				break;
			} else {
				if (aObject[key].dataset !== undefined) {
					result = this.getObjStrPart(aObject[key].dataset[0]);
					break;
				}
			}
		}
	}
	return(result);
};
UiForm.prototype.getObjClasz = function(aObj) {
	if (aObj.dataset !== undefined) {

	} else {

	}

};
UiForm.prototype.sendDeleteFieldObject = function(aThis, fieldsetTitle, basePath, targetName) {
	return function() {
		var thisUiForm = aThis; // once gointo a call dialog box, this is window this, not UiForm this
		var fieldFqnName = getJsonPath(basePath, targetName);
		var targetField = UiUtil.GetVarByJsonPath(aThis.obj2Edit, fieldFqnName);
		var setMaster = document.getElementById(thisUiForm.locationId);

		if (targetField.dataset !== undefined) {
			var slideNxt = thisUiForm.createIdStr(fieldsetTitle, '_nxt');
			var slideId = thisUiForm.createIdStr(fieldsetTitle, '_slide');
			var idxSlide;
			var currSlide;
			for (var cntr = 0; cntr < thisUiForm.allSlider.length; cntr++) {
				if (thisUiForm.allSlider[cntr][bxSliderMasterName].id === slideId) {
					idxSlide = cntr;
					currSlide = thisUiForm.allSlider[cntr].getCurrentSlide();
					break;
				}
			}

			var idxObject;
			for(var cntr = 0; cntr < targetField.dataset.length; cntr++) {
				if (targetField.dataset[cntr].delete === undefined) {
					if (targetField.dataset[cntr].slideNo === currSlide) {
						idxObject = cntr;
						break;
					}
				}
			}

			thisUiForm.removeNode(thisUiForm.allSlider[idxSlide][bxSliderMasterName]); // remove all existing member of the dataset from the slider, below will redraw the slider again
			if (targetField.dataset[idxObject].objectId === -1) {
				targetField.dataset.splice(idxObject, 1);
			} else {
				targetField.dataset[idxObject].delete = true;
			}

			var cntrSlide = 0;
			for (var cntr = 0; cntr < targetField.dataset.length; cntr++) {
				if (targetField.dataset[cntr].delete !== undefined) continue;
				var divForSlideChild = document.createElement('div');
				thisUiForm.allSlider[idxSlide][bxSliderMasterName].appendChild(divForSlideChild);
				var avoidRecursive = new Array();
				//avoidRecursive.push({clasz: thisUiForm.rawObj.meta.ParentClass, Oid: thisUiForm.rawObj.meta.ParentOid});
				avoidRecursive.push({clasz: thisUiForm.obj2Edit.clasz, Oid: thisUiForm.obj2Edit.cbjectId});
				targetField.dataset[cntr].slideNo = cntrSlide++;
				thisUiForm.editAreaRecursion(targetField.dataset[cntr], setMaster, divForSlideChild, basePath, targetName + '[' + cntr + ']', cntr, true, avoidRecursive, 0, false);
			}
			var funcSlow = function() { 
				thisUiForm.setupAryCtrlButton(targetField, fieldsetTitle, slideId, slideNxt, basePath, targetName);
			};
			setTimeout(funcSlow, 100);
		} else {
			var divParent = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle +'")').parent()[0];
			var divChild = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle +'")').parent().children();
			for(var cntr = 0; cntr < divChild.length; cntr++) { 
				if (divChild[cntr].tagName !== 'LEGEND' && divChild[cntr].id !== 'st-aryctrl') { 
					divParent.removeChild(divChild[cntr]);
				}
			}
			thisUiForm.setupCtrl(0, targetField.clasz, fieldsetTitle, basePath, targetName);
			targetField.delete = true;
			//delete targetField;
		}
	};
};
UiForm.prototype.disableArea = function() {
	document.getElementById(this.locationId).disabled = true;
	var nodesDisable = document.getElementById(this.locationId).getElementsByTagName('*');
	this.changeEditableArea(true, nodesDisable, false);
	this.preventOnclickA(this.locationId); // disable the New, Delete, Next link in object fields
};
UiForm.prototype.enableArea = function(ignoreUpdateable) {
	document.getElementById(this.locationId).disabled = false;
	var nodesDisable = document.getElementById(this.locationId).getElementsByTagName('*');
	if (ignoreUpdateable === undefined) ignoreUpdateable = false;
	this.changeEditableArea(false, nodesDisable, ignoreUpdateable);
	this.focusFirstWidget();
};
UiForm.prototype.boldFsBtn = function(btn, fw) {
	for(var cntr = 0; cntr < $(btn).length; cntr++) {
		var btnFs = $($(btn)[cntr]).parents('fieldset')[0]; // only bold on immediate children of fsHover
		if (this.getLgndStr(btnFs) === this.getLgndStr(fsHover)) {
			$($($(btn)[cntr]).parents('div')[0]).css('font-weight', fw);
			$($(btn)[cntr]).css('font-weight', fw);
			if (fw === 'bold') {
				$(btnFs).children('legend').css('color', 'blue');
			} else {
				$(btnFs).children('legend').css('color', 'black');
			}
		}
	}
};
UiForm.prototype.getLgndStr = function(fs) {
	var result = $(fs).children('legend').text();
	if (result === undefined || result === null) {
		result = '';
	}
	return(result);
};
UiForm.prototype.mouseAtFs = function(fs) {
	var result;
	if (fs !== undefined && fs !== null) {
		if ($(fs).is('fieldset')) {
			result = fs;
		} else {
			result = $($(fs).parents('fieldset')[0]);
		}
	}
	return(result);
};
UiForm.prototype.boldFsHover = function() {
	var thisUiForm = this;
	$('fieldset .' + CLS_FIELDSET).bind('mousemove', function(evt) {
		var newMouseAt = thisUiForm.mouseAtFs(evt.target);
		if (thisUiForm.getLgndStr(newMouseAt) !== thisUiForm.getLgndStr(fsHover)) {
			if (fsHover !== undefined && fsHover !== null) {
				var btn = $(fsHover).find('.array_btn');
				if (btn !== undefined && btn !== null) {
					thisUiForm.boldFsBtn(btn, 'normal');
				}
			}
	
			fsHover = thisUiForm.mouseAtFs(evt.target);
			if (fsHover !== undefined && fsHover !== null) {
				var btn = $(fsHover).find('.array_btn');
				if (btn !== undefined && btn !== null) {
					thisUiForm.boldFsBtn(btn, 'bold');
				}
			}
		}
	});
};
var fsHover;
UiForm.prototype.boldFsOut = function() {
	if (fsHover !== undefined && fsHover !== null) {
		var btn = $(fsHover).find('.array_btn');
		if (btn !== undefined && btn !== null) {
			this.boldFsBtn(btn, 'normal');
		}
	}
};
UiForm.prototype.preventOnclickA = function(aArea) {
	$('#' + aArea + ' a[onclick]').each(function() {
		var originalClick = this.onclick;
		$(this).data('onclick', this.onclick);
		this.onclick = function(event) {
			if ($(this).attr('disabled')) {
				return false;
			};
			$(this).data('onclick', originalClick);
			$(this).data('onclick').call(this, event || window.event);
		};
	});
};
UiForm.prototype.changeColor = function(nodes, disable) {
	var bkcl;
	var fgcl;
	var lbcl;
	var hfcl;
	if (disable === true) {
		bkcl = 'rgb(235, 235, 228)';
		fgcl = 'rgb(136, 136, 136)';
		lbcl = 'grey';
		hfcl = 'grey';
		this.boldFsOut(); 
	} else {
		bkcl = 'rgb(255, 255, 255)';
		fgcl = 'black';
		lbcl = 'black';
		hfcl = '';
		this.boldFsHover(); // will bold the array buttons when mouse move on the seledted fieldset
	}

	var tgNm = nodes.tagName;
	if (tgNm === 'INPUT' || tgNm === 'SELECT') {
		nodes.style.backgroundColor = bkcl;
		nodes.style.color = fgcl;
	} else if (tgNm === 'LABEL' || tgNm === 'FIELDSET') {
		nodes.style.color = lbcl;
	} else if (tgNm === 'TABLE') {
		if (disable) {
			$(nodes).find("tr").attr("ondblclick", "null");
		} else {
			$(nodes).find("tr").attr("ondblclick", "rowClick(this)");
		}
	} else if (tgNm === 'A') {
		if (nodes.innerHTML.indexOf('Next') !== -1) {
			if (navigator.userAgent.toUpperCase().indexOf('MSIE') >= 0) {
				nodes.style.color = hfcl;
			} else {
				nodes.style.color = '';
			}
		} else {
			nodes.style.color = hfcl;
		}
	} else if (tgNm === 'DIV') {
		if ($(nodes).attr('class') !== undefined) {
			if ($(nodes).attr('class').trim() === 'nicEdit-main') {
				$(nodes).attr('contenteditable', !disable);
				$(nodes).css('background-color', bkcl);
				$(nodes).css('color', fgcl);
			}
		}
	}
};
UiForm.prototype.changeEditableArea = function(disable, nodes, ignoreUpdateable) {
	for(var i = 0; i < nodes.length; i++) {
		if (nodes[i].hasAttribute("updateable") && !ignoreUpdateable) { // if is key, make it not updateable, should rename updateable to iskey
			if (this.obj2Edit.cbjectId !== -1 || disable === true || nodes[i].hasAttribute("changeable")) {
				nodes[i].disabled = true;
			} else {
				nodes[i].disabled = false;
			}
			this.changeColor(nodes[i], nodes[i].disabled);
			var nodesDisable = nodes[i].getElementsByTagName('*');
			if (nodesDisable !== undefined) {
				this.changeEditableArea(nodes[i].disabled, nodesDisable, ignoreUpdateable); // this is not effective, child is flatten and not hierarchical
			}
		} else {
			if (nodes[i].hasAttribute("changeable")) {
				nodes[i].disabled = true; 
			} else {
				nodes[i].disabled = disable; // this will add the disabled attribute to the element
			}
			var dbtn = $($(nodes[i]).find('[id^=deletebtn]')[0]).find('a');
			var nbtn = $($(nodes[i]).find('[id^=newbtn]')[0]).find('a');
			if (disable || nodes[i].disabled) {
				if (dbtn !== undefined && dbtn.length > 0) {
					dbtn.css('cursor', 'default');
					dbtn.attr('disabled', 'disabled');
				}
				if (nbtn !== undefined && nbtn.length > 0) {
					nbtn.css('cursor', 'default');
					nbtn.attr('disabled', 'disabled');
				}
			} else {
				if (dbtn !== undefined && dbtn.length > 0) {
					dbtn.css('cursor', 'pointer');
					dbtn.removeAttr('disabled');
				}
				if (nbtn !== undefined && nbtn.length > 0) {
					nbtn.css('cursor', 'pointer');
					nbtn.removeAttr('disabled');
				}
			}
			this.changeColor(nodes[i], disable || nodes[i].disabled);
		}
	}
};
UiForm.prototype.storeSaveObject = function() {
	//UiUtil.StoreObj("employeeFormSaved", editArea.obj2Edit);
};
UiForm.prototype.validatedBeforeSave = function() {
	return(true);
};
UiForm.prototype.saveObjectSuccess = function() {
};
UiForm.prototype.saveObjectFail = function() {
};
UiForm.prototype.warnBeforeSave = function() {
	return(false);
};
UiForm.prototype.callSave2Backend = function() {
	var editArea = this;
	return(function() {
		editArea.saveObject2Backend(editArea);
	});
};
UiForm.prototype.warnOnSave = function(aWarnMsg, aWarnIgnore) {
	UiUtil.DialogYesNo('Confirm to Save', aWarnMsg, this.callSave2Backend(), aWarnIgnore);
};
UiForm.prototype.saveObject2Backend = function(aThis) {
	UiUtil.DialogWaitStart();
	var editArea = aThis;
	var requestParam = {parentOid: this.parentOid, object2Save: JSON.stringify(this.obj2Edit)};
	UiUtil.BeAction(requestParam, 'save', this.baseUrl
		, function(jsonObject) {
			window.onbeforeunload = null;
			editArea.obj2Edit = UiUtil.GetAryByJsonPath(jsonObject, "")[0];
			localStorage.setItem("saveObjectMsg", "Successfully saved...");
			editArea.storeSaveObject();
			editArea.saveObjectSuccess();
			window.history.go(-1);
		}
		, function() {
			editArea.saveObjectFail();
		}
	);
};
UiForm.prototype.saveObject = function() {
	if (this.validatedBeforeSave() === true) { 
		if (this.warnBeforeSave()) {
			// do nothing
		} else {
			this.saveObject2Backend(this);
		}
	}
};
UiForm.prototype.cancelEdit = function() {
	UiUtil.CancelEdit();
};
UiForm.prototype.focusFirstWidget = function() {
	var editDiv = this.locationId;
	var allInput = $('#' + editDiv).find('input, select');
	for (var cntr = 0; cntr < allInput.length; cntr++) {
		if (allInput[cntr].disabled === false) {
			allInput[cntr].focus();
			break;
		}
	}
};
UiForm.prototype.scriptAddWithRemove = function(strScript, idName) {
	var tmp = this.scriptAdd(strScript);
	tmp.setAttribute("id", idName);
	this.sourceToBeRemove.push(idName);
};
UiForm.prototype.scriptAdd = function(strScript) {
	var head = document.getElementsByTagName('head')[0];
	var scpt = document.createElement('script');
	scpt.type = 'text/javascript';
	scpt.appendChild(document.createTextNode(strScript));
	head.appendChild(scpt);
	return(scpt);
};
UiForm.CreateComboBoxCountry = function(aName, aValue, aSet) {
	var inputArea = UiUtil.CreateComboBox(aName);
	var cmb = inputArea.getElementsByTagName("select")[0];
	cmb.setAttribute('style', 'margin-top: 10px');
	UiForm.PopulateComboBoxWithName(cmb, aValue.option, aValue.data);
	aSet.appendChild(inputArea);
};
UiForm.PopulateComboBoxWithName = function(cmb, jsonObj, chosen) {
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
UiForm.AddStyle = function(cssStr) {
	if (UiForm.StyleExist(cssStr) === false) {
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
UiForm.StyleExist = function(strStyle) {
	var ssList = document.styleSheets; 
	if (!ssList) return false;
	for (var i = 0; i < ssList.length; i++) {
		var ss = ssList[i]; 
		if (!ss) continue;
		if (UiForm.XTraverseStyleSheet(ss, strStyle)) return true;
	}
	return false;
};
UiForm.XTraverseStyleSheet = function(ss, strStyle) {
	if (!ss) return false;
	var rls = UiForm.XGetCSSRules(ss) ; if (!rls) return false;
	var str2 = UiForm.StdCssStr(strStyle);
	for (var j = 0; j < rls.length; j++) {
		var cr = rls[j];
		if (cr.selectorText) {
			var str1 = UiForm.StdCssStr(cr.cssText);
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
UiForm.XGetCSSRules = function(ss) { 
	return ss.rules ? ss.rules : ss.cssRules; 
};
UiForm.StdCssStr = function(strCss) {
	var body = strCss.match(/[^{}]+(?=\})/g); // standardise body section string
	var tmp = document.createElement("div");
	tmp.style.cssText = body[0];

	var tgtCss = strCss.substr(0, strCss.indexOf(body) -1); // get the targeted css name
	var result = tgtCss + '{ ' + tmp.style.cssText + ' }';
	
	return(result);
};
UiForm.plusOne = function(seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) {
		seqNum.startNum++;
		seqNum.value = seqNum.prefix + seqNum.startNum;
	} 
	return(seqNum);
};
UiForm.nextLevelNumbering = function(seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) {
		seqNum.prefix += seqNum.value + '.';
		seqNum.startNum = 1;
		seqNum.value = seqNum.prefix + seqNum.startNum;
	} 
	return(seqNum);
};