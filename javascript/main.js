//When the page is first loaded, get a data list
let widgetList = [];

let getDataAjax = () => {

    request = new XMLHttpRequest();
    request.onload = function () {
        var response = request.responseText;
        var ar = JSON.parse(response);

        ar.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });


        for (let i = 0; i < ar.length; i++) {
            cat = document.createElement("li");
            cat.classList.add("items");
            cat.innerHTML = ar[i]['name'];
            cat.onclick = function () {
                addWidget(i, ar);
            }
            document.getElementById("drop").appendChild(cat);
        }
    }

    request.open("GET", "getAjax.php");
    request.send("");
}


function addWidget(index, ar) {

    //Check if clicked value already exists in the widgetList
    var has = false;
    if (widgetList.length != 0) {
        for (let i = 0; i < widgetList.length; i++) {
            if (ar[index]['name'] == widgetList[i]['name']) {
                has = true;
            }
        }
    }

    //if clicked value doesn't exist in the widgetList, then create new
    if (has == false) {
        widgetList.push(ar[index]);
        showWidgetList();
    }

}



function showWidgetList() {
    const lists = document.getElementsByClassName("lists");
    while (lists[0].hasChildNodes()) {
        lists[0].removeChild(lists[0].lastChild);
    }

    for (let i = 0; i < widgetList.length; i++) {

        content = document.createElement("div");
        content.classList.add("content");
        lists[0].appendChild(content);

        var cId = widgetList[i]['id'];
        var idx = i;

        var comName = document.createElement("h3");
        var comDisc = document.createElement("h5");
        comName.innerHTML = widgetList[i]['name'];
        comDisc.innerHTML = widgetList[i]['information'];

        var delBtn = new createBtn("X", "btnDelete", idx, 'delete');
        var showBtn = new createBtn("* Show", "btnShow", idx, 'show');
        var addBtn = new createBtn("+ Add", "btnAdd", idx, 'add');


        content.appendChild(comName);
        content.appendChild(comDisc);
        content.appendChild(delBtn);
        content.appendChild(showBtn);
        content.appendChild(addBtn);
    }
    console.log(widgetList);
}



//Creates a button element, passes innerHTML, className, id number
function createBtn(bText, bClass, idx, func) {
    var create = document.createElement("button");
    create.type = "button";
    create.innerHTML = bText;
    create.classList.add(bClass);
    create.onclick = function () {
        if (func == 'delete') deleteWidget(idx);
        else fetchData(widgetList[idx]['code'], func);
    }

    return create;
}

//When click "X" button in the widget, delete itself
function deleteWidget(idx) {
    widgetList.splice(idx, 1);
    showWidgetList();
}



var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        maintainAspectRatio: false,
        title: {
            text: 'Chart.js Time Scale'
        },
    }
};

var myChart;


function fetchData(code, func) {
    /// use Fetch API send a request to get the Information
    fetch("getGraphData.php?code=" + code)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok'); // if the request is failed
            return res.json(); // Trasnlate JSON data -> JavaScript
        })
        .then(data => {
            //Store date&value to each arrays
            var dateArray = [];
            var numArray = [];
            if (data && data.data) {
                for (var i = 0; i < Object.keys(data.data).length; i++) {
                    dateArray.push(data.data[i].date);
                    numArray.push(data.data[i].value);
                }
            }

            if (func === 'show') {
                showGraph(code, dateArray, numArray);
            } else if (func === 'add') {
                addGraph(code, dateArray, numArray);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


let showGraph = (code, dateArray, numArray) => {
    console.log("show new data");

    //Destroy previous chart
    clearGraph();

    //INITIALISE a dataset and labels in the config
    config.data.labels = dateArray;
    config.data.datasets = [];

    generateDataset(code, dateArray, numArray);
    var ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, config);

}



let addGraph = (code, dateArray, numArray) => {
    
    //Check if the Dataset is already added to the graph
    var exist = false;
    for (var i = 0; i < config.data.datasets.length; i++) {
        if (config.data.datasets[i].label == code) {
            exist = true;
            console.log("already exists");
            break;
        }
    }

    if (!exist) {
        console.log("add data!");
        generateDataset(code, dateArray, numArray);
        myChart.update();
    }
}


let generateDataset = (code, dateArray, numArray) => {
    //Add dataset with random colour
    var color1 = Math.floor(Math.random() * 256);
    var color2 = Math.floor(Math.random() * 256);
    var color3 = Math.floor(Math.random() * 256);
    var setColor = 'rgba(' + color1 + ', ' + color2 + ', ' + color3 + ', 1)';

    var newDataset = {
        label: code,
        borderColor: setColor,
        backgroundColor: setColor,
        data: [],
        fill: false
    }

    // insert the data into newDataset
    for (var i = 0; i < dateArray.length; i++) {
        newDataset.data.push(numArray[i]);
    }

    //Add a new dataset, maintaining existing chart
    config.data.datasets.push(newDataset);
}



//Clear all data in the canvas and generate new canvas
function clearGraph() {
    //Destroy previous chart
    if (myChart != undefined) {
        myChart.destroy();
        console.log("destroy");
    }
    console.log("clear");
}
