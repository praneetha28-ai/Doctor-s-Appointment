const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const doctorId = urlParams.get('docid');
const statusParam = urlParams.get('status');
var doctor_id;
if (doctorId && doctorId.indexOf("'")>=0)
{
    doctor_id = doctorId.split("'")[1];
}
else 
{
    doctor_id = doctorId;
}
console.log(doctor_id);
document.getElementById("doctorid").setAttribute("value",doctor_id);
function validateMyForm()
{
    var selectedDate = document.getElementById("breakdate").value ;
    var breakStart = document.getElementById("breakStart").value;
    var breakEnd = document.getElementById("breakEnd").value;
    var breakTime = breakStart+"-"+breakEnd;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","../php_pages/doctors.php",true);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhttp.send("checkSlotonDate=true&doctorid="+doctor_id+"&date="+selectedDate+"&break="+breakTime);
    xhttp.onreadystatechange = function()
    {
        if(this.readyState==4 && this.status == 200)
        {
            var data = this.responseText;
            console.log(data);
            if(data=="success")
            {
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST","../php_pages/doctors.php",true);
                xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xhttp.send("addBreak=true&doctorid="+doctor_id+"&date="+selectedDate+"&breakStart="+breakStart+"&breakEnd="+breakEnd);
                xhttp.onreadystatechange = function()
                {
                    if(this.readyState == 4 && this.status==200)
                        {
                            var data = this.responseText;
                            console.log(data);
                            if (data=="success")
                            {
                                Swal.fire("Break time update successfully");
                                location.reload();
                            }
                        }
                }            
            }
            else if(data.startsWith("no"))
            {
                Swal.fire("Break time should be atleast "+data.substring(2)+" minutes");
            }
            else if(data=="Out of time")
            {
                Swal.fire("Break time should be in between your availability");
            }
            else if(data=="fail")
            {
                Swal.fire("Break is already there in between this time")
            }
            else if(data=="No slot")
            {
                Swal.fire("Please add availability for the following date")
            }
        }
    }
}
document.getElementById("breakdate").addEventListener("change",function(event){
    console.log("date changed "+document.getElementById("breakdate").value);
    var selectedDate = document.getElementById("breakdate").value;
var xhttp = new XMLHttpRequest();
xhttp.open("POST","../php_pages/doctors.php",true);
xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xhttp.send("getbreaks=true&doctorid="+doctor_id+"&date="+selectedDate);
xhttp.onreadystatechange = function()
{
    if(this.readyState == 4 && this.status == 200)
        {
            var data = this.responseText;
            console.log(data);
            data = JSON.parse(data);
            var listOfBreaks = document.getElementById("existingbreaksContainer");
            if(data.length>0)
            {

                
                listOfBreaks.innerHTML = "";
                var heading = document.createElement("h4");
                heading.innerHTML = "Existing breaks";
                listOfBreaks.appendChild(heading);
                for(var i = 0;i<data.length;i++)
                {
                   
                    var breakDiv = document.createElement("div");
                    breakDiv.classList.add("indvbreak")
                    var dateDiv = document.createElement("div");
                    var dateImg = document.createElement("img");
                    dateImg.setAttribute("src","../assets/date.png");
                    dateImg.setAttribute("width","25px");
                    dateImg.setAttribute("height","25px");
                    var dateHead = document.createElement("h5");
                    dateHead.innerText = data[i][0]["date"];
                    dateDiv.appendChild(dateImg);
                    dateDiv.appendChild(dateHead);

                    var timeDiv = document.createElement("div");
                    var timeImg = document.createElement("img");
                    timeImg.setAttribute("src","../assets/time.png");
                    timeImg.setAttribute("width","25px");
                    timeImg.setAttribute("height","25px");
                    var timeHead = document.createElement("h5");
                    timeHead.innerText = data[i][0]["break_start"]+"-"+data[i][0]["break_end"];
                    timeDiv.appendChild(timeImg);
                    timeDiv.appendChild(timeHead);
                    breakDiv.appendChild(dateDiv);
                    breakDiv.appendChild(timeDiv);
                    listOfBreaks.appendChild(breakDiv);
                    // listOfBreaks.appendChild(dateDiv);
                    // listOfBreaks.appendChild(timeDiv);
                }
               
            }
            else 
            {
                listOfBreaks.innerHTML = "";
                var info = document.createElement("h5");
                info.innerText = "No breaks on this day";
                var heading = document.createElement("h4");
                heading.innerHTML = "Existing breaks";
                listOfBreaks.appendChild(heading);
                listOfBreaks.appendChild(info);
            }
        }
}

})
