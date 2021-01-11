$("#slideshow > div:gt(0)").hide();

setInterval(function() {
  $('#slideshow > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
}, 3000);

let durationSelection = document.querySelectorAll(".durationSelection");
let flavor3 = document.getElementById("flavor3div");
let flavor4 = document.getElementById("flavor4div");
var price = document.getElementById("price");

durationSelection.forEach(item=>{
  item.addEventListener('change',event=>{
    var priceCheck = event.target;
    var duration = event.target.value;
    console.log(typeof(duration))
    if (duration === "4"){
      flavor3.style.display = "none"
      flavor4.style.display = "none"
      flavor3.children[1].value = ""
      flavor4.children[1].value = ""
      price.innerHTML=priceCheck.parentNode.children[1].innerText.slice(-5)
      return
    }
    if (duration === "6"){
      flavor3.style.display = "block"
      flavor4.style.display = "none"
      flavor4.children[1].value = ""
      price.innerHTML=priceCheck.parentNode.children[1].innerText.slice(-5)
      return
    }
    flavor3.style.display = "block"
    flavor4.style.display = "block"
    price.innerHTML=priceCheck.parentNode.children[1].innerText.slice(-5)
  })
});

let daySelection = document.querySelectorAll(".daySelection");
let otherDay = document.getElementById("other-day");

daySelection.forEach(item=>{
  item.addEventListener('change',event=>{
    var day = event.target.value;
    if (day == "today"){
      otherDay.style.display="none"
      otherDay.children[1].value=findDateToday();
      return
    }
    otherDay.style.display="block"
  })
});

findDateToday();

function findDateToday(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  } 
  if(mm<10){
    mm='0'+mm
  } 
  today = yyyy+'-'+mm+'-'+dd;
  document.getElementById("datefield").setAttribute("min", today);
  return today
}



