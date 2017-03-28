//Читаем выбранные объекты

var newItem;
var docRef = app.activeDocument;
var docSelected = docRef.selection;

var access = getAccess();

//Делаем проверку на наличие обектов
if ( access ) {

	//Валидация сохранения файлов
	var success = false;

	//Выбираем директорию для файлов
	var destFolder = null;
	destFolder = Folder.selectDialog( 'Select folder for SVG files.', '~');
			
	var newDoc = app.documents.add(docRef.colorMode, 24, 24, 1, docRef.ArtboardLayout, 1, 20.0);

	//Обрабатываем каждый объект по отдельности
	for ( i = 0; i < docSelected.length; i++) {

		if ( destFolder != null) {

			//Для работы только с одним из объектов исхоного массива
			docSelected[i].selected = false; 

			//Клонируем объект в новый документ
			newItem = docSelected[i].duplicate( newDoc, ElementPlacement.PLACEATEND );

			//Выбираем все объекты в новом документе (это всегда будет только 1 объект)
			newDoc.layers[0].hasSelectedArtwork = true;

			//Обжимаем его для поднготовки к экспорту
			newDoc.fitArtboardToSelectedArt(0);

			//Снимаем выделение с объекта (возможно можно этот момент вырезать)
			newItem.selected = false;

			//Стоит проверить, нужна ли здесь валидация вообще
			var options = getOptions();

			//Создаем имя для разработчиков под Android
			var ItemName = docSelected[i].name + '_' + Math.round(docSelected[i].width) + 'x' + Math.round(docSelected[i].height);

			// (имя объекта при экспорте, првефикс, папка размещения)
			var targetFile = getTargetFile(ItemName, '.svg' , destFolder);
			newDoc.exportFile(targetFile, ExportType.SVG, options);

			//Очищаем новый документ от старых объектов
			newDoc.pageItems.removeAll();
			
			success = true;
		}

	}	

	newDoc.close( SaveOptions.DONOTSAVECHANGES );

	if ( success ) {
		alert(docSelected.length + ' object(s) saved as SVG.' );
	}
}


function getAccess() {

	var access = false;
	var docAccess = false;
	var selAccess = false;

	//Проверка на наличие выделенных объектов
	if ( docSelected.length > 0 ) {

		docAccess = true;
		selAccess = true;

		//Проверка на наличие пустых имен
		for ( i = 0; i < docSelected.length; i++ ) {

			if (docSelected[i].name.length == 0) {
				selAccess = false;
			}
		}
	}

	//Объекты не выделены
	else {
		alert( 'Please select one or more objects.' ); 
	}

	//Имена не названы
	if ( selAccess == false && docAccess ) {
		alert( 'One of the selected objects is unnamed. Please name it.' );
	}

	access = selAccess && docAccess;

	//Идентификатор валидации
	return access;
}

function getOptions() {

	var options = new ExportOptionsSVG();
	
	options.DTD = SVGDTDVersion.SVG1_1;
	options.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
	options.fontType = SVGFontType.SVGFONT;
	options.documentEncoding = SVGDocumentEncoding.UTF8;
	options.coordinatePrecision = 3
	options.cssProperties = SVGCSSPropertyLocation.STYLEELEMENTS;
	options.embedRasterImages = false;
	
	return options;
}

function getTargetFile(ItemName, ext, destFolder) {
	var newItemName = '';

	if (ItemName.indexOf('.') < 0) {
		newItemName = ItemName + ext;
	}

	else {
		var dot = ItemName.lastIndexOf('.');
		newItemName += ItemName.substring(0, dot);
		newItemName += ext;
	}
	
	var myFile = new File( destFolder + '/' + newItemName );
	
	if (myFile.open('w')) {
		myFile.close();
	}
	else {
		alert( 'Access is denied' );
	}
	return myFile;
}

