let video;
let poseNet;
const poseNett = ml5.poseNet();
let poses = [];
let skeletons = [];
let x = 480;
let y = 360;
let locked = false;
let overBox = false;
let hasStarted = false;
let count = 0;
let score = 0;
let poseI;
let posess = [];
let show = false;
let threshold = 0.2;
let acc;

let sum = 0;

const thigh1 = document.getElementById('thighs1');
const thigh2 = document.getElementById('thighs2');
const thigh3 = document.getElementById('thighs3');
const back1 = document.getElementById('back1');
const back2 = document.getElementById('back2');
const back3 = document.getElementById('back3');

const thigh11 = document.getElementById('thighs11');
const thigh22 = document.getElementById('thighs22');
const thigh33 = document.getElementById('thighs33');
const back11 = document.getElementById('back11');
const back22 = document.getElementById('back22');
const back33 = document.getElementById('back33');

function setup(){
    createCanvas(x, y);
    background(5, 0, 100);
    var name = 'Hi, I am here to help!';
    textSize(40);
    fill(255);
    nameWidht = textWidth(name);
    fill(255,0,100);
    textStyle(BOLD);
    text(name, (width - nameWidht)/2, height/2 - 40);
    startBtn = createButton('Let\'s do it!');
    startBtn.position(width/2 - 60, height/2);
    startBtn.style('display: inline-block');
    startBtn.style('border-radius: 200px');
    startBtn.style('font-weight: 300');
    startBtn.style('padding: 10px 30px');
    startBtn.style('background-color: #050064');
    startBtn.style('color: #00ffe2');
    startBtn.style('margin-right: 15px');
    startBtn.style(' border: 1px solid #00ffe2');

    startBtn.mousePressed(startCheck); //Calling function where part of pain is specified
    noLoop();
}


//---------------------Main Stuff-------------------//

function draw() {
    if(hasStarted){
        if(count==0){
            count++;
            removeElements();
            background(0);
            video = createCapture(VIDEO);
            video.size(width, height);

            // Create a new poseNet method with a single detection
            poseNet = ml5.poseNet(video, {detectionType: 'single'},modelReady);
            // This sets up an event that fills the global variable "poses"
            // with an posesay every time new poses are detected
            poseNet.on('pose', function (results) {
                poses = results;
                //console.log(poses);
                //Figure out what exercises will work and how to check how well the user does
                //Analyze performance and recommend other activities
            });
            // Hide the video element, and just show the canvas
            video.hide();
        }else{
            if(show){
                drawKeypoints(posess)
                drawSkeleton(posess);
            }else{
                if(posess.length>0 && poses.length>0){
                    for(let i = 0; i<17; i++){
                       sum = sum + (poses[0].pose.keypoints[i].position.y - posess[0].pose.keypoints[i].position.y);
                        //The difference algorithm as explained in gihub readme
                    }
                    acc = map(sum, 0, 1800, 100, 0);//Getting accuracy score
                    console.log(acc);
                    sum = 0;
                    score = acc;
                    
                }
                image(video, 0, 0, width, height);
                fill(0);
                textSize(32);
                text(score, 10, height-20);

                // We can call both functions to draw all keypoints and the skeletons
                drawKeypoints(poses);
                drawSkeleton(poses);
                fill(0,255,255);
                noStroke();
                rect(x-10,y-10,10, 10);
                if(mouseX>x-10 && mouseY >y-10){
                    overBox = true;
                }else{
                    overBox = false;
                }
            }
        }
    }
}

function mousePressed(){
    if(overBox){
        locked = true;
    }
}

function mouseDragged(){
    if(locked){
        x = mouseX;
        y = mouseY;
        resizeCanvas(x,y);
        video.size(width, height);
        poseNet = ml5.poseNet(video);
    }
}

function mouseReleased(){
    locked = false;
}

//-------------------Design and Stuff---------------//

//Do stuff like ask which part of their body needs help
function startCheck(){
    removeElements();
    background(5, 0, 100);
    var name = 'Where do you feel pain?';
    textSize(35);
    fill(255);
    nameWidht = textWidth(name);
    fill(255,0,100);
    textStyle(BOLD);
    text(name, (width - nameWidht)/2, height/2 - 60);

    backBtn = createButton('Back');
    thighBtn = createButton('Thighs');
    neckBtn = createButton('Neck');
    shoulderBtn = createButton('Shoulders');
    calfBtn = createButton('Calf');

    backBtn.position(width/2 - 170, height/2);
    backBtn.style('display: inline-block');
    backBtn.style('border-radius: 200px');
    backBtn.style('font-weight: 300');
    backBtn.style('padding: 10px 30px');
    backBtn.style('background-color: #050064');
    backBtn.style('color: #00ffe2');
    backBtn.style('margin-right: 15px');
    backBtn.style(' border: 1px solid #00ffe2');

    thighBtn.position(width/2-60, height/2);
    thighBtn.style('display: inline-block');
    thighBtn.style('border-radius: 200px');
    thighBtn.style('font-weight: 300');
    thighBtn.style('padding: 10px 30px');
    thighBtn.style('background-color: #050064');
    thighBtn.style('color: #00ffe2');
    thighBtn.style('margin-right: 15px');
    thighBtn.style(' border: 1px solid #00ffe2');

    neckBtn.position(width/2+60, height/2);
    neckBtn.style('display: inline-block');
    neckBtn.style('border-radius: 200px');
    neckBtn.style('font-weight: 300');
    neckBtn.style('padding: 10px 30px');
    neckBtn.style('background-color: #050064');
    neckBtn.style('color: #00ffe2');
    neckBtn.style('margin-right: 15px');
    neckBtn.style(' border: 1px solid #00ffe2');

    shoulderBtn.position(width/2-110, height/2+60);
    shoulderBtn.style('display: inline-block');
    shoulderBtn.style('border-radius: 200px');
    shoulderBtn.style('font-weight: 300');
    shoulderBtn.style('padding: 10px 30px');
    shoulderBtn.style('background-color: #050064');
    shoulderBtn.style('color: #00ffe2');
    shoulderBtn.style('margin-right: 15px');
    shoulderBtn.style(' border: 1px solid #00ffe2');

    calfBtn.position(width/2 + 30, height/2+60);
    calfBtn.style('display: inline-block');
    calfBtn.style('border-radius: 200px');
    calfBtn.style('font-weight: 300');
    calfBtn.style('padding: 10px 30px');
    calfBtn.style('background-color: #050064');
    calfBtn.style('color: #00ffe2');
    calfBtn.style('margin-right: 15px');
    calfBtn.style(' border: 1px solid #00ffe2');

    backBtn.mousePressed(()=>{
        back();//Calling function to run posenet with example exercise
    });
    neckBtn.mousePressed(()=>{
        back();//Calling function to run posenet with example exercise
    });
    calfBtn.mousePressed(()=>{
        thigh();//Calling function to run posenet with example exercise
    });
    shoulderBtn.mousePressed(()=>{
        back();//Calling function to run posenet with example exercise
    });
    thighBtn.mousePressed(()=>{
        thigh();//Calling function to run posenet with example exercise
    });

    noLoop();

}

//---------------Showing Relative Examples----------//

thigh1.style.visibility = 'hidden';
thigh2.style.visibility = 'hidden';
thigh3.style.visibility = 'hidden';
back1.style.visibility = 'hidden';
back2.style.visibility = 'hidden';
back3.style.visibility = 'hidden';

function thigh(){
    removeElements();
    background(0);
    hasStarted = true;
    loop();
    thigh3.style.visibility = 'visible';
    setTimeout(detectPoseT, 3000);
}

function back(){
    removeElements();
    background(0);
    hasStarted = true;
    loop();
    back2.style.visibility = 'visible';
    setTimeout(detectPoseB, 700);
}

//-------------Single Pose For Comparison-----------//


function detectPoseB() {
    poseNett.singlePose(back22).then((results) => {
        posess = results;
        console.log(posess);
        threshold = 0.06;
        show = false;//to show pose
    });
}
function detectPoseT() {
    poseNett.singlePose(thigh33).then((results) => {
        posess = results;
        console.log(posess);
        threshold = 0.06;
        show = false;
    });
}

function modelReady(){
    console.log('ModelReady');
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints(arr)  {
    // Loop through all the poses detected
    for (let i = 0; i < arr.length; i++) {
        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < arr[i].pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = arr[i].pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than threshold
            if (keypoint.score > threshold) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

//A function to draw the skeletons
function drawSkeleton(arr) {
    // Loop through all the skeletons detected
    for (let i = 0; i < arr.length; i++) {
        // For every skeleton, loop through all body connections
        for (let j = 0; j < arr[i].skeleton.length; j++) {
            let partA = arr[i].skeleton[j][0];
            let partB = arr[i].skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}
