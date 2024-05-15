
var xhttp=new XMLHttpRequest();
var params;
var nameButton=document.getElementById("nameButton");
nameButton.addEventListener("click",
function(){
    var nameDropDown=document.getElementById("nameList");
    xhttp.open("POST","../php_pages/doctors.php",true);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhttp.send("nameList=1");
    xhttp.onreadystatechange=function()
    {
        if(this.readyState==4 && this.status==200)
        {
            var data=this.responseText;
            console.log(data);
            data=JSON.parse(data);
            var name = document.getElementById("nameList");
            for(var i=0;i<data.length;i++)
            {
                const ptag=document.createElement("li");
                const atag=document.createElement("a");
                atag.classList.add("dropdown-item");
                atag.id=data[i]["doc_id"];
                atag.textContent=data[i]["doc_name"];
                ptag.appendChild(atag);
                nameDropDown.appendChild(ptag);
            }
            document.querySelectorAll("#nameList .dropdown-item").forEach(item=>{
            item.addEventListener("click",event=>
                {
                    var docName=document.getElementById("doc_name");
                    var docID= document.getElementById("doctor_id");
                    docName.setAttribute("value",event.target.textContent);
                    var id=event.target.id;
                    docID.setAttribute("value",event.target.id);
                })
            })
        }
    }
});
function getSlotDetails(doctorID,date,callback)
{
    
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
document.getElementById("date").addEventListener('change',function(event){
    var doctorID = document.getElementById("doctor_id").value;
    var date = document.getElementById("date").value;
    console.log(doctorID);
    xhttp.open("POST","../php_pages/doctors.php",true);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhttp.send("checkDate="+doctorID+'&date='+date);
    xhttp.onreadystatechange = function()
    {
        if(this.readyState==4 && this.status==200)
            {
                var data = this.responseText;
                console.log(data);
                if(data=="fail")
                {
                    Swal.fire(
                        {title:"Slots on this date are already registered.",
                        text:" Do you want to update?",
                        showCancelButton: true,
                        confirmButtonText:"Update",
                        cancelButtonText:"Cancel"
                        }).then((result)=>{
                            if(result.isConfirmed){
                                getSlotDetails(doctorID, date, function(params) {
                                    console.log(params[0]); 
                                    // [{"doctor_id":"doc608","date":"2024-05-09","available_time":"10:30-20:00","break_time":"12:30-13:00"}]
                                    params = JSON.parse(params);
                                    var doc_name = params[0]["doctor_name"];
                                    var doc_id = params[0]["doctor_id"];
                                    var date = params[0]["date"];
                                    var avTime = params[0]["available_time"];
                                    
                                    var av_from_time = avTime.split('-')[0];
                                    var av_to_time = avTime.split('-')[1];
                                    var bkTime = params[0]["break_time"];
                                    var bk_from_time = bkTime.split('-')[0];
                                    var bk_to_time = bkTime.split('-')[1];
                                    
                                    window.location.href = "edittime.html?doc_id="+doc_id+"&doc_name="+doc_name+"&date="+date+"&av_from_time="+av_from_time+"&av_to_time="+av_to_time+"&bk_from_time="+bk_from_time+"&bk_to_time="+bk_to_time;
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
// document.getElementById('availability_form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission
    
//     Swal.fire({
//         title: 'Are you sure?',
//         text: "You are about to submit the form",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, submit it!'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // If user confirms, submit the form
//             this.submit();
//         }
//     });
// });