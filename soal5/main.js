/*
    main.js
    Simulate Motion caused by Potential Energy

    Perystito siahaan | https://github.com/peryssiahaan/soal5
*/

// Define parameters' variable
var TBEG, TDATA, TEND, DT, TPROC, T, NDATA, IDATA, RDISPOSITION;
var MASS1, MASS2, DMASS1, DMASS2, GCONST;
var CLM1, CFM1, CLM2, CFM2;
var VALV1, VALV2, VALX1, VALX2, VALY1, VALY2, VALV1X, VALV1Y, VALV2X, VALV2Y;
var XMIN, XMAX, YMIN, YMAX;
var HEADER;
var h1, startBtn, oTA, can;
var PROC;

// call the main function
main();

// Define the main function
function main()
{
    createAndArrangeElements();
    initialParameters();
}

// Define initial paramters function
function initialParameters()
{
    // Set initial parameters
    TPROC = 1; 
    TBEG = 0;
    TEND = 0.1;
    DT = 0.0001;
    T = TBEG;
    TDATA = 0.001;
    NDATA = Math.round(TDATA/T);
    IDATA = NDATA;
    RDISPOSITION = 5;

    // Set physical system parameters of mass1 and mass2
    MASS1 = 0.01;
    DMASS1 = 0.01;
    MASS2 = 0.01;
    DMASS2 = 0.01;
    GCONST = 0.01;

    // Set color of mass1 and mass2 
    CLM1 = "#F00";
    CFM1 = "#FCC";
    CLM2 = "#00F";
    CFM2 = "#CCF";

    // Set initial conditions
    VALX1 = -0.01;
    VALY1 = 0;
    VALV1 = 0;
    VALV1X = VALV1;
    VALV1Y = 0;
    VALX2 = 0.01;
    VALY2 = 0;
    VALV2 = 0;
    VALV2X = VALV2;
    VALV2Y = 0;

    // Set drawing area
    XMIN = -0.02;
    YMIN = -0.01;
    XMAX = 0.02;
    YMAX = 0.01;

    // Display Header Information
    HEADER = "# t\tx1\ty1\tv1x\tv1y\tx2\ty2\tv2x\tv2y\n";
    oTA.value = HEADER;
}

function simulate()
{
    if(IDATA == NDATA)
    {
        // Display result on textarea
        oTA.value += T.toFixed(3) + "\t" 
            + VALX1.toFixed(4) + "\t" + VALY1.toFixed(4) + "\t"
            + VALV1X.toFixed(3) + "\t" + VALV1Y.toFixed(3) + "\t"
            + VALX2.toFixed(4) + "\t" + VALY2.toFixed(4) + "\t"
            + VALV2X.toFixed(3) + "\t" + VALV2Y.toFixed(3) + "\n";
        oTA.scrollTop = oTA.scrollHeight;

        // Display Mass position of canvas
        clearCanvas(can);
        drawMassOnCanvas(VALX1,VALY1,0.5*DMASS1,CLM1,CFM1,can);
        drawMassOnCanvas(VALX2,VALY2,0.5*DMASS2,CLM2,CFM2,can);

        IDATA = 0;
    }

    // Calculate overlap
    var L12 = Math.abs(VALX1-VALX2);
    var XI = Math.max(0,0.5*(DMASS1+DMASS2)-L12);
    var XIDOT = -Math.abs(VALV1 - VALV2) * Math.sign(XI);

    // Use Gravition force and 2nd law of motion
    var A1 = GCONST*MASS2/Math.pow(RDISPOSITION,2);
    var A2 = -GCONST*MASS1/Math.pow(RDISPOSITION,2);

    // Implement Euler Method
    VALV1 = VALV1 + A1*DT;
    VALX1 = VALX1 + VALV1*DT;

    VALV2 = VALV2 + A2*DT;
    VALX2 = VALX2 + VALV2*DT;

    // Terminate simulate if condition meets
    if(T >= TEND)
    {
        clearInterval(PROC);
        startBtn.innerHTML = "Start";
        startBtn.disabled = true;
    } else
    {
        T += DT;
        IDATA++;
    }
}

// Clear Canvas
function clearCanvas(can)
{
    var cx = can.getContext("2d");
    cx.clearRect(0,0,can.width,can.height);

}

// Display mass position of canvas
function drawMassOnCanvas(x, y, R, cLine, cFill, can)
{
    var cx = can.getContext("2d");

    // Get Canvas Coordinate
    var XMINCAN = 0;
    var XMAXCAN = can.width;
    var YMINCAN = can.height;
    var YMAXCAN = 0;

    // Draw mass
    var RR = tx(2*R) - tx(R);
    cx.beginPath();
    cx.strokeStyle = cLine;
    cx.lineWidth = 4;
    cx.arc(tx(x),ty(y),RR,0,2*Math.PI);
    cx.stroke();
    cx.fillStyle = cFill;
    cx.fill();

    // Transform x from real coordinate to canvas coordinate
    function tx(x)
    {
        var xx = (x - XMIN) / (XMAX - XMIN) * (XMAXCAN - XMINCAN) + XMINCAN;
        return xx;
    }

    // Transform y from real coordinate to canvas coordinate
    function ty(y)
    {
        var yy = (y - YMIN) / (YMAX - YMIN) * (YMAXCAN - YMINCAN) + YMINCAN;
        return yy;
    }
}

// Create and Arrange Elements
function createAndArrangeElements()
{
    // Create Header Elements
    h1 = document.createElement("h1");
    h1.innerHTML = "Motion Caused by Gravitional Force.";

    // Create Start Button
    startBtn = document.createElement("button");
    startBtn.innerHTML = "Start";
    startBtn.style.width = "48px";
    startBtn.style.float = "left";
    startBtn.addEventListener("click",startBtnHandler);

    // Create Output Textarea
    oTA = document.createElement("textarea");
    oTA.style.width = "600px";
    oTA.style.height = "150px";
    oTA.style.overflowY = "scroll";

    // Create a canvas
    can = document.createElement("canvas");
    can.width = "300";
    can.height = "150";
    can.style.width = can.width + "px";
    can.style.height = can.height + "px";
    can.style.border = "1px solid #CCC";

    // Arrange the elements
    document.body.appendChild(h1);
    document.body.appendChild(startBtn);
    document.body.appendChild(oTA);
    document.body.appendChild(can);
}

// Handle Start Button when clicked
function startBtnHandler()
{
    var cap = event.target.innerHTML;
    if(cap == "Start")
    {
        console.log("Start Button Clicked!");
        event.target.innerHTML = "Stop";
        PROC = setInterval(simulate,TPROC);
    } else
    {
        console.log("Stop Button Clicked!");
        event.target.innerHTML = "Start";
        clearInterval(PROC);
    }
}