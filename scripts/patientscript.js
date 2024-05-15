// document.getElementById("patientLogin").addEventListener('click',loginPatient);
var finalSlotsList = [];
var optionsHtml = "<option value='no'>Please choose a date</option>";
var chosenDate;
var chosenSlot;
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
var parseIn = function (date_time) 
{
    console.log(date_time);
    var d = new Date();
    d.setHours(date_time.substring(11, 13));
    d.setMinutes(date_time.substring(14, 16));
    return d;
  };
var getTimeIntervals = function (time1, time2) 
{
  var arr = [];
  while (time1 < time2) 
    {
    arr.push(time1.toTimeString().substring(0, 5));
    time1.setMinutes(time1.getMinutes() + 15);
  }
  return arr;
};
function updateTimeAndDate(app_id,chosenDate,chosenSlot)
{
    console.log(chosenDate);
    if(chosenSlot && chosenDate)
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST","./php_pages/doctors.php",true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("updatePatApt=true&app_id="+app_id+"&newDate="+chosenDate+"&newslot="+chosenSlot);
            xhttp.onreadystatechange=function()
            {
                if(this.readyState==4 && this.status==200)
                    {
                        var data = this.responseText;
                        console.log(data);
                        Swal.fire("Appointment updated","","success").then((result)=>
                            {
                                if(result.isConfirmed)
                                    {
                                        location.reload();
                                    }
                                    else 
                                    {
                                        location.reload();
                                    }
                        });
                    }
            }
        }
        else 
        {
            Swal.fire("Could not update the appointment","","info");
        }
    
}
function getAvailableSlots(doctorID,date) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./php_pages/doctors.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("doctorID=" + doctorID+"&date="+date);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = xhttp.responseText;
        console.log(data);
        if(data!=0)
          {
              data = JSON.parse(data);
              console.log(data);
          
        var availability = data["available"];
        var booked = data["booked"];
        var date = document.createElement("h4");
  
        date.innerText = availability[0]["date"];
        var availableStartTime = availability[0]["available_time"].split("-")[0];
        var availableEndTime = availability[0]["available_time"].split("-")[1];
        var breakStartTime = availability[0]["break_time"].split("-")[0];
        
        var breakEndTime = availability[0]["break_time"].split("-")[1];
        var startTime = parseIn(availability[0]["date"] + " " + availableStartTime);
        var endTime = parseIn(availability[0]["date"] + " " + availableEndTime);
        var breakStime = parseIn(availability[0]["date"] + " " + breakStartTime);
        var breakEtime = parseIn(availability[0]["date"] + " " + breakEndTime);
        var intervals = getTimeIntervals(startTime, endTime);
        console.log(intervals);
        var breakTime = getTimeIntervals(breakStime, breakEtime);
        
        for(var i = 0;i<booked.length;i++)
          {
              breakTime.push(booked[i]["slot"]);
          }
          console.log(breakTime);
        var finalAvailableSlots = [];
        for (var i = 0; i < intervals.length; i++) 
          {
          if (!(breakTime.indexOf(intervals[i]) > 0)) {
            finalAvailableSlots.push(intervals[i]);
          }
        }
        finalSlotsList = finalAvailableSlots;
        console.log(finalAvailableSlots);
        optionsHtml = finalAvailableSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
        const alertTimeElement = document.getElementById("alert_time");
                if (alertTimeElement) {
                    alertTimeElement.innerHTML = optionsHtml;
                }
        }
        else 
        {
            optionsHtml = `<option value="no">No slots available</option>`;
            const alertTimeElement = document.getElementById("alert_time");
                if (alertTimeElement) {
                    alertTimeElement.innerHTML = optionsHtml;
                }
        }
        }
    }
}  
function showEditDialog(appointmentID,doctor_id)
{
    var today = new Date().toISOString().split('T')[0];
    Swal.fire({
        title: "Please choose date and time slot",
        html: ` <label for="alert_date">Select new Date</label>
                <input type="date" min=${today} name="alert_date" id="alert_date">
                <br><br>
                <label for="alert_time">Select new Time</label>
                <select id="alert_time" name="alert_time">${optionsHtml}</select>`,
                willOpen: () => {
                                // Add event listener when the modal is fully opened and elements are in the DOM
                const alertDateElement = document.getElementById("alert_date");
                if (alertDateElement) 
                {
                console.log(doctor_id);
                alertDateElement.addEventListener("change", function() {
                chosenDate = this.value;
                if (chosenDate) 
                    {
                        getAvailableSlots(doctor_id, chosenDate);
                    }
                });
            }
            const alertTimeElement = document.getElementById("alert_time");
            if(alertTimeElement)
            {
                alertTimeElement.addEventListener("change",function(){
                    chosenSlot = alertTimeElement.value;console.log(chosenSlot);
                });
                                        
            }
        }
    }).then((result)=>
        {
            if(result.isConfirmed)
                {
                    updateTimeAndDate(appointmentID,chosenDate,chosenSlot);
                    // console.log(chosenDate,chosenSlot,appointmentID);
                }
     })
}
function showDeleteDialog(appointmentID,doctor_id)
{
    Swal.fire({
        title: "Do you want to delete the appointment?",
        text:"You can also edit the appointment",
        icon:"warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Edit",
        denyButtonText: `Delete`
      }).then((result) => 
        {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) 
            {
                var today = new Date().toISOString().split('T')[0];
                 Swal.fire
                 ({
                    title: "You can now edit date and time slot",
                    html: ` <label for="alert_date">Select new Date</label>
                            <input type="date" min=${today} name="alert_date" id="alert_date">
                            <br><br>
                            <label for="alert_time">Select new Time</label>
                            <select id="alert_time" name="alert_time">${optionsHtml}</select>`,
                    willOpen: () => {
                                // Add event listener when the modal is fully opened and elements are in the DOM
                                const alertDateElement = document.getElementById("alert_date");
                                if (alertDateElement) 
                                    {
                                    console.log(doctor_id);
                                    alertDateElement.addEventListener("change", function() {
                                        chosenDate = this.value;
                                        if (chosenDate) {
                                            getAvailableSlots(doctor_id, chosenDate);
                                        }
                                    });
                                }
                                const alertTimeElement = document.getElementById("alert_time");
                                if(alertTimeElement)
                                    {
                                        alertTimeElement.addEventListener("change",function(){chosenSlot = alertTimeElement.value;console.log(chosenSlot);});
                                        
                                    }
                            }
                 }).then((result)=>
                    {
                        if(result.isConfirmed)
                            {
                                updateTimeAndDate(appointmentID,chosenDate,chosenSlot);
                                // console.log(chosenDate,chosenSlot,appointmentID);
                            }
                 })
            } 
        else if (result.isDenied) 
            {
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST","./php_pages/doctors.php",true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("deleteAppointment=true&appointmentId="+appointmentID);

                xhttp.onreadystatechange = function()
                {
                    if(this.readyState==4 && this.status==200)
                        {
                            var data  = this.responseText;
                            if(data=="true")
                                {
                                    Swal.fire("Appointment deleted", "", "success").then((result)=>
                                        {
                                            if(result.isConfirmed)
                                                {
                                                    location.reload();
                                            }
                                            else 
                                            {
                                                location.reload();
                                            }
                                        }
                                       
                                    )
                                    
                                    
                                }
                            else 
                            {
                                Swal.fire("Could not delete the appointment","","info");
                            }
                        }
                }
                
            }
      });
}
if(document.getElementById("patientPastApplications"))
    {
        var patientList = document.getElementById("patientPastApplicationList");
        
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST","./php_pages/doctors.php",true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("patientPastApplications=true&patientNumber="+sessionStorage.getItem("phn_number"));
        xhttp.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status==200)
                {
                    var data = this.responseText;
                    // console.log(data);
                    data = JSON.parse(data);
                    console.log(data);
                    if(data==0)
                        {
                            console.log("no");
                            var h3 = document.createElement("h3");
                            h3.innerText = "No appointments to show";
                            patientList.appendChild(h3);
                        }
                    for(var i = 0;i<data.length;i++)
                        {
                            var id = data[i][0]["id"];
                            var doctor_id = data[i][0]["doctor_id"];
                            var card = document.createElement("div");
                            card.classList.add("card");
                            card.style.backgroundColor = "rgb(233, 233, 233)";
                            card.style.margin = "15px";
                            card.style.marginLeft = "10px";
                            var card_body = document.createElement("div");
                            card_body.classList.add("card-body");
                            // h4
                            var patientDiv = document.createElement("div");
                            patientDiv.style.display = "flex";
                            patientDiv.style.justifyContent="start";
                            patientDiv.style.alignItems="center";

                            var patientImg = document.createElement("img");
                            patientImg.setAttribute("src","assets/user.png");
                            patientImg.setAttribute("width","20px");
                            patientImg.setAttribute("height","20px");
                            patientImg.setAttribute("margin","5px");

                            var patientName = document.createElement("h4");
                            patientName.innerText = data[i][0]["patient_name"];

                            patientDiv.appendChild(patientImg);
                            patientDiv.appendChild(patientName)
                            // div 
                            var div1 = document.createElement("div");
                            div1.style.display = "flex";
                            div1.style.justifyContent = "space-between";
                            div1.style.alignItems = "center";
                            // h5 
                            var doctorDiv = document.createElement("div");
                            doctorDiv.style.display = "flex";
                            doctorDiv.style.justifyContent="space-evenly";
                            doctorDiv.style.alignItems="center";
                            var doctorName = document.createElement("h5");
                            
                            doctorName.innerText ="Dr. "+ data[i][0]["doctor_name"];
                            var docimage = document.createElement("img");
                            
                            docimage.setAttribute("src","assets/steth.png");
                            docimage.setAttribute("width","20px");
                            docimage.setAttribute("height","20px");
                            docimage.style.margin = "5px";
                            doctorDiv.appendChild(docimage);
                            doctorDiv.appendChild(doctorName);
                            var dateDiv = document.createElement("div");
                            dateDiv.style.display = "flex";
                            dateDiv.style.justifyContent="center";
                            dateDiv.style.alignSelf = "center";

                            var dateImg = document.createElement("img");
                            dateImg.setAttribute("src","assets/date.png");
                            dateImg.setAttribute("width","20px");
                            dateImg.setAttribute("height","20px");
                            dateImg.style.margin="5px";
                            var date = document.createElement("h5");
                            date.innerText = ""+data[i][0]["date"]

                            dateDiv.appendChild(dateImg);
                            dateDiv.appendChild(date);

                            var timeDiv = document.createElement("div");
                            timeDiv.style.display = "flex";
                            timeDiv.style.justifyContent = "space-evenly";
                            timeDiv.style.alignItems = "center";
                            timeDiv.style.textAlign = "center";
                            var timeImg = document.createElement("img");
                            timeImg.setAttribute("src","assets/time.png");
                            timeImg.setAttribute("width","20px");
                            timeImg.setAttribute("height","20px");
                            timeImg.setAttribute("margin","5px");

                            var time = document.createElement("h5");
                            time.innerText = data[i][0]["slot"];

                            timeDiv.appendChild(timeImg);
                            timeDiv.appendChild(time);

                            div1.appendChild(doctorDiv);
                            div1.appendChild(dateDiv);
                            div1.appendChild(timeDiv);

                            card_body.appendChild(patientDiv);
                            card_body.appendChild(div1);

                           
                    

                            card.appendChild(card_body);
            
                            patientList.appendChild(card);
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
                    if(data==0)
                        {
                            console.log("no");
                            var h3 = document.createElement("h3");
                            h3.innerText = "You don't have any appointments";
                            var buttonEle = document.createElement("button");
                            buttonEle.classList.add("btn");
                            var bookButton = document.createElement("a");
                            // bookButton.classList.add("btn");
                            bookButton.innerText = "Book now";
                            buttonEle.style.backgroundColor = "#1e128b";
                            bookButton.style.color = "white";
                            bookButton.setAttribute("href","index.php");
                            buttonEle.appendChild(bookButton);
                            patientList.appendChild(h3);
                            patientList.appendChild(buttonEle);
                        }
                    for(var i = 0;i<data.length;i++)
                        {
                            var id = data[i][0]["id"];
                            var doctor_id = data[i][0]["doctor_id"];
                            var card = document.createElement("div");
                            card.classList.add("card");
                            card.style.backgroundColor = "rgb(233, 233, 233)";
                            card.style.margin = "15px";
                            card.style.marginLeft = "10px";
                            var card_body = document.createElement("div");
                            card_body.classList.add("card-body");
                            // h4
                            var patientDiv = document.createElement("div");
                            patientDiv.style.display = "flex";
                            patientDiv.style.justifyContent="start";
                            patientDiv.style.alignItems="center";

                            var patientImg = document.createElement("img");
                            patientImg.setAttribute("src","assets/user.png");
                            patientImg.setAttribute("width","20px");
                            patientImg.setAttribute("height","20px");
                            patientImg.setAttribute("margin","5px");

                            var patientName = document.createElement("h4");
                            patientName.innerText = data[i][0]["patient_name"];

                            patientDiv.appendChild(patientImg);
                            patientDiv.appendChild(patientName)
                            // div 
                            var div1 = document.createElement("div");
                            div1.style.display = "flex";
                            div1.style.justifyContent = "space-between";
                            div1.style.alignItems = "center";
                            // h5 
                            var doctorDiv = document.createElement("div");
                            doctorDiv.style.display = "flex";
                            doctorDiv.style.justifyContent="space-evenly";
                            doctorDiv.style.alignItems="center";
                            var doctorName = document.createElement("h5");
                            
                            doctorName.innerText ="Dr. "+ data[i][0]["doctor_name"];
                            var docimage = document.createElement("img");
                            
                            docimage.setAttribute("src","assets/steth.png");
                            docimage.setAttribute("width","20px");
                            docimage.setAttribute("height","20px");
                            docimage.style.margin = "5px";
                            doctorDiv.appendChild(docimage);
                            doctorDiv.appendChild(doctorName);
                            var dateDiv = document.createElement("div");
                            dateDiv.style.display = "flex";
                            dateDiv.style.justifyContent="center";
                            dateDiv.style.alignSelf = "center";

                            var dateImg = document.createElement("img");
                            dateImg.setAttribute("src","assets/date.png");
                            dateImg.setAttribute("width","20px");
                            dateImg.setAttribute("height","20px");
                            dateImg.style.margin="5px";
                            var date = document.createElement("h5");
                            date.innerText = ""+data[i][0]["date"]

                            dateDiv.appendChild(dateImg);
                            dateDiv.appendChild(date);

                            var timeDiv = document.createElement("div");
                            timeDiv.style.display = "flex";
                            timeDiv.style.justifyContent = "space-evenly";
                            timeDiv.style.alignItems = "center";
                            timeDiv.style.textAlign = "center";
                            var timeImg = document.createElement("img");
                            timeImg.setAttribute("src","assets/time.png");
                            timeImg.setAttribute("width","20px");
                            timeImg.setAttribute("height","20px");
                            timeImg.setAttribute("margin","5px");

                            var time = document.createElement("h5");
                            time.innerText = data[i][0]["slot"];

                            timeDiv.appendChild(timeImg);
                            timeDiv.appendChild(time);

                            div1.appendChild(doctorDiv);
                            div1.appendChild(dateDiv);
                            div1.appendChild(timeDiv);

                            card_body.appendChild(patientDiv);
                            card_body.appendChild(div1);

                            var div2 = document.createElement("div");
                            div2.style.display = "flex";
                            div2.style.justifyContent = "space-evenly";

                            var edit = document.createElement("button")
                            edit.classList.add("btn");
                            edit.style.backgroundColor = "#1e128b"
                            edit.style.color = "white";
                            edit.innerText = "Edit";
                            edit.setAttribute("id","edit");
                            edit.setAttribute("doctor",doctor_id);
                            edit.setAttribute("app_id",data[i][0]["id"]);
                            var deleteOptn = document.createElement("button");
                            deleteOptn.classList.add("btn");
                            deleteOptn.innerText = "Delete"
                            deleteOptn.style.backgroundColor = "red";
                            deleteOptn.style.color = "white";
                            // deleteOptn.setAttribute("onclick",`showDeleteDialog(${id}, ${doctor_id})`);
                            deleteOptn.setAttribute("doctor",doctor_id);
                            deleteOptn.setAttribute("app_id",data[i][0]["id"]);
                            deleteOptn.setAttribute("id","delete");
                            div1.appendChild(edit);
                            div1.appendChild(deleteOptn);

                            card_body.appendChild(div2);

                            card.appendChild(card_body);
            
                            patientList.appendChild(card);
                        }
                        document.addEventListener("click", function (event) {
                            if (event.target && event.target.id.startsWith("delete")) {
                                var doctor_id = event.target.getAttribute("doctor");
                                var app_id = event.target.getAttribute("app_id");
                                showDeleteDialog(app_id, doctor_id);
                            }
                        });
                        document.addEventListener("click", function (event) {
                            if (event.target && event.target.id.startsWith("edit")) {
                                var doctor_id = event.target.getAttribute("doctor");
                                var app_id = event.target.getAttribute("app_id");
                                showEditDialog(app_id, doctor_id);
                            }
                        });

                }
        }
    }