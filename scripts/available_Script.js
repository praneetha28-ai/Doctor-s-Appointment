// var today = new Date().toISOString().split('T')[0];

// document.getElementById("date").setAttribute("min",today);
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const doctorId = urlParams.get('docid');
const statusParam = urlParams.get('status');
if (doctorId && doctorId.indexOf("'")>=0)
{
    var doctor_id = doctorId.split("'")[1];
}
else 
{
    var doctor_id = doctorId;
}
document.getElementById("breakBtn").setAttribute("href","breaks.html?docid="+doctor_id);
console.log(doctor_id);
if(statusParam=="fail")
    {
        Swal.fire({
            title:"Appointments during break time will be canceled",
            text:"Do you want to cancel them?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonText:"Yes,Cancel",
            cancelButtonText:"No",
            icon:"info"
        }).then((result)=>{
            if(result.isConfirmed)
                {
                    
                }
            else 
            {
                window.location.href = "availability.html";
            }
        })
    }
document.getElementById("doctor_id").value = doctor_id;
function getSlotDetails(doctorID,date,callback)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","../php_pages/doctors.php",true);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhttp.send("getSlotDetails=1&doc_id="+doctorID+"&date="+date);
    xhttp.onreadystatechange = function (){
        if(this.readyState==4 && this.status==200)
            {
                var data = this.responseText;
                console.log(data);
                params=  data;
                callback(data);
            }
    }
}
function updateBreakTimeInputs(selectElement) 
{

    const selectedBreak = selectElement.value;
    const breakTimesDiv = selectElement.nextElementSibling;
    const breakTimeInputs = breakTimesDiv.querySelectorAll('.break-time');
    
    breakTimeInputs.forEach(input => 
    {
        input.style.display = input.name === selectedBreak ? 'inline-block' : 'none';
    });
}

function addData(dateString,doctorid)
{
    var availableTime = document.getElementById("av_time");
    const breakTimesData = [];

    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        const date = row.querySelector('.col-md-2').textContent.trim();
        const availableTime = row.querySelector('#av_time').value;

        const breakTimes = {};
        const breakTimeInputs = row.querySelectorAll('.break-time');
        breakTimeInputs.forEach(input => {
            if (input.value) 
            {
                breakTimes[input.name] = input.value;
            }
        });

        breakTimesData.push({
            date: date,
            availableTime: availableTime,
            breakTimes: breakTimes
        });
    });
    console.log(breakTimesData);
    var xhttp = new XMLHttpRequest();
    // xhttp.open("POST","../php_pages/doctors.php");
    // xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    // xhttp.send("checkDatePresent=true&date="+dateString+"&id="+doctorid);
    // xhttp.onreadystatechange= function()
    // {
    //     if(this.readyState==4 && this.status==200)
    //         {
    //             var data = this.responseText;
    //             if(data=="true")
    //             {
    //                 exists = true;
    //             }
    //             else 
    //             {
    //                 exists = false;
    //             }
    //         }
    // }
}
// function checkDatabase(dateString)
// {
//     var doc_Id = doctorId.split("'")[1];
//     var exists;
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST","../php_pages/doctors.php");
//     xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//     xhttp.send("checkDatePresent=true&date="+dateString+"&id="+doc_Id);
//     xhttp.onreadystatechange= function()
//     {
//         if(this.readyState==4 && this.status==200)
//             {
//                 var data = this.responseText;
//                 if(data=="true")
//                 {
//                     exists = true;
//                 }
//                 else 
//                 {
//                     exists = false;
//                 }
//             }
//     }
//     return exists;
// }
// generateScheduleRows();
// function generateScheduleRows() 
// {
//     const container = document.getElementById("rowOfSchedules");
//     const today = new Date();

//     for (let i = 0; i < 30; i++) {
//         const currentDate = new Date(today);
//         currentDate.setDate(today.getDate() + i);
//         const dateString = currentDate.toISOString().split('T')[0];

//         const hasEntry = checkDatabase(dateString);
//         const rowHTML = `
//             <div class="row" style="text-align: center; margin-top: 10px;">
//                 <div class="col-md-2">${dateString}</div>
//                 <div class="col-md-3">
//                     Available Time
//                     <input type="time" id="av_time">
//                 </div>
//                 <div class="col-md-3">
//                     <select name="break-select" class="break-select" onchange="updateBreakTimeInputs(this)">
//                         <option selected disabled >Select break</option>
//                         <option value="b1">Break 1</option>
//                         <option value="b2">Break 2</option>
//                         <option value="b3">Break 3</option>
//                     </select>
//                     <div class="break-times">
//                         <input type="time" class="break-time" name="b1" style="display:none;">
//                         <input type="time" class="break-time" name="b2" style="display:none;">
//                         <input type="time" class="break-time" name="b3" style="display:none;">
//                     </div>
//                 </div>
//                 <div class="col-md-2">
//                     <button class="btn btn-primary" ${!hasEntry ? 'disabled' : ''} onclick=updateExistingData(${dateString},${doctor_id})>Edit</button>
//                 </div>
//                 <div class="col-md-2">
//                     <button class="btn btn-primary" ${hasEntry ? 'disabled' : ''} onclick=addData(${dateString},'${doctor_id}')>Add</button>
//                 </div>
//             </div>
//         `;
//         container.insertAdjacentHTML('beforeend', rowHTML);
//     }
// }






document.getElementById("date").addEventListener('change',function(event){
    // var doctorID = document.getElementById("nameList").value;
    var date = document.getElementById("date").value;
    console.log(doctor_id);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","../php_pages/doctors.php",true);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhttp.send("checkDate="+doctor_id+'&date='+date);
    xhttp.onreadystatechange = function()
    {
        if(this.readyState==4 && this.status==200)
            {
                var data = this.responseText;
                // console.log(doctorID);
                console.log(data);
                if(data=="fail")
                {
                    Swal.fire(
                        {title:"Slots on this date are already registered.",
                        text:" Do you want to update?",
                        showCancelButton: true,
                        confirmButtonText:"Update",
                        confirmButtonColor: "#1e128b",
                        cancelButtonText:"Cancel"
                        }).then((result)=>{
                            if(result.isConfirmed){
                                getSlotDetails(doctor_id, date, function(params) 
                                {
                                    console.log(params[0]); 
                                    // [{"doctor_id":"doc608","date":"2024-05-09","available_time":"10:30-20:00","break_time":"12:30-13:00"}]
                                    params = JSON.parse(params);
                                    var doc_name = params[0]["doctor_name"];
                                    var doc_id = params[0]["doctor_id"];
                                    var date = params[0]["date"];
                                    var avTime = params[0]["available_time"];
                                    var timeInterval = params[0]["time_interval"];

                                    var av_from_time = avTime.split('-')[0];
                                    var av_to_time = avTime.split('-')[1];
                                    var bkTime = params[0]["break_time"];
                                    var bk_from_time = bkTime.split('-')[0];
                                    var bk_to_time = bkTime.split('-')[1];
                                    
                                    window.location.href = "edittime.html?doc_id="+doc_id+"&doc_name="+doc_name+"&date="+date+"&av_from_time="+av_from_time+"&av_to_time="+av_to_time+"&bk_from_time="+bk_from_time+"&bk_to_time="+bk_to_time+"&timeInterval="+timeInterval;
                                    // location.reload();
                                });
                                
                            }else {
                                document.getElementsByName("updatetime")[0].disabled = true;
                            }
                       
                    });
                }
                else
                {
                    document.getElementsByName("updatetime")[0].disabled = false;
                }
            }
    }
});
