//======TODO=================
// Convert Map[string,HtmlNode] to Map[String,String] to LS store only
// the item name instead of whole element.
//======Logging=================
var log = (t, v) => {
  var value = " ";
  value = JSON.stringify(v, undefined, 4);
  if (v != null) console.log(t + ": " + value);
  else console.log(t);
};

let xmlSerializer = new XMLSerializer();
let str_key = "listData";

//==========loadListFromLocalStorage==============
async function loadListFromLocalStorage() {
  var mapStringFromLS = localStorage.getItem(str_key);
  if (mapStringFromLS != null) {
    document.getElementById("list").parentElement.innerHTML =
      atob(mapStringFromLS);
    // refreshList();
  }
}
loadListFromLocalStorage();

//===============DOMContentLoaded======================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Completed loading page..........");
  //==========load bkcolor from localstorage and set bkgroundcolor property
  const bkcolor = localStorage.getItem("bkcolor");
  // root.style.getPropertyValue("--bk-color")
  if (bkcolor) {
    document.documentElement.style.setProperty("--bk-color", bkcolor);
    document.getElementById("bkcolor").value=bkcolor;
  }

  Array.prototype.forEach.call(
    document.getElementsByClassName("remove-item"),
    (element) => {
      element.addEventListener("click", removeItemFromList);
    }
  );
});
//======Add item to list=================
var addItemToList = () => {
  var newitem = document.getElementById("newitem");
  newitem.select();
  var inputtxt = document.createElement("input");
  inputtxt.setAttribute("type", "text");
  inputtxt.setAttribute("id", "item2");
  inputtxt.setAttribute("value", newitem.value);
  inputtxt.setAttribute("class", "list-item");
  inputtxt.setAttribute("name", "items");
  inputtxt.readOnly = true;

  const idkey = "remove-item" + Math.round(Math.random() * 10000000);
  var btn = document.createElement("button");
  btn.setAttribute("id", idkey);
  btn.setAttribute("type", "submit");
  btn.setAttribute("class", "remove-item buttonglass");
  // btn.setAttribute("value", "-");
  btn.innerHTML = "-";
  btn.addEventListener("click", removeItemFromList);

  var div = document.createElement("div");
  div.setAttribute("class", "item-grp");
  div.appendChild(inputtxt);
  div.appendChild(btn);

  //==============================
  document.getElementById("list").appendChild(div);
  // ------save List state to LS-----
  saveListToLocalStorage();
};
//======Add item to list on Enter key press=================
var addItemToListViaEnter = (event) => {
  if (event.isComposing || event.keyCode === 13) {
    addItemToList();
  }
};

//======Remove item from list=================
var removeItemFromList = (event) => {
  const idkey = event.target.id;
  // log("Removing item: ", idkey);
  const elem = document.getElementById(idkey).parentElement;
  if (elem != null) {
    elem.remove();
  }
  saveListToLocalStorage();
};

function saveListToLocalStorage() {
  const list = document.getElementById("list");
  var encodedElem = btoa(xmlSerializer.serializeToString(list));
  localStorage.setItem(str_key, encodedElem);
}

function getItemsListFromUI() {
  let s = "Grocery-List\n======================";
  let list = document.getElementsByTagName("input");
  if (list.length > 0)
    for (let index = 1; index < list.length; index++) {
      const element = list[index];
      s = s + "\n" + element.value;
    }
  // alert(s);
  return s;
  // return "Apples";
}

//======Send List to Whatsapp=================

function sendToWhatsapp() {
  const listitems = getItemsListFromUI();
  var msg = encodeURI(listitems);
  // alert("MSg: " + msg);
  const list = document.getElementById("whatsapp-link");
  const phoneno = document.getElementById("phoneno");
  list.href = list.href + phoneno.value + "&text=" + msg;
  // alert(list.href + "apples%0Acarrots%0Abanaga%0Adararg111");
}

//======Events Listeners=================
document
  .getElementById("add-item-button")
  .addEventListener("click", addItemToList);

document
  .getElementById("newitem")
  .addEventListener("keyup", addItemToListViaEnter);

document
  .getElementById("whatsapp-button")
  .addEventListener("click", sendToWhatsapp);
let root = document.documentElement;
document.getElementById("bkcolor").addEventListener(
  "input",
  (e) => {
    // console.log("s==>" + e.target.value);
    // console.log("c==>" + root.style.getPropertyValue("--bk-color"));
    document.documentElement.style.setProperty("--bk-color", e.target.value);
    localStorage.setItem("bkcolor", e.target.value);
  },
  false
);
