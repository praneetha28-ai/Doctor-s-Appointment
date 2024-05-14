<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php 
        include('database.php');
        $sql = "SELECT * FROM `appointments` where doctor_id={$_GET["docId"]} ORDER BY date DESC ,slot DESC ";
        
        $run = mysqli_query($conn,$sql);
        if(mysqli_num_rows($run)>0)
        {
            $previousDate = null;
            $today = date("Y-m-d");
            while($row = mysqli_fetch_assoc($run))
            {
                $currentDate = $row["date"];

                if ($currentDate != $previousDate) 
                {
                    
                    if ($currentDate == $today) {
                        echo "<h3>Today</h3>";
                    } else {
                        echo "<h3>$currentDate</h3>";
                    }
                    $previousDate = $currentDate;
                }
                
                echo '<div class="card mx-auto" style="width: 38rem;margin: 15px;background-color: rgb(233, 233, 233);">';
                echo '   <div class="card-body">';
                echo'        <div style="display: flex;justify-content: space-between;align-items: center;align-content: center;">';
                echo'            <h5 class="card-title" style="text-align: center;margin-top: 10px;">Dr.'.$row["doctor_id"].'</h5>';
                echo'            <div style="display: flex;align-items: center;">';
                echo'                <img src="../assets/steth.png" alt="" width="25px" height="25px">';
                echo'                <h6 class="card-subtitle mt-1 text-muted">Dentist</h6>';
                echo'            </div>';
                echo'        </div>';
                echo'        <br>';

                echo'        <p class="card-text">Dr.'.$row["doctor_id"].' is having an appointment with '. $row["patient_name"].' on <b>'.$row["date"].'</b> at <b>'.$row["slot"].'</b></p>';       
                echo'    </div>';
                echo '</div> ';
            }
        }
        else 
        {
            echo "No appointments";
        }
    ?>
    </body>
</html>