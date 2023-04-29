<?php
    try{
        $con = new PDO('mysql:host=learn-mysql.cms.waikato.ac.nz;dbname=jk296','jk296','my209452sql');
    } catch(PDOException $e){
        echo "Database connection error ". $e->getMessage();
    }