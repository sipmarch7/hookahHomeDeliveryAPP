

var checkForNewAddress = document.getElementById("otherAddress")
var newAddressDiv = document.getElementById("otherAddressDiv")

checkForNewAddress.addEventListener("change", toggleNewAddress)

function toggleNewAddress(){
    if (newAddressDiv.style.display=="block"){
        newAddressDiv.style.display="none"
        return
    }else{
        newAddressDiv.style.display="block"
    }
}