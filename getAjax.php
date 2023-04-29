<?php
    //connect to the database
    require_once('dbconnect.php');

    //create the sql query
    $query = "select * from `commodities`";
    
    $result = $con->query($query);

    $data = [];

        if($result != FALSE){
        while($row = $result->fetch())
        {
            $arr = [];
            $arr['id'] = $row['id'];
            $arr['name'] = $row['name'];
            $arr['information'] = $row['information'];
            $arr['code'] = $row['code'];
            
            $data[] = $arr;
        }
    }
        echo json_encode($data);