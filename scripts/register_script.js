
var xhttp = new XMLHttpRequest();


    var optionButton = document.getElementById("optionButton");


    optionButton.addEventListener("click",function(){
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
                            const ptag = document.createElement("li");
                            const atag = document.createElement("a");
                            atag.classList.add("dropdown-item");
                            atag.id = data[i]["dept_id"];
                            atag.textContent = data[i]["dept_name"];
                            ptag.appendChild(atag);
                            departmentDropDown.appendChild(ptag);
                        }
                        document.querySelectorAll("#identifierList .dropdown-item").forEach(item=>{
                            item.addEventListener("click",event=>{
                                var optionbtn = document.getElementById("department");
                                optionbtn.setAttribute("value",event.target.id); 
                                var id = event.target.id;
                            })
                        })
                }
        }
    })
