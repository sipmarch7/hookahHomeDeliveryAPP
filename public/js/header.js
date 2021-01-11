var orderNavItem = document.getElementById("orderNavItem");
var orderAccountLink = document.getElementById("orderAccountLink");
var accountToggle = document.getElementById("accountToggle");

document.addEventListener('DOMContentLoaded',orderPositionChange);
window.addEventListener('resize',orderPositionChange);

function orderPositionChange(){
    if (window.screen.width<=800){
        orderNavItem.style.display="list-item";
        orderAccountLink.parentElement.style.display="none";
        accountToggle.querySelector('span').style.display="none"
        accountToggle.querySelector('img').style.display="inline"
    }else{
        orderNavItem.style.display="none";
        orderAccountLink.parentElement.style.display="block";
        accountToggle.querySelector('span').style.display="inline"
        accountToggle.querySelector('img').style.display="none"
    }
    
}
