var orderNavItem = document.getElementById("orderNavItem");
var orderAccountLink = document.getElementById("orderAccountLink");

document.addEventListener('DOMContentLoaded',orderPositionChange);
window.addEventListener('resize',orderPositionChange);

function orderPositionChange(){
    if (window.screen.width<=800){
        orderNavItem.style.display="list-item";
        orderAccountLink.innerHTML="";
        orderAccountLink.parentElement.style.lineHeight="60px";
    }else{
        orderNavItem.style.display="none";
        orderAccountLink.innerHTML="Παράγγειλε τώρα";
        orderAccountLink.parentElement.style.lineHeight="unset"
    }
    
}