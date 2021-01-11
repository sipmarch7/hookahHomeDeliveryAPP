document.addEventListener('DOMContentLoaded',showError);

function showError(){
    try{
        var date = document.getElementById("birthdaySpan")
        if (!(date==null)){ date.innerHTML = date.innerHTML.slice(4,15) }
        var err = document.getElementById("error");
        if (err.childNodes[0].innerHTML == "tk"){
            err.childNodes[0].innerHTML = "Τα στοιχεία "+
            "που δηλώσατε δεν ανήκουν στην περιοχή που καλύπτουμε.\n"+
            " Λυπούμαστε για αυτό. Θα χαρούμε να σας εξυπηρετήσουμε μελλοντικά."
        }else if (err.childNodes[0].innerHTML == "empty"){
            err.childNodes[0].innerHTML = "Δεν έχετε συμπληρώσει "+
            "όλα τα πεδία της φόρμας. Παρακαλώ ξαναπροσπαθήστε."
        }else if (err.childNodes[0].innerHTML == "tel"){
            err.childNodes[0].innerHTML = "Δεν έχετε συμπληρώσει "+
            "σωστά το τηλέφωνο επικοινωνίας. Χωρίς κενά. Χωρίς αριθμό Χώρας"
        }else if (err.childNodes[0].innerHTML == "user"){
            err.childNodes[0].innerHTML = "O χρήστης υπάρχει ήδη. "+
            "Μπορείτε να συνδεθείτε με το email και το τηλέφωνο που είχατε δηλώσει."
        }else if (err.childNodes[0].innerHTML == "success"){
            err.childNodes[0].innerHTML = "Αλλάξατε επιτυχώς τα στοιχεία σας"
            err.childNodes[0].style.color = "green"
        }
        err.style.display="block"
    }catch{
        console.log("ENJOY... FACKING ERROR ;*")
    }
}