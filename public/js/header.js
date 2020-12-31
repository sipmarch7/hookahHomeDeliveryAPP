var orderNavItem = document.getElementById("orderNavItem");
var orderAccountLink = document.getElementById("orderAccountLink");

document.addEventListener('DOMContentLoaded',orderPositionChange);
window.addEventListener('resize',orderPositionChange);

function orderPositionChange(){
    if (window.screen.width<=800){
        orderNavItem.style.display="list-item";
        orderAccountLink.parentElement.style.display="none";
    }else{
        orderNavItem.style.display="none";
        orderAccountLink.parentElement.style.display="block";
    }
    
}