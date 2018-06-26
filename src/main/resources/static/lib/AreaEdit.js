AreaEdit.prototype.rawObj = {};
AreaEdit.prototype.obj2Edit = {};
AreaEdit.prototype.parentOid = undefined;
AreaEdit.prototype.locationId = '';
AreaEdit.prototype.allSlider = [];
AreaEdit.prototype.forPrint = false;
AreaEdit.prototype.myName = '';
AreaEdit.prototype.baseUrl = '';
AreaEdit.prototype.sourceToBeRemove = [];

var bxSliderMode = 'fade';
var noImg = "img/imgErrorBlank.gif";
if (typeof ScreenBuilder === 'undefined' || ScreenBuilder === null) {
	ScreenBuilder = {}; // to avoid nb warning
}
function AreaEdit() {
};
AreaEdit.prototype.setValue = function(aFqn, aWidget) { 
	ScreenBuilder.JsonAssignment(this.obj2Edit, aFqn, aWidget.value);
};
AreaEdit.prototype.setValueBoolean = function(aFqn, aWidget) { 
	var value = "false";
	if ($(aWidget).prop("checked") === true) {
		value = "true";
	}

	// need the below if to avoid original null value being set to false when nothing actually change, impacted onbeforeunload
	if (!(ScreenBuilder.NotUndefineNotNullNotBlank(ScreenBuilder.GetValueByJsonPath(this.obj2Edit, aFqn)) === false && value === "false")) { // don't do anything if obj2Edit value is null/blank and checkbox value is false
		ScreenBuilder.JsonAssignment(this.obj2Edit, aFqn, value); 
	}
};
AreaEdit.prototype.assignValue = function(aIndex, aWidget, aFqn) { 
	if (ScreenBuilder.NotUndefineNotNull(this.rawObj)) {
		if (ScreenBuilder.NotUndefineNotNull(this.rawObj.dataset)) {
			if (ScreenBuilder.NotUndefineNotNull(this.rawObj.dataset[aIndex])) {
				var editObj  = this.rawObj.dataset[aIndex];
				ScreenBuilder.JsonAssignment(editObj, aFqn, aWidget.value); 
			}
		}
	}
};
AreaEdit.prototype.getValue = function(aIndex, aFqn) { 
	var editObj  = this.rawObj.dataset[aIndex];
	var varObj = ScreenBuilder.GetVarByJsonPath(editObj, aFqn);
	return(varObj.data);
};
AreaEdit.prototype.beAction= function(aIndex, aActionKeyword, aUrl, aBeSucc) { 
	var editObj  = this.rawObj.dataset[aIndex];
	ScreenBuilder.BeAction(editObj, aActionKeyword, aUrl, aBeSucc);
};
AreaEdit.prototype.setValueNoBr = function(aFqn, aWidget) { 
	if (aWidget.value !== "<br>") { // ignore this damn <br> html element place in by HtmlEditor widget
		this.setValue(aFqn, aWidget);
	}
};
AreaEdit.prototype.setComboboxWithValue = function(cmb, choices, chosen) {
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
AreaEdit.prototype.emptyChildCombobox = function(aWidget) {
	if (aWidget.toBeEmpty !== undefined) {
		for (var cntr = 0; cntr < aWidget.toBeEmpty.length; cntr++) {
			$(aWidget.toBeEmpty[cntr]).empty();
		}
	}
};
AreaEdit.prototype.filterChildCombobox = function(parentCmbx, strChildFqn) {
	var childCmbx = $(parentCmbx).parents('.eachfield').next().find('select');
	if (childCmbx.length === 0) return;
	var targetObj = ScreenBuilder.GetVarByJsonPath(this.obj2Edit, strChildFqn);
	childCmbx.empty();
	var thisAreaEdit = this;
	$.each(targetObj.option, function(master, child) {
		if (master === parentCmbx.value) {
			thisAreaEdit.setComboboxWithValue(childCmbx[0], child, '');
			return(false);
		}
	});
};
AreaEdit.GetHtmlEditorValue = function(aHtmlEditor) {
	aHtmlEditor.nicInstances[0].saveContent();
	var jsVar = aHtmlEditor.nicInstances[0].content;
	return(jsVar);
};
// new version is above this line


function AreaEdit(aVarName) { 
	this.myName = aVarName; // use in html pages to call function for this object
};
AreaEdit.prototype.displayObject = function(aLocationId, aObj2Edit, aTitle) {
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
	this.displayAreaEdit(aLocationId, tmpAry, 0);
};
AreaEdit.prototype.displayAreaEdit = function(aLocationId, aObj2Edit, aIdx, aBaseUrl) {
	if (aLocationId === undefined || aLocationId === null) {
		alert("The AreaEdit constructor takes two arguments:\n- name (string)\n- json object\n\nGot instead " + (typeof aLocationId) + " and " + (typeof aObj2Edit) + ".");
		return;
	}
	if (aObj2Edit === undefined || aObj2Edit === null) {
		alert("The AreaEdit constructor takes two arguments:\n- name (string)\n- json object\n\nGot instead " + (typeof aLocationId) + " and " + (typeof aObj2Edit) + ".");
		return;
	}
	if (aObj2Edit.dataset === undefined || aObj2Edit.dataset === null) {
		alert("The AreaEdit constructor takes a JSON object that must contain dataset field");
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

	var strCss = "input {max-width:" + screen.width * 0.9 + "px}";
	this.addStyle(strCss);

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

	var setSeqNum = {value: '', prefix: '', startNum: 0, cls: 'fs01'}; // for numbering fieldset, uses object to for pass by ref
	var childSet = this.createChildSet(masterDiv, datasetName, false, AreaEdit.plusOne(setSeqNum));
	var avoidRecursive = [];
	avoidRecursive.push({clasz: this.obj2Edit.clasz, Oid: this.obj2Edit.objectId});
	this.editAreaRecursion(this.obj2Edit, masterDiv, childSet, "", "", true, avoidRecursive, setSeqNum, false);

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

	var masterDivPage = ScreenBuilder.GetActiveSlideElement(this.locationId);
	$(masterDivPage).empty();
	masterDivPage.appendChild(masterDiv);

	this.setOk(masterDivPage);
	var thisAreaEdit = this;
	var funcSlow = function() {
		for(var eachSlider in thisAreaEdit.allSlider) { 
			var slideNxt = '';
			if (thisAreaEdit.allSlider[eachSlider].getSlideCount() > 1) slideNxt = 'Next>>';
			var nextId = thisAreaEdit.allSlider[eachSlider].nextBtnId;
			thisAreaEdit.allSlider[eachSlider].reloadSlider({mode:bxSliderMode, pager: false, nextSelector:"#" + nextId, controls: true, prevText:'', nextText: slideNxt}); 
		}
		thisAreaEdit.objBeforeEdit = jQuery.extend(true, {}, thisAreaEdit.obj2Edit);
		window.onbeforeunload = ScreenBuilder.BeforeUnloadCheck(thisAreaEdit.obj2Edit);
		/*
		window.onbeforeunload = function() {
			$('input').each(function(){
				$(this).trigger('blur'); //each input event one by one... will be blured
			});
			return(thisAreaEdit.backNavi(thisAreaEdit.objBeforeEdit, thisAreaEdit.obj2Edit));
		};
		*/
	};
	setTimeout(funcSlow, 100);
	return(masterDivPage);
};
AreaEdit.prototype.editAreaRecursion = function(aObj2Display, aMasterSet, aChildSet, aParentFqnName, aObjName, aUnestedFeel, aAvoidRecursive, aSetNum, aNoChildSet) {
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
				var labelName = fieldName;
				//if (aRecursiveDepth >= 1 && aObjName !== "") { //labelName = aObjName + " " + fieldName; }
				var inputField = this.createWidget(labelName, fieldValue, aParentFqnName);
				if (inputField !== null) {
					if (aChildSet === null && rootSet === null && aNoChildSet === false) { // create new rootSet when order sequence grouping changes i.e. displayPosition 
						if (aUnestedFeel === true)	
							rootSet = this.createChildSet(aMasterSet, fieldName, true, AreaEdit.plusOne(aSetNum));
						else
							rootSet = this.createChildSet(aChildSet, fieldName, true, AreaEdit.plusOne(aSetNum));
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
								nextNum = AreaEdit.plusOne(aSetNum);
							} else {
								nextNum = AreaEdit.nextLevelNumbering(aSetNum);
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
								this.editAreaRecursion(fieldValue.dataset[cntrObj], aMasterSet, newSet, aParentFqnName, fieldName + aryIdx, nextUnestedFeel, aAvoidRecursive, nextNum, false);
								aAvoidRecursive.pop();
							} else if (this.useCustomWidget(fieldName, fieldValue.dataset[cntrObj], divForSlideMaster, aParentFqnName)) {
								// do nothing
							} else {
								var divForSlideChild = document.createElement('div');
								divForSlideMaster.appendChild(divForSlideChild);
								aAvoidRecursive.push({clasz: fieldValue.dataset[cntrObj].clasz, Oid: fieldValue.dataset[cntrObj].objectId});
								fieldValue.dataset[cntrObj].slideNo = cntrSlide++;
								this.editAreaRecursion(fieldValue.dataset[cntrObj], aMasterSet, divForSlideChild, aParentFqnName, fieldName + aryIdx, nextUnestedFeel, aAvoidRecursive, nextNum, false);
								aAvoidRecursive.pop();
							}
						}

						this.setupAryCtrl(cntrObj, newbtn, deletebtn, nxtbtn, strClsz, titleStr, slideId, slideNxt, newSet, aParentFqnName, fieldName); // can refactor this at ediatAreaRecursion later
					} else { // its fieldobject
						var nextNum = jQuery.extend({}, aSetNum);
						if (this.isUiMaster(fieldValue) && aNoChildSet === false) {
							if (aUnestedFeel === true) {
								nextNum = AreaEdit.plusOne(aSetNum);
							} else {
								nextNum = AreaEdit.nextLevelNumbering(aSetNum);
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
							this.editAreaRecursion(fieldValue, aChildSet, newSet, aParentFqnName, fieldName, nextUnestedFeel, aAvoidRecursive, nextNum, false);
							aAvoidRecursive.pop();
						}

						if (this.isUiMaster(fieldValue)) {
							if ($(newSet).find('.eachfield').size() !== 0) {
								var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
								//newbtn.innerHTML = this.doHref('', fieldValue.clasz, titleStr, aParentFqnName, fieldName);
								var elem = $(this.doHref('', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								newbtn[0].appendChild(elem);

								var delbtn = $(newSet).find("[id^=deletebtn]")[0]; // .find('#deletebtn')[0];
								//delbtn.innerHTML = this.doHref('[Delete]', fieldValue.clasz, titleStr, aParentFqnName, fieldName);
								elem = $(this.doHref('[Delete]', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								delbtn.appendChild(elem);
							} else {
								var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
								//newbtn.innerHTML = this.doHref('[New]', fieldValue.clasz, titleStr, aParentFqnName, fieldName);
								var elem = $(this.doHref('[New]', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								newbtn[0].appendChild(elem);

								var delbtn = $(newSet).find("[id^=deletebtn]")[0]; //.find('#deletebtn')[0];
								//delbtn.innerHTML = this.doHref('', fieldValue.clasz, titleStr, aParentFqnName, fieldName);
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
AreaEdit.prototype.useCustomWidget = function(aName, aValue, aSet, aBasePath) {
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
			var mny = this.createMoney(aName, aValue, targetedFqn);
			if (mny !== undefined) {
				aSet.appendChild(mny);
			}
		} else if (aValue.type === 'boolean' ) {
			var chkbxArea = this.createCheckbox(aName, aValue);
			var chkbx = chkbxArea.getElementsByTagName("input")[0];
			chkbx.setAttribute("onchange", this.myName + ".setValueBoolean('" + targetedFqn + "', this)");
			aSet.appendChild(chkbxArea);
		} else if (aValue.type === 'salary' ) {
		} else if (aValue.type === 'country' ) {
			var inputArea = this.createCombobox(aName);
			var cmb = inputArea.getElementsByTagName("select")[0];
			cmb.toBeEmpty = [];
			var childFqn = targetedFqn.replace('Country', 'State'); // change targetedFqn last field to state
			AreaEdit.populateComboboxWithName(cmb, aValue.option, aValue.data);
			cmb.setAttribute("onchange", this.myName + ".setValue('" + targetedFqn + "', this);" + " " + this.myName +  ".filterChildCombobox(this, '" + childFqn + "');" + " "+ this.myName + " .emptyChildCombox(this)");
			cmb.setAttribute("onblur", this.myName + ".setValue('" + targetedFqn + "', this)");
			aSet.appendChild(inputArea);
		} else if (aValue.type === 'state' ) {
			var inputArea = this.createCombobox(aName);
			var cmb = inputArea.getElementsByTagName("select")[0];
			cmb.toBeEmpty = [];
			var childFqn = targetedFqn.replace('State', 'City');
			cmb.setAttribute("onchange", this.myName + ".setValue('" + targetedFqn + "', this);" + " " + this.myName + " .filterChildCombobox(this, '" + childFqn + "');" + " "  + this.myName + "  .emptyChildCombobox(this)");
			cmb.setAttribute("onblur", this.myName + ".setValue('" + targetedFqn + "', this)");
			aSet.appendChild(inputArea);
			AreaEdit.populateMasterChildCmbx (cmb, targetedFqn, aValue);
		} else if (aValue.type === 'city' ) {
			var inputArea = this.createCombobox(aName);
			var cmb = inputArea.getElementsByTagName("select")[0];
			//var childFqn = targetedFqn.replace('City', 'State');
			cmb.setAttribute("onchange", this.myName + ".setValue('" + targetedFqn + "', this);");
			cmb.setAttribute("onblur", this.myName + ".setValue('" + targetedFqn + "', this)");
			aSet.appendChild(inputArea);
			AreaEdit.populateMasterChildCmbx (cmb, targetedFqn, aValue);

			var cmbState = $(cmb).parents('.eachfield').prev().find('select');
			if (cmbState.length !== 0) {
				var cmbCountry = cmbState.parents('.eachfield').prev().find('select');
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
			var printField = this.createInputField(aName, printTxt);
			aSet.appendChild(printField);
		}
	}
	return(result);
};
AreaEdit.emptyChildCmbx = function(aWidget) {
	if (aWidget.toBeEmpty !== undefined) {
		for (var cntr = 0; cntr < aWidget.toBeEmpty.length; cntr++) {
			$(aWidget.toBeEmpty[cntr]).empty();
		}
	}
};
AreaEdit.filterChildCmbx = function(parentCmbx, strChildFqn) {
	var childCmbx = $(parentCmbx).parents('.eachfield').next().find('select');
	if (childCmbx.length === 0) return;
	var targetObj = ScreenBuilder.GetVarByJsonPath(parentCmbx.areaEdit.obj2Edit, strChildFqn);
	childCmbx.empty();
	$.each(targetObj.option, function(master, child) {
		if (master === parentCmbx.value) {
			AreaEdit.populateComboboxWithValue(childCmbx[0], child, '');
			return(false);
		}
	});
};
AreaEdit.populateMasterChildCmbx = function(childCmb, childFqn, aValue) {
	var parentCmb = $(childCmb).parents('.eachfield').prev().find('select');
	if (parentCmb.length !== 0) {
		var targetObj = ScreenBuilder.GetVarByJsonPath(childCmb.areaEdit.obj2Edit, childFqn);
		$(childCmb).empty();
		var parentCurrentValue = $(parentCmb).find('option:selected').text();
		$.each(targetObj.option, function(master, child) {
			if (master === parentCurrentValue) {
				AreaEdit.populateComboboxWithValue(childCmb, child, aValue.data);
				return(false);
			}
		});
	}
};
AreaEdit.prototype.createWidget = function(fieldName, fieldValue, aBasePath) {
	var result = null;
	if (this.forPrint === false) {
		var fieldFqnName = getJsonPath(aBasePath, fieldName);
		if (fieldValue.lookup === true) {
			result = this.createCombobox(fieldName);
			var cmb = result.getElementsByTagName("select")[0];
			AreaEdit.populateComboboxWithName(cmb, fieldValue.option, fieldValue.data);
			cmb.areaEdit = this;
			cmb.setAttribute("onchange", this.myName + ".setValue('" + fieldFqnName + "', this)");
			cmb.setAttribute("onblur", this.myName + ".setValue('" + fieldFqnName + "', this)");
		} else if (fieldValue.type === "datetime" ||fieldValue.type === "date" ) {
			result = this.createDatepicker(fieldName, fieldValue, fieldFqnName);
		} else if (fieldValue.type === "html" ) {
			result = this.createHtmlField(fieldName, fieldValue, fieldFqnName);
		} else {
			result = this.createTextField(fieldName, fieldValue.data, fieldValue.size);
			var txtField = result.getElementsByTagName("input")[0];
			txtField.areaEdit = this;
			txtField.setAttribute("onblur", this.myName + ".setValue('" + fieldFqnName + "', this)");
		}
		if (this.obj2Edit.objectId !== -1) {
			this.setUpdateableOnWidget(fieldValue, result);
		}
		this.setChangeableOnWidget(fieldValue, result);
	} else {
		var printTxt = document.createElement("span");
		printTxt.setAttribute("class", "print-field");
		printTxt.innerHTML = fieldValue.data;
		result = this.createInputField(fieldName, printTxt);
	}

	return(result);
};
AreaEdit.prototype.createChildSet = function(masterSet, setName, isArray, seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) setName = seqNum.value + '. ' + setName; 
	var childSet = this.createFieldset(setName);
	if (typeof seqNum !== 'undefined' && seqNum !== null) $(childSet).addClass(seqNum.cls);
	if (isArray) {
		var aryCtrl = document.createElement('div');
		aryCtrl.setAttribute('id', 'aryctrl');
		//var strCss = '.array_widget {text-align:right;font-size:x-small;cursor:pointer;border-style:none;background:none}';
		var strCss = '.array_widget {text-align:right;cursor:pointer;border-style:none;background:none}';
		this.addStyle(strCss);
		aryCtrl.setAttribute('class', 'array_widget');

		var spCss = '.array_btn {margin-left:4px;}';
		this.addStyle(spCss);

		var spNext= document.createElement('span');
		spNext.setAttribute('class', 'array_btn');
		//spNext.setAttribute('id', 'nextbtn');
		spNext.setAttribute('id', 'nextbtn_' + ScreenBuilder.GetRandom5());
		spNext.innerHTML = '';

		var spDelete = document.createElement('span');
		spDelete.setAttribute('class', 'array_btn');
		//spDelete.setAttribute('id', 'deletebtn');
		spDelete.setAttribute('id', 'deletebtn_' + ScreenBuilder.GetRandom5());
		spDelete.innerHTML = '';

		var spNew = document.createElement('span');
		spNew.setAttribute('class', 'array_btn');
		//spNew.setAttribute('id', 'newbtn');
		spNew.setAttribute('id', 'newbtn_' + ScreenBuilder.GetRandom5());
		spNew.innerHTML = '';

		aryCtrl.appendChild(spNext);
		aryCtrl.appendChild(spDelete);
		aryCtrl.appendChild(spNew);

		childSet.appendChild(aryCtrl);
	}
	var appdObj = masterSet.appendChild(childSet);
	/*
	*/
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
AreaEdit.prototype.setupAryCtrlButton = function(aTargetField, aFieldsetTitle, aSlideId, aSlideNxt, aBasePath, aTargetName) {
	var setMaster = ScreenBuilder.GetActiveSlideElement(this.locationId);
	var setChild = $(setMaster).find('legend').filter(':contains("' + aFieldsetTitle + '")');
	setChild = $(setChild).parent()[0];
	//var btn1 = $(setChild).find("[id^=newbtn]");
	//var btn2 = $(setChild).find("[id^=deletebtn]");
	//var btn3 = $(setChild).find("[id^=nextbtn]");
	var btn1 = $(setChild).children('#aryctrl').children('[id^=newbtn]');
	var btn2 = $(setChild).children('#aryctrl').children('[id^=deletebtn]');
	var btn3 = $(setChild).children('#aryctrl').children('[id^=nextbtn]');
	var totalMember = 0;
	for (var cntr = 0; cntr < aTargetField.dataset.length; cntr++) {
		if (aTargetField.dataset[cntr].delete === undefined) {
			totalMember++;
		}
	}
	this.setupAryCtrl(totalMember, btn1, btn2, btn3, aTargetField.clasz, aFieldsetTitle, aSlideId, aSlideNxt, setChild, aBasePath, aTargetName); // can refactor this at ediatAreaRecursion later
};
AreaEdit.prototype.setupAryCtrl = function(cntrObj, newbtn, deletebtn, nxtbtn, strClsz, fieldsetName, slideId, slideNxt, slideSet, basePath, targetName) {
	var strNext = 'Next>>';
	if (cntrObj === 0) {
		strNext = '';
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		//var elem = $(this.doHref('[New]', strClsz, fieldsetName, basePath, targetName))[0];
		//newbtn[0].appendChild(elem);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('', strClsz, fieldsetName, basePath, targetName);
			//var elem = $(this.doHref('', strClsz, fieldsetName, basePath, targetName))[0];
			//deletebtn[0].appendChild(elem);
		}
	} else if (cntrObj === 1) {
		strNext = '';
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		//var elem = $(this.doHref('[New]', strClsz, fieldsetName, basePath, targetName))[0];
		//newbtn[0].appendChild(elem);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName);
			//var elem = $(this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName))[0];
			//deletebtn[0].appendChild(elem);
		}
	} else if (cntrObj > 1) {
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		//var elem = $(this.doHref('[New]', strClsz, fieldsetName, basePath, targetName))[0];
		//newbtn[0].appendChild(elem);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName);
			//var elem = $(this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName))[0];
			//deletebtn[0].appendChild(elem);
		}
		if (typeof nxtbtn[0] !== 'undefined') {
			nxtbtn[0].setAttribute('id', slideNxt);
		}
	} else {
	}

	var idxSlider = -1;
	for (var cntr = 0; cntr < this.allSlider.length; cntr++) {
		if (this.allSlider[cntr][0].id === slideId) {
			idxSlider = cntr;
			break;
		}
	}

	if (idxSlider === -1) {
		var btn = newbtn[0];
		btn.allSlider = this.allSlider; // create allSlider variable in the button

		var slideScript = document.createElement('script');
		slideScript.setAttribute('type', 'text/javascript');
		slideScript.innerHTML = "\n" + "//<![CDATA[ " + "\n"
		+ "	$(document).ready(function(){ sliderVar = $('#" + slideId + "').bxSlider({ticker:false, mode:'" + bxSliderMode + "', controls:true, pager:false, nextSelector:'#" + slideNxt + "', nextText:'" + strNext + "'});" 
		+ "sliderVar.nextBtnId = '" + slideNxt + "';"
		+ "var ary = ScreenBuilder.GetActiveSlideElement('" + btn.id + "');"
		+ "ary.allSlider.push(sliderVar); " 
		+ "});"
		+ "\n" + "//]]>" + "\n";
		slideSet.appendChild(slideScript);
	} else {
		this.allSlider[idxSlider].reloadSlider({mode:bxSliderMode, controls:true, pager:false, nextSelector:'#' + slideNxt, nextText:strNext});
	} 
};
AreaEdit.prototype.doHref = function(innerLabel, strClsz, titleStr, basePath, fieldName) {
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
AreaEdit.prototype.isSystemField = function(aName) {	
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
AreaEdit.prototype.createIdStr = function(fieldName, postfix) {
	var strId = fieldName.replace(/\s+/g, '_') + postfix;
	strId = strId.split('.').join('');
	return(strId);
};
AreaEdit.prototype.isUiMaster = function(each) {	
	var result = false;
	if (each.uimaster === true) {
		result = true;
	}
	return(result);
};
AreaEdit.prototype.createFieldset = function(displayLabel) {
	var fset = document.createElement("fieldset");
	var lgnd = document.createElement("legend");
	lgnd.setAttribute("style", "font-weight:bold;font-size:larger");
	lgnd.innerHTML = displayLabel;
	fset.appendChild(lgnd);
	var strCss = "fieldset {padding-bottom:2em;padding-left:1em;}";
	this.addStyle(strCss);
	strCss = "fieldset div.eachfield.row {display:inline-block; margin:1em 2em 3px 0px;}";
	this.addStyle(strCss);
	//strCss = ".eachfield.row {height:100%}";
	this.addStyle(strCss);
	return(fset);
};
AreaEdit.prototype.createButton = function(btnLabel, btnId) {
	var newBtn = document.createElement('button');
	newBtn.innerHTML = btnLabel;
	newBtn.style.cursor = 'pointer';
	newBtn.style.width = '80px';
	newBtn.setAttribute('id', btnId);
	return(newBtn);
};
AreaEdit.prototype.createCheckbox = function(displayLabel, aValue) {
	var inputTxt = document.createElement("input");
	inputTxt.setAttribute("class", "textfield");
	inputTxt.setAttribute("type", "checkbox");
	inputTxt.style.marginLeft = "0px";
	inputTxt.style.minHeight = "15px";
	inputTxt.areaEdit = this;
	if (aValue.data !== undefined) {
		if (aValue.data === 'true') {
			$(inputTxt).prop("checked", true);
		} else {
			$(inputTxt).prop("checked", false);
		}
	} else {
		$(inputTxt).prop("checked", false);
	}

	var result = this.createInputField(displayLabel, inputTxt);
	return(result);
};
AreaEdit.prototype.createTelephone = function(displayLabel, jsonTelephone, jsonPath) {
	var listAreaCode = this.createCombobox(undefined);
	var tpBase = ScreenBuilder.GetRandom5();
	listAreaCode.setAttribute("id", tpBase + "_mid");
	var result = this.createPhone(displayLabel, jsonTelephone, listAreaCode, tpBase, jsonPath);
	return(result);
};
AreaEdit.prototype.createMobilephone = function(displayLabel, jsonMobile, jsonPath) {
	var listNdc = this.createCombobox(undefined);
	var mpBase = ScreenBuilder.GetRandom5();
	listNdc.setAttribute("id", mpBase + "_mid");
	var result = this.createPhone(displayLabel, jsonMobile, listNdc, mpBase, jsonPath);
	return(result);
};
AreaEdit.prototype.createPhone = function(displayLabel, jsonMobile, listNdc, mpBase, jsonPath) {
	var strArray = jsonMobile.data.split("-");
	var codeCtry = strArray[0];
	var codeNdc = strArray[1];
	var codeSubNo = strArray[2];

	var listCountry = this.createCombobox(undefined);
	var ctryId = mpBase + "_ctry";
	listCountry.setAttribute("id", ctryId);
	AreaEdit.populateComboboxWithName(listCountry, jsonMobile.countrycode, codeCtry);
	listCountry.setAttribute("onchange", "AreaEdit.changePhone('" + jsonPath + "' , this)");
	listCountry.setAttribute("onblur", "AreaEdit.changePhone('" + jsonPath + "' , this)");

	var spCountry = document.createElement("span");
	spCountry.setAttribute("class", "symbol");
	spCountry.appendChild(listCountry);

	var spNdc = document.createElement("span");
	spNdc.setAttribute("class", "symbol");
	spNdc.appendChild(listNdc);
	listNdc.setAttribute("onchange", "AreaEdit.changePhone('" + jsonPath + "' , this)");
	listNdc.setAttribute("onblur", "AreaEdit.changePhone('" + jsonPath + "' , this)");

	var spNo = document.createElement("span");
	var tfNo = this.createTextFieldNoLabel(mpBase + "_mn");
	if (codeSubNo !== undefined) {
		tfNo.setAttribute("value", codeSubNo);
	}
	tfNo.setAttribute("onchange", "AreaEdit.changePhone('" + jsonPath + "' , this)");
	tfNo.setAttribute("onblur", "AreaEdit.changePhone('" + jsonPath + "' , this)");
	spNo.appendChild(tfNo);

	var funcName = "mphn_" + mpBase;
	var scrptDyn = this.createDynamicList(funcName, listNdc.id, jsonMobile.countrycode);
	this.scriptAddWithRemove(scrptDyn, funcName);
	var chgFunc = funcName + "(this.value)";
	listCountry.setAttribute("onchange", chgFunc);

	AreaEdit.populateComboboxWithValue(listNdc, jsonMobile.countrycode[codeCtry], codeNdc); // to populate the selected NDC

	var parent = document.createElement("parentwrapper");
	parent.appendChild(spCountry);
	parent.appendChild(spNdc);
	parent.appendChild(spNo);
	var result = this.createInputField(displayLabel, parent);

	return(result);
};
AreaEdit.prototype.createHtmlField = function(displayLabel, aValue, aFqnName) {
	var inputTxt = document.createElement("textarea");
	inputTxt.areaEdit = this;
	if (aFqnName !== undefined && aFqnName !== "") {
		aFqnName = aFqnName.replace(/ /g,"_");
		inputTxt.setAttribute("id", aFqnName);
	}
	inputTxt.innerHTML = aValue.data;
	inputTxt.style.width = "720px";
	inputTxt.style.height = "100px";

	var divArea = this.createInputField(displayLabel, inputTxt);

	var result = document.createElement("div");
	result.appendChild(divArea);

	var jsNicE = document.createElement("script");
	jsNicE.setAttribute("type", "text/javascript");
	jsNicE.innerHTML = "\n" + "//<![CDATA[  "
	+ "\n" + "var htmlEditor = new nicEditor({fullPanel : true}).panelInstance('" + inputTxt.id + "');"
	+ "\n" + "htmlEditor.addEvent('blur', function() {"
	+ "\n" + "var jsVar = {};"
	+ "\n" + "jsVar.value = this.nicInstances[0].getContent();"
	+ "\n" + "if (jsVar !== undefined) {"
	+ "\n" + "\t" + this.myName + ".setValueNoBr('" + aFqnName + "', jsVar);"
	+ "\n" + "}"
  + "\n" + "});"
	+ "\n" + "//]]>" + "\n";
	var jsexe = document.createElement("jsnice"); // cannot append directly on the body, the script will not execute, why?
	jsexe.appendChild(jsNicE);
	divArea.appendChild(jsexe);

	return(result);
};

AreaEdit.prototype.createTextField = function(displayLabel, aValue, aSize, id) {
	var inputTxt = this.createTextFieldNoLabel(id, aValue);
	if (aSize !== undefined) {
		inputTxt.setAttribute("size", aSize);
	}
	var result = this.createInputField(displayLabel, inputTxt);
	return(result);
};
AreaEdit.prototype.createTextFieldNoLabel = function(id, aValue) {
	var inputTxt = document.createElement("input");
	inputTxt.areaEdit = this;
	inputTxt.setAttribute("class", "textfield");
	inputTxt.setAttribute("type", "text");
	if (aValue !== undefined) {
		inputTxt.setAttribute("value", aValue);
	}
	if (id !== undefined && id !== "") {
		inputTxt.setAttribute("id", id);
	}
	return(inputTxt);
};
AreaEdit.handleDollar = function(el, ev, centid) {
	el.value = el.value.replace(/\D/g, '');
	el.value = AreaEdit.numberWithComma(el.value);
	var code = ev.keyCode;
	if (code === 190) {
		ScreenBuilder.GetActiveSlideElement(centid).focus();
	}
};
AreaEdit.handleCent = function(el, ev, centid) {
	el.value = el.value.replace(/\D/g, '');
};
AreaEdit.HandleMoney = function(aStrToHandle) {
	var result = "";
	if (ScreenBuilder.NotUndefineNotNullNotBlank(aStrToHandle)) {
		var strToHandle = ('' + aStrToHandle).replace(/[^0-9.]/g, "");
		if (ScreenBuilder.NotUndefineNotNullNotBlank(strToHandle)) {
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
				partDollar = AreaEdit.numberWithComma(partDollar);
				result = partDollar + "." + partCent;
			} else {
				result = AreaEdit.numberWithComma(strToHandle);
			}
		}
	}
	return(result);
};
AreaEdit.FormatMoney = function(aStrToHandle) {
	var result = AreaEdit.HandleMoney('' + aStrToHandle);
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
AreaEdit.numberWithComma = function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
AreaEdit.prototype.json2Money = function(result, strValue) {
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
AreaEdit.prototype.createMoney = function(displayLabel, jsonMoney, jsonPath) {
	var	mnyName = ScreenBuilder.GetRandom5();
	var mnyValue = {};
	mnyValue.currency = '';
	mnyValue.dollar = '';
	mnyValue.cent = '';

	this.json2Money(mnyValue, jsonMoney.data);

	var crcy = this.createCombobox(undefined);
	AreaEdit.populateComboboxWithValue(crcy, jsonMoney.currencies, mnyValue.currency);
	crcy.setAttribute("id", mnyName + "_cy");
	crcy.setAttribute("onchange", "AreaEdit.changeMoney('" + jsonPath + "' , this)");
	crcy.setAttribute("onblur", "AreaEdit.changeMoney('" + jsonPath + "' , this)");

	var spCrcy = document.createElement("span");
	spCrcy.setAttribute("class", "symbol");
	spCrcy.appendChild(crcy);

	var spDlr = document.createElement("span");
	var tfDlr = this.createTextFieldNoLabel(mnyName + "_dl", mnyValue.dollar);
	tfDlr.setAttribute("style", "text-align:right");
	tfDlr.setAttribute("onchange", "AreaEdit.changeMoney('" + jsonPath + "' , this)");
	tfDlr.setAttribute("onblur", "AreaEdit.changeMoney('" + jsonPath + "' , this)");
	spDlr.appendChild(tfDlr);

	var decPoint = document.createElement("span");
	decPoint.setAttribute("class", "symbol");
	decPoint.innerHTML = ".";

	var spCnt = document.createElement("span");
	var tfCnt = this.createTextFieldNoLabel(mnyName + "_ct", mnyValue.cent);
	tfCnt.setAttribute("style", "text-align:right");
	tfCnt.setAttribute("size", 2);
	tfCnt.setAttribute("onchange", "AreaEdit.changeMoney('" + jsonPath + "' , this)");
	tfCnt.setAttribute("onblur", "AreaEdit.changeMoney('" + jsonPath + "' , this)");
	spCnt.appendChild(tfCnt);

	tfDlr.setAttribute("onkeyup", "AreaEdit.handleDollar(this, event, \"" + tfCnt.id + "\")");
	tfCnt.setAttribute("onkeyup", "AreaEdit.handleCent(this, event)");

	var parent = document.createElement("parentwrapper");
	parent.appendChild(spCrcy);
	parent.appendChild(spDlr);
	parent.appendChild(decPoint);
	parent.appendChild(spCnt);
	var result = this.createInputField(displayLabel, parent);

	return(result);
};
AreaEdit.prototype.createInputField = function(displayLabel, inputField) {
	var parent = document.createElement("div");
	parent.setAttribute("class", "eachfield row");

	var labelArea = document.createElement("div");
	labelArea.setAttribute("class", "label-area");
	var label = document.createElement("label");
	label.innerHTML = displayLabel;
	label.setAttribute('style', 'margin-right:5px');
	var err = document.createElement("img");
	err.setAttribute("src", noImg);
	$(err).css("display", "none");
	var msg = document.createElement("span");
	msg.setAttribute("style", "font-weight:normal");
	labelArea.appendChild(label);
	labelArea.appendChild(err);
	labelArea.appendChild(msg);

	var inputArea = document.createElement("div");
	inputArea.setAttribute("class", "input-area");

	if (inputField.tagName === "parentwrapper") {
		for(var cntr = 0; cntr < inputField.childNodes.length; cntr++) { 
			inputArea.appendChild(inputField.childNodes[cntr]);
		}
	} else {
		inputArea.appendChild(inputField);
	}
	parent.appendChild(labelArea);
	parent.appendChild(inputArea);

	var htmlFloat = "";
	var strStyle = "div.label-area {margin-right:2px;margin-bottom:2px;" + htmlFloat + "}";
	this.addStyle(strStyle);
	strStyle = "div.input-area {display:inline-block}";
	this.addStyle(strStyle);

	return(parent);
};
AreaEdit.prototype.createCombobox = function(displayLabel) {
	var input = document.createElement("select");
	input.areaEdit = this;
	input.setAttribute("class", "combobox");
	input.setAttribute("style", "min-width:70px");
	input.displayLabel = displayLabel;
	var result = input;
	if (displayLabel !== undefined) {
		result = this.createInputField(displayLabel, input);
	}
	return(result);
};
AreaEdit.populateComboboxWithName = function(cmb, jsonObj, chosen) {
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
AreaEdit.changeValueBoolean = function(aFqn, aWidget) { 
	if (ScreenBuilder.NotUndefineNotNull(aWidget.areaEdit) === false) {
		return;
	}
	var value = "false";
	if ($(aWidget).prop("checked") === true) {
		value = "true";
	}
	ScreenBuilder.JsonAssignment(aWidget.areaEdit.obj2Edit, aFqn, value); 
};
AreaEdit.changeValue = function(aFqn, aWidget) { 
	if (ScreenBuilder.NotUndefineNotNull(aWidget.areaEdit) === false) {
		return;
	}
	ScreenBuilder.JsonAssignment(aWidget.areaEdit.obj2Edit, aFqn, aWidget.value); 
};
AreaEdit.changeHtmlField = function(aFqn, aWidget) { 
	if (ScreenBuilder.NotUndefineNotNull(aWidget.areaEdit) === false) {
		return;
	}
	// ignore this damn <br> html element place in by HtmlEditor widget
	if (aWidget.value !== "<br>") {
		AreaEdit.changeValue(aFqn, aWidget);
	}
};
AreaEdit.changePhone = function(jsonPath, aThis) {
	if (ScreenBuilder.NotUndefineNotNull(aThis.areaEdit) === false) {
		return;
	}
	var parentLgnd = $($(aThis).parents('fieldset')[0]).children('legend');
	var slideId = aThis.areaEdit.createIdStr(parentLgnd.text(), '_slide');
	var idxSlide;
	for (var cntr = 0; cntr < aThis.areaEdit.allSlider.length; cntr++) {
		if (aThis.areaEdit.allSlider[cntr][0].id === slideId) {
			idxSlide = cntr;
			break;
		}
	}

	var nmBase = aThis.id.substr(0, aThis.id.indexOf('_'));
	if (idxSlide !== undefined) {
		var kidi;
		var kids = aThis.areaEdit.allSlider[idxSlide].children();
		for (var cntr = 0; cntr < kids.length; cntr++) {
			if ($(kids[cntr]).find(aThis).length !== 0) {
				kidi = $(kids[cntr]);
				break;
			}
		}
		var ctryNm = kidi.find('#' + nmBase + '_ctry')[0];
		var NdcNm = kidi.find('#' + nmBase + '_mid')[0];
		var NoNm = kidi.find('#' + nmBase + '_mn')[0];
		aThis.areaEdit.changePhoneAsgn(jsonPath, ctryNm, NdcNm, NoNm);
	} else {
		var nmCtry = ScreenBuilder.GetActiveSlideElement(nmBase + "_ctry");
		var nmNdc = ScreenBuilder.GetActiveSlideElement(nmBase + "_mid");
		var nmNo = ScreenBuilder.GetActiveSlideElement(nmBase + "_mn");
		aThis.areaEdit.changePhoneAsgn(jsonPath, nmCtry, nmNdc, nmNo);
	}
};
AreaEdit.prototype.changePhoneAsgn = function(jsonPath, nmCtry, nmNdc, nmNo) { 
	var strMobileNo = nmCtry.value+ "-" + nmNdc.value + "-" + nmNo.value; 
	ScreenBuilder.JsonAssignment(this.obj2Edit, jsonPath, strMobileNo); 
};
AreaEdit.changeMoney = function(jsonPath, aThis) { 
	if (ScreenBuilder.NotUndefineNotNull(aThis.areaEdit) === false) {
		return;
	}
	var nmBase = aThis.id.substr(0, aThis.id.indexOf('_'));
	var nmCy = ScreenBuilder.GetActiveSlideElement(nmBase + "_cy");
	var nmDl = ScreenBuilder.GetActiveSlideElement(nmBase + "_dl");
	var nmCt = ScreenBuilder.GetActiveSlideElement(nmBase + "_ct");

	if (!nmDl.value.trim() && !nmCt.value.trim()) {
		var strAmt = ""; 
		ScreenBuilder.JsonAssignment(aThis.areaEdit.obj2Edit, jsonPath, strAmt); 
	} else {
		var strAmt = nmCy.value + " " + nmDl.value + "." + nmCt.value; 
		ScreenBuilder.JsonAssignment(aThis.areaEdit.obj2Edit, jsonPath, strAmt); 
	}
};
AreaEdit.prototype.createDatepicker = function(displayLabel, fieldVar, jsonPath) {
	return(ScreenBuilder.CreateDatepicker(displayLabel, fieldVar, jsonPath, this.myName, false, false));
};
AreaEdit.prototype.changeDatepicker = function(jsonName, aThis) { 
	if (ScreenBuilder.NotUndefineNotNull(this.obj2Edit) === false) {
		return;
	}

	var nmBase = aThis.id.substr(0, aThis.id.indexOf('_'));
	var nmDay = ScreenBuilder.GetActiveSlideElement(nmBase + "_d");
	var nmMth = ScreenBuilder.GetActiveSlideElement(nmBase + "_m");
	var nmYer = ScreenBuilder.GetActiveSlideElement(nmBase + "_y");
	var nmHour = ScreenBuilder.GetActiveSlideElement(nmBase + "_h");
	var nmMin = ScreenBuilder.GetActiveSlideElement(nmBase + "_mt");
	var nmSec = ScreenBuilder.GetActiveSlideElement(nmBase + "_s");

	var strDate = ScreenBuilder.AssignDatepicker(nmDay, nmMth, nmYer, nmHour, nmMin, nmSec);

	if (this.obj2Edit !== undefined) {
		ScreenBuilder.JsonAssignment(this.obj2Edit, jsonName, strDate); 
	}
};
AreaEdit.populateComboboxWithValue = function(cmb, choices, chosen) {
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
AreaEdit.prototype.addStyle = function(cssStr) {
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
AreaEdit.prototype.styleExist = function(strStyle) {
	var ssList = document.styleSheets; 
	if (!ssList) return false;
	for (var i = 0; i < ssList.length; i++) {
		var ss = ssList[i]; 
		if (!ss) continue;
		if (this.xTraverseStyleSheet(ss, strStyle)) return true;
	}
	return false;
};
AreaEdit.prototype.xTraverseStyleSheet = function(ss, strStyle) {
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
AreaEdit.prototype.stdCssStr = function(strCss) {
	var body = strCss.match(/[^{}]+(?=\})/g); // standardise body section string
	var tmp = document.createElement("div");
	tmp.style.cssText = body[0];

	var tgtCss = strCss.substr(0, strCss.indexOf(body) -1); // get the targeted css name
	var result = tgtCss + '{ ' + tmp.style.cssText + ' }';
	
	return(result);
};
AreaEdit.prototype.xGetCSSRules = function(ss) { 
	return ss.rules ? ss.rules : ss.cssRules; 
};
AreaEdit.prototype.hrefCssAdd = function(cssPath) {
	if (hrefCssExist(cssPath) === false) {
		var lnk = document.createElement("link");
		lnk.setAttribute("href", cssPath);
		lnk.setAttribute("rel", "stylesheet");
		lnk.setAttribute("type", "text/css");
		document.head.appendChild(lnk);
	}
};
AreaEdit.prototype.hrefCssExist = function(cssPath) {
	var ss = document.styleSheets;
	for (var cntr = 0, max = ss.length; cntr < max; cntr++) {
		var fullUrl = getFullUrl(cssPath);
		if (ss[cntr].href === fullUrl) return(true);
	}	
	return(false);
};
AreaEdit.prototype.setUpdateableOnWidget = function(fieldValue, widgetSet) {
	if (fieldValue.updateable !== undefined) {
		if (fieldValue.data !== undefined) {
			var nodesChild = widgetSet.getElementsByTagName('*');
			for(var cntr = 0; cntr < nodesChild.length; cntr++){
				nodesChild[cntr].setAttribute('updateable', '');
			}
		}
	}
};
AreaEdit.prototype.setChangeableOnWidget = function(fieldValue, widgetSet) {
	if (fieldValue.changeable !== undefined) {
		if (fieldValue.data !== undefined) {
			var nodesChild = widgetSet.getElementsByTagName('*');
			for(var cntr = 0; cntr < nodesChild.length; cntr++){
				nodesChild[cntr].setAttribute('changeable', '');
			}
		}
	}
};
AreaEdit.prototype.setOk = function(errormsg) {
	var ok = document.createComment("000");
	errormsg.appendChild(ok);
};
AreaEdit.prototype.createDynamicList = function(masterId, childId, jsonMaster) {
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
AreaEdit.prototype.removeNode = function(parentNode) {
	while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
	}
};
AreaEdit.prototype.setupCtrl = function(cntrObj, strClsz, titleStr, basePath, fieldName) {
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
AreaEdit.prototype.newFieldObject = function(fieldClasz, fieldsetTitle, basePath, targetName) {
	startDialogWait();
	var tempScrollTop = $(window).scrollTop();
	var inpClasz = fieldClasz;
	var fieldFqnName = getJsonPath(basePath, targetName);
	var thisAreaEdit = this; // once gointo ajax call, this is no this prototype anymore
	var requestParam = {targetClasz: JSON.stringify(inpClasz), fieldFqn: fieldFqnName};
	ScreenBuilder.BeAction(requestParam, 'newField', this.baseUrl, function(jsonObject) {
		if (jsonObject !== null) {
			var setMaster = document.getElementById(thisAreaEdit.locationId);
			var setChild = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle + '")');
			var titleStr = $(setChild).text();
			var afterNumIdx = titleStr.indexOf(' ');
			var prefixStr = titleStr.substr(0, afterNumIdx - 1); // don't want the dot

			setChild = $(setChild).parent()[0];
			var targetField = ScreenBuilder.GetVarByJsonPath(thisAreaEdit.obj2Edit, fieldFqnName);
			delete targetField.delete; // remove delete marker for new field
			var subSeqNum = {value: '', prefix: prefixStr, startNum: 0, cls: 'fs02'}; // for numbering fieldset, uses object to for pass by ref
			if (targetField.dataset !== undefined) {
				var slideId = thisAreaEdit.createIdStr(fieldsetTitle, '_slide');
				var slideNxt = thisAreaEdit.createIdStr(fieldsetTitle, '_nxt');
				targetField.dataset.push(jsonObject.dataset[0]);

				var idxSlide; // find the slide in allSlider, i.e. its index
				for (var cntr = 0; cntr < thisAreaEdit.allSlider.length; cntr++) {
					if (thisAreaEdit.allSlider[cntr][0].id === slideId) {
						idxSlide = cntr;
						break;
					}
				}

				// create the div for the new child field and append to allSlider
				var cntr = targetField.dataset.length - 1;
				var divForSlideChild = document.createElement('div');
				thisAreaEdit.allSlider[idxSlide][0].appendChild(divForSlideChild);
				var avoidRecursive = new Array();
				avoidRecursive.push({clasz: thisAreaEdit.rawObj.meta.ParentClass, Oid: thisAreaEdit.rawObj.meta.ParentOid});
				targetField.dataset[cntr].slideNo = thisAreaEdit.allSlider[idxSlide].getSlideCount();
				thisAreaEdit.editAreaRecursion(targetField.dataset[cntr], setChild, divForSlideChild, basePath, targetName + '[' + cntr + ']', true, avoidRecursive, subSeqNum, false);
				thisAreaEdit.setupAryCtrlButton(targetField, fieldsetTitle, slideId, slideNxt, basePath, targetName);
				var funcSlow = function() { thisAreaEdit.allSlider[idxSlide].goToSlide(thisAreaEdit.allSlider[idxSlide].getSlideCount() - 1); };
				setTimeout(funcSlow, 100);
				//$(divForSlideChild).find(':input:first').focus();
			} else {
				jQuery.extend(true, targetField, jsonObject.dataset[0]);
				var avoidRecursive = new Array();
				avoidRecursive.push({clasz: thisAreaEdit.rawObj.meta.ParentClass, Oid: thisAreaEdit.rawObj.meta.ParentOid});
				thisAreaEdit.editAreaRecursion(targetField, setChild, setChild, basePath, targetName, true, avoidRecursive, subSeqNum, false);
				thisAreaEdit.setupCtrl(1, targetField.clasz, fieldsetTitle, basePath, targetName);
			}
			$(window).scrollTop(tempScrollTop);
		} else {
			displayMsg('error', 'Fail to create field: ' + fieldsetTitle);
		}
	}
	, undefined
	);
};
AreaEdit.prototype.deleteFieldObject = function(fieldsetTitle, basePath, fieldName) {
	var fieldFqnName = getJsonPath(basePath, fieldName);
	var targetField = ScreenBuilder.GetVarByJsonPath(this.obj2Edit, fieldFqnName);
	var fieldBrief = '';
	if (targetField.dataset !== undefined) {
		var slideId = this.createIdStr(fieldsetTitle, '_slide');
		var idxSlide;
		var idxObject;
		for (var cntr = 0; cntr < this.allSlider.length; cntr++) {
			if (this.allSlider[cntr][0].id === slideId) {
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
	showDialogOkCancel('Confirm to Delete', 'Confirm to delete ' + fieldBrief + '?', sendDelRq);
};
AreaEdit.prototype.getFieldBrief = function(aDisplayField) {
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
AreaEdit.prototype.getObjStrPart = function(aObject) {
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
AreaEdit.prototype.getObjClasz = function(aObj) {
	if (aObj.dataset !== undefined) {

	} else {

	}

};
AreaEdit.prototype.sendDeleteFieldObject = function(aThis, fieldsetTitle, basePath, targetName) {
	return function() {
		var thisAreaEdit = aThis; // once gointo a call dialog box, this is window this, not areaEdit this
		var fieldFqnName = getJsonPath(basePath, targetName);
		var targetField = ScreenBuilder.GetVarByJsonPath(aThis.obj2Edit, fieldFqnName);
		var setMaster = document.getElementById(thisAreaEdit.locationId);

		if (targetField.dataset !== undefined) {
			var slideNxt = thisAreaEdit.createIdStr(fieldsetTitle, '_nxt');
			var slideId = thisAreaEdit.createIdStr(fieldsetTitle, '_slide');
			var idxSlide;
			var currSlide;
			for (var cntr = 0; cntr < thisAreaEdit.allSlider.length; cntr++) {
				if (thisAreaEdit.allSlider[cntr][0].id === slideId) {
					idxSlide = cntr;
					currSlide = thisAreaEdit.allSlider[cntr].getCurrentSlide();
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

			thisAreaEdit.removeNode(thisAreaEdit.allSlider[idxSlide][0]); // remove all existing member of the dataset from the slider, below will redraw the slider again
			if (targetField.dataset[idxObject].objectId === -1) {
				targetField.dataset.splice(idxObject, 1);
			} else {
				targetField.dataset[idxObject].delete = true;
			}

			var cntrSlide = 0;
			for (var cntr = 0; cntr < targetField.dataset.length; cntr++) {
				if (targetField.dataset[cntr].delete !== undefined) continue;
				var divForSlideChild = document.createElement('div');
				thisAreaEdit.allSlider[idxSlide][0].appendChild(divForSlideChild);
				var avoidRecursive = new Array();
				//avoidRecursive.push({clasz: thisAreaEdit.rawObj.meta.ParentClass, Oid: thisAreaEdit.rawObj.meta.ParentOid});
				avoidRecursive.push({clasz: thisAreaEdit.obj2Edit.clasz, Oid: thisAreaEdit.obj2Edit.cbjectId});
				targetField.dataset[cntr].slideNo = cntrSlide++;
				thisAreaEdit.editAreaRecursion(targetField.dataset[cntr], setMaster, divForSlideChild, basePath, targetName + '[' + cntr + ']', true, avoidRecursive, 0, false);
			}
			var funcSlow = function() { 
				thisAreaEdit.setupAryCtrlButton(targetField, fieldsetTitle, slideId, slideNxt, basePath, targetName);
			};
			setTimeout(funcSlow, 100);
		} else {
			var divParent = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle +'")').parent()[0];
			var divChild = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle +'")').parent().children();
			for(var cntr = 0; cntr < divChild.length; cntr++) { 
				if (divChild[cntr].tagName !== 'LEGEND' && divChild[cntr].id !== 'aryctrl') { 
					divParent.removeChild(divChild[cntr]);
				}
			}
			thisAreaEdit.setupCtrl(0, targetField.clasz, fieldsetTitle, basePath, targetName);
			targetField.delete = true;
			//delete targetField;
		}
	};
};
AreaEdit.prototype.disableArea = function() {
	document.getElementById(this.locationId).disabled = true;
	var nodesDisable = document.getElementById(this.locationId).getElementsByTagName('*');
	this.changeEditableArea(true, nodesDisable, false);
	this.preventOnclickA(this.locationId); // disable the New, Delete, Next link in object fields
};
AreaEdit.prototype.enableArea = function(ignoreUpdateable) {
	document.getElementById(this.locationId).disabled = false;
	var nodesDisable = document.getElementById(this.locationId).getElementsByTagName('*');
	if (ignoreUpdateable === undefined) ignoreUpdateable = false;
	this.changeEditableArea(false, nodesDisable, ignoreUpdateable);
	this.focusFirstWidget();
};
AreaEdit.prototype.boldFsBtn = function(btn, fw) {
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
AreaEdit.prototype.getLgndStr = function(fs) {
	var result = $(fs).children('legend').text();
	if (result === undefined || result === null) {
		result = '';
	}
	return(result);
};
AreaEdit.prototype.mouseAtFs = function(fs) {
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
AreaEdit.prototype.boldFsHover = function() {
	var thisAreaEdit = this;
	$('fieldset .fs01').bind('mousemove', function(evt) {
		var newMouseAt = thisAreaEdit.mouseAtFs(evt.target);
		if (thisAreaEdit.getLgndStr(newMouseAt) !== thisAreaEdit.getLgndStr(fsHover)) {
			if (fsHover !== undefined && fsHover !== null) {
				var btn = $(fsHover).find('.array_btn');
				if (btn !== undefined && btn !== null) {
					thisAreaEdit.boldFsBtn(btn, 'normal');
				}
			}
	
			fsHover = thisAreaEdit.mouseAtFs(evt.target);
			if (fsHover !== undefined && fsHover !== null) {
				var btn = $(fsHover).find('.array_btn');
				if (btn !== undefined && btn !== null) {
					thisAreaEdit.boldFsBtn(btn, 'bold');
				}
			}
		}
	});
};
var fsHover;
AreaEdit.prototype.boldFsOut = function() {
	if (fsHover !== undefined && fsHover !== null) {
		var btn = $(fsHover).find('.array_btn');
		if (btn !== undefined && btn !== null) {
			this.boldFsBtn(btn, 'normal');
		}
	}
};
AreaEdit.prototype.preventOnclickA = function(aArea) {
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
AreaEdit.prototype.changeColor = function(nodes, disable) {
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
AreaEdit.prototype.changeEditableArea = function(disable, nodes, ignoreUpdateable) {
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
AreaEdit.prototype.storeSaveObject = function() {
	//ScreenBuilder.StoreObj("employeeFormSaved", editArea.obj2Edit);
};
AreaEdit.prototype.validatedBeforeSave = function() {
	return(true);
};
AreaEdit.prototype.saveObjectSuccess = function() {
};
AreaEdit.prototype.saveObjectFail = function() {
};
AreaEdit.prototype.warnBeforeSave = function() {
	return(false);
};
AreaEdit.prototype.callSave2Backend = function() {
	var editArea = this;
	return(function() {
		editArea.saveObject2Backend(editArea);
	});
};
AreaEdit.prototype.warnOnSave = function(aWarnMsg, aWarnIgnore) {
	ScreenBuilder.ShowDialogYesNo('Confirm to Save', aWarnMsg, this.callSave2Backend(), aWarnIgnore);
};
AreaEdit.prototype.saveObject2Backend = function(aThis) {
	startDialogWait();
	var editArea = aThis;
	var requestParam = {parentOid: this.parentOid, object2Save: JSON.stringify(this.obj2Edit)};
	ScreenBuilder.BeAction(requestParam, 'save', this.baseUrl
		, function(jsonObject) {
			window.onbeforeunload = null;
			editArea.obj2Edit = ScreenBuilder.GetAryByJsonPath(jsonObject, "")[0];
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
AreaEdit.prototype.saveObject = function() {
	if (this.validatedBeforeSave() === true) { 
		if (this.warnBeforeSave()) {
			// do nothing
		} else {
			this.saveObject2Backend(this);
		}
	}
};
AreaEdit.prototype.cancelEdit = function() {
	ScreenBuilder.CancelEdit();
};
AreaEdit.prototype.focusFirstWidget = function() {
	var editDiv = this.locationId;
	var allInput = $('#' + editDiv).find('input, select');
	for (var cntr = 0; cntr < allInput.length; cntr++) {
		if (allInput[cntr].disabled === false) {
			allInput[cntr].focus();
			break;
		}
	}
};
AreaEdit.prototype.scriptAddWithRemove = function(strScript, idName) {
	var tmp = this.scriptAdd(strScript);
	tmp.setAttribute("id", idName);
	this.sourceToBeRemove.push(idName);
};
AreaEdit.prototype.scriptAdd = function(strScript) {
	var head = document.getElementsByTagName('head')[0];
	var scpt = document.createElement('script');
	scpt.type = 'text/javascript';
	scpt.appendChild(document.createTextNode(strScript));
	head.appendChild(scpt);
	return(scpt);
};
AreaEdit.CreateComboboxCountry = function(aName, aValue, aSet) {
	var inputArea = AreaEdit.CreateCombobox(aName, undefined);
	var cmb = inputArea.getElementsByTagName("select")[0];
	cmb.setAttribute('style', 'margin-top: 10px');
	AreaEdit.PopulateComboboxWithName(cmb, aValue.option, aValue.data);
	aSet.appendChild(inputArea);
};
AreaEdit.CreateCombobox = function(displayLabel, aObj2Edit) {
	var input = document.createElement("select");
	input.areaEdit = this;
	input.setAttribute("class", "combobox");
	if (typeof aObj2Edit !== 'undefined') input.obj2Edit = aObj2Edit;
	input.displayLabel = displayLabel;
	var result = input;
	if (displayLabel !== undefined) {
		result = AreaEdit.CreateInputField(displayLabel, input);
	}
	return(result);
};
AreaEdit.CreateInputField = function(displayLabel, inputField) {
	var parent = document.createElement("div");
	parent.setAttribute("class", "eachfield row");

	var labelArea = document.createElement("div");
	labelArea.setAttribute("class", "label-area");
	var label = document.createElement("label");
	label.innerHTML = displayLabel;
	label.setAttribute('style', 'margin-right: 5px');
	var err = document.createElement("img");
	err.setAttribute("src", noImg);
	$(err).css("display", "none");
	var msg = document.createElement("span");
	msg.setAttribute("style", "font-weight:normal");
	labelArea.appendChild(label);
	labelArea.appendChild(err);
	labelArea.appendChild(msg);

	var inputArea = document.createElement("div");
	inputArea.setAttribute("class", "input-area");

	if (inputField.tagName === "parentwrapper") {
		for(var cntr = 0; cntr < inputField.childNodes.length; cntr++) { 
			inputArea.appendChild(inputField.childNodes[cntr]);
		}
	} else {
		inputArea.appendChild(inputField);
	}
	parent.appendChild(labelArea);
	parent.appendChild(inputArea);

	var htmlFloat = "";
	var strStyle = "div.label-area {margin-right:2px;" + htmlFloat + "}";
	AreaEdit.AddStyle(strStyle);
	strStyle = "div.input-area {display:inline-block}";
	AreaEdit.AddStyle(strStyle);

	return(parent);
};
AreaEdit.PopulateComboboxWithName = function(cmb, jsonObj, chosen) {
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
AreaEdit.AddStyle = function(cssStr) {
	if (AreaEdit.StyleExist(cssStr) === false) {
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
AreaEdit.StyleExist = function(strStyle) {
	var ssList = document.styleSheets; 
	if (!ssList) return false;
	for (var i = 0; i < ssList.length; i++) {
		var ss = ssList[i]; 
		if (!ss) continue;
		if (AreaEdit.XTraverseStyleSheet(ss, strStyle)) return true;
	}
	return false;
};
AreaEdit.XTraverseStyleSheet = function(ss, strStyle) {
	if (!ss) return false;
	var rls = AreaEdit.XGetCSSRules(ss) ; if (!rls) return false;
	var str2 = AreaEdit.StdCssStr(strStyle);
	for (var j = 0; j < rls.length; j++) {
		var cr = rls[j];
		if (cr.selectorText) {
			var str1 = AreaEdit.StdCssStr(cr.cssText);
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
AreaEdit.XGetCSSRules = function(ss) { 
	return ss.rules ? ss.rules : ss.cssRules; 
};
AreaEdit.StdCssStr = function(strCss) {
	var body = strCss.match(/[^{}]+(?=\})/g); // standardise body section string
	var tmp = document.createElement("div");
	tmp.style.cssText = body[0];

	var tgtCss = strCss.substr(0, strCss.indexOf(body) -1); // get the targeted css name
	var result = tgtCss + '{ ' + tmp.style.cssText + ' }';
	
	return(result);
};
AreaEdit.plusOne = function(seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) {
		seqNum.startNum++;
		seqNum.value = seqNum.prefix + seqNum.startNum;
	} 
	return(seqNum);
};
AreaEdit.nextLevelNumbering = function(seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) {
		seqNum.prefix += seqNum.value + '.';
		seqNum.startNum = 1;
		seqNum.value = seqNum.prefix + seqNum.startNum;
	} 
	return(seqNum);
};