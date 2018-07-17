var UiUtil; // to suppress NB error fuss
var positionCheckbox = 0;
var positionDesc = 3;
UiGrid.MsiaSgpConfig = {
	enableSort: false,
	decimal_point: '.',
	thousands_separator: ','
};
UiGrid.GridHeight = 5;
function UiGrid() {
	alert("The UiGrid is a collection of static functions, it cannot be prototyped!");
};
UiGrid.doNothing = function() {}; 
UiGrid.getJsonObj = function(chosenId, aryObj) {
	var result;
	for(var cntr = 0; cntr < aryObj.length; cntr++) {
		var tmp = aryObj[cntr];
		if (tmp.ObjectId === chosenId) {
			result = tmp;
			break;
		}
	}
	return(result);
};
UiGrid.deleteRows = function(rowObjArray) {
	var result;
	for (var i = 0; i < rowObjArray.length; i++) {
		var rIndex = rowObjArray[i].sectionRowIndex;
		result = rowObjArray[i].rowIndex;
		rowObjArray[i].parentNode.deleteRow(rIndex);
	}
	return(result);
};
UiGrid.rowClick = function(myTD, tbl, idxSel){
	$('.rowSelected').removeClass('rowSelected');
	$(myTD).addClass('rowSelected');
	setTimeout(function() {$('#' + tbl.id + ' tr').eq(idxSel).dblclick();} , 1);	
};
UiGrid.selectRow = function(tbl, ridx) {
	var rec = tbl.rows[ridx];
	if (typeof rec !== 'undefined') {
		UiGrid.rowClick(rec, tbl, ridx);
	} else {
		var tidx = ridx - 1;
		rec = tbl.rows[tidx];
		if (tidx > 0) {
			UiGrid.rowClick(rec, tbl, tidx);
		} else {
			//divEditArea.emptyUiForm('editArea');
		}
	}
}; 
UiGrid.sendDeleteRequest = function(aGrid, tbl, aTheUrl, rwi, jsn) {
	return function() {
		var ridx = UiGrid.deleteRows(rwi);
		UiGrid.selectRow(tbl, ridx);
		var requestParam = {jsn: JSON.stringify(jsn)};
		UiUtil.BeAction(requestParam, 'delete', aTheUrl, function(jsonObject) {
			if (UiUtil.NotUndefineNotNull(aGrid.refreshFromBe)) {
				aGrid.refreshFromBe();
			}
		});
	};
}; 
UiGrid.IsAllRowChecked = function(aGrid) {
	var result = false;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.table)) {
		result = aGrid.table.rows[0].cells[positionCheckbox].getElementsByTagName('input')[0].checked;
	}
	return(result);
};
UiGrid.getAllCheckRow = function(aGrid) {
	var row;
	var result = [];
	for(var cntrRow = 1; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[positionCheckbox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				result.push(cntrRow);
			}
		}
	}
	return(result);
};
UiGrid.getFirstCheckRow = function(aGrid) {
	var row;
	var idxToEdit;
	for(var cntrRow = 1; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[positionCheckbox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				idxToEdit = cntrRow;
				break;
			}
		}
	}
	return(idxToEdit);
};
UiGrid.CheckAtRow = function(aGrid, aIdx, aValue) {
	var row;
	row = aGrid.table.rows[aIdx];
	var aryInput = row.cells[positionCheckbox].getElementsByTagName('input');
	if (aryInput.length > 0) {
		aryInput[0].checked = aValue;
	}
};
UiGrid.CheckAllRow = function(aGrid, aValue) {
	var row;
	for(var cntrRow = 0; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[positionCheckbox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			aryInput[0].checked = aValue;
		}
	}
};
UiGrid.CheckTotalRow = function(aGrid) {
	var row;
	var cntrChecked = 0;
	for(var cntrRow = 0; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[positionCheckbox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				cntrChecked++;
			}
		}
	}
	return(cntrChecked);
};
UiGrid.onEdit = function(aGrid) {
	var idxToEdit = UiGrid.getFirstCheckRow(aGrid);
	if (idxToEdit === undefined) {
		startDialogInfo('Error', "There is no record selected, please tick the checkbox at the table first!", UiGrid.doNothing);
	} else {
		$($(aGrid.table)[0].rows[idxToEdit]).dblclick();
	}
};
UiGrid.onDelete = function(aGrid, aTheUrl, sendDelRq, cancelDelRq) {
	var tbl = aGrid.table;
	var row;
	var jsn = [];
	var rwi = [];
	var desc = '';
	for(var cntrRow = 1; row = tbl.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[positionCheckbox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				var obj = {};
				obj.Class = $(row.cells[2]).text();
				obj.ObjectId = $(row.cells[1]).text();
				jsn.push(obj);
				rwi.push(row);
				if (desc !== '') desc += ', ';
				desc += row.cells[positionDesc].innerHTML;
			}
		}
	}
	if (rwi.length > 0) {
		if (desc.length > 30) {
			desc = desc.substr(0, 30) + '...';
		}
		if (sendDelRq === undefined) {
			sendDelRq = UiGrid.sendDeleteRequest(aGrid, tbl, aTheUrl, rwi, jsn);
		} 
		if (cancelDelRq === undefined) {
			cancelDelRq = function() {UiGrid.doNothing();};
		} 
		var confirmMsg = 'Confirm to delete record of: ' + desc + ', total record to delete: ' + rwi.length + '?';
		showDialogOkCancel('Confirmation', confirmMsg, sendDelRq, cancelDelRq);
	} else {
		startDialogInfo('Error', "There is no record selected, please tick the checkbox at the table first!", UiGrid.doNothing);
	}
}; 
UiGrid.populateGrid = function(aGrid, aWantedCol, aGridDiv, aJson, aTableId) {
	var headerMeta = UiGrid.createGridHeader(aWantedCol);
	var bodyData = UiGrid.createGridBody(aJson.dataset, aWantedCol);
	aGrid.load({"metadata":headerMeta, "data":bodyData});
	if (aWantedCol[0].type === 'checkbox') {
		aGrid.setHeaderRenderer(aWantedCol[0].name, new RenderHdrCbx(aGrid));
	}
	aGrid.setCellRenderer(aWantedCol[0].name, new RenderBdyCbx(aGrid));
	for(var cntr = 1; cntr < headerMeta.length; cntr++) {
		if (UiUtil.NotUndefineNotNullNotBlank(aWantedCol[cntr].editable)) {
			aGrid.setCellRenderer(aWantedCol[cntr].name, new RenderEditable(aGrid));
		} else {
			aGrid.setCellRenderer(headerMeta[cntr].name, new CellRenderer({
			render: function(cell, value) { 
				cell.innerHTML = value ? $('<div/>').html(value).text() : ""; }
			})); 
		}
	}
	aGrid.renderGrid(aGridDiv, "stdGrid", aTableId);
};
UiGrid.createGridHeader = function(aWantedCol) {
	var defHeader = [];
	for(var cntr = 0; cntr < aWantedCol.length; cntr++) {
		var defCol = {};
		if (aWantedCol[cntr].type === 'checkbox') {
			defCol.name = aWantedCol[cntr].name;
			defCol.datatype = 'boolean';
			defCol.editable = true;
			defHeader.push(defCol);
		} else {
			var colName = aWantedCol[cntr].label;
			defCol.name = colName;
			defCol.label = colName;
			//defCol.datatype = 'string';
			defCol.datatype = aWantedCol[cntr].type;
			if (UiUtil.NotUndefineNotNullNotBlank(aWantedCol[cntr].editable)) {
				defCol.editable = true;
			} else {
				defCol.editable = false;
			}
			defHeader.push(defCol);
		}
	}
	return(defHeader);
};
UiGrid.createGridBody = function(aDataList, aWantedCol) {
	var data = [];
	for(var cntrRow = 0; cntrRow < aDataList.length; cntrRow++) {
		var row = {};
		row.id = cntrRow;
		row.values = {};
		var objRow = aDataList[cntrRow];
		if (UiUtil.NotUndefineNotNull(objRow.delete)) continue;
		for(var cntrCol = 0; cntrCol < aWantedCol.length; cntrCol++) {
			if (aWantedCol[cntrCol].type === 'checkbox') {
				// do nothing
			} else {
				var colName = aWantedCol[cntrCol].label;
				var colPath = aWantedCol[cntrCol].path;
				if (objRow.data !== undefined) {
					var objWanted = UiUtil.GetVarByJsonPath(objRow, colPath);
					if (aWantedCol[cntrCol].funcGetField !== undefined) { // get the custom wanted object if told so
						objWanted = aWantedCol[cntrCol].funcGetField(objRow);
					} 

					if (objWanted !== undefined) {
						var dataFormatted = undefined;
						if (aWantedCol[cntrCol].funcFormat !== undefined) { // format the wanted object if told to
							dataFormatted = aWantedCol[cntrCol].funcFormat(objWanted.data);
						}
						if ((objWanted.data === undefined || jQuery.isEmptyObject(objWanted.data)) && jQuery.isNumeric(objWanted.data) === false) {
							row.values[colName] = '';
						} else {
							if (dataFormatted !== undefined) {
								row.values[colName] = dataFormatted;
							} else {
								row.values[colName] = objWanted.data;
							}
						}
					} else {
						row.values[colName] = '';
					}
				} else {
					UiUtil.DisplayMsg('error', 'There is no field with the name: ' + colPath);
				}
			}
		}
		data.push(row);
	}
	return(data);
};
UiGrid.defineGridHeader = function(aryResult, aType, aField, aPath, aFuncGetField, aFuncFormat, aEditable) {
	var result = {};
	if (aType.toLowerCase() === 'checkbox') {
		result.name= aField;
		result.type = 'checkbox';
		aryResult.push(result);
	} else {
		result.name = aField;
		result.label = aField;
		result.path = aPath;
		result.type = aType;
		result.funcFormat = aFuncFormat;
		result.funcGetField = aFuncGetField;
		if (UiUtil.NotUndefineNotNullNotBlank(aEditable)) {
			result.editable = true;
		}
		aryResult.push(result);
	}
	return(result);
};
UiGrid.applyRowSelectedStyle = function(aEvent, aGrid) {
	$(aGrid.table).find('.rowSelected').removeClass('rowSelected');
	if ($(aEvent.target).is('td')) {
		$(aEvent.target.parentNode).addClass('rowSelected');
	} else if ($(aEvent.target).is('tr')) {
		$(aEvent.target).addClass('rowSelected');
	}
};
UiGrid.hideCol = function(aTableId, aColPosition) {
	$('#' + aTableId + ' ' + 'th:nth-of-type(' + aColPosition + ')').css('display', 'none');
	$('#' + aTableId + ' ' + 'td:nth-of-type(' + aColPosition + ')').css('display', 'none');
};
UiGrid.Flatten2Relational = function(data, aName, aFlattenUpTo) {
	function flattenRecurse(aObj, aParentName, eachRow, aAccumParentName) {
		if (aParentName !== '') {
			aAccumParentName = aAccumParentName + '-' + aParentName;
		}

		if (UiUtil.NotUndefineNotNullNotBlank(aFlattenUpTo)) {
			for(var cntr = 0; cntr <aFlattenUpTo.length; cntr++) {
				if (aFlattenUpTo[cntr] === aAccumParentName) return;
			}
		}

		// handle primitive
		for(var prop in aObj) {
			if (prop === 'data') {
				var newObj = aObj['data'];
				if (typeof(newObj) !== 'object') {
					//eachRow[aParentName] = aObj;
					eachRow[aAccumParentName] = aObj;
				}
			}
		}

		// handle data 
		for(var prop in aObj) {
			if (prop === 'objectId') {
				eachRow[aAccumParentName + '-objectId'] = aObj.objectId;
			} else if (prop === 'clasz') {
				eachRow[aAccumParentName + '-clasz'] = aObj.clasz;
			} else if (prop === 'data') {
				var newObj = aObj['data'];
				if (typeof(newObj) === 'object') {
					for(var newProp in newObj) {
						flattenRecurse(newObj[newProp], newProp, eachRow, aAccumParentName);
					}
				}
			}
		}
 
		// handle dataset
		var cloneMasterRow = jQuery.extend(true, {}, eachRow); // preserving the row at this state 
		for(var prop in aObj) {
			if (prop === 'dataset') {
				var newObj = aObj['dataset'];
				for(var cntr = 0; cntr < newObj.length; cntr++) {
					var cloneRow = eachRow;
					if (cntr !== 0) {
						cloneRow = jQuery.extend(true, {}, cloneMasterRow);
					}
					flattenRecurse(newObj[cntr], '', cloneRow, aAccumParentName);
					if (cntr !== 0) {
						result.push(cloneRow); 
					}
				}
			}
		}
	}

	var result = [];
	var row = {};
	result.push(row);
	flattenRecurse(data, '', row, aName);

	var result1 = {};
	result1.dataset = [];
	for(var cntr = 0; cntr < result.length; cntr++) {
		var asObj = {};
		asObj.data = result[cntr];
		asObj.objectId = asObj.data[aName + '-objectId'];
		asObj.clasz = asObj.data[aName + '-clasz'];
		result1.dataset.push(asObj);
	}

	return(result1);
};
UiGrid.ForEachRow = function(aGrid, aFunc) {
	var rowCount = aGrid.getRowCount();
	for(var cntr = 0; cntr < rowCount; cntr++) {
		aFunc(aGrid.getRow(cntr));
	}
};
UiGrid.GetGridHeight = function(aGrid) {
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.GridHeight)) {
		return(aGrid.GridHeight);
	} else {
		return(UiGrid.GridHeight);
	}
};
UiGrid.ReflectGridChanges = function(aGrid, aObjectListName, aChangedObjectName, aSortField, aSortFieldType) {
	var gridHeight = UiGrid.GetGridHeight(aGrid);
	var gridObjectList = UiUtil.GetAryByJsonPath(aGrid.rawObj);
	var updatedIndex = null;

	var changedObject = UiUtil.GetPrevObj(aChangedObjectName);
	if (UiUtil.NotUndefineNotNull(changedObject)) {
		var coObjectId = changedObject.objectId;
		var coClasz = changedObject.clasz;

		var gridRowCount = gridObjectList.length;
		for(var cntr = 0; cntr < gridRowCount; cntr++) {
			var gdObjectId = UiUtil.GetValueByJsonPath(gridObjectList[cntr], "objectId");
			var gdClasz = UiUtil.GetValueByJsonPath(gridObjectList[cntr], "clasz");
			if (gdObjectId === coObjectId && gdClasz === coClasz) {
				updatedIndex = cntr;
				break;
			}
		}

		if (updatedIndex !== null) {
			gridObjectList[updatedIndex] = changedObject;
		} else { // this is new object, so insert
			var compare;
			if (aSortFieldType === "date") {
				compare = function(left, right) {
					var leftValue = UiUtil.GetValueByJsonPath(left, aSortField);
					var rightValue = UiUtil.GetValueByJsonPath(right, aSortField);
					leftValue = Date.parse(leftValue);
					rightValue = Date.parse(rightValue);
					if (leftValue < rightValue) return -1;
					if (leftValue > rightValue) return 1;
					return 0;
				};
			} else {
				compare = function(left, right) {
					var leftValue = UiUtil.GetValueByJsonPath(left, aSortField);
					var rightValue = UiUtil.GetValueByJsonPath(right, aSortField);
					if (leftValue < rightValue) return -1;
					if (leftValue > rightValue) return 1;
					return 0;
				};
			}
			gridObjectList.push(changedObject); // insert into gridObjectList
			gridObjectList.sort(compare);

			var smallestGridRow = UiUtil.GetValueByJsonPath(gridObjectList[0], aSortField);
			smallestGridRow = smallestGridRow.substring(0, 0);

			var sortedSmallestRow = UiUtil.GetValueByJsonPath(gridObjectList[0], aSortField);
			sortedSmallestRow = sortedSmallestRow.substring(0, 0);

			if (gridObjectList.length > gridHeight) {
				if(sortedSmallestRow < smallestGridRow ) { // check if first row can be in this grid
					UiUtil.RemoveArrayElement(gridObjectList, 0); // first row not qualify to be in the grid, remove the first row
				} else { 
					UiUtil.RemoveArrayElement(gridObjectList, gridObjectList.length - 1); // first row is qualify to be in grid, remove last row
				}
			} else {
				// do nothing, since grid is not full height yet
			}
		}
		UiUtil.StorePrevObj(aObjectListName, aGrid.rawObj);
		UiUtil.StoreObj(aChangedObjectName, undefined);
	}
};
UiGrid.GetSelection = function(aGrid, aColOid1, aColClasz1, aColOid2, aColClasz2) {
	var selectedList = undefined;
	if (UiGrid.IsAllRowChecked(aGrid)) {
		selectedList = []; // mean select all
	} else {
		var allCheckRow = UiGrid.getAllCheckRow(aGrid);
		for(var cntr = 0; cntr < allCheckRow.length; cntr++) {
			var idxChecked = allCheckRow[cntr];

			var colNameOid1 = aGrid.table.rows[0].cells[aColOid1].innerText;
			var colNameClasz1 = aGrid.table.rows[0].cells[aColClasz1].innerText;
			var colValueOid1 = aGrid.table.rows[idxChecked].cells[aColOid1].innerText;
			var colValueClasz1 = aGrid.table.rows[idxChecked].cells[aColClasz1].innerText;

			var strObj;
			if (aColOid2 !== undefined && aColClasz2 !== undefined) {
				var colNameOid2 = aGrid.table.rows[0].cells[aColOid2].innerText;
				var colNameClasz2 = aGrid.table.rows[0].cells[aColClasz2].innerText;
				var colValueOid2 = aGrid.table.rows[idxChecked].cells[aColOid2].innerText;
				var colValueClasz2 = aGrid.table.rows[idxChecked].cells[aColClasz2].innerText;
				strObj = '{';
				strObj += '"' + colNameOid1 + '": "' + colValueOid1 + '", "' +  colNameClasz1 + '": "' + colValueClasz1 + '"';
				strObj += ', "' +colNameOid2 + '": "' + colValueOid2 + '", "' +  colNameClasz2 + '": "' + colValueClasz2 + '"';
				strObj += '}';
			} else {
				var strObj = '{"' + colNameOid1 + '": "' + colValueOid1 + '", "' +  colNameClasz1 + '": "' + colValueClasz1 + '"}';
			}

			var selectedObj = JSON.parse(strObj);
			if (selectedList === undefined) selectedList = [];
			selectedList.push(selectedObj);
		}
	}
	return(selectedList);
};
/*
UiGrid.GetSelection = function(aGrid, aColOid, aColClasz) {
	var selectedList = undefined;
	if (UiGrid.IsAllRowChecked(aGrid)) {
		selectedList = []; // mean select all
	} else {
		var allCheckRow = UiGrid.getAllCheckRow(aGrid);
		for(var cntr = 0; cntr < allCheckRow.length; cntr++) {
			var idxChecked = allCheckRow[cntr];
			var colNameOid = aGrid.table.rows[0].cells[aColOid].innerText;
			var colNameClasz = aGrid.table.rows[0].cells[aColClasz].innerText;
			var colValueOid = aGrid.table.rows[idxChecked].cells[aColOid].innerText;
			var colValueClasz = aGrid.table.rows[idxChecked].cells[aColClasz].innerText;
			var strObj = '{"' + colNameOid + '": "' + colValueOid + '", "' +  colNameClasz + '": "' + colValueClasz + '"}';
			var selectedObj = JSON.parse(strObj);
			if (selectedList === undefined) selectedList = [];
			selectedList.push(selectedObj);
		}
	}

	return(selectedList);
};
*/



RenderHdrCbx = function(aGrid) { this.editableGrid = aGrid; }; // must first instantiate
RenderHdrCbx.prototype = new CellRenderer();
RenderHdrCbx.prototype.grid;
RenderHdrCbx.prototype.editableGrid;
RenderHdrCbx.prototype.render = function(cell, value) {
	var cbx = document.createElement('input');
	cbx.setAttribute('type', 'checkbox');
	cbx.setAttribute('onchange', 'RenderHdrCbx.HeaderCbxClick(this)');
	cell.appendChild(cbx);
	$(cell).find('a').html('');
	$(cell).css('text-align', 'center');
	$(cell).css('width', '50px');
}; 
RenderHdrCbx.HeaderCbxClick = function(aCaller) {
	var tbl = $(aCaller).closest('table')[0];
	var cellIdx = aCaller.parentElement.cellIndex;
	var aryInput = tbl.rows[0].cells[cellIdx].getElementsByTagName('input');
	if (aryInput.length > 0) {
		for(var cntrRow = 1; ; cntrRow++) { 
			var row = tbl.rows[cntrRow];
			if (row !== undefined && row !== null) {
				var userChoice = aryInput[0].checked;
				row.cells[cellIdx].getElementsByTagName('input')[0].checked = userChoice;
			} else {
				break;
			}
		}
	}
};


RenderBdyCbx = function(aGrid) { this.editableGrid = aGrid; }; // must first instantiate
RenderBdyCbx.prototype = new CellRenderer();
RenderBdyCbx.prototype.grid;
RenderBdyCbx.prototype.editableGrid;
RenderBdyCbx.prototype.render = function(cell, value) {
	var cbx = document.createElement('input');
	cbx.setAttribute('type', 'checkbox');
	cbx.setAttribute('onchange', 'RenderBdyCbx.BodyCbxClick(this)');
	cell.appendChild(cbx);
	$(cell).find('a').html('');
	$(cell).css('text-align', 'center');
	$(cell).css('width', '50px');
}; 
RenderBdyCbx.BodyCbxClick = function(aCaller) {
	var tbl = $(aCaller).closest('table')[0];
	var hdrChkbx = tbl.rows[0].cells[0].getElementsByTagName('input');
	hdrChkbx[0].checked = false;
};


RenderEditable = function(aGrid) { this.editableGrid = aGrid; }; // must first instantiate
RenderEditable.prototype = new CellRenderer();
RenderEditable.prototype.grid;
RenderEditable.prototype.editableGrid;
RenderEditable.prototype.render = function(cell, value) {
	var thisGrid = this.editableGrid;
	var thisCell = cell;
	thisGrid.columns[$(thisCell)[0].columnIndex].cellValidators = [];
	$(cell).on('keyup', function() { 
		if (thisGrid.columns[$(thisCell)[0].columnIndex].datatype === 'nombor') {
			var thisInput = $(thisCell).children('input')[0];
			if (UiUtil.NotUndefineNotNull(thisInput)) {
				thisInput.value = thisInput.value.replace(/\D/g, '');
				thisInput.value = UiForm.numberWithComma(thisInput.value);
				thisCell.netValue = thisInput.value;
			}
		} else if (thisGrid.columns[$(thisCell)[0].columnIndex].datatype === 'duit') {
			var thisInput = $(thisCell).children('input')[0];
			if (UiUtil.NotUndefineNotNull(thisInput)) {
				thisInput.value = UiForm.HandleMoney(thisInput.value);
				thisCell.netValue = thisInput.value;
			}
		} else {
			// do nothing
		}
	});

	//var newValue = thisCell.netValue;
	var newValue = value;
	if (UiUtil.NotUndefineNotNullNotBlank(newValue)) {
		if (thisGrid.columns[$(thisCell)[0].columnIndex].datatype === 'duit') {
			var gotDot = ('' + newValue).indexOf('.');
			if (gotDot < 0) {
				newValue += ".00";
			} else {
				var centPart = ('' + newValue).substring(gotDot + 1);
				if (centPart.length === 1) {
					newValue += "0";
				}
			}
		}
		cell.innerHTML = newValue;
	} else {
		cell.innerHTML = "";
	}
}; 

