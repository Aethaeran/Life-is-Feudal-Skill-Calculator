function loadCrafting(){
	$('#tree').html($("#craftingView-template").html());
			
	//Crafting//
	artisanTree.render($('#artisanTree'));
	artisanTree.traverseBF(initializeNode);		
	$('#artisanImage').attr('src',artisan.imageSrc);
	naturesLoreTree.render($('#naturesLoreTree'));
	naturesLoreTree.traverseBF(initializeNode);		
	$('#naturesLoreImage').attr('src',naturesLore.imageSrc);				
	huntingTree.render($('#huntingTree'));
	huntingTree.traverseBF(initializeNode);
	$('#huntingImage').attr('src',hunting.imageSrc);
	
	//center the divs
	var newWidth = parseInt($('#artisanTree > ul > li').css("width")) + parseInt($('#artisanTree > ul > li').css("padding-left")) * 2 + 1;
	$('#artisanTree').css('width',newWidth);
	newWidth = parseInt($('#naturesLoreTree > ul > li').css("width")) + parseInt($('#naturesLoreTree > ul > li').css("padding-left")) * 2 + 1;
	$('#naturesLoreTree').css('width',newWidth);
	newWidth = parseInt($('#huntingTree > ul > li').css("width")) + parseInt($('#huntingTree > ul > li').css("padding-left")) * 2 + 1;
	$('#huntingTree').css('width',newWidth);
}

function loadCombat(){
	//Combat//
	$('#tree').html($("#combatView-template").html());	
	cavalryTree.render($('#cavalryTree'));
	cavalryTree.traverseBF(initializeNode);
	$('#cavalryImage').attr('src',cavalry.imageSrc);
	militiaTree.render($('#militiaTree'));
	militiaTree.traverseBF(initializeNode);
	$('#militiaImage').attr('src',militia.imageSrc);
	footmanTree.render($('#footmanTree'));	
	footmanTree.traverseBF(initializeNode);
	$('#footmanImage').attr('src',footman.imageSrc);
	slingerTree.render($('#slingerTree'));
	slingerTree.traverseBF(initializeNode);
	$('#slingerImage').attr('src',slinger.imageSrc);
	assaulterTree.render($('#assaulterTree'));
	assaulterTree.traverseBF(initializeNode);
	$('#assaulterImage').attr('src',assaulter.imageSrc);	
	unitAndFormationTree.render($('#unitAndFormationTree'));
	unitAndFormationTree.traverseBF(initializeNode);
	$('#unitAndFormationImage').attr('src',unitAndFormation.imageSrc);
	equipmentMaintainTree.render($('#unitAndFormationTree'));
	equipmentMaintainTree.traverseBF(initializeNode);
	$('#equipmentMaintainImage').attr('src',equipmentMaintain.imageSrc);
	battleSurvivalTree.render($('#battleSurvivalTree'));
	battleSurvivalTree.traverseBF(initializeNode);
	$('#battleSurvivalImage').attr('src',battleSurvival.imageSrc);
	demolitionTree.render($('#battleSurvivalTree'));
	demolitionTree.traverseBF(initializeNode);
	$('#demolitionImage').attr('src',demolition.imageSrc);
	
	//center the divs
}

function loadMinor(){
	//Minor//
	$('#tree').html($("#minorView-template").html());
	
	movementTree.render($('#movementTree'));
	movementTree.traverseBF(initializeNode);
	$('#movementImage').attr('src',movement.imageSrc);
	generalActionsTree.render($('#generalActionsTree'));
	generalActionsTree.traverseBF(initializeNode);
	$('#generalActionsImage').attr('src',generalActions.imageSrc);
	swimmingTree.render($('#swimmingTree'));
	swimmingTree.traverseBF(initializeNode);
	$('#swimmingImage').attr('src',swimming.imageSrc);
	authorityTree.render($('#authorityTree'));
	authorityTree.traverseBF(initializeNode);
	$('#authorityImage').attr('src',authority.imageSrc);	
	horsebackRidingTree.render($('#horsebackRidingTree'));
	horsebackRidingTree.traverseBF(initializeNode);
	$('#horsebackRidingImage').attr('src',horsebackRiding.imageSrc);
	pietyTree.render($('#pietyTree'));
	pietyTree.traverseBF(initializeNode);
	$('#pietyImage').attr('src',piety.imageSrc);
	mentoringTree.render($('#mentoringTree'));
	mentoringTree.traverseBF(initializeNode);
	$('#mentoringImage').attr('src',mentoring.imageSrc);
	artsTree.render($('#artsTree'));
	artsTree.traverseBF(initializeNode);
	$('#artsImage').attr('src',arts.imageSrc);
}

function handlePopup(errText){
	$('#errorTxt').html(errText);
	
	$('.popup').fadeIn(350);

	//e.preventDefault();
}
  
function inputChange(skillName, value){
	//pull the skill
	var skillData = eval(skillName);
	var currentTree = eval(skillData.treeName);

	//find the node in the tree set global Current Node to that node's value.			
	currentTree.traverseBF(function returnChild(node){
								if(node.data.idName == skillName){
									currentNode = node;
								}
							});
	value = parseInt(checkParent(skillName,value));
	value = parseInt(checkChild(skillName,value));
	
	
	//check that the tree can handle that many points.
	var treeCap = parseInt($('#'+currentNode.data.skillType+'Cap').html());
	var curTotal = 0;
	$('.'+currentNode.data.skillType).each(function(){
		if(this.id != skillName){
			curTotal += parseInt($('#'+this.id)[0].value);
		}
	});
	
	if(curTotal + parseInt(value) > treeCap){
		value = treeCap - curTotal;
		curTotal = treeCap;
		$('#'+skillName)[0].value = value;
		handlePopup(popupMessages.SkillCap);
	}else{
		curTotal = curTotal + parseInt(value);
	}
	
	manageSummaryTable(currentNode,value);
	
	currentNode.data.value = value;
	$('#'+currentNode.data.skillType+'Points').html(curTotal);
}

function checkParent(skillName, value){//Logic for changing and validing the value.						
	if(currentNode.parent == null){
		//check that value is within sanity
		if(value > 100){ 
			$('#'+skillName)[0].value = 100;
			value=100;
			
			handlePopup(popupMessages.SkillHighest);
		}
		if(value < 0){
			$('#'+skillName)[0].value = 0;
			value=0;
			handlePopup(popupMessages.SkillLowest);
		}
		
		//check if value exceeded 30 and enable child nodes if so
		if(value >= 30){
			$.each(currentNode.children, function(key, val) {			
			   $('#'+val.data.idName+'Image').attr('src',val.data.imageSrc);
			});
		}else{
			$.each(currentNode.children, function(key, val) {			
			   $('#'+val.data.idName+'Image').attr('src',val.data.disabledImageSrc);
			});
		}
	}else{
		//get parent value
		var parentSkillValue = $('#' + currentNode.parent.data.idName)[0].value;
		if(parentSkillValue < 30){
			$('#'+skillName)[0].value = 0;
			value=0;
			handlePopup(popupMessages.UnlockParent30 + currentNode.parent.data.displayName);
		}else{
			if(parentSkillValue >= 30 && parentSkillValue < 60){
				if(value > 29){
					$('#'+skillName)[0].value = 29;
					value=29;
					handlePopup(popupMessages.UnlockParent60 + currentNode.parent.data.displayName);
				}
			}else{
				if(value > 100){ 
					$('#'+skillName)[0].value = 100;
					value=100;
					handlePopup(popupMessages.SkillHighest);
				}
				if(value < 0){
					$('#'+skillName)[0].value = 0;
					value=0;
					handlePopup(popupMessages.SkillLowest);
				}
				
				if(value >= 30){
					$.each(currentNode.children, function(key, val) {			
					   $('#'+val.data.idName+'Image').attr('src',val.data.imageSrc);
					});
				}else{
					$.each(currentNode.children, function(key, val) {			
					   $('#'+val.data.idName+'Image').attr('src',val.data.disabledImageSrc);
					});
				}
			}
		}
	}
	
	return value;
}

function checkChild(skillName,value){
	//if the value drops below 60 any child nodes can't have points above 29. If such children exist, the value won't be able to decrease past 60
	if(value < 60){
		$.each(currentNode.children, function(key, val) {			
			var childValue = parseInt($('#'+val.data.idName)[0].value);
			if(childValue > 29){
				$('#'+skillName)[0].value = 60;
				value=60;
				handlePopup('You cannot decrease this skill until you have less than 29 points in ' + currentNode.child.displayName);
			}
		});
	}
	
	//same thing. Values below 30 mean 0 points can be invested in child nodes. If any points are invested value is locked to 30
	if(value < 30){
		$.each(currentNode.children, function(key, val) {			
			var childValue = parseInt($('#'+val.data.idName)[0].value);
			if(childValue > 0){
				$('#'+skillName)[0].value = 30;
				value=30;
				
				handlePopup('You cannot decrease this skill until you have 0 points in ' + currentNode.data.displayName);
			}
		});
	}
	
	return value;
}

function modifyStr(value){
	var currentTotal = parseInt($('#constitution').val()) + parseInt($('#agility').val()) + parseInt($('#intelligence').val()) + parseInt($('#willpower').val())
	
	if(currentTotal + parseInt(value) > 150){
		value = 150 - currentTotal;
		currentTotal = 150;
		
		handlePopup(popupMessages.StatCapStr);
	}else{
		if(parseInt(value) > 110){
			value = 110;
			$('#strength').val(110);
				
			handlePopup(popupMessages.StatMax);
		}else{
			if(parseInt(value) < 10){
				value = 10;
				$('#strength').val(10);
				
				handlePopup(popupMessages.StatMin);
			}
		}
		currentTotal += parseInt(value);
	}
	
	$('#strength').val(value.toString());
	$('#AttrPoints').html(currentTotal.toString());
	
}

function modifyAgi(value){
	var currentTotal = parseInt($('#constitution').val()) + parseInt($('#strength').val()) + parseInt($('#intelligence').val()) + parseInt($('#willpower').val())
	
	if(currentTotal + parseInt(value) > 150){
		value = 150 - currentTotal;
		currentTotal = 150;
		
		handlePopup(popupMessages.StatCapAgi);
	}else{
		if(parseInt(value) > 110){
			value = 110;
			$('#agility').val(110);
				
			handlePopup(popupMessages.StatMax);
		}else{
			if(parseInt(value) < 10){
				value = 10;
				$('#agility').val(10);
				
				handlePopup(popupMessages.StatMin);
			}
		}
		currentTotal += parseInt(value);
	}
	
	$('#agility').val(value.toString());
	$('#AttrPoints').html(currentTotal.toString());
}

function modifyCon(value){
	var currentTotal = parseInt($('#agility').val()) + parseInt($('#strength').val()) + parseInt($('#intelligence').val()) + parseInt($('#willpower').val())
	
	if(currentTotal + parseInt(value) > 150){
		value = 150 - currentTotal;
		currentTotal = 150;
		
		handlePopup(popupMessages.StatCapConst);
	}else{
		if(parseInt(value) > 110){
			value = 110;
			$('#constitution').val(110);
				
			handlePopup(popupMessages.StatMax);
		}else{
			if(parseInt(value) < 10){
				value = 10;
				$('#constitution').val(10);
				
				handlePopup(popupMessages.StatMin);
			}
		}
		currentTotal += parseInt(value);
	}
	
	$('#constitution').val(value.toString());
	$('#AttrPoints').html(currentTotal.toString());


	var statCap = 100 + parseInt(value)-10;
	$('#HP').html(statCap.toString());
}

function modifyInt(value){
	var currentTotal = parseInt($('#constitution').val()) + parseInt($('#strength').val()) + parseInt($('#agility').val()) + parseInt($('#willpower').val())
	
	if(currentTotal + parseInt(value) > 150){
		value = 150 - currentTotal;
		currentTotal = 150;
		
		handlePopup(popupMessages.StatCapInt);
	}else{
		if(parseInt(value) > 110){
			value = 110;
			$('#intelligence').val(110);
				
			handlePopup(popupMessages.StatMax);
		}else{
			if(parseInt(value) < 10){
				value = 10;
				$('#intelligence').val(10);
				
				handlePopup(popupMessages.StatMin);
			}
		}
		currentTotal += parseInt(value);
	}
	
	$('#intelligence').val(value.toString());
	$('#AttrPoints').html(currentTotal.toString());

	modifyCaps();
}

function modifyWill(value){
	var currentTotal = parseInt($('#constitution').val()) + parseInt($('#strength').val()) + parseInt($('#intelligence').val()) + parseInt($('#agility').val())
	
	if(currentTotal + parseInt(value) > 150){
		value = 150 - currentTotal;
		currentTotal = 150;
		handlePopup(popupMessages.StatCapWill);
	}else{
		if(parseInt(value) > 110){
			value = 110;
			$('#willpower').val(110);
				
			handlePopup(popupMessages.StatMax);
		}else{
			if(parseInt(value) < 10){
				value = 10;
				$('#willpower').val(10);
				
				handlePopup(popupMessages.StatMin);
			}
		}
		currentTotal += parseInt(value);
	}
	
	$('#willpower').val(value.toString());
	$('#AttrPoints').html(currentTotal.toString());

	var statCap = 100 + parseInt(value)-10;
	$('#Stam').html(statCap.toString());
	
	statCap = 100 + parseInt(value)*2;
	var overload = statCap * 2;
	$('#CarryWeight').html(statCap.toString()+"/"+overload.toString());
}

function modifyCaps(){
	var statCap = parseInt($('#statCap').val());
	if($('#twoforone').is(':checked')){
		statCap += (parseInt($('#intelligence').val())-10)*2;
	}else{
		statCap += (parseInt($('#intelligence').val())-10); 
	}	
	
	$('#MinorCap').html(statCap.toString());
	$('#CombatCap').html(statCap.toString());
	$('#CraftingCap').html(statCap.toString());
}

function summaryAddRow(skillName, skillLevel, skillText){
	var skillSort = 100;
	
	switch(skillLevel){
		case "All":
			skillSort = 0;
			break;
		case "0":
			skillSort = 1;
			break;
		case "30":
			skillSort = 2;
			break;
		case "60":
			skillSort = 3;
			break;
		case "90":
			skillSort = 4;
			break;
		case "100":
			skillSort = 5;
			break;
	}

	$('#summaryTable').append("<tr id='" + skillName + skillSort.toString() + "'><td valign='top' style='text-align:center'><b><a href='https://lifeisfeudal.gamepedia.com/"+skillName+"' target='_blank'>"+skillName+"</a></b></td><td  valign='top' style='text-align:center'>"+skillLevel.toString()+"</td><td>" + skillText + "</td></tr>");
}<!--This previous line is the summary table generation -->

function summaryRemoveRow(skillName, skillLevel, skillText){
	switch(skillLevel){
		case "All":
			skillSort = 0;
			break;
		case "0":
			skillSort = 1;
			break;
		case "30":
			skillSort = 2;
			break;
		case "60":
			skillSort = 3;
			break;
		case "90":
			skillSort = 4;
			break;
		case "100":
			skillSort = 5;
			break;
	}
	$('#' + skillName + skillSort.toString()).remove();
}

function manageSummaryTable(node, value){
	if(node.parent == null && value == null){
		//initializing a root of a tree
		if(node.data.allText != "") summaryAddRow(node.data.displayName,HardTextVals.AllText,node.data.allText);
		if(node.data.zeroText != "") summaryAddRow(node.data.displayName,"0",node.data.zeroText);
	}else{

		var direction = node.data.value - parseInt(value)
		
		if(direction > 0){
			//value is decreasing
			if(node.data.value >= 30 && parseInt(value) < 30){
				//remove Thirty data
				if(node.data.thirtyText != "") summaryRemoveRow(node.data.displayName,"30",node.data.thirtyText);
				
				//remove child node "All" and "Zero" data
				$.each(node.children, function(key, val) {			
					if(val.data.allText != "") summaryRemoveRow(val.data.displayName,HardTextVals.AllText,val.data.allText);
					if(val.data.zeroText != "") summaryRemoveRow(val.data.displayName,"0",val.data.zeroText);
				});
			}
			
			if(node.data.value >= 60 && parseInt(value) < 60){
				//remove 60 Data
				if(node.data.sixtyText != "") summaryRemoveRow(node.data.displayName,"60",node.data.sixtyText);
				
			}
			
			if(node.data.value >= 90 && parseInt(value) < 90){
				//remove 90 Data
				if(node.data.ninetyText != "") summaryRemoveRow(node.data.displayName,"90",node.data.ninetyText);
			}
			
			if(node.data.value >= 100 && parseInt(value) < 100){
				//remove 100 Data
				if(node.data.hundredText != "") summaryRemoveRow(node.data.displayName,"100",node.data.hundredText);
			}
			
		}else{
			//value is increasing
			if(node.data.value < 30 && parseInt(value) >= 30){
				//add Thirty data
				if(node.data.thirtyText != "") summaryAddRow(node.data.displayName,"30",node.data.thirtyText);
				
				//add child node "All" and "Zero" data
				$.each(node.children, function(key, val) {			
					if(val.data.allText != "") summaryAddRow(val.data.displayName,HardTextVals.AllText,val.data.allText);
					if(val.data.zeroText != "") summaryAddRow(val.data.displayName,"0",val.data.zeroText);
				});
			}
			
			if(node.data.value < 60 && parseInt(value) >= 60){
				//add 60 Data
				if(node.data.sixtyText != "") summaryAddRow(node.data.displayName,"60",node.data.sixtyText);
			}
			
			if(node.data.value < 90 && parseInt(value) >= 90){
				//add 90 Data
				if(node.data.ninetyText != "") summaryAddRow(node.data.displayName,"90",node.data.ninetyText);
				
			}
			
			if(node.data.value < 100 && parseInt(value) >= 100){
				//add 100 Data
				if(node.data.hundredText != "") summaryAddRow(node.data.displayName,"100",node.data.hundredText);
			}
		}
	}
	sortTable(f_rid);
}

function sortTable(f){
	var rows = $('#summaryTable tbody  tr').get();

	rows.sort(function(a, b) {
		var A = getVal(a);
		var B = getVal(b);
		
		
		if(A < B) {
			return -1*f;
		}
		if(A > B) {
			return 1*f;
		}
		return 0;
	});

	function getVal(elm){
		var v = elm.id;
		return v;
	}

	$.each(rows, function(index, row) {
		$('#summaryTable').children('tbody').append(row);
	});
}

function saveString(){
	var jsonData = {};
	$("input").each(function() {
					   if($(this).val() > 0){
						  jsonData[this.id] = $(this).val();
					   }
					});
	var saveStr = JSON.stringify(jsonData);
	saveStr = btoa(saveStr);
	$('#saveString').val(saveStr);
}

function loadString(){
	var loadStr = $('#saveString').val();
	loadStr = atob(loadStr);
	var jsonData = JSON.parse(loadStr);
	
	$.each(jsonData, function(i, item) {
		if(eval(i).displayName != null){
			$('#' + i).val(item);
			inputChange(i,item);
		}else{
			switch(i){
				case "statCap":
					$('#statCap').val(item);
					modifyCaps();
					break;
				case "strength":
					$('#strength').val(item);
					modifyStr(item);
					break;
				case "agility":
					$('#agility').val(item);
					modifyAgi(item);
					break;
				case "intelligence":
					$('#intelligence').val(item);
					modifyInt(item);
					break;
				case "constitution":
					$('#constitution').val(item);
					modifyCon(item);
					break;
				case "willpower":
					$('#willpower').val(item);
					modifyWill(item);
					break;
			}
		}
	});
}

//for pulling the language
function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}


function changeLang(lang){
	$.getScript( "lang/" + lang +".js")
		.done(function(){
			artisanTree.traverseBF(repaintTreeText_callback);
			naturesLoreTree.traverseBF(repaintTreeText_callback);
			huntingTree.traverseBF(repaintTreeText_callback);
			cavalryTree.traverseBF(repaintTreeText_callback);
			militiaTree.traverseBF(repaintTreeText_callback);
			footmanTree.traverseBF(repaintTreeText_callback);
			slingerTree.traverseBF(repaintTreeText_callback);
			assaulterTree.traverseBF(repaintTreeText_callback);
			equipmentMaintainTree.traverseBF(repaintTreeText_callback);
			battleSurvivalTree.traverseBF(repaintTreeText_callback);
			demolitionTree.traverseBF(repaintTreeText_callback);
			movementTree.traverseBF(repaintTreeText_callback);
			swimmingTree.traverseBF(repaintTreeText_callback);
			generalActionsTree.traverseBF(repaintTreeText_callback);
			horsebackRidingTree.traverseBF(repaintTreeText_callback);
			authorityTree.traverseBF(repaintTreeText_callback);
			pietyTree.traverseBF(repaintTreeText_callback);
			mentoringTree.traverseBF(repaintTreeText_callback);
			artsTree.traverseBF(repaintTreeText_callback);
			
			$.each(HardTextVals, function(key,value){
				 $('#'+key).html(value);
			});
			
			
			
			$("#summaryTable").find("tr:gt(0)").remove();
			//This is the summary table that appears at the bottom of the page.
			manageSummaryTable(artisanTree._root);;
			manageSummaryTable(naturesLoreTree._root);;
			manageSummaryTable(huntingTree._root);
			manageSummaryTable(cavalryTree._root);
			manageSummaryTable(militiaTree._root);
			manageSummaryTable(footmanTree._root);
			manageSummaryTable(slingerTree._root);
			manageSummaryTable(assaulterTree._root);
			manageSummaryTable(demolitionTree._root);
			manageSummaryTable(equipmentMaintainTree._root);
			manageSummaryTable(battleSurvivalTree._root);
			manageSummaryTable(movementTree._root);
			manageSummaryTable(generalActionsTree._root);
			manageSummaryTable(swimmingTree._root);
			manageSummaryTable(authorityTree._root);
			manageSummaryTable(horsebackRidingTree._root);
			manageSummaryTable(pietyTree._root);
			manageSummaryTable(mentoringTree._root);
			manageSummaryTable(artsTree._root);
		});
}
