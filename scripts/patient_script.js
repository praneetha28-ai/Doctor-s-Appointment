// document.getElementById("patientLogin").addEventListener('click',loginPatient);
function logoutUser()
{
    sessionStorage.removeItem("pat_login");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("phn_number");
    sessionStorage.removeItem("age");

    window.location.href = "./index.php";

}
function loginPatient()
{
    var patientNumber = document.getElementById("patientNumber").value;
    var patientPassword = document.getElementById("patientPassword").value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","../php_pages/doctors.php",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("patientLogin=true&patientNumber="+patientNumber+"&patientPassword="+patientPassword);
    xhttp.onreadystatechange = function()
    {
        if(this.readyState==4 && this.status==200)
            {
                console.log("hello");
                var data = this.responseText;
                // {id: '1', patient_name: 'praneetha', patient_number: '9573118693', patient_password: '$2y$10$9.E0WuQnUd1.yrEcSaKUM.SNRGu/AWyHKPU/Ar2POBcgE1EP2tMtS', patient_age: '22'}

                data = JSON.parse(data);
                console.log(data);
                if(data=="Invalid password")
                    {
                       
                    }
                else 
                { 
                    console.log("success");
                    sessionStorage.setItem('pat_login',true);
                    sessionStorage.setItem('name',data["patient_name"]);
                    sessionStorage.setItem('phn_number',data["patient_number"]);
                    sessionStorage.setItem('age',data['patient_age']);

                    console.log(sessionStorage.getItem('pat_login'));
                    console.log(sessionStorage.getItem('name'));
                    console.log(sessionStorage.getItem('phn_number'));
                    console.log(sessionStorage.getItem('age'));
                    window.location.href = "../index.php";
                    
                }
            }
    }
}

if(document.getElementById("patientApplications"))
    {
        var patientList = document.getElementById("patientApplicationList");
        
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST","./php_pages/doctors.php",true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("patientApplications=true&patientNumber="+sessionStorage.getItem("phn_number"));
        xhttp.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status==200)
                {
                    var data = this.responseText;
                    // console.log(data);
                    data = JSON.parse(data);
                    console.log(data);
                    for(var i = 0;i<data.length;i++)
                        {
                            console.log(data[0]);
                           
                            
                            var card = document.createElement("div");
                            card.classList.add("card");
                            card.style.backgroundColor = "rgb(233, 233, 233)";
                            card.style.margin = "15px";
                            var card_body = document.createElement("div");
                            card_body.classList.add("card-body");
                            // h4
                            var patientName = document.createElement("h4");
                            patientName.innerText = data[i][0]["patient_name"];
                            // div 
                            var div1 = document.createElement("div");
                            div1.style.display = "flex";
                            div1.style.justifyContent = "space-between";
                            div1.style.alignItems = "center";
                            // h5 
                            var doctorName = document.createElement("h5");
                            doctorName.innerText ="Dr. "+ data[i][0]["doctor_name"];
                            
                            var date = document.createElement("h5");
                            date.innerText = data[i][0]["date"]

                            var time = document.createElement("h5");
                            time.innerText = data[i][0]["slot"];
                            div1.appendChild(doctorName);
                            div1.appendChild(date);
                            div1.appendChild(time);

                            card_body.appendChild(patientName);
                            card_body.appendChild(div1);

                            var div2 = document.createElement("div");
                            div2.style.display = "flex";
                            div2.style.justifyContent = "space-evenly";

                            var edit = document.createElement("button")
                            edit.classList.add("btn");
                            edit.style.backgroundColor = "#1e128b"
                            edit.style.color = "white";
                            edit.innerText = "Edit";

                            var deleteOptn = document.createElement("button");
                            deleteOptn.classList.add("btn");
                            deleteOptn.innerText = "Delete"
                            deleteOptn.style.backgroundColor = "red";
                            deleteOptn.style.color = "white";
                            div2.appendChild(edit);
                            div2.appendChild(deleteOptn);

                            card_body.appendChild(div2);

                            card.appendChild(card_body);
                       

                            patientList.appendChild(card);
                        }
                }
        }
    }