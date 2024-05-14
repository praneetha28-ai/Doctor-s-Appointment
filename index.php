<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

    <style>
        html {
            scroll-behavior: smooth;
        }

        .scrollable-cards-container_1,scrollable-cards-container_1 {
            display: flex;
            justify-content: space-evenly;
            margin: 15px;
             /* Prevent cards from wrapping */
            /* width: 3000px; */
        }
        .scrollable-cards-container .card{
            border-radius: 10px;
            
        }
        
        .nav-link:hover{
            border-bottom: 2px solid #1e128b;
            color: #1e128b;
            padding-bottom: 3px;
            font-weight: 600;
        }
        .nav-link{
            color: black;
        }
        body{
            background-color: rgb(233, 233, 233);
        }
        .spl_class{
            margin: 10px;
        }
        #doctors{
            /* text-align: center; */
            
            margin-right: 25px;
            overflow-y: scroll;
            align-items: center;
            align-content: center;
            align-self: center;
            max-height: 700px;
        }
        #doctor{
            border: 1px solid black;
            margin-top: 5px;
            padding: 10px;
            width: 550px;
        }
        .pageContent{
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            margin-top: 10px;
        }
        #time-slots {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 10px;
        }
        #confirm{
            width: 250px;
            height: 50px;
            text-align: center;

        }
        #myDate{
            width: 300px;
        }
        
        .time-slot-indv {
            width: calc(25% - 10px); /* Adjust width based on the number of items per row */
            margin-bottom: 10px;
            border: 1px solid #ccc;
            padding: 5px;
            box-sizing: border-box;
        }
        .bookings{
            text-align: center;
            display: flex;
            flex-direction: column;
            padding: 10px;
            align-content: center;
            width: 50%;
        }
        .header{
            display: flex;
            justify-content: space-between;
            margin: 50px;
        }
        .register{
            display: flex;
            justify-content: space-around;
            width: 300px;
        }
        #specialist{
            border: 1px black;
            width: 100px;
        }
    </style>
</head>
<body>
    <!-- 343A40 -->
<div class="container-fluid" >
        <div class="navbar  justify-content-space">
        <ul class="nav justify-content-end">
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <img src="onl_doc.png" alt="" width="75px" height="75px">
                    </div>
                </li>
                <li class="nav-item" style="align-self: center;">
                    <div style="display: flex;justify-content: center;margin: 15px;color:#1e128b">
                        <h3>DocConnect</h3>
                    </div>
                </li>
            </ul>
            <ul class="nav justify-content-center">
                <li class="nav-item" >
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="index.php">Home</a>
                    </div>
                </li>
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="php_pages/appointments.php">Appointments</a>
                    </div>
                </li>
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="#">About Us</a>
                    </div>
                </li>
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;">
                        <a class="nav-link" href="#">Contact Us</a>
                    </div>
                </li>
            </ul>
            <ul class="nav justify-content-end">
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;background-color:#1e128b;border-radius: 8px;color: white">
                        <a class="nav-link" href="index.php" style="color: white;">Login As Doctor</a>
                    </div>
                </li>
                <li class="nav-item">
                    <div style="display: flex;justify-content: center;margin: 15px;background-color:#1e128b;border-radius: 8px;color: white">
                    <a class="nav-link" href="index.php" style="color: white;">Register Here</a>
                    </div>
                </li>
            </ul>
        </div> 
        <div class="card text-white" style="margin-top: 10px; background-color: #1e128b;height: 450px;border-radius: 15px;margin-left: 45px;margin-right: 45px;">
            <div class="row" style="height: 450px;">
                <div class="col-md-4 align-self-center" style="margin-bottom: 30px;">
                    <div class="card-img-overlay" style="width: auto;position:relative">
                        <div style="display: flex;padding: 3px;margin: 5px;text-align: center;align-content: center;justify-content: space-evenly;width: 220px;align-items: center;">
                            <h2 class="card-title" style="font-weight: 800;font-size: 40px;">Book</h2>
                            <h4 class="card-title" style="text-align: center;margin-top: 15px">your</h4>
                        </div>
                        <div style="margin: 5px;padding: 3px;align-items: center;width: 300px;text-align: center;">
                            <h2 class="card-title" style="font-weight: 800;font-size: 40px;">Appointment</h2>
                        </div>
                       
                        <div style="display: flex;padding: 3px;margin: 5px;text-align: center;align-content: center;justify-content: space-evenly;width: 300px;align-items: center;">
                            <h2 class="card-title" style="font-weight: 800;font-size: 40px;">Online</h2>
                            <h4 class="card-title" style="margin-bottom: 3px;">with</h4>
                            <h2 class="card-title" style="font-weight: 800;font-size: 40px;">Us</h2>
                        </div>
                        
                    </div>
                </div>
                <div class="col-md-4 align-self-center">
                    <button class="btn" style="background-color: white;width: 100%" onclick="viewSpecialists()">View All our Specialists</button>
                </div>
                <div class="col-md-4 align-self-start">
                    <img class="card-img" src="medical-team.png" alt="Card image" width="100px" height="500px">
                </div>
            </div>
        </div>
        <div style="margin-top: 70px;text-align: center;margin-bottom:35px">
            <h3>Our Specialists</h3>
            <hr>
        </div>
        <div class="scrollable-cards-container" id="scrollable-cards-container">

        <div class="scrollable-cards-container_1" >
            <div class="card" style="height: 150px;width: 400px;background-color:white;color:#343A40" onclick="getDoctorList(104)" id="specialist_104">
                <div class="row no-gutters" >
                    <div class="col-md-8">
                        <div class="card-img-overlay" style="width: 400px;">
                            <div style="margin: 5px;padding: 3px;align-items: center;width: 300px;text-align: left;">
                                <h4 class="card-title" style="font-weight: 300;font-size: 30px;margin-top: 15px;">ENT Specialist</h4>
                            </div> 
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img class="card-img" src="ent.png" alt="Card image">
                    </div>
                </div>
            </div>
            <div class="card " style="height: 150px;width: 400px;background-color:white;color:#343A40" onclick="getDoctorList(103)" id="specialist_103">
                <div class="row no-gutters" >
                    <div class="col-md-8">
                        <div class="card-img-overlay" style="width: 400px;">
                            <div style="margin: 5px;padding: 3px;align-items: center;width: 300px;text-align: left;">
                                <h4 class="card-title" style="font-weight: 300;font-size: 30px;margin-top: 15px;margin-right: 15px;">Dermatologist</h4>
                            </div> 
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img class="card-img" src="derma.png" alt="Card image">
                    </div>
                </div>
            </div>
            <div class="card " style="height: 150px;width: 400px;background-color:white;color:#343A40" onclick="getDoctorList(101)" id="specialist_101">
                <div class="row no-gutters" >
                    <div class="col-md-8">
                        <div class="card-img-overlay" style="width: 400px;">
                            <div style="margin: 5px;padding: 3px;align-items: center;width: 300px;text-align: left;">
                                <h4 class="card-title" style="font-weight: 300;font-size: 30px;margin-top:1px ;">General </h4>
                                <h4 class="card-title" style="font-weight: 300;font-size: 30px;">Physician </h4>
                            </div> 
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img class="card-img" src="general.png" alt="Card image" width="80px">
                    </div>
                </div>
            </div>
        </div>
        <div class="scrollable-cards-container_1" >
            <div class="card " style="height: 150px;width: 400px;background-color:white;color:#343A40" onclick="getDoctorList(102)" id="specialist_102">
                <div class="row no-gutters" >
                    <div class="col-md-8">
                        <div class="card-img-overlay" style="width: 400px;">
                            <div style="margin: 5px;padding: 3px;align-items: center;width: 300px;text-align: left;">
                                <h4 class="card-title" style="font-weight: 300;font-size: 30px;margin-top: 15px;margin-right: 15px;">Dentist</h4>
                            </div> 
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img class="card-img" src="dentist.png" alt="Card image">
                    </div>
                </div>
            </div>
            <div class="card " style="height: 150px;width: 400px;background-color:white;color:#343A40" onclick="getDoctorList(105)" id="specialist_105">
                <div class="row no-gutters" >
                    <div class="col-md-8">
                        <div class="card-img-overlay" style="width: 400px;">
                            <div style="margin: 5px;padding: 3px;align-items: center;width: 300px;text-align: left;">
                                <h4 class="card-title" style="font-weight: 300;font-size: 30px;margin-top: 15px;margin-right: 15px;">Homeopathy</h4>
                            </div> 
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img class="card-img" src="homeopathy.png" alt="Card image">
                    </div>
                </div>
            </div>
            <div class="card " style="height: 150px;width: 400px;background-color:white;color:#343A40" onclick="getDoctorList(106)" id="specialist_106">
                <div class="row no-gutters" >
                    <div class="col-md-8">
                        <div class="card-img-overlay" style="width: 400px;">
                            <div style="margin: 5px;padding: 3px;align-items: center;width: 300px;text-align: left;">
                                <h4 class="card-title" style="font-weight: 300;font-size: 30px;margin-top: 15px;margin-right: 15px;">Ayurveda</h4>
                            </div> 
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img class="card-img" src="ayurveda.png" alt="Card image">
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    <div class="pageContent" id="pageContent">
        <div id="doctors" style="padding: 10px;">

        </div>
        <div class="bookings" id="bookings">
            <div class="time-slots" id="timeslotsgrid">

            </div>
        </div>
    </div>
    <script src="scripts/doctor_Script.js"></script>
</body>
</html>