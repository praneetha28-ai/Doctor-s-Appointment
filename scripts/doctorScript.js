//Parse In
var patientLogin = sessionStorage.getItem("pat_login");
var confirmedDate;
var confirmedTime;
var confirmeddoctorID;
var confirmedDoctorName;
var patientNumber = ""; 
var patientName = "";
var chosenDepartment = "";
//make list

if(patientLogin)
  {
    document.getElementById("patientLoginButton").innerHTML = "";
    patientName = sessionStorage.getItem("name");
    patientNumber = sessionStorage.getItem("phn_number");
    var patientAvtar = document.createElement("button")
    patientAvtar.innerText = sessionStorage.getItem("name");
    patientAvtar.classList.add("btn");
    patientAvtar.style.color = "white";
    patientAvtar.setAttribute("onclick",'openPatientPage()');
    document.getElementById("patientLoginButton").appendChild(patientAvtar);
  }
var doc_Depts = {"101":"General Physician","102":"Dentist","103":"Dermatologist","104":"ENT Specialist","105":"Homeopathy","106":"Ayurveda"};

var timings = {"101":20,"102":30,"103":20,"104":20,"105":"20","106":20}
function markConsultComplete(appointmnetId,status)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","doctors.php",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("consult=true&appId="+appointmnetId+"&status="+status);
    xhttp.onreadystatechange = function()
    {
      if(this.readyState==4 && this.status==200)
        {
          var data = this.responseText;
          if(data=="success")
            {
              Swal.fire("Appointment Updated successfully","","info").then((result)=>{
                if(result.isConfirmed)
                  {
                    location.reload();
                  }
                  else 
                  {
                    location.reload();
                  }
              })
            }
        }
    }
}
var parseIn = function (date_time,addMinutes) {
  console.log(date_time);
  var d = new Date();
  d.setHours(date_time.substring(11, 13));
  d.setMinutes(date_time.substring(14, 16));
  // addMinutes==true?d.setMinutes(d.getMinutes()-15):"";
  return d;
};

function openPatientPage()
{
  console.log("patient page");
  window.location.href = "./patient_page.html";
}
var getTimeIntervals = function (time1, time2,timeInterval) 
{
  var arr = [];
  while (time1 < time2) 
    {
    arr.push(time1.toTimeString().substring(0, 5));
    time1.setMinutes(time1.getMinutes() + timeInterval);
  }
  return arr;
};
function storeDateTime(timeSlot)
{
    console.log(timeSlot);
    var allTimeSlots = document.getElementsByClassName("time-slot-indv");

    for (let i = 0; i < allTimeSlots.length; i++) {
        allTimeSlots[i].style.backgroundColor = "aliceblue";
        allTimeSlots[i].style.color = "black";
      }
    var selectedTimeSlot = document.getElementById(timeSlot.replace(":","-"));
    selectedTimeSlot.style.backgroundColor = "green";
    selectedTimeSlot.style.color="white";
    confirmedTime = timeSlot;
}
function updateAppointmentTable()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200)
            {
                var data = this.responseText;
                console.log(data);
                if(data=="Booking confirmed")
                    {
                      console.log("data");
                        Swal.fire("Booking confirmed");
                        getAvailableSlots(confirmeddoctorID,confirmedDate);
                    }
            }
    }
    xhttp.open("POST","./php_pages/doctors.php",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("doctorid="+confirmeddoctorID+"&date="+confirmedDate+"&slot="+confirmedTime+"&patID="+patientNumber+"&patName="+patientName);
}
function checkPatientExists(patientNum,date,slot)
{
  console.log(patientNum);
  console.log(date);
  console.log(slot);
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST","./php_pages/doctors.php",true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("patnum="+patientNum+"&date="+date+"&slot="+slot);
  xhttp.onreadystatechange = function()
  {
    if(this.readyState==4 && this.status==200)
      {
        var data = this.responseText;
        console.log(data);
        if(data=="fail")
          {
            Swal.fire("Cannot book multiple appointments at same time");
          }
        else
        {
          updateAppointmentTable();

        }
      }
  }
  return false;
}
function saveName(){
  patientName = document.getElementById("patName").value;
  console.log(patientName);
}
function saveNumber()
{
  patientNumber = document.getElementById("patNum").value;
  console.log(patientNumber);
}
function confirmAppointment()
{
    if(confirmedTime==null)
        {
            Swal.fire({title:"Please choose a time slot",icon:"info"});
        }
        else
        {
            Swal.fire({
              title:"Please confirm the following",
              text:"Doctor: "+confirmedDoctorName+" Date: "+confirmedDate+" Time Slot : "+confirmedTime,
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "Confirm",
              html:`
             
              <label for="docName">Doctor:</label>
              <input type="text" name="docName" id="docName" style="border:0" value="${confirmedDoctorName}" readonly> <br>
              <label for="finalDate">Date:</label>
              <input type="text" name="finalDate" value="${confirmedDate}" id="confirmedDate" style="border:0" readonly ><br>
              <label for="finalSlot">Time Slot</label>
              <input type="text" name="finalSlot" value="${confirmedTime}" style="border:0" id="finalSlot" readonly><br>
              <label for="patName">Patient Name</label>
              <input  required type="text" name="patName" value="${patientName}" id="patName" onkeyup="saveName()"><br>
              <label for="patNum">Phone Number</label>
              <input required type="text" name="patNum" id="patNum" value="${patientNumber}" onkeyup="saveNumber()"><br>
              `,
              preConfirm: () => {
                console.log("heyy");
                var patientNameValidate = document.getElementById("patName").value;
                var patientNumValidate = document.getElementById("patNum").value;
                
                  if(!patientNameValidate)
                    {
                      Swal.showValidationMessage("Please fill name");
                    }
                    else if(!patientNumValidate)
                      {
                        Swal.showValidationMessage("Please fill number");
                      }
                      else if(!(patientNameValidate && patientNumValidate))
                        {
                          Swal.showValidationMessage('Please fill patient name and patient number');
                        }
                  else{
                    return [patientNameValidate,patientNumValidate];
                  }
                
            }
            }).then((result)=>
                {
                  console.log("hellpp");
                    if (result.isConfirmed) 
                      {
                        checkPatientExists(patientNumber,confirmedDate,confirmedTime);
                      }            
                })
        }
}
function getAvailableSlots(doctorID,date) {
  var xhttp = new XMLHttpRequest();
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
      var timeInterval = parseInt(data["time_interval"]);
      var breaks = data["breaks"];
      var date = document.createElement("h4");
      var breakTime = [];
      for(var i = 0;i<breaks.length;i++)
      {
          
          var bStart = breaks[i]["breakslot"].split("-")[0];
          var bEnd = breaks[i]["breakslot"].split("-")[1];
          var breStart = parseIn(breaks[i]["date"]+" "+bStart);
          var breEnd = parseIn(breaks[i]["date"]+" "+bEnd)
          // console.log(bStart,bEnd);
          breakTime = breakTime.concat(getTimeIntervals(breStart,breEnd,5));
      }
      date.innerText = availability[0]["date"];
      var availableStartTime = availability[0]["available_time"].split("-")[0];
      var availableEndTime = availability[0]["available_time"].split("-")[1];
      var breakStartTime = availability[0]["break_time"].split("-")[0];
      
      var breakEndTime = availability[0]["break_time"].split("-")[1];
      var startTime = parseIn(availability[0]["date"] + " " + availableStartTime,false);
      var endTime = parseIn(availability[0]["date"] + " " + availableEndTime,false);
      var breakStime = parseIn(availability[0]["date"] + " " + breakStartTime,true);
      var breakEtime = parseIn(availability[0]["date"] + " " + breakEndTime,false);
      var intervals = getTimeIntervals(startTime, endTime,timeInterval);
      console.log(intervals);
      // var breakTime = getTimeIntervals(breakStime, breakEtime,5);
      // console.log(breakTime);
      for(var i = 0;i<booked.length;i++)
      {
          breakTime.push(booked[i]["slot"]);
      }
      console.log(breakTime);
      var finalAvailableSlots = [];
      for (var i = 0; i < intervals.length; i++) 
        {
        if (!(breakTime.indexOf(intervals[i]) >= 0)) 
          {
          finalAvailableSlots.push(intervals[i]);
        }
      }
      console.log(finalAvailableSlots);
      
      var timeSlotsGrid = document.getElementById("bookings");
      if(document.getElementById("time-slots") )
        {   
            document.getElementById("confirm").remove();
            document.getElementById("time-slots").remove();
        }
      var currentDate = new Date();
      console.log(currentDate.toISOString());
      var selectedDate = new Date(availability[0]["date"]);
      console.log(selectedDate);
      var time_slots = document.createElement("div");
      time_slots.id = "time-slots";
      finalAvailableSlots.forEach(function (timeSlot) 
      {
        if(currentDate.getDate()==selectedDate.getDate())
          {

            if(timeSlot > (currentDate.getHours()+":"+currentDate.getMinutes()))
              {
                var timeSlotDiv = document.createElement("div");
                timeSlotDiv.textContent = timeSlot;
                timeSlotDiv.id = timeSlot.replace(":", "-");
                timeSlotDiv.classList.add("time-slot-indv");
                timeSlotDiv.style.backgroundColor = "aliceblue";
                timeSlotDiv.style.borderRadius = "10px";
                timeSlotDiv.setAttribute("onclick", "storeDateTime('" + timeSlot + "')");
                time_slots.appendChild(timeSlotDiv);
              }
          }
        else 
        {
                var timeSlotDiv = document.createElement("div");
                timeSlotDiv.textContent = timeSlot;
                timeSlotDiv.id = timeSlot.replace(":", "-");
                timeSlotDiv.classList.add("time-slot-indv");
                timeSlotDiv.style.backgroundColor = "aliceblue";
                timeSlotDiv.style.borderRadius = "10px";
                timeSlotDiv.setAttribute("onclick", "storeDateTime('" + timeSlot + "')");
                time_slots.appendChild(timeSlotDiv);
        }
        
      });
      timeSlotsGrid.append(time_slots);
      var confirmButton = document.createElement("button")
      confirmButton.innerText = "Book Appointment";
      confirmButton.id = "confirm";
      confirmButton.setAttribute("onclick","confirmAppointment()");
      confirmButton.style.backgroundColor = "#1e128b";
      confirmButton.style.color ="white";
      confirmButton.style.borderRadius = "5px";
      confirmButton.classList.add("btn");
      confirmButton.style.marginTop = "5px";
      var bookingsSpace = document.getElementById("bookings");
      bookingsSpace.appendChild(confirmButton);
    }
    else
    {
        if(document.getElementById("confirm"))
            {
                document.getElementById("confirm").remove();
            }
                Swal.fire({title:"No slots available for selected date ",icon:"info",text:"Please choose different date"});
    }
    }
  };
  console.log(date);
  xhttp.open("POST", "./php_pages/doctors.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("doctorID=" + doctorID+"&date="+date);
}

function handleAppointmentBooking(event) {
  console.log(event.target);
  var doctorId = event.target.getAttribute("doc_id");
  console.log(doctorId);
  var docName = event.target.getAttribute("doc_name");
  confirmeddoctorID = doctorId;
  confirmedDoctorName = docName;
  var bookingsSpace = document.getElementById("bookings");
  bookingsSpace.innerHTML = "";
  var doc_id = document.createElement("h4");
  doc_id.innerText = docName;
  doc_id.style.textAlign="left";
  var dateInput = document.createElement("input");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("id", "myDate");
    // document.getElementById("myDate").min = new Date().getFullYear() + "-" +  parseInt(new Date().getMonth() + 1 ) + "-" + new Date().getDate()
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute("min",today);
   
    dateInput.addEventListener("change", 
    function() {
        
        var chosenDate = this.value;
        if (chosenDate) 
        {
            if(document.getElementById("time-slots"))
                {
                    document.getElementById("time-slots").remove();
                    document.getElementById("confirm").remove();
                }
                confirmedDate =chosenDate;
            getAvailableSlots(doctorId,chosenDate);
        }
    });
    
    bookingsSpace.appendChild(doc_id);
    bookingsSpace.appendChild(dateInput);
}

function searchDoctors()
{
  var userSearch = document.getElementById("searchDoctor").value;
  var docList = document.getElementById("doctors");
  var doctorsCards = docList.getElementsByClassName("card");
  var doctorsNames = docList.getElementsByTagName("h5");
  for(var i = 0;i<doctorsNames.length;i++)
    {
        var name = doctorsNames[i].innerText;
        // console.log(name.toLowerCase());
        // console.log("dr. "+userSearch.toLowerCase());
        if(name.toLowerCase().startsWith("dr. "+userSearch.toLowerCase()))
          {
            console.log("matched");
            console.log(doctorsCards[i]);
            doctorsCards[i].style.display = "";
          }
          else 
          {
            doctorsCards[i].style.display = "none";
          }
    }
}
function createDoctorsList(data,department) {
  chosenDepartment = department;
  var section = document.getElementById("doctors");
  section.innerHTML = "";
  var subSection = document.createElement("div");
  // subSection.style.display = "flex";
  subSection.style.justifyContent = "space-evenly";
  var findDoc = document.createElement("h4");
  findDoc.style.marginLeft = "10px";
  findDoc.innerText = doc_Depts[department];

  var searchDiv = document.createElement("div");
  searchDiv.style.display = "flex";
  searchDiv.style.marginLeft = "10px";
  var searchDoc = document.createElement("input")
  searchDoc.setAttribute("type","text");
  searchDoc.setAttribute("id","searchDoctor");
  searchDoc.setAttribute("placeholder","Search for doctors...");
  searchDoc.setAttribute("onkeyup","searchDoctors()");
  searchDoc.style.marginLeft = "10px";
  // searchDoc.style.borderRadius = "5px";

  
  var searchButton = document.createElement("button");
  searchButton.classList.add("btn");
  searchButton.style.backgroundColor = "#1e128b";
  searchButton.style.color = "white";
  searchButton.innerText = "Search"
 

  var searchImg = document.createElement("img");
  searchImg.setAttribute("src","assets/search.png");
  searchImg.setAttribute("width","25px");
  searchImg.setAttribute("height","25px");

  // searchDiv.appendChild(searchImg);
  searchDiv.appendChild(searchDoc);
  searchDiv.appendChild(searchButton);
  subSection.appendChild(findDoc);
  // subSection.appendChild(searchImg);
  subSection.appendChild(searchDiv);
  section.appendChild(subSection);
  for (var i = 0; i < data.length; i++) 
  {
    var doctorDiv = document.createElement("div");
    doctorDiv.classList.add("card");
    doctorDiv.style.width="24rem";
    doctorDiv.style.margin="8px";
    doctorDiv.style.borderRadius="15px";
      var carbody = document.createElement("div");
      carbody.classList.add("card-body");
          var card_title = document.createElement("h5");
          card_title.classList.add('card-title');
          card_title.innerText="Dr. "+data[i]["doctor_name"];
            var infoOfDoc = document.createElement("div");
            infoOfDoc.style.display="flex";
            infoOfDoc.style.justifyContent="space-between";
                var info = document.createElement("div");
                info.style.display = "flex";
                info.style.alignItems = "center";
                    var steth = document.createElement("img");
                    steth.setAttribute("src","assets/steth.png");
                    steth.setAttribute("width","25px");
                    steth.setAttribute("height","25px");
                    var proff = document.createElement("h6");
                    proff.classList.add("card-subtitle");
                    proff.innerText = doc_Depts[department];
                info.appendChild(steth);
                info.appendChild(proff);
            infoOfDoc.appendChild(info);
                var exp_info = document.createElement("div");
                exp_info.style.display="flex";
                exp_info.style.alignItems="center";
                    var exp_img = document.createElement("img");
                    exp_img.setAttribute("src","assets/experience.png");
                    exp_img.setAttribute("width","25px");
                    exp_img.setAttribute("height","25px");
                    var exp_num = document.createElement("h6");
                    exp_num.classList.add("card-subtitle");
                    exp_num.innerText = data[i]["experience"] + " Years Experience";
                exp_info.appendChild(exp_img);
                exp_info.appendChild(exp_num);
            infoOfDoc.appendChild(exp_info);    
            var doc_desc = document.createElement("p");
            doc_desc.classList.add("card-text");
            doc_desc.innerText="Dr. "+data[i]["doctor_name"]+" is "+doc_Depts[department]+" with "+data[i]["experience"]+" years of experience."+" Book your appointment now.";
            var appointment_btn = document.createElement("button");
            appointment_btn.classList.add("btn");
            appointment_btn.style.backgroundColor = "#1e128b";
            appointment_btn.style.color ="white";
            appointment_btn.innerText ="Check Availability";
            appointment_btn.style.marginTop = "8px";
            appointment_btn.setAttribute("doc_id", data[i]["doc_id"]);
            appointment_btn.setAttribute("doc_name",data[i]["doctor_name"]);
            appointment_btn.addEventListener("click", handleAppointmentBooking);
        carbody.appendChild(card_title);
        carbody.appendChild(infoOfDoc);
        // carbody.appendChild(doc_desc);
        carbody.appendChild(appointment_btn);
      doctorDiv.appendChild(carbody);
    doctorDiv.setAttribute("id", "doctor");
    
    section.appendChild(doctorDiv);
    // var doctorName = document.createElement("h3");
    // doctorName.innerText = data[i]["doctor_name"];
    // doctorDiv.appendChild(doctorName);

    // var experience = document.createElement("h4");
    // experience.innerText = data[i]["experience"] + " Years Experience";
    // doctorDiv.appendChild(experience);

    // var feeButtonDiv = document.createElement("div");
    // feeButtonDiv.classList.add("fee-button");

    // var fee = document.createElement("p");
    // fee.innerText = "Consultation Fee: $" + data[i]["fee"];
    // feeButtonDiv.appendChild(fee);
    // doctorDiv.appendChild(feeButtonDiv);

    // var button = document.createElement("button");
    // button.innerText = "Book Appointment";
    // button.setAttribute("data-id", data[i]["doc_id"]);
    //  // Set data-id attribute to store the ID
    // button.setAttribute("doc-name",data[i]["doctor_name"]);
    // button.addEventListener("click", handleAppointmentBooking);
    // doctorDiv.appendChild(button);

    // section.appendChild(doctorDiv);
  }
}
function getDoctorList(department) {
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = xhttp.responseText;
      console.log(data);
      data = JSON.parse(data);
      console.log(data);
      var all_cards = document.querySelectorAll(".scrollable-cards-container .card");
      for(var i = 0;i<all_cards.length;i++)
        {
          all_cards[i].style.backgroundColor = "white";
          all_cards[i].style.color = "#343A40";
        }
      var cardSelected = document.querySelector(".scrollable-cards-container #specialist_"+department);
      console.log(cardSelected);
      cardSelected.style.backgroundColor = "#1e128b";
      cardSelected.style.color="white";
      
      createDoctorsList(data,department);
      document.getElementById("pageContent").scrollIntoView();
    }
  };
  xhttp.open("POST", "./php_pages/doctors.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("dept=" + department);
}
function viewSpecialists(){
  document.getElementById("scrollable-cards-container").scrollIntoView();
}