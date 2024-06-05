<?php 
    include("database.php");

    if(isset($_POST["addBreak"]))
    {
        $doctorid = $_POST["doctorid"];
        $breakdate = $_POST["date"];
        $breakStart = $_POST["breakStart"];
        $breakEnd = $_POST["breakEnd"];
        $sql = "INSERT INTO `breaks`( `doctor_id`, `date`, `break_start`, `break_end`) VALUES ('$doctorid','$breakdate','$breakStart','$breakEnd')";
       
        $run = mysqli_query($conn,$sql);
            echo "success";
        
        
    }

    if(isset($_POST["checkSlotonDate"]))
    {
        $doctorid = $_POST["doctorid"];
        $date =$_POST["date"];
        $break = $_POST["break"];
        $breakStart = explode("-",$break)[0];
        $breakEnd =  explode("-",$break)[1];
        $sql = "SELECT * FROM slots where doctor_id = '$doctorid' and date='$date'";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0) 
        {
            $row = mysqli_fetch_assoc($run);
            $availableStart = explode("-",$row["available_time"])[0];
            $availableEnd = explode("-",$row["available_time"])[1];
            $timeinterval = $row["time_interval"];
            $timeDifference = abs(strtotime($breakStart)-strtotime($breakEnd))/60;
            
            if($timeDifference<$timeinterval)
            {
                echo "no".$timeinterval;

            }
            else if(strtotime($breakStart)<=strtotime($availableStart) || strtotime($breakEnd)>=strtotime($availableEnd))
            {
                echo "Out of time";
            }
            else 
            {
                $status = 1;
                $firstBreak = explode("-",$row["break_time"]);
                $firstBreakStart = $firstBreak[0];
                $firstBreakEnd = $firstBreak[1];   
                if((strtotime($breakStart)<strtotime($firstBreakStart) && strtotime($breakEnd)<=strtotime($firstBreakStart)) || (strtotime($breakStart)>=strtotime($firstBreakEnd) && strtotime($breakEnd)>strtotime($firstBreakEnd))) 
                {
                    // echo "success";
                    $sqlCheckExistBreaks = "SELECT * FROM breaks where doctor_id='$doctorid' and date='$date'";
                    $runbreaks = mysqli_query($conn,$sqlCheckExistBreaks);
                    if(mysqli_num_rows($runbreaks)>0)
                    {
                        while($row=mysqli_fetch_assoc($runbreaks))
                        {
                            if((strtotime($breakStart)<strtotime($row["break_start"]) && strtotime($breakEnd)<=strtotime($row["break_end"])) || (strtotime($breakStart)>=strtotime($row["break_start"]) && strtotime($breakEnd)>strtotime($row["break_end"])))
                            {
                                // echo "success";
                                
                            } 
                            else 
                            {
                                $status = 0;
                            }
                        }
                    }
                    else 
                    {
                        echo "success";

                    }
                    if($status==0)
                    {
                        echo "fail";
                    }
                    else 
                    {
                        echo "success";
                    }
                }
                else 
                {
                    echo "fail";
                }
            }
        }
        else 
        {
            echo "No slot";
        }
    }
    if(isset($_POST["getbreaks"]))
    {
        $doctorId= $_POST["doctorid"];
        $date = $_POST["date"];
        $sql = "SELECT * FROM breaks where doctor_id= '$doctorId' and date='$date' order by break_start desc";
        $run = mysqli_query($conn,$sql);
        $breaksList = array();
        if(mysqli_num_rows($run)>0) 
        {
            while($row = mysqli_fetch_assoc($run))
            {
                $breaksList[] = array($row);
            }
        }
        echo json_encode($breaksList);
    }
    if(isset($_POST["consult"]))
    {
        $appointmentId = $_POST["appId"];
        $status = $_POST["status"];
        $sql = "UPDATE appointments set consultation={$status} where id={$appointmentId}";
        $run = mysqli_query($conn,$sql);
        echo "success";
    }
    if(isset($_POST["updatePatApt"]))
    {
        $appointmentId = $_POST["app_id"];
        $newDate = $_POST["newDate"];
        $newTime = $_POST["newslot"];
        $sql_slot_check = "SELECT * from `appointments` where date='{$newDate}' and slot='{$newTime}'";
        $run = mysqli_query($conn,$sql_slot_check);
        if(mysqli_num_rows($run)>0)
        {
            echo "fail";
        }
        else 
        {
            $sql = "UPDATE `appointments` SET `date`='{$newDate}',`slot`='{$newTime}' WHERE id={$appointmentId}";
            $run = mysqli_query($conn,$sql);    
        }
        
    }
    if(isset($_POST["deleteAppointment"]))
    {
        $appointmentId= $_POST["appointmentId"];
        $sql = "DELETE FROM `appointments` WHERE id={$appointmentId}";
        $run = mysqli_query($conn,$sql);
        echo "true";
    }
    if(isset($_POST["checkDatePresent"]))
    {
        $chosenDate = $_POST["date"];
        $selectedId = $_POST["id"];
        $sql = "SELECT * FROM slots where date={$chosenDate} and doctor_id={$selectedId}";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0)
        {
            echo "false";
        }
        else 
        {
            echo "true";
        }
    }
    if(isset($_POST["patientPastApplications"]))
    {
        $patientNumber = $_POST["patientNumber"];
        $today = date("Y-m-d");
        $sql ="SELECT appointments.id,appointments.doctor_id, appointments.date, appointments.slot, appointments.patient_id, appointments.patient_name, doctors.doctor_name ,appointments.consultation
        FROM appointments 
        JOIN doctors ON appointments.doctor_id = doctors.doctor_id 
        WHERE appointments.patient_id = '{$patientNumber}' and (appointments.date<'{$today}' or appointments.consultation!=0)
        ORDER BY appointments.date DESC, appointments.slot DESC;";
        // echo $sql;
        // die;
        $run = mysqli_query($conn,$sql);
        
        $appointmentLists = array();
        if(mysqli_num_rows($run)>0)
        {
            while($row = mysqli_fetch_assoc($run))
            {
                $appointmentLists[] = array($row);
            }
            echo json_encode($appointmentLists);
        }
        else
        {
            echo 0;
        }
    }
    if(isset($_POST["patientApplications"]))
    {
        $patientNumber = $_POST["patientNumber"];
        $today = date("Y-m-d");
        $time = date("H:i");
        $sql ="SELECT appointments.id,appointments.doctor_id, appointments.date, appointments.slot, appointments.patient_id, appointments.patient_name, doctors.doctor_name 
        FROM appointments 
        JOIN doctors ON appointments.doctor_id = doctors.doctor_id 
        WHERE appointments.patient_id = '{$patientNumber}' and appointments.consultation=0 and appointments.date>='{$today}'
        ORDER BY appointments.date DESC, appointments.slot DESC;";
        $run = mysqli_query($conn,$sql);
        // echo $sql;
        $appointmentLists = array();
        if(mysqli_num_rows($run)>0)
        {
            while($row = mysqli_fetch_assoc($run))
            {
                $appointmentLists[] = array($row);
            }
            echo json_encode($appointmentLists);
        }
        else
        {
            echo 0;
        }
    }
    if(isset($_POST["patientLogin"]))
    {
        $patientNumber = $_POST["patientNumber"];
        $patientPassword = $_POST["patientPassword"];

        $sql = "SELECT * FROM patients where patient_number='{$patientNumber}'";
        $run =mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0)
        {
            $row = mysqli_fetch_assoc($run);
            $verify = password_verify($patientPassword,$row["patient_password"]);
            if($verify)
            {
                
                echo json_encode($row);
            }
            else
            {
                echo "Invalid password";
            }
        }
        else 
        {
            echo "Please register to login";
        }
    }
    if(isset($_POST["patientRegister"]))
    {
        $patientName = $_POST["patientName"];
        $patientAge = $_POST["patientAge"];
        $patientNumber = $_POST["patientNumber"];
        $patientPassword = $_POST["patientPassword"];
        $patientPassword = password_hash($patientPassword,PASSWORD_DEFAULT);
        // $driver = new mysqli_driver();
        // $driver->report_mode = MYSQLI_REPORT_ALL;
        $sql = "INSERT INTO `patients`(`patient_name`, `patient_number`, `patient_password`, `patient_age`) VALUES ('{$patientName}','{$patientNumber}','{$patientPassword}','{$patientAge}')";
        try
        {
            mysqli_query($conn,$sql);
            echo header("Location: ../index.php");
        }
        catch (Exception  $e)
        {
            // echo "fail";
            echo header("Location: ../html_pages/patient_registration.html?patReg=f");

        }
        
    }
    if(isset($_POST["loginDoctor"]))
    {
        $doctorID = $_POST["inputID"];
        $password = $_POST["inputPassword"];
        $sql = "SELECT doctor_id,password from doctors where doctor_id='{$doctorID}'";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0) 
        {
            $row = mysqli_fetch_assoc($run);
            if($row["password"]==null)
            {
                $hashPaswd = password_hash($password,PASSWORD_DEFAULT);
                $updateSql = "UPDATE doctors set password ='{$hashPaswd}' where doctor_id='{$doctorID}'";
                $queryExec = mysqli_query($conn,$updateSql);

            }
            else
            {
                $verify = password_verify($password,$row["password"]);
                if($verify)
                {
                    echo header("Location: doctor_appointments.php?docId="."{$doctorID}");
                }
                else
                {
                    echo header("Location: ../html_pages/doctorLogin.html?status=wrong");
                }
            }
        }
        else 
        {
            echo header("Location: ../html_pages/doctorLogin.html?status=id");
        }
    }
    if(isset($_POST["updateCancelApp"]))
    {
        $doctor_ID = $_POST["doctor_id"];
        $selecteddate = $_POST["date"];
        $av_from_time = $_POST["av_from_time"];
        $av_to_time = $_POST["av_to_time"];
        $bk_from_time = $_POST["bk_from_time"];
        $bk_to_time = $_POST["bk_to_time"];
        $timeinterval = $_POST["timeInterval"];
        $availabilityTime = $av_from_time . "-" . $av_to_time;
        $breaktime = $bk_from_time . "-" . $bk_to_time;
        $sql_app_check = "SELECT * FROM appointments where doctor_id='{$doctor_ID}' and date='{$selecteddate}' and (slot>'{$bk_from_time}' or slot<'{$bk_to_time}')";
        $run = mysqli_query($conn,$sql_app_check);
        while($row = mysqli_fetch_assoc($run))
        {
            $deleteApp = "UPDATE appointments set consultation=3 where id={$row['id']}"; //update query instead of delete
            $runDelete = mysqli_query($conn,$deleteApp);
        }
        $sql = "UPDATE `slots` SET `available_time`='{$availabilityTime}',`break_time`='{$breaktime}',`time_interval`={$timeinterval} WHERE date='{$selecteddate}' and doctor_id='{$doctor_ID}'";
        $run = mysqli_query($conn,$sql);

        echo "success";
    }
    if(isset($_POST["updateEdittime"]))
    {
        $doctor_ID = $_POST["doctor_id"];
        $selecteddate = $_POST["date"];
        $av_from_time = $_POST["av_from_time"];
        $av_to_time = $_POST["av_to_time"];
        $bk_from_time = $_POST["bk_from_time"];
        $bk_to_time = $_POST["bk_to_time"];
        $timeinterval = $_POST["timeInterval"];
        $availabilityTime = $av_from_time . "-" . $av_to_time;
        $breaktime = $bk_from_time . "-" . $bk_to_time;
        $sql_app_check = "SELECT * FROM appointments where doctor_id='{$doctor_ID}' and date='{$selecteddate}' and (slot>'{$bk_from_time}' or slot<'{$bk_to_time}')";
        $run_check = mysqli_query($conn,$sql_app_check);
        if(mysqli_num_rows($run_check)>0)
        {
            echo "warn";
            // $sql = "UPDATE `slots` SET `available_time`='{$availabilityTime}',`break_time`='{$breaktime}',`time_interval`={$timeinterval} WHERE date='{$selecteddate}' and doctor_id='{$doctor_ID}'";
            // $run = mysqli_query($conn,$sql);

            // while($row = mysqli_fetch_assoc($run_check))
            // {
            //     $deleteApp = "UPDATE appointments set 'consultation'=3 where id={$row['id']}"; //update query instead of delete
            //     $runDelete = mysqli_query($conn,$deleteApp);

            // }
            // header("Location: ../html_pages/availability.html?docid=".$doctor_ID."&status=fail");
        }
        else 
        {
            $sql = "UPDATE `slots` SET `available_time`='{$availabilityTime}',`break_time`='{$breaktime}',`time_interval`={$timeinterval} WHERE date='{$selecteddate}' and doctor_id='{$doctor_ID}'";
            $run = mysqli_query($conn,$sql);
            echo "success";
            // header("Location: ../html_pages/availability.html?docid=".$doctor_ID);
        }
    }
    if(isset($_POST["patnum"]))
    {
        $patNum = $_POST["patnum"];
        $finalDate = $_POST["date"];
        $timeSlot = $_POST["slot"];
        $sql = "SELECT * FROM appointments where patient_id='{$patNum}' and date='{$finalDate}' and slot='{$timeSlot}'";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0)
        {
            echo "fail";
        }
        else
        {
            echo $sql;
        }
    }
    if(isset($_POST["checkDate"]))
    {
        $doctor_ID = $_POST["checkDate"];
        $selecteddate = $_POST["date"];
        $sql = "SELECT * FROM slots where doctor_id='{$doctor_ID}' and date='{$selecteddate}'";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)<=0)
        {
            echo "success";
        }
        else 
        {
            echo "fail";
        }
    }
    if(isset($_POST["getSlotDetails"]))
    {
        $doc_id = $_POST["doc_id"];
        $date = $_POST["date"];
        $sql = "SELECT * FROM slots where doctor_id='{$doc_id}' and date='{$date}'";
        $run = mysqli_query($conn,$sql);
        $slotdata = array();
        if(mysqli_num_rows($run)>0)
        {
            $row = mysqli_fetch_assoc($run);
            $sql = "SELECT doctor_name FROM doctors where doctor_id='{$row["doctor_id"]}'";
            $run = mysqli_query($conn,$sql);
            $nameRow = mysqli_fetch_assoc($run);
            $slotdata[] = array(
                "doctor_name"=>$nameRow["doctor_name"],
                "doctor_id"=>$row["doctor_id"],
                "date"=>$row["date"],
                "available_time"=>$row["available_time"],
                "break_time"=>$row["break_time"],
                "time_interval"=>$row["time_interval"]
            );
            echo json_encode($slotdata);
        }
    }
    if(isset($_POST["updatetime"]))
    {
        $doctor_ID = $_POST["doctor_id"];
        echo $doctor_ID;
        $selecteddate = $_POST["date"];
        $av_from_time = $_POST["av_from_time"];
        $av_to_time = $_POST["av_to_time"];
        $bk_from_time = $_POST["bk_from_time"];
        $bk_to_time = $_POST["bk_to_time"];
        $time_interval = $_POST["timeInterval"];
        $availabilityTime = $av_from_time . "-" . $av_to_time;
        $breaktime = $bk_from_time . "-" . $bk_to_time;
        $sql = "SELECT * FROM slots where doctor_id='{$doctor_ID}' and date='{$selecteddate}'";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)<=0)
        {
            $sql = "INSERT INTO slots ( `doctor_id`, `date`, `available_time`, `break_time`,`time_interval`) VALUES ('{$doctor_ID}','{$selecteddate}','{$availabilityTime}','{$breaktime}',{$time_interval})";
            $run = mysqli_query($conn,$sql);

            $sqlBreaks = "INSERT INTO `breaks`( `doctor_id`, `date`, `break_start`, `break_end`) VALUES ('$doctor_ID','$selecteddate','$bk_from_time','$bk_to_time')";
            $runAddBreak = mysqli_query($conn,$sqlBreaks);
            
            header("Location: ../html_pages/availability.html?docid=".$doctor_ID);
        }
        else 
        {
            echo "fail";
        }
    }
    if (isset($_POST["departmentList"]))
    {
        $listOfDepartments = array();
        $sql = "SELECT * FROM department";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run))
        {
            while($row = mysqli_fetch_assoc($run))
            {
                $listOfDepartments[] = array(
                    "dept_id"=>$row["department_id"],
                    "dept_name"=>$row["department_name"]
                );
            }
        }
        echo json_encode($listOfDepartments);
    }
    if(isset($_POST["nameList"]))
    {
        $listofnames = array();
        $sql = "SELECT * FROM doctors";
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run))
        {
            while($row = mysqli_fetch_assoc($run))
            {
                $listofnames[] = array(
                    "doc_id"=>$row["doctor_id"],
                    "doc_name"=>$row["doctor_name"]
                );
            }
        }
        echo json_encode($listofnames);
    }
    if(isset($_POST['dept']))
    {
        $listofdoctors=array();
        $dept_id = $_POST['dept'];
        $sql = "SELECT * FROM doctors where dept_id=".$dept_id;
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0) 
        {
            
            while($row = mysqli_fetch_assoc($run))
            {
                $listofdoctors[] = array(
                    "doctor_name" => $row['doctor_name'],
                    "experience" => $row['experience'],
                    "fee" => $row['consultation_fee'],
                    "doc_id"=>$row['doctor_id']
                );
            }
        }
        echo json_encode($listofdoctors);
        
    }
    
    if(isset($_POST["addDoctor"]))
    {
        $name = $_POST["doc_name"];
        $lastName = $_POST["last_name"];
        $sql_name_check = "SELECT * from doctors where doctor_name='{$name}' and last_name='{$lastName}'";
        
        $run = mysqli_query($conn,$sql_name_check);
        
        if(mysqli_num_rows($run)>0)
        {
            echo header("Location: ../html_pages/add_doctors.html?status=name");
            exit; 
        }
        else 
        {
            $sql = "SELECT max(id) as 'id' from doctors";
            $run = mysqli_query($conn,$sql);
            $row = mysqli_fetch_assoc($run);
            $newId = $row['id']+1;
            $newId = "doc".$newId;
            $exp = (int)$_POST["exp"];
            $fee = (int)$_POST["fee"];
            $dept_id = (int)$_POST["department"];
            echo $dept_id;
            $sql_insert = "INSERT INTO `doctors` (`doctor_id`, `doctor_name`,`last_name`, `dept_id`, `experience`, `consultation_fee`) VALUES ('{$newId}', '{$name}','{$lastName}', $dept_id, $exp, $fee)";
            try 
            {
                $run = mysqli_query($conn,$sql_insert);                
                header("Location: ../html_pages/add_doctors.html?status=".$newId);
            } catch (Exception $th) 
            {
                header("Location: ../html_pages/add_doctors.html?status=f");
            }
        }
    }

    if(isset($_POST["doctorID"]) && isset($_POST["date"]))
    {
        $doctorID= $_POST["doctorID"];
        $date = $_POST["date"];
        $sql = "SELECT * FROM slots WHERE doctor_id='{$doctorID}' and date='{$date}'";
        
        $run = mysqli_query($conn,$sql);
        $doctorAvailability = array();
        if(mysqli_num_rows($run)>0)
        {
            $availableTime = array();
            
            while($row = mysqli_fetch_assoc($run))
            {
                $availableTime[] = array(
                    "date"=>$row["date"],
                    "available_time"=>$row["available_time"],
                    "break_time"=>$row["break_time"],
                    
                );
                $doctorAvailability["time_interval"] = $row["time_interval"];
            }
            $doctorAvailability["available"] = $availableTime;
            $sql = "SELECT * FROM appointments WHERE doctor_id='{$doctorID}' and date='{$date}'";
            $bookedTime = array();
            $run = mysqli_query($conn,$sql);
            if(mysqli_num_rows($run)>0) 
            {
                
                while($row = mysqli_fetch_assoc($run))
                {
                    $bookedTime[] = array(
                        "date"=>$row["date"],
                        "slot"=>$row["slot"],
                       
                    );
                }
                $doctorAvailability["booked"] = $bookedTime;
            }
            else
            {
                $doctorAvailability["booked"]= $bookedTime;
            }
            $breakTimes= array();
            $getBreaks = "SELECT * from breaks where doctor_id='$doctorID' and date='$date'";
            $runGetBreaks = mysqli_query($conn,$getBreaks);
            if(mysqli_num_rows($runGetBreaks)>0)
            {
                while ($row=mysqli_fetch_assoc($runGetBreaks))
                {
                    $breaktimes[] = array("breakslot"=>$row["break_start"].'-'.$row["break_end"],"date"=>$row["date"]);
                }
                $doctorAvailability["breaks"] = $breaktimes;
            }
            else 
            {
                $doctorAvailability["breaks"] = $breaktimes;
            }
            echo json_encode($doctorAvailability);
        }
        else
        {
            echo 0;
        }
        
    }

    if(isset($_POST["doctorid"]) && isset($_POST["date"]) && isset($_POST["slot"]))
    {
        $doctorID = $_POST["doctorid"];
        $date  = $_POST["date"];
        $slot = $_POST["slot"];
        $patID = $_POST["patID"];
        $patName = $_POST["patName"];
        $sql = "INSERT INTO `appointments` (`doctor_id`, `date`, `slot`, `patient_id`, `patient_name`) VALUES ('{$doctorID}','{$date}','{$slot}','{$patID}','{$patName}')";
        $run = mysqli_query($conn,$sql);
        echo "Booking confirmed";
    }
?>