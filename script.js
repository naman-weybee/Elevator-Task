//  ===============================================================================
//  -------------------------------- Elevator Task --------------------------------
//  ===============================================================================

let Elevators = document.querySelector(".elevators");
let Floors = document.querySelector(".floors");
let Mentanance = document.querySelector('.mentanance');
let LiftStatus = document.querySelector('.lift-status');
let Overlay = document.querySelector('.over');
let BtnReset = document.querySelector('.reset');
let BtnStatus = document.querySelector('.status');
let LiftContainer = [];
let movableLifts = [];

var LiftNumbers = 3;
var FloorNumbers = 7;

function init() {
    for (let i = 0; i < LiftNumbers; i++) {
        let Lift = `<div class = "lift" id = "lift-${i}"><div class = "lift-box" id = "lift-box-${i}"> 0 </div></div>`;
        Elevators.insertAdjacentHTML("afterbegin", Lift);
        LiftContainer.push({
            LiftId: `lift-${i}`,
            isChecked: false,
            LiftPosition: 0,
            isMoving: false,
            isAvailable: `Available`,
            LiftNumber: `${i}`,
            LiftCompartment: `${i}`,
        });
    }

    for (let i = 0; i < FloorNumbers; i++) {
        let Floor = `<button class = "floor" id = "floor-${i}" onclick = "Movements(id)" > Floor - ${i}</button>`;
        Floors.insertAdjacentHTML("afterbegin", Floor);
    }

    let lifts = document.querySelectorAll(".lift");
    for (let lift of lifts) {
        lift.style.height = `${3 * FloorNumbers}em`;
    }

    for (let lift of LiftContainer) {
        let cb = `<div class="cb-box"><input type="checkbox" class="cb" id="cb-${lift.LiftNumber}" onchange="EditMentanance(id)"></div>`;
        Mentanance.insertAdjacentHTML("afterbegin", cb);
    }
}
init();

//  ------------------ Shortest Distance Lift Compartment ------------------
function Movements(id) {
    let movableLifts = LiftContainer.filter(lift => lift.isChecked == false);
    if (movableLifts.length == 0) {
        console.log(`Sorry, All the Lifts are in Mentanance...🥺`);
    } else {
        let MinDistanceLift = [];
        let index = id.split("-");
        let distance = movableLifts.filter(lift => lift = lift.isMoving == false).map(lift => Math.abs(index[1] - lift.LiftPosition));
        let MinDistance = Math.min(...distance);
        movableLifts.forEach(lift => {
            if (Math.abs(index[1] - lift.LiftPosition) == MinDistance) {
                MinDistanceLift.push(lift);
            }
        });

        //  ------------------ Update UI ------------------
        let Liftcnt = MinDistanceLift[Math.floor(Math.random() * MinDistanceLift.length)];
        let cnt = Liftcnt.LiftNumber;
        let cur = Liftcnt.LiftPosition;
        document.querySelector(`#lift-box-${cnt}`).style.bottom = `${index[1] * 3}em`;
        document.querySelector(`#lift-box-${cnt}`).textContent = `${index[1]}`;
        document.querySelector(`#lift-box-${cnt}`).style.transition = `bottom ${Math.abs(index[1] - cur)*1}s`;
        LiftContainer[cnt].isMoving = true;
        document.getElementById(`floor-${index[1]}`).disabled = true;
        LiftContainer[cnt].LiftPosition = `${index[1]}`;
        setTimeout(function () {
            LiftContainer[cnt].isMoving = false;
            document.getElementById(`floor-${index[1]}`).disabled = false;
        }, 1000);
    }
}

//  -------------------------------- Reset --------------------------------
function Reset() {
    Floors.innerHTML = '';
    Elevators.innerHTML = '';
    Mentanance.innerHTML = '';
    LiftContainer.length = 0;
    movableLifts.length = 0;

    LiftNumbers = prompt("How many lifts do you want...?");
    if (LiftNumbers) {
        FloorNumbers = prompt("How many floors do you want...?");
        if (FloorNumbers) {
            FloorNumbers = FloorNumbers;
        } else {
            LiftNumbers = 3;
            FloorNumbers = 7;
        }
    } else {
        LiftNumbers = 3;
        FloorNumbers = 7;
    }
    init();
}

BtnReset.addEventListener('click', Reset);

//  -------------------------------- Edit Mentanance --------------------------------
function EditMentanance(id) {
    let Btncheck = document.getElementById(`${id}`);
    let Liftnum = id.split("-");
    if (Btncheck.checked) {
        LiftContainer.forEach(lift => {
            if (lift.LiftNumber == Liftnum[1]) {
                lift.isChecked = true;
                lift.isAvailable = `Not Available`;
                document.querySelector(`#lift-box-${lift.LiftNumber}`).classList.add('stop');
            }
        });
        movableLifts = LiftContainer.filter(lift => lift.isChecked == false);
    } else {
        LiftContainer.forEach(lift => {
            if (lift.LiftNumber == Liftnum[1]) {
                lift.isChecked = false;
                lift.isAvailable = `Available`;
                document.querySelector(`#lift-box-${lift.LiftNumber}`).classList.remove('stop');
            }
        });
        movableLifts = LiftContainer.filter(lift => lift.isChecked == false);
    }
}

//  -------------------------------- Lift Status --------------------------------
function Status() {
    LiftStatus.innerHTML = '';
    LiftStatus.style.display = 'block';
    Overlay.style.display = 'block';
    for (let lift of LiftContainer) {
        let info = `
        <div class = 'Liftstatus' id = 'status-${lift.LiftNumber}'>
        <span> Lift - ${lift.LiftNumber} : ${lift.isAvailable} </span>
        </div>`;
        LiftStatus.insertAdjacentHTML('afterbegin', info);
    }
}

function Normal() {
    Overlay.style.display = 'none';
    LiftStatus.style.display = 'none';
}

BtnStatus.addEventListener('click', Status);
Overlay.addEventListener('click', Normal);