let poses = [];
let skeletons = [];
const thighs1 = document.getElementById("thighs1");
const poseNet = ml5.poseNet();
setTimeout(detectPose, 3000);

function setup(){
    createCanvas(480, 360);
    background(0);
}
function detectPose() {
  poseNet.singlePose(thighs1).then((results) => {
      poses = results;
      console.log(poses);
      drawKeypoints();
      drawSkeleton();
  });
}

function modelLoaded(){
    console.log('modelloaded');
}

function draw(){
}


function drawKeypoints()  {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = poses[i].pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.3) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

//A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        // For every skeleton, loop through all body connections
        for (let j = 0; j < poses[i].skeleton.length; j++) {
            let partA = poses[i].skeleton[j][0];
            let partB = poses[i].skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}