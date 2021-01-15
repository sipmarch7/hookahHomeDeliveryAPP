document.addEventListener('DOMContentLoaded',showError);

function showError(){
    showCity()
    try{
        var err = document.getElementById("error");
        if (err.childNodes[0].innerHTML == "success"){
            err.childNodes[0].innerHTML = "Αλλάξατε επιτυχώς τα στοιχεία σας"
            err.childNodes[0].style.color = "green"
        }
        err.style.display="block"
    }catch{
        console.log("ENJOY...  ;*")
    }
}

function showCity(){
    var cities = document.querySelectorAll("option")
    var cityHidden = document.getElementById("cityHidden")
    for (option in cities){
        if (cities[option].innerHTML==cityHidden.value){
            cities[option].selected=true;
        }
    }
}

