//NTCFunction
const NTCTABLE_VIEW = {
    ALL: 'all',
    GROUP: 'group',
}

function randomString(length) {
    var string = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < length; i++) {
        string += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return string;
}

function size(associativeArray) {
    var size = 0,
        key;
    for (key in associativeArray) {
        associativeArray.hasOwnProperty(key);
        size++;
    }

    return size;
}

function selector(string, type) {
    var prefix;
    if (type) {
        switch (type) {
            case 'id':
                prefix = '#';
                break;
            case 'class':
                prefix = '.';
                break;
            default:
                prefix = type;
        }

        return prefix + string;
    } else {
        return string
    }
}

function actualOrPlaceholder(object, key, placeholder) {
    var outputValue;

    var isNeedPlaceholder = true;

    if (key) {
        if (object) {
            if (object[key]) {
                outputValue = object[key];
                isNeedPlaceholder = false;
            }
        }
    } else if (object) {
        outputValue = object;
        isNeedPlaceholder = false;
    }

    if (isNeedPlaceholder) {
        if (placeholder || placeholder === null) {
            if (typeof placeholder == 'function') {
                outputValue = placeholder();
            } else {
                outputValue = placeholder;
            }
        } else {
            outputValue = ' ';
        }
    }

    return outputValue;
}



//NTCUIKit
/**
 * This class generates table views
 * @class
 * @param {Array|Object} dataSourceArray - [REQUIRED] - Datastructure difines table structure(sections). There is sample structure in example section.
 * @param {Array|String} tableHeadersArray - [OPTIONAL]
 * @property {String} openTag
 * @property {String} closeTag
 * @property {Array | Object} dataSource
 * @property {Array} tableHeaders
 * @property {NTCRow} rows
 * @property {String} elementId
 * @property {String} htmlTags
 * @property {String} view - values: NTCTABLE_VIEW.ALL, NTCTABLE_VIEW.GROUP - default: NTCTABLE_VIEW.GROUP
 * @property {String} noDataMessage - default: 'Gösterilebilecek veri yok'
 * @property {Boolean} withIndicatorArea - default: true
 * @example //sample 'dataSourceArray'
            dataSourceArray = {
                yesilcam:[
                    {
                        name: 'Omer',
                        surname: 'Turist',
                        age: '42',
                    },
                    {
                        name: 'Tarkan',
                        surname: 'Altarinoglu',
                        age: '51',
                    }
                ],
                hollywood:[
                    {
                        name: 'Marty',
                        surname: 'McFly',
                        age: '42',
                    },
                    {
                        name: 'Vincent',
                        surname: 'Vega',
                        age: '34',
                    }
                ]
            }
 */
function NTCTable(dataSourceArray, tableHeadersArray) {
    this.openTag;
    this.closeTag;
    this.dataSource;
    this.tableHeaders;
    this.rows;
    this.elementId;
    this.htmlTags;
    this.view;
    this.noDataMessage;

    this.elementId = randomString(6);

    this.openTag = '<div id="' + this.elementId + '">';
    this.closeTag = '</div>';

    if (dataSourceArray && size(dataSourceArray) > 0) {
        this.dataSource = dataSourceArray;
    } else {
        this.dataSource = {};
        console.warn('NTC-Warning: #180103');
    }

    if (tableHeadersArray) {
        this.tableHeaders = tableHeadersArray;
    }

    this.htmlTags = {
        sectionTitle: {
            openTag: '<h2 class="ntc-heading2">',
            closeTag: '</h2>'
        },
        group: {
            openTag: '<div class="ntc-group-dinamic">',
            closeTag: '</div>'
        },
        table: {
            openTag: '<table class="ntc-table-main">',
            closeTag: '</table>'
        }
    }

    this.view = NTCTABLE_VIEW.GROUP;

    this.rows = [];

    this.noDataMessage = 'Gösterilebilecek veri yok';
    
    this.withIndicatorArea = true;
}

/**
 * This method generates every single section table's open tag with 'data-section-key' attribute.
 * @augments NTCTable
 * @param {String} sectionKey
 * @return {String}
 */
NTCTable.prototype.generateSectionTableOpenTag = function (sectionKey) {
    var openTag;
    var thisSectionKey;
    if (sectionKey) {
        thisSectionKey = sectionKey;
    } else {
        thisSectionKey = 'rg-' + randomString(6);
    }

    openTag = '<table class="ntc-table-main" data-section-key="' + thisSectionKey + '">';

    return openTag;
}

/**
 * This method generates html table header row(<tr><th>...</th></tr>) code.
 * @augments NTCTable
 * @return {String}
 */
NTCTable.prototype.generateTableHeaderHtmlCode = function () {
    if (this.tableHeaders && this.tableHeaders.length > 0) {
        var finalHtmlCode = '';
        finalHtmlCode += '<tr class="ntc-tableRow-tableHeading">';
        
        for (var i in this.tableHeaders) {
            finalHtmlCode += this.generateTableHeaderCellHtmlCodeAtIndex(i);
        }
        finalHtmlCode += '</tr>';

        return finalHtmlCode;
    } else {
        return null;
    }
}

/**
 * This method generates html table header cell html code.
 * @augments NTCTable
 * @param {Int} index
 * @return {String}
 */
NTCTable.prototype.generateTableHeaderCellHtmlCodeAtIndex = function (index) {
    var outputHtml = '';
    
    var text = this.tableHeaders[index] || '';
        
    outputHtml += '<th>' + text + '</th>';
    
    return outputHtml;
}

/**
 * Generates table section title html.
 * @augments NTCTable
 * @param {Int|String} sectionIndex
 * @return {String}
 */
NTCTable.prototype.generateSectionTitleHtmlCode = function (sectionIndex) {
    var outputHtml = this.htmlTags.sectionTitle.openTag + this.sectionTitleText(sectionIndex) + this.htmlTags.sectionTitle.closeTag;

    return outputHtml;
}

/**
 * Generates table section title text. In most situation it will be override.
 * @augments NTCTable
 * @param {Int|String} sectionIndex
 * @return {Int|String}
 */
NTCTable.prototype.sectionTitleText = function (sectionIndex) {
    return sectionIndex;
}

/**
 * This method generates html table body row(s)(<tr><td>...</td><td>...</td>...</tr><tr><td>...</td><td>...</td>...</tr>...) code for single section.
 * @augments NTCTable
 * @param {Int|String} sectionIndex
 * @return {String}
 */
NTCTable.prototype.generateTableBodyHtmlCodeAtSectionIndex = function (sectionIndex) {
    var finalHtmlCode = '';
    if (this.rows[sectionIndex] && this.rows[sectionIndex].length > 0) {
        for (var i in this.rows[sectionIndex]) {
            var currentRowObject = this.rows[sectionIndex][i];
            finalHtmlCode += currentRowObject.generateHtmlCode();
        }
        return finalHtmlCode;
    } else {
        console.error('NTC-Error: #180301');
    }
}

/**
 * This method generates whole table inner(which is in first div) html code. It's help jQuery event listeneter when reload html code because it does not effect container div.
 * @augments NTCTable
 * @return {String}
 */
NTCTable.prototype.generateInnerHtmlCode = function () {
    this.setRows();

    var outputHtmlCode = '';

    for (var i in this.rows) {
        var sectionHtml = this.htmlTags.group.openTag;
        if (this.view == 'group') {
            sectionHtml += this.generateSectionTitleHtmlCode(i);
        }
        if (this.generateTableBodyHtmlCodeAtSectionIndex(i)) {
            sectionHtml += this.generateSectionTableOpenTag(i) + (this.generateTableHeaderHtmlCode() != null ? this.generateTableHeaderHtmlCode() : '') + this.generateTableBodyHtmlCodeAtSectionIndex(i) + this.htmlTags.table.closeTag;
        } else {
            sectionHtml += '<h1 id="' + this.elementId + '">' + this.noDataMessage + '</h1>';
        }

        outputHtmlCode += sectionHtml + this.htmlTags.group.closeTag;
    }

    if (!size(this.rows)) {
        outputHtmlCode += '<h1 id="' + this.elementId + '">' + this.noDataMessage + '</h1>'
    }

    if (this.withIndicatorArea) {
        outputHtmlCode += '<div class="ntc-indicator-container"></div>';
    }

    return outputHtmlCode;
}

/**
 * This method generates html table(<table>...</table>) code with headres for complete table(whole sections).
 * @augments NTCTable
 * @param {Boolean} withoutEventListener - Event listener for row clicks. If this function call with event listener(this.whenClick) it will trigger as much as called.
 * @return {String}
 */
NTCTable.prototype.generateTableHtmlCode = function (withoutEventListener) {
    var finalHtmlCode = this.openTag;

    finalHtmlCode += this.generateInnerHtmlCode();

    finalHtmlCode += this.closeTag;

    if (!withoutEventListener) {
        this.whenClick();
    }

    return finalHtmlCode;
}

/**
 * This method find table in DOM and replace it with newly generated table html code.
 * @augments NTCTable
 * @param {Object} additionalFilterObject - for filtering
 * @return {void}
 */
NTCTable.prototype.reloadHtmlCode = function (additionalFilterObject) {
    var filterParameter;

    if (additionalFilterObject) {
        filterParameter = additionalFilterObject;
    } else {
        filterParameter = null;
    }

    var idSelector = selector(this.elementId, 'id');

    if(this.filterController){
        this.filter(filterParameter);   
    }

    $(idSelector).html(this.generateInnerHtmlCode());
}

/**
 * This method loops dataSource for every row and calls this.cellsForRowAtIndex method and populate NTCTable.rows array.
 * @augments NTCTable
 * @return {void}
 */
NTCTable.prototype.setRows = function () {
    this.rows = [];
    for (var k in this.dataSource) {
        var currentSectionData = this.dataSource[k];
        for (var i in currentSectionData) {
            var currentRowData = currentSectionData[i]
            if (currentRowData.isVisible != false) {
                var indexPath = {
                    sectionIndex: k,
                    rowIndex: i
                };

                var newRow = this.cellsForRowAtIndex(indexPath);
                
                currentRowData.rowKey = newRow.rowKey;
                
                if (!this.rows[indexPath.sectionIndex]) {
                    this.rows[indexPath.sectionIndex] = [];
                }
                
                this.rows[indexPath.sectionIndex].push(newRow);
            }
        }
    }
}

/**
 * This method has read dataSource keys for cell data and set cell in row at indexPath(sectionIndex, rowIndex). It can be override for custom cell data.
 * @augments NTCTable
 * @param {Object} indexPath - (@property {Int}indexPath.sectionIndex @property {Int} indexPath.rowIndex) [REQUIRED]
 * @return {NTCRow}
 */
NTCTable.prototype.cellsForRowAtIndex = function (indexPath) {
    var newRow = new NTCRow();

    for (var key in this.dataSource[indexPath.sectionIndex][indexPath.rowIndex]) {
        newRow.addNewCell(actualOrPlaceholder(this.dataSource[indexPath.sectionIndex][indexPath.rowIndex][key]));
    }

    return newRow;
}

/**
 * This method listen to row click and call NTCTable.didClickRowAtIndexPath and NTCTable.didClickRowAtIndexKey functions by clicked row's indexpath
 * @augments NTCTable
 * @return {void}
 */
NTCTable.prototype.whenClick = function () {
    var self = this;
    var indexPath = {};
    var indexKey = {};
    $('body').on('click', selector(this.elementId, 'id') + ' tr', function (e) {
        var selectedText = getSelection().toString();
        if(!selectedText){
            var jqTableGroup = $(selector(self.elementId, 'id'));
            var jqParentTable = $(this).parents('table');

            indexPath.rowIndex = $(this).index();
            if (jqParentTable.find('tr th').length) {
                indexPath.rowIndex--;
            }
            indexPath.sectionIndex = jqTableGroup.find('table').index(jqParentTable);

            indexKey.rowKey = $(this).attr('data-row-key');
            indexKey.sectionKey = jqParentTable.attr('data-section-key');

            self.didClickRowAtIndexPath(indexPath);
            self.didClickRowAtIndexKey(indexKey);   
        }
    });
}

/**
 * This method called by NTCTable.whenClick function. It must be overrided depend on what has been expected when user click a row.
 Difference between this method and 'didClickRowAtIndexKey' is;
 this method's input define by row visual index which change if user filter table but data structure still will be same.
 didClickRowAtIndexKey method's input define by a identifier which written and read in html code,
 * @augments NTCTable
 * @param {Object} indexPath - (@property {Int}indexPath.sectionIndex @property {Int} indexPath.rowIndex) [REQUIRED]
 * @return {void}
 */
NTCTable.prototype.didClickRowAtIndexPath = function (indexPath) {
    console.warn(indexPath);
    console.warn('This methot must be override');
}

/**
 * This method called by NTCTable.whenClick function. It must be overrided depend on what has been expected when user click a row. Difference between this method and 'didClickRowAtIndexPath' is;
 this method's input define by a identifier which written and read in html code,
 didClickRowAtIndexPath method's input define by row visual index which change if user filter table but data structure still will be same.
 * @augments NTCTable
 * @param {Object} indexKey - (@property {Int}indexKey.sectionKey @property {Int} indexPath.rowKey) [REQUIRED]
 * @return {void}
 */
NTCTable.prototype.didClickRowAtIndexKey = function (indexKey) {
    console.warn(indexKey);
    console.warn('This methot must be override');
}

//TODO: Refactor
/**
 * This method filter to table with changing NTCRow.isVisible value. It needs id attribute for filterable fields in every dataSource item
 * WARNINNG: 'additionalFilterObject' is came from NTCCheckbox.watcher(). Watcher trigers before sets new value but filter needs also new value so it pass new value with 'additionalFilterObject'.
 * @todo Refactor
 * @param {Object} additionalFilterObject
 * @return {void}
 */
NTCTable.prototype.filter = function (additionalFilterObject) {
    //Set all rows as invisible
    for (var key in this.dataSource) {
        var currentSection = this.dataSource[key];
        for (var k in currentSection) {
            var currentData = currentSection[k];
            currentData.isVisible = false;
        }
    }

    //Holes mean active filter options
    //Read filter controller and sets available holes
    var holes;
    holes = {};
    for (var k in this.filterController.mainFilter.dataSource) {
        var currentHole = this.filterController.mainFilter.dataSource[k];

        if (currentHole.isChecked) {
            if (this.filterController.subFilters[k].filter instanceof NTCCheckBoxGroup) {
                holes[this.filterController.subFilters[k].key] = [];
                for (var key in this.filterController.subFilters[k].filter.dataSource) {
                    var currentValue = this.filterController.subFilters[k].filter.dataSource[key];

                    if (currentValue.isChecked) {
                        holes[this.filterController.subFilters[k].key].push(key);
                    }
                }
            } else if (this.filterController.subFilters[k].filter instanceof NTCForm) {
                var floorInput = this.filterController.subFilters[k].filter.findInputById('floor').floor;
                var ceilInput = this.filterController.subFilters[k].filter.findInputById('ceil').ceil;

                if (!holes[this.filterController.subFilters[k].key]) {
                    holes[this.filterController.subFilters[k].key] = {}
                }
                
                switch(floorInput.type){
                    case 'date':
                        holes[this.filterController.subFilters[k].key].floor = floorInput.value ? new Date(floorInput.value) : null;
                        holes[this.filterController.subFilters[k].key].ceil = ceilInput.value ? new Date(ceilInput.value) : null;
                        break;
                        
                    default:
                        holes[this.filterController.subFilters[k].key].floor = parseInt(floorInput.value);
                        holes[this.filterController.subFilters[k].key].ceil = parseInt(ceilInput.value);
                }
            }
        }
    }

    if (additionalFilterObject) {
        //Add or remove one more hole for last interaction checkbox
        if (additionalFilterObject.type == 'main') {
            var allHolesKeys = Object.keys(holes);
            for (var key in additionalFilterObject.data) {
                var currentKey = additionalFilterObject.data[key];
                if (currentKey.isChecked) {
                    if (allHolesKeys.indexOf(key) <= 0) {
                        holes[key] = [];
                    }
                } else {
                    delete holes[key]
                }
            }
        }

        //Add or remove one more hole for last interaction checkbox
        if (additionalFilterObject.type == 'sub') {
            var allHolesKeys = Object.keys(holes);
            for (var k in additionalFilterObject.data) {
                var currentKeyValues = additionalFilterObject.data[k];
                for (var key in currentKeyValues) {
                    var currentKeyValue = currentKeyValues[key];
                    if (currentKeyValue.isChecked) {
                        if (allHolesKeys.indexOf(k) >= 0) {
                            holes[k].push(key);
                        } else {
                            holes[k] = [key];
                        }
                    } else {
                        if (allHolesKeys.indexOf(k) >= 0) {
                            if (holes[k].indexOf(key) >= 0) {
                                holes[k].splice(holes[k].indexOf(key), 1);
                            }
                        }
                    }
                }
            }
        }
    }


    var keyIndex = 0;

    //All holes set
    //Filter rows depend on holes
    if (size(holes) > 0) {
        for (var k in holes) {
            var currentHole = holes[k];
            var isVisibleForCurrentHole = true;
            for (var key in this.dataSource) {
                var currentSection = this.dataSource[key];
                for (var kPrime in currentSection) {
                    var currentData = currentSection[kPrime];
                    var currentDataHoleValues = currentData[k];
                    var allKeys = [];

                    if (currentDataHoleValues) {
                        if (typeof currentDataHoleValues == 'object') {
                            if(Array.isArray(currentDataHoleValues)){
                                allKeys = currentDataHoleValues;
                            }else{
                                allKeys = Object.keys(currentDataHoleValues);   
                            }
                        } else if (typeof currentDataHoleValues == 'string') {
                            allKeys.push(currentDataHoleValues);
                        } else {
                            console.error('NTC-Error: #180206');
                        }
                    }

                    if (size(currentHole) > 0) {
                        for (var i in currentHole) {
                            var currentValue = currentHole[i];

                            if (Object.keys(currentHole).indexOf('ceil') >= 0 || Object.keys(currentHole).indexOf('floor') >= 0) {
                                var isInRange;
                                
                                if(currentHole.floor || currentHole.ceil){
                                    if(currentDataHoleValues == null || currentDataHoleValues == undefined){
                                        isInRange = false;
                                    }else{
                                        var currentDataHoleValuesAsInt;

                                        var comparisonTypeDefiner;
                                        if(currentHole.floor){
                                            comparisonTypeDefiner = currentHole.floor;
                                        }else{
                                            comparisonTypeDefiner = currentHole.ceil;
                                        }
                                        
                                        switch(comparisonTypeDefiner.constructor){
                                            case Date:
                                                currentDataHoleValuesAsInt = new Date(currentDataHoleValues);
                                                break;

                                            case Number:
                                                currentDataHoleValuesAsInt = parseInt(currentDataHoleValues);
                                                break;
                                        }

                                        isInRange = true;

                                        if (!isNaN(currentHole.floor)) {
                                            if (currentDataHoleValuesAsInt < currentHole.floor && currentHole.floor) {
                                                isInRange = false;
                                            }
                                        }

                                        if (!isNaN(currentHole.ceil)) {
                                            if (currentDataHoleValuesAsInt > currentHole.ceil && currentHole.ceil) {
                                                isInRange = false;
                                            }
                                        }
                                    }
                                }else{
                                    isInRange = true;
                                }
                                
                                if (keyIndex > 0 ? (isInRange && currentData.isVisible) : (isInRange)) {
                                    isVisibleForCurrentHole = true;
                                    break;
                                } else {
                                    isVisibleForCurrentHole = false;
                                }
                            } else {
                                if (keyIndex > 0 ? (allKeys.indexOf(currentValue) >= 0 && currentData.isVisible) : (allKeys.indexOf(currentValue) >= 0)) {
                                    isVisibleForCurrentHole = true;
                                    break;
                                } else {
                                    isVisibleForCurrentHole = false;
                                }

                            }
                        }
                    } else if (keyIndex > 0) {
                        isVisibleForCurrentHole = currentData.isVisible;
                    }

                    currentData.isVisible = isVisibleForCurrentHole;
                }
            }

            keyIndex++;
        }
    } else {
        for (var key in this.dataSource) {
            var currentSection = this.dataSource[key];
            for (var k in currentSection) {
                var currentData = currentSection[k];
                currentData.isVisible = true;
            }
        }
    }
}

/**
 * This method set selected row. It is not triggered as default. It must be call in like 'didClickRowAtIndexKey' method.
 * @augments NTCTable
 * @param {Object} path - (@property {Int}path.sectionIndex @property {Int} path.rowIndex) or (@property {String}path.sectionKey @property {String} path.rowKey) [REQUIRED]
 * @return {void}
 */
NTCTable.prototype.setSelectedRow = function (path) {
    $(selector(this.elementId, 'id')).find('tr.selected').removeClass('selected');
    if (path.rowKey) {
        var tableSelector = 'table[data-section-key="' + path.sectionKey + '"]';
        var rowSelector = 'tr[data-row-key="' + path.rowKey + '"]';
        $(selector(this.elementId, 'id'))
            .find(tableSelector)
            .find(rowSelector).addClass('selected');
    } else {
        $(selector(this.elementId, 'id'))
            .find('table').eq(path.sectionIndex)
            .find('tr').eq(path.rowIndex).addClass('selected');
    }
}



/**
 * It can store single row data and can generate table row which is for NTCTable object
 * @class
 * @param {Array|NTCCell} NTCCellObjectArray [OPTIONAL]
 * @param {String} rowKey [OPTIONAL]
 * @property {String} openTag
 * @property {String} closeTag
 * @property {Array|NTCCell} cellsArray
 * @property {String} rowKey
 */
function NTCRow(NTCCellObjectArray, rowKey) {
    this.openTag;
    this.closeTag;
    this.cellsArray;
    this.rowKey;

    if (rowKey) {
        this.rowKey = rowKey;
    } else {
        this.rowKey = 'gr-' + randomString(8);
    }

    this.openTag = '<tr class="ntc-tableRow-regular" data-row-key="' + this.rowKey + '">';
    this.closeTag = '</tr>';
    this.cellsArray = [];
}

/**
 * This method create a new 'NTCCell' object and add it 'NTCRow.cellsArray' array
 * @augments NTCRow
 * @param {String} cellData [REQUIRED]
 * @return {void}
 */
NTCRow.prototype.addNewCell = function (cellData) {	
	var newCell = new NTCCell(cellData);
	this.cellsArray.push(newCell);
}

/**N
 * This method generates single table row(<tr>...</tr>) with cells(<td>...</td>,<td>...</td>,...) in it.
 * @augments NTCRow
 * @return {String}
 */
NTCRow.prototype.generateHtmlCode = function () {
    var htmlCode;
    var innerHtmlCode = '';

    if (this.cellsArray && this.cellsArray.length > 0) {
        var self = this;
        for (var index in self.cellsArray) {
            var currentCell = self.cellsArray[index];
            innerHtmlCode += currentCell.generateHtmlCode();
        }

        htmlCode = this.openTag + innerHtmlCode + this.closeTag;

        return htmlCode;
    } else {
        console.error('NTC-Error: #180302');
    }

}



/**
 * It can store single cell data and can generate table cell which is for NTCRow object and NTCTable object.
 * @class
 * @param {String} cellData
 * @property {String} openTag
 * @property {String} closeTag
 * @property {String} cellData
 */
function NTCCell(cellData) {
    var openTag;
    var closeTag;
    var cellData;
    if (cellData || cellData === 0) {
        this.cellData = cellData;
    } else {
        console.log('NTC-Error: #180105');
    }

    this.openTag = '<td>';
    this.closeTag = '</td>';
}

/**
 * This method generates single table cell(<td>...</td>) html code.
 * @augments NTCCell
 * @returm {String}
 */
NTCCell.prototype.generateHtmlCode = function () {
    var htmlCode = this.openTag + this.cellData + this.closeTag;

    return htmlCode;
}