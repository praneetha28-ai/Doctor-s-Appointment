<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <style>
        .nav-link:hover{
            border-bottom: 2px solid #1e128b;
            color: #1e128b;
            padding-bottom: 3px;
            font-weight: 600;
        }
        .nav-link{
            color: black;
        }
        .nav-item.active .nav-link {
            border-bottom: 2px solid #1e128b;
            color: #1e128b;
            font-weight: 600;
        }
        
    </style>
</head>
<body>
    <div class="container-fluid">
    <div class="navbar justify-content-space">
        <ul class="nav justify-content-end">
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <img src="../assets/onl_doc.png" alt="" width="75px" height="75px">
                    </div>
                </li>
                <li class="nav-item" style="align-self: center;">
                    <div style="display: flex;justify-content: center;margin: 15px;color:#1e128b">
                        <h3>DocConnect</h3>
                    </div>
                </li>
        </ul>
        <ul class="nav" style="justify-content: space-between;display: flex">
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="../index.php">Home</a>
                    </div>
                </li>
                <li class="nav-item active" id="activeApplications">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="#">My Appointments</a>
                    </div>
                </li>
                <li class="nav-item" id="activeApplications">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="doctor_past_appointments.php?docId=<?php echo $_GET["docId"]; ?>">Past Appointments</a>
                    </div>
                </li>
                <li class="nav-item" id="activeApplications">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="../html_pages/availability.html?docid=<?php echo $_GET["docId"]; ?>">My Availability</a>
                    </div>
                </li>
                <li>
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" style="background-color: #1e128b;color: white;border-radius: 5px;" href="../index.php">Logout</a>
                    </div>
                </li>

        </ul>
        </div>
    </div>
    <div class="container">
<?php 
        include('database.php');
        $today = date('Y-m-d');
        $sql = "SELECT appointments.*,doctors.doctor_name FROM `appointments` JOIN doctors ON appointments.doctor_id = doctors.doctor_id  where appointments.doctor_id='{$_GET["docId"]}' and appointments.consultation=0 and appointments.date>='{$today}' ORDER BY date DESC ,slot DESC ";
        
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0)
        {
            $previousDate = null;
            $today = date("Y-m-d");
            while($row = mysqli_fetch_assoc($run))
            {
                
                date_default_timezone_set("Asia/Kolkata");
                $currentDateTime = date('Y-m-d H:i');
                echo '<div class="card mx-auto" style="width: 38rem;margin: 15px;background-color: rgb(233, 233, 233);">';
                echo '   <div class="card-body">';
                echo'        <div style="display: flex;justify-content: space-between;align-items: center;align-content: center;">';
                echo'            <h5 class="card-title" style="text-align: center;margin-top: 10px;">Dr.'.$row["doctor_name"].'</h5>';
                echo'            <div style="display: flex;align-items: center;">';
                echo'                <img src="../assets/steth.png" alt="" width="25px" height="25px">';
                echo'                <h6 class="card-subtitle mt-1 text-muted">Dentist</h6>';
                echo'            </div>';

                $appointmentDateTime = $row["date"] . ' ' . $row["slot"];
                // echo $currentDateTime;
               $today = date('Y-m-d H:s');
            //    echo $today;
                $checkDateTime = strtotime($appointmentDateTime) > strtotime($today);
                $disabledAttribute = $checkDateTime?'disabled':"";
                $consultbuttonColor = $checkDateTime?"grey":"green";
                $availableButtonColot = $checkDateTime?"grey":"red";
                echo '           <button class="btn" style="background-color: '.$consultbuttonColor.'; color: white;" onclick="markConsultComplete(' . $row["id"] . ',1)" ' . $disabledAttribute . '>Consulted</button>';
                echo '           <button class="btn" style="background-color: '.$availableButtonColot.'; color: white;" onclick="markConsultComplete(' . $row["id"] . ',2)" ' . $disabledAttribute . '>Patient Unavailable</button>';
                echo'        </div>';
                echo'        <br>';

                echo'        <p class="card-text">You are having an appointment with '. $row["patient_name"].' on <b>'.$row["date"].'</b> at <b>'.$row["slot"].'</b></p>';       
                echo'    </div>';
                echo '</div> ';
            }
        }
        else 
        {
            echo "No active appointments to show";
            echo "<br>";
            echo "<button class='btn ' onclick=pastAppointments('{$_GET['docId']}') style='background-color: #1e128b;color: white'> View Past Appointments</button>";
        }
    ?>
    </div>
    <script>
        function pastAppointments(doctorId)
        {
            window.location.href = "doctor_past_appointments.php?docId="+doctorId;
        }
        </script>
    <script src="../scripts/doctorScript.js"></script>
    </body>
</html>