const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const statusCode = urlParams.get('status');
if(statusCode=="name")
  {
    Swal.fire("Name is already registered","","info").then((result)=>{
      if(result.isConfirmed)
        {
          window.location.href = "add_doctors.html";
          // location.reload();
        }
        else
        {
          window.location.href = "add_doctors.html";
        }
    })

  }
else if(statusCode=="f")
  {
    Swal.fire("Unknown error occured","Could not add the doctor","fail").then((result)=>{
      if(result.isConfirmed)
        {
          window.location.href = "add_doctors.html";
        }
        else
        {
          window.location.href = "add_doctors.html";
        }
    })
  }
  else if(statusCode)
    {
      if(statusCode.startsWith("doc"))
        {
          Swal.fire("Doctor with ID "+statusCode+" added successfully","","success").then((result)=>{
            if(result.isConfirmed)
              {
                window.location.href = "add_doctors.html";
              }
              else
              {
                window.location.href = "add_doctors.html";
              }
          });
          
        }
      
    }
var xhttp = new XMLHttpRequest();


    var optionButton = document.getElementById("identifierList");


    // optionButton.addEventListener("click",function()
    // {
        // for(var i = 0;i<optionButton.options.length;i++)
        //   {
        //     optionButton.remove(optionButton.options);
        //   }
        
        console.log(optionButton.options.length);
        var departmentDropDown = document.getElementById("identifierList");
        
        console.log("clicked")
        xhttp.open("POST","../php_pages/doctors.php",true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("departmentList=1");
        xhttp.onreadystatechange=function(){
            if(this.readyState==4 && this.status==200)
                {
                    var data = this.responseText;
                    data = JSON.parse(data);
                    console.log(data);
                    for(var i = 0;i<data.length;i++)
                        {
                            const ptag = document.createElement("option");                
                            ptag.setAttribute("value",data[i]["dept_id"]);
                            ptag.innerText = data[i]["dept_name"];
                            // ptag.setAttribute("id","identifierList")
                            departmentDropDown.appendChild(ptag);
                        }
                       // document.querySelectorAll("#identifierList ").forEach(item=>{
                        //     item.addEventListener("click",event=>{
                        //         var optionbtn = document.getElementById("department");
                        //         optionbtn.setAttribute("value",event.target.options[event.target.selectedIndex].innerText); 
                        //         console.log(event.target.options[event.target.selectedIndex].innerText);
                        //         // var id = event.target.id;
                        //     })
                        // })
                }
        }
    // })
// document.querySelectorAll("#identifierList ").forEach(item=>{
//       item.addEventListener("click",event=>{
//         var optionbtn = document.getElementById("department");
//         optionbtn.setAttribute("value",event.target.options[event.target.selectedIndex].innerText); 
//         console.log(event.target.options[event.target.selectedIndex].innerText);
//                                 // var id = event.target.id;
//       })
// })