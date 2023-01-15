//---TO DO LIST---//
//LINE 211- continue Killing//
//REPREDUC THEM-LOGIC//
//continue EPOC logic//
//---TO DO LIST---//

//Glob
const SIM = {};

//when you rezise the canvas
function resizeCanvas() {
    SIM.can.width = window.innerWidth*0.5;
    SIM.can.height = window.innerWidth*0.5;
    SIM.Xmax = SIM.can.width
    SIM.Ymax =  SIM.can.height

}

//onload
function Init() {
  window.addEventListener("resize", resizeCanvas, false);
  var canvas = document.getElementById("MyCan");
  document.getElementById('Epoc-PH').scrollIntoView()
  SIM.danger = {};
  SIM.interval;
  SIM.Sec_Epoc=0;
  SIM.epocSIZE=100;
  SIM.EPOCHS=0;
  SIM.EpochsCounter=0;
  SIM.SurviveCounter=0;
  SIM.countDeath=0;
  SIM.lastRoundPOP=0;
  SIM.ReproduceRound=0;
  SIM.SurPercent=0;
  SIM.stat=[];
  SIM.Ai_array = [];
  canvas.width=0.5*innerWidth;
  canvas.height=0.5*innerWidth;
  SIM.can = canvas;
  SIM.Xmax = SIM.can.width
  SIM.Ymax =  SIM.can.height
  var ctx = canvas.getContext("2d");
  SIM.ctx = ctx;
  //SettingsD();
}

//settings for danger zone
function SettingsD() {
  document.getElementById("PosStartX").max = SIM.Xmax-SIM.danger.x;
  document.getElementById("PosStartY").max = SIM.Ymax-SIM.danger.y;
  document.getElementById("Wid").max = SIM.Xmax-SIM.danger.xstart;
  document.getElementById("Hi").max = SIM.Ymax-SIM.danger.ystart;

}

//when you change the danger zone
function ChangeDangerZ() {
  SIM.ctx.clearRect(0, 0, SIM.Ymax, SIM.Xmax);

  SIM.danger.xstart = parseInt(document.getElementById("PosStartX").value);
  SIM.danger.ystart = parseInt(document.getElementById("PosStartY").value)
  SIM.danger.x = parseInt(document.getElementById("Wid").value);
  SIM.danger.y = parseInt(document.getElementById("Hi").value);

  document.getElementById("PosStartX").max = SIM.Xmax - parseInt(SIM.danger.x);
  document.getElementById("PosStartY").max = SIM.Xmax - parseInt(SIM.danger.x);
  SettingsD();
  // if (
  //   SIM.danger.ystart == "" ||
  //   SIM.danger.xstart == "" ||
  //   SIM.danger.y == "" ||
  //   SIM.danger.x == ""
  // ) {
  //   SIM.danger.xstart = 0;
  //   SIM.danger.ystart = 0;
  //   SIM.danger.x = 0;
  //   SIM.danger.y = 0;
  // }
  Render_dangerZ();
}
//update the epocs from the input
function onChangeEpochs(input) {
  SIM.EPOCHS=parseInt(input.value);
}
//render the danger zone
function Render_dangerZ() {
  document.getElementById("PosStartXL").innerHTML=`X Start : ${SIM.danger.xstart}`
  document.getElementById("PosStartYL").innerHTML=`Y Start : ${SIM.danger.ystart}`
  document.getElementById("WidL").innerHTML=`Width : ${SIM.danger.x}`
  document.getElementById("HiL").innerHTML=`Hight : ${SIM.danger.y}`

  SIM.ctx.fillStyle = "#FF000050";
  SIM.ctx.fillRect(
    SIM.danger.xstart,
    SIM.danger.ystart,
    SIM.danger.x,
    SIM.danger.y
  );
}
//when you change the radius trigger to render pop
function ChangeRadiusInput() {
  let amount=parseInt(document.getElementById('amountIN').value);
  let rad=parseInt(document.getElementById('radiusIN').value);
  if (amount==''||rad=='') {
    return;
  } else {
    CreatePOP(amount,rad);
    
  }
  
}

//click train button event
function TrainBtn() {
  if (SIM.EpochsCounter==SIM.EPOCHS) {
    //the end of the train
    return;
  }
  SIM.interval= setInterval(Epoch,10);
}

//create entir population of ai
function CreatePOP(amount,radius) {
  SIM.Ai_array=[];
    for (let i = 0; i < amount; i++) {
        
      SIM.Ai_array.push(CreateAI(i,radius))
        
    }
    console.log(SIM.Ai_array)
    Render_POP();
    //return SIM.Ai_array
    
}

//create ai and return it
function CreateAI(id,radius) {
    let ai={};
    //Create Ai attribut for the 0 Gen
    ai.vel=Math.random()*15+5;
    let grd = SIM.ctx.createLinearGradient(0, 0, 200, 0);
    let color1=GetRandomColor()
    let color2=GetRandomColor();
    grd.addColorStop(0,color1 );
    grd.addColorStop(1, color2);
    ai.color=grd;
    ai.isFather=false;
    ai.colorCode1=color1;
    ai.colorCode2=color2;
    //ctx.fillStyle = grd; for later to render it//
    ai.id=id;
    ai.mot_rate=Math.random()*Math.random();
    ai.radius=radius;
    ai.x=Math.floor(Math.random()*(SIM.Xmax-2*radius))+radius;
    ai.y=Math.floor(Math.random()*(SIM.Ymax-2*radius))+radius;
    ai.memo=[];
    for (let i = 0; i <  SIM.epocSIZE; i++) {
        ai.memo.push(Math.random()*2*Math.PI)
        
    }

    return ai;
    
    
}

//get random color
function GetRandomColor() {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    while(randomColor.length<6){
        randomColor = Math.floor(Math.random()*16777215).toString(16);
    }
    return  '#'+randomColor;

}

//Render the entire pop
function Render_POP() {
  SIM.ctx.clearRect(0, 0, SIM.Ymax, SIM.Xmax);
  Render_dangerZ();
  SIM.Ai_array.forEach(ai => {
      SIM.ctx.beginPath();
      SIM.ctx.arc(ai.x, ai.y, ai.radius, 0, 2 * Math.PI);
      SIM.ctx.stroke();
      SIM.ctx.fillStyle=ai.color;
      SIM.ctx.fill()
      SIM.ctx.closePath();
      console.log(ai.id)
      
  });
  

}

//one epoch learn
function Epoch() {
  Movement(SIM.Sec_Epoc);
  SIM.Sec_Epoc++;
  console.log(SIM.Sec_Epoc)
  if (SIM.Sec_Epoc== SIM.epocSIZE) {
    SIM.Sec_Epoc=0;
    clearInterval(SIM.interval)
    //The end of the epoc
    //check pos and kill and repreduce
    SIM.countDeath=0;
    SIM.ReproduceRound=0;
    SIM.SurPercent=0;
    SIM.SurviveCounter=0;
    SIM.lastRoundPOP=SIM.Ai_array.length;
    Kill();
    Render_POP();
    if (SIM.Ai_array.length<100) {
      Repreduce();
    }
    SetRandomPos() //set random pos
    SIM.EpochsCounter++;
    Render_Epoch();
    setTimeout(TrainBtn,100);
  }
}

//one move for each ai in the pop
function Movement(i) {
  SIM.Ai_array.forEach(ai => {
    if (ai.x+(Math.cos(ai.memo[i])*ai.vel)<2*ai.radius) {
      ai.x=2*ai.radius;
    }
    else if(ai.x+Math.cos(ai.memo[i])*ai.vel>SIM.Xmax-2*ai.radius){
      ai.x=SIM.Xmax-2*ai.radius;
    }
    else{
      ai.x+=Math.cos(ai.memo[i])*ai.vel;
    }

    if (ai.y+Math.sin(ai.memo[i])*ai.vel<2*ai.radius) {
      ai.y=2*ai.radius;
    }
    else if(ai.y+Math.sin(ai.memo[i])*ai.vel>SIM.Ymax-2*ai.radius){
      ai.y=SIM.Ymax-2*ai.radius;
    }
    else{
      ai.y+=Math.sin(ai.memo[i])*ai.vel;
    }
    //console.log(ai.id+' : '+ai.color)
  });
  Render_POP()
}

function Kill() {
  
  let tempArr=[];
  SIM.Ai_array.forEach(ai => {
    if (ai.x>SIM.danger.xstart-ai.radius && ai.x<SIM.danger.x + SIM.danger.xstart+ai.radius && ai.y> SIM.danger.ystart-ai.radius && ai.y<SIM.danger.y+SIM.danger.ystart+ai.radius) {
      SIM.countDeath++;
     
    }
    else{
      //if they in safezone 
      SIM.SurviveCounter++;
      tempArr.push(ai)
    }
  });
  SIM.Ai_array=tempArr
  
}

//duplicate from the ai that left (inside alreadt Render function)
function Repreduce() {
  let tempArr=[];
  SIM.Ai_array.forEach(father => {
    if (Math.random()>0.25) {
      let child={};
      SIM.ReproduceRound++;
      let off=SignRand();
   
      child.vel=father.vel+off*(father.mot_rate*Math.floor(Math.random()*25+1))
      if (child.vel<=0) {
        child.vel=1+Math.random()*3;
      }
      let grd=SIM.ctx.createLinearGradient(0, 0, 200, 0);
      child.colorCode2=GetRandomColor();
      grd.addColorStop(0,child.colorCode2 );
      grd.addColorStop(1, father.colorCode1);
      child.colorCode1=father.colorCode2;
      child.color=grd;
      child.id=parseInt(father.id)+100;
      child.mot_rate=father.mot_rate+off*Math.random();
      child.radius=father.radius+off*father.mot_rate;
      if (child.radius<=3) {
        child.radius=3;
      }
      child.x=father.x+off*Math.random()*250;
      child.y=father.y+off*Math.random()*170;
      child.memo=father.memo;
      console.log('XXX',child.memo)
      for (let i = 0; i < child.memo.length; i++) {
      // if (Math.random()>0.08) {
      //   child.memo[i]=Math.random()*2*Math.PI;
      // }
      child.memo[i]+=off*father.mot_rate/1.5 //the change of the angle between father and son
      
      }
      child.memo=shuffle(child.memo);
      console.log('UUU',child.memo)
  
    
    tempArr.push(child);
    father.isFather=true;
    }
    tempArr.push(father);

  });


  SIM.Ai_array=tempArr;
  Render_POP();
}


function Render_Epoch() {
  
  let str='<div>';
  str+=`<p>Epoch numer: ${SIM.EpochsCounter}</p>`;
  str+=`<p>Death: ${SIM.countDeath}</p>`;
  str+=`<p>Survive: ${SIM.Ai_array.length}</p>`;
  SIM.SurPercent=Math.floor((SIM.SurviveCounter/SIM.lastRoundPOP)*100);
  let bar={label:`${SIM.EpochsCounter}`,y:SIM.SurPercent}
  SIM.stat.push(bar);
  str+=`<p>Survive percent: ${SIM.SurPercent} %</p>`;
  str+=`<p>Reproduce Number: ${SIM.ReproduceRound}</p>`;
  str+=`<hr></div>`;
  document.getElementById('Epoc-PH').innerHTML+=str;
  document.getElementById('numofpopP').innerHTML=`Population: ${SIM.Ai_array.length}`
  document.getElementById('GenEpocP').innerHTML=`Epochs: ${SIM.EPOCHS}`;


}

function DisplayBar() {
  $('#chartContainer').click(function (){
    $(this).fadeOut(500);
  })
  $('#chartContainer').fadeIn(500);
  var chart = new CanvasJS.Chart("chartContainer", {
		title:{
			text: "Survive percent vs Epochs"              
		},
		data: [              
		{
			// Change type to "doughnut", "line", "splineArea", etc.
			type: "column",
      dataPoints: SIM.stat,
      axisY:{
        prefix: "$",
        suffix: "K"
      } 
			// dataPoints: [
			// 	{ label: "apple",  y: 10  },
			// 	{ label: "orange", y: 15  },
			// 	{ label: "banana", y: 25  },
			// 	{ label: "mango",  y: 30  },
			// 	{ label: "grape",  y: 28  }
			// ]
		}
		]
	});
	chart.render();
}

function DisplayGraph() {
  $('#chartContainer').click(function (){
    $(this).fadeOut(500);
  })
  $('#chartContainer').fadeIn(500);
  var chart = new CanvasJS.Chart("chartContainer", { 
		title: {
			text: "Survive percent % vs Epochs"
		},
		data: [
		{
			type: "spline",
			dataPoints: SIM.stat,
      axisY:{
        prefix: "$",
        suffix: "K"
      }
		}
		]
	});
	chart.render();	
}

function SignRand() {
  let off=1;
  if (Math.random()>0.5) {
    off=-1;
  }
  return off;
}

function SetRandomPos() {

  SIM.Ai_array.forEach(ai => {
    // ai.x=Math.floor(Math.random()*(SIM.Xmax-2*ai.radius))+ai.radius;
    // ai.y=Math.floor(Math.random()*(SIM.Ymax-2*ai.radius))+ai.radius;
    ai.x+=SignRand()*Math.random()*15*ai.radius;
    ai.y+=SignRand()*Math.random()*15*ai.radius;
  });
  
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}