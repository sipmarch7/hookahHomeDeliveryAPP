let status = document.querySelectorAll(".status");

for ( i in status ){
    if (status[i].innerHTML=="canceled"){status[i].style.color='red'}
    if (status[i].innerHTML=="pending"){status[i].style.color='blue'}
    if (status[i].innerHTML=="accepted"){status[i].style.color='green'}
    if (status[i].innerHTML=="completed"){status[i].style.color='orange'}
    if (status[i].innerHTML=="delivered"){status[i].style.color='yellow'}
}

document.addEventListener('DOMContentLoaded',putNumbersInOrders);

function putNumbersInOrders(){
    var orders = document.querySelectorAll(".numberOfOrder")
    for (i in orders){
        orders[i].innerHTML=orders.length-i
    }
}