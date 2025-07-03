// This is main type of object. It will be used to create UrgentImportantTasks, they will be added to one of 4 arrays basing on urgency-importance values
class TheTask {
  constructor(text, dueDate, urgent, importnt) {
    this.text = text;
    this.dueDate = new Date(dueDate);
    this.urgent = urgent;
    this.importnt = importnt;  
  } 
}

// Change the date format for task due date, so that it can be used in the code for comparing with current date
document.querySelector("#task_due_date").value = new Date().toISOString().substring(0, 10);

// This function just calculates the value to be shown next to the task
function daysTillEnd (dueDate) {
  var Today = new Date().getTime();
  var DueDateSubstr = new Date(dueDate).getTime();
  daysleft = DueDateSubstr-Today;
  let Difference_In_Days =
    Math.ceil
        (daysleft / (1000 * 3600 * 24));
  let DueDaysStatus = "";        
  (Difference_In_Days == 0) ? DueDaysStatus = "for today" 
  : (Difference_In_Days == 1) ? DueDaysStatus = "for tomorrow"
  : (Difference_In_Days < 0) ? DueDaysStatus = Difference_In_Days*(-1) + " days ago"    
  : DueDaysStatus = "do in "+ Difference_In_Days + " days"; 
  return DueDaysStatus;
}

// Here is initial declaration of 4 arrays for Tasks
var UrgentImportantTasks = [];
var NotUrgentImportantTasks = [];
var UrgentNotImportantTasks = [];
var NotUrgentNotImportantTasks = [];

// These lists will be used later for loops through 4 arrays declared above
var OverallArray = [UrgentImportantTasks, NotUrgentImportantTasks, UrgentNotImportantTasks, NotUrgentNotImportantTasks];
var OverallListofIDs = ["UrgentImportant", "NotUrgentImportant", "UrgentNotImportant", "NotUrgentNotImportant"];

document.addEventListener('DOMContentLoaded', function() {
loadNotes();
pageRefresh ("Normal_Mode");
})

// This function adds new task object to the corresponding array and refreshes the page
function addContent () {
//	event.preventDefault();
    var text_element = document.querySelector("#task_text");
    var text = text_element.value;
    var due_date_element = document.querySelector("#task_due_date");
    var due_date = new Date(due_date_element.value);
    var urgent_element = document.querySelector("#checkbox_Urgent");
    var important_element = document.querySelector("#checkbox_Important");
    var urgent = urgent_element.checked;
    var importnt = important_element.checked;
    var incomingData = new TheTask(text, due_date, urgent, importnt); 
let variant = urgent +"+"+ importnt;
switch (variant) {
  case "true+true" : UrgentImportantTasks.push(incomingData); break;
  case "false+true" : NotUrgentImportantTasks.push(incomingData); break;
  case "true+false" : UrgentNotImportantTasks.push(incomingData); break;
  case "false+false" : NotUrgentNotImportantTasks.push(incomingData); break;
}
saveNotes();
pageRefresh ("Normal_Mode");

}

function saveNotes() {
//	localStorage.clear();
    localStorage.setItem('UrgentImportantTasks', JSON.stringify(UrgentImportantTasks));
    localStorage.setItem('NotUrgentImportantTasks', JSON.stringify(NotUrgentImportantTasks));
    localStorage.setItem('UrgentNotImportantTasks', JSON.stringify(UrgentNotImportantTasks));
    localStorage.setItem('NotUrgentNotImportantTasks', JSON.stringify(NotUrgentNotImportantTasks));
}

function loadNotes() {
    const UI_Tasks = localStorage.getItem('UrgentImportantTasks');
    const NUI_Tasks = localStorage.getItem('NotUrgentImportantTasks');
    const UNI_Tasks = localStorage.getItem('UrgentNotImportantTasks');
    const NUNI_Tasks = localStorage.getItem('NotUrgentNotImportantTasks');
    UrgentImportantTasks = UI_Tasks ? JSON.parse(UI_Tasks) : []
    NotUrgentImportantTasks = NUI_Tasks ? JSON.parse(NUI_Tasks) : []
    UrgentNotImportantTasks = UNI_Tasks ? JSON.parse(UNI_Tasks) : []
    NotUrgentNotImportantTasks = NUNI_Tasks ? JSON.parse(NUNI_Tasks) : []
    OverallArray = [UrgentImportantTasks, NotUrgentImportantTasks, UrgentNotImportantTasks, NotUrgentNotImportantTasks];
}

// Page refresh with the actual data from arrays. Also adds "delete" button which is not visible by default
function pageRefresh (Mode) {

if(OverallArray.length !== 0) {

	for (var i=0; i < 4; i++) {                                          // loop through 4 arrays of tasks
	document.querySelector(`#${OverallListofIDs[i]} ul`).innerHTML="";  // delete the content of the box
	var numInList = -1;
	for (const item of OverallArray[i]) {                               // fill box with tasks from corresponding array
	numInList++;
	  let HightlightColor = "black";
	  if (Mode !== "Normal_Mode" ) {daysTillEnd(item["dueDate"]) == "for today" ? HightlightColor = "firebrick" : HightlightColor = "black"; }
	  let added_content = document.createElement("li");
	  added_content.innerHTML = `<div>${item["text"]}</div><div>
	  <span style="font-weight:normal">${daysTillEnd(item["dueDate"])}</span></div><button class="hide" id="${OverallListofIDs[i]}${numInList}">[X]</button>`;
	  added_content.style.color = HightlightColor;
	  document.querySelector(`#${OverallListofIDs[i]} ul`).append(added_content);
	  }
	}
	
const Items = document.querySelectorAll('li button')

	Items.forEach((item) => {
	  item.addEventListener("click", () => { 
		const LiItem = item.getAttribute("id");
		const NeededArrayId = LiItem.slice(0,(LiItem.length - 1));   
		const NeededArrayName = NeededArrayId + "Tasks";
		const NeededItemPosition = LiItem.slice(-1);
		const arr = window[NeededArrayName];
		window[NeededArrayName].splice(NeededItemPosition,1);
    saveNotes();
		pageRefresh ("Normal_Mode");
			});
		}
	);

}
};

// Shows and hides fields for new task
function showInputForm () {
  var toggleBlock = document.querySelector(".inputForm");
  toggleBlock.classList.toggle("hide");
}  

// Highlights tasks due today when hovering over the corresponding button
function hightlightTodayTasks () {
  document.querySelector("button[onmouseenter]").style.color = "firebrick";
  document.querySelector("button[onmouseenter]").style.fontWeight="bold";
  pageRefresh ("Highlight_Mode");
  }

// Resets formatting after today's tasks were highlighted
function dehightlightTodayTasks () {
  document.querySelector("button[onmouseenter]").style.color = "black";
  document.querySelector("button[onmouseenter]").style.fontWeight="normal";  
  pageRefresh ("Normal_Mode");
    }  

// Sorts task objects within each of 4 arrays and refreshes the page    
function Sort(ArrayName) {
OverallArray.forEach ((array) => array.sort((a, b) => a.dueDate - b.dueDate));
pageRefresh ("Normal_Mode");
}

// Shows delete buttons for each Task
function DeleteTask() {
  const Items = document.querySelectorAll('li button');
Items.forEach((item) => {
  item.classList.toggle("hide");
})
}

