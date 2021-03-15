var checkForNewAddress = document.getElementById("otherAddress");
var newAddressDiv = document.getElementById("otherAddressDiv");

checkForNewAddress.addEventListener("change", toggleNewAddress);

function toggleNewAddress() {
  if (newAddressDiv.style.display == "block") {
    newAddressDiv.style.display = "none";
    return;
  } else {
    newAddressDiv.style.display = "block";
  }
}

let dualHose = document.getElementById("dualHose");
if (dualHose.innerHTML == "1") {
  dualHose.innerHTML = "Ναι";
} else {
  dualHose.innerHTML = "Όχι";
}

let quantity = document.getElementById("quantity");
if (quantity.innerHTML == "2" || quantity.innerHTML == "3") {
  quantity.innerHTML = "1";
} else {
  quantity.innerHTML = "2";
}

/* var order0 = document.getElementById("order0");
if (order0.innerHTML==""){
    order0.style.display="none"
} */
