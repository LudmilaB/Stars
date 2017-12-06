	  var colors=["#00b3b3", "DarkBlue", "Red"];
	  var score=0;
	  var canvas = document.getElementById('myCanvas');
	  var ctx = canvas.getContext('2d');

      var Cookie="best-stars";
	  var best=window.localStorage.getItem(Cookie);
	     if(best === undefined || best === null || best.length === 0)
			 best=0;
	  document.getElementById('best-container').innerHTML=best;
	  
	  var mouseX;
	  var mouseY;
	  var dragHoldX;
	  var dragHoldY;
      var timer=0;
	  var targetX;
	  var targetY;
	  var targeti;
	  var targetj;
	  var easeAmount;	  
      var StarFilledSound = new sound("sounds/menu-button-click-switch-01.mp3");
	  var TwoDiagonalsFilledSound = new sound("sounds/correct-answer-bell-gliss-04.mp3");
	  var EndOfGameSound = new sound("sounds/correct-answer-bell-gliss-01.mp3");
	  var DiagonalFilledSound = new sound("sounds/correct-answer-notification-01.mp3");	  
      
	  var PlaySounds=false;
      
	  var cells=7;   //cells x cells in game table

	  var Stars=new Array(cells);
	  for (var i=0; i<cells; i++)
	  {
		  Stars[i]=new Array(cells);
	  }	 

	  var Circlei=-1;     //index i of dragged circle
	  var Circlej=-1;     //index j of dragged circle
	  var direction=null; //hor ver direction of dragging
	  StartGame();

function shape(ct_x, ct_y,type)
{
	this.ct_x=ct_x;
	this.ct_y=ct_y;
	var ind=Math.floor(Math.random() * colors.length);
	this.clr=colors[ind];
	this.r=25;
	this.ind=ind;
	this.type=type;
}		  

 	 function StartGame(){
		
	  RemoveMessage();
	  
      for (var i=0; i<cells; i++)
	  {
		  var ct_y=(i+0.5)*canvas.width/cells;
	      for (var j=0; j<cells; j++)
		  {
			  var type;
			  if(i%2==0 && j%2==0 || i%2!=0 && j%2!=0)
				  type="star";
			  else
				  type="circle";
			  var ct_x=(j+0.5)*canvas.width/cells;
		      Stars[i][j]=new shape(ct_x, ct_y,type);
		  }
	  }	
	  
	  score=0;
	  level=1;
//	  window.localStorage.setItem(Cookie, best);
	  document.getElementById('best-container').innerHTML=best;
	  document.getElementById('score-container').innerHTML=0;
	  draw();
	  canvas.addEventListener("mousedown", mouseDownListener, false);
	  canvas.addEventListener("touchstart", touchStartListener, false);
	}
  
	  function draw()
	  {  
	     DrawField();	 
         ctx.lineWidth=5;		
       
	     for (var i=0;i<cells;i++)	
	     {
	    	 for (var j=0;j<cells;j++)
			    if(Stars[i][j].type=="circle")
				   DrawCircle(Stars[i][j]);
			    else //if (Stars[i][j].type=="star" or "filled")
				   DrawStar(Stars[i][j]);
	     }	
     }

	 
	 function DrawCircle(c)
	 {
		ctx.beginPath();
        ctx.arc(c.ct_x, c.ct_y, c.r, 0, 2 * Math.PI, false);
    	ctx.fillStyle = c.clr;						
        ctx.fill(); 
		 
	 }
	 
	 function DrawStar(s){
	  var spikes=4;
	  var outerRadius=s.r+4;
	  var innerRadius=9;
	  var cx=s.ct_x;
	  var cy=s.ct_y;
	  
      var rot=Math.PI/2*3;
      var x=cx;
      var y=cy;
      var step=Math.PI/spikes;

      ctx.beginPath();
      ctx.moveTo(cx,cy-outerRadius)
      for(i=0;i<spikes;i++){
        x=cx+Math.cos(rot)*outerRadius;
        y=cy+Math.sin(rot)*outerRadius;
        ctx.lineTo(x,y)
        rot+=step

        x=cx+Math.cos(rot)*innerRadius;
        y=cy+Math.sin(rot)*innerRadius;
        ctx.lineTo(x,y)
        rot+=step
      }
      ctx.lineTo(cx,cy-outerRadius);
      ctx.closePath();
      
	  if(s.type=="filled")
		ctx.fillStyle=s.clr;
	  else
		ctx.fillStyle="white";
	  ctx.fill();
	  
	  ctx.lineWidth=4;
      ctx.strokeStyle=s.clr;
      ctx.stroke();
		  
    }
	 
	 function DrawField(){
		ctx.beginPath();
		var w=canvas.width;
		ctx.clearRect(0, 0, w, w);	
	    ctx.fillStyle= "#ffeccc";
		ctx.fillRect(0, 0, w, w);
		 
	 }
	 

function touchStartListener(evt){
	
	return mouseDownListener(evt);
}
function mouseDownListener(evt) {	    
		evt.preventDefault();
		if(timer)
			return;

		//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
		var bRect = canvas.getBoundingClientRect();
		var clientX= evt.type=="mousedown"? evt.clientX:evt.changedTouches[0].clientX;
		var clientY= evt.type=="mousedown"? evt.clientY:evt.changedTouches[0].clientY;
		mouseX = (clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (clientY - bRect.top)*(canvas.height/bRect.height);
//		document.getElementById('score-container').innerHTML=evt.changedTouches[0].clientX;

		var quadr = whatQuadrant(mouseX,mouseY);
		if( quadr!=null && Stars[quadr[0]][quadr[1]].type=="circle")
		{
			   Circlei=quadr[0];
			   Circlej=quadr[1];
               dragHoldX = clientX;
			   dragHoldY = clientY;				   
		}
        else
			return false;
		
			

		window.addEventListener("mousemove", mouseMoveListener, false);
		window.addEventListener("touchmove", touchMoveListener, false);
//		evt.preventDefault();

		canvas.removeEventListener("mousedown", mouseDownListener, false);
		canvas.removeEventListener("touchstart", touchStartListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		window.addEventListener("touchend", touchEndListener, false);
		
		return false;
	}

	function touchEndListener(evt){
		return mouseUpListener(evt);  
	}
	
	function mouseUpListener(evt){
		
	    window.removeEventListener("mousemove", mouseMoveListener, false);
		window.removeEventListener("touchmove", touchMoveListener, false);
        canvas.addEventListener("mousedown", mouseDownListener, false);
		canvas.addEventListener("touchstart", touchStartListener, false);		
	}
	
	function touchMoveListener(evt){
		return mouseMoveListener(evt);
	}
	function mouseMoveListener(evt) {
		if(evt.type!="mousemove")
			evt.preventDefault();
		
		//getting mouse position correctly 
		var bRect = canvas.getBoundingClientRect();
		var clientX= evt.type=="mousemove"? evt.clientX:evt.changedTouches[0].clientX;
		var clientY= evt.type=="mousemove"? evt.clientY:evt.changedTouches[0].clientY;
		
		mouseX = (clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (clientY - bRect.top)*(canvas.height/bRect.height);
		
		//clamp x and y positions to prevent object from dragging outside of canvas
		var posX = mouseX - dragHoldX;
		var posY = mouseY - dragHoldY;
		var dif_x=clientX - dragHoldX;
		var dif_y=clientY - dragHoldY;

		if(Math.abs(Math.abs(dif_x)-Math.abs(dif_y))<=3)   // we don't know direction or finish last move
					return;  
        
		window.removeEventListener("mousemove", mouseMoveListener, false);
		window.removeEventListener("touchmove", touchMoveListener, false);
		
		if( Math.abs(dif_x) > Math.abs(dif_y))                // horisontal direction
		{
			if( dif_x<0 )
			{
				if(Circlej-1<0) 
					return;
				
				targetX= Stars[Circlei][Circlej-1].ct_x;
				targetj=Circlej-1;
		    }
			else
			{
				if(Circlej+1>=cells) 
					return;
				targetX= Stars[Circlei][Circlej+1].ct_x;
				targetj=Circlej+1;
			}
			targetY= Stars[Circlei][Circlej].ct_y;
			targeti=Circlei;
		}
		else                                             //vertical direction
		{
			if( dif_y<0 )
			{
				if(Circlei-1<0) 
					return;
				targetY= Stars[Circlei-1][Circlej].ct_y;
				targeti=Circlei-1;
		    }
			else
			{
				if(Circlei+1>=cells) 
					return;
				targetY= Stars[Circlei+1][Circlej].ct_y;
				targeti=Circlei+1;
			}
			targetX= Stars[Circlei][Circlej].ct_x;
			targetj=Circlej;
		}
		//start timer
		timer = setInterval(onTimerTick, 1000/30);
	}
	
	function onTimerTick()
	{
		if( targetX != Stars[Circlei][Circlej].ct_x )
			Stars[Circlei][Circlej].ct_x = Stars[Circlei][Circlej].ct_x + 8*(targetX - Stars[Circlei][Circlej].ct_x)/Math.abs(targetX - Stars[Circlei][Circlej].ct_x);
		if(targetY != Stars[Circlei][Circlej].ct_y)
			Stars[Circlei][Circlej].ct_y = Stars[Circlei][Circlej].ct_y + 8*(targetY - Stars[Circlei][Circlej].ct_y)/Math.abs(targetY - Stars[Circlei][Circlej].ct_y);

		//stop the timer when the target position is reached (close enough)
		if (Math.abs(Stars[Circlei][Circlej].ct_x - targetX) < 1 && Math.abs(Stars[Circlei][Circlej].ct_y - targetY) < 1) 
		{
						//stop timer:
			clearInterval(timer);
			timer=0;
			Stars[Circlei][Circlej].ct_x=(Circlej+0.5)*canvas.width/cells;
			Stars[Circlei][Circlej].ct_y=(Circlei+0.5)*canvas.width/cells;
			
			if(Stars[targeti][targetj].clr==Stars[Circlei][Circlej].clr && Stars[targeti][targetj].type!="filled")
			{
			    Stars[targeti][targetj].type="filled";
				
				var ind=Math.floor(Math.random() * colors.length);
				if(colors[ind]==Stars[targeti][targetj].clr)  //I want color of new circle be different of previous
					ind=ind==colors.length-1?0:ind+1;
				Stars[Circlei][Circlej].clr=colors[ind]; 
				score++;
				
	            document.getElementById('score-container').innerHTML=score;	 
	            if(score > best)
	            {
	               best=score;
	               document.getElementById('best-container').innerHTML= best;
				   window.localStorage.setItem(Cookie, best );	
		        }
                draw();
				if(!CheckAndChangeDiagonals(targeti,targetj))   //diagonals were not filled
					StarFilledSound.play();

				if(EndOfGame()==true)
				{
                    EndOfGameSound.play();
					messageContainer = document.querySelector(".game-message");
					messageContainer.classList.add("game-over");
					messageContainer.getElementsByTagName("p")[0].textContent ="Out of moves";
	//				ShareScore();
				}
				return;
			}
	
		}
		draw();
		DrawCircle(Stars[Circlei][Circlej]);  //circle should be on top
	} 
	
	function whatQuadrant(X, Y){
		
		var q=[0,0];
		q[1]=Math.floor(X/canvas.width*cells);
		q[0]=Math.floor(Y/canvas.width*cells);
		if(q[0]>cells-1)
			return null;
		return q;
	}
	
	function EndOfGame()
	{
	  for (var i=0; i<cells; i++)
	  {
	      for (var j=0; j<cells; j++)
		  {
			
			  if(Stars[i][j].type=="star")
			  {
				  var clr=Stars[i][j].clr;
				  if( i-1>=0 && Stars[i-1][j].clr== clr || i+1<cells && Stars[i+1][j].clr== clr ||
				       j-1>=0 && Stars[i][j-1].clr== clr || j+1<cells && Stars[i][j+1].clr== clr )
				  return false;				  
			  }			
		  }
	  }	
	  return true;
	}
	function CheckAndChangeDiagonals(i,j)
	{
		var Diag1Full=true;
		var r;
		var c;

		for(r=i+1, c=j+1; r<cells && c<cells; c++, r++)
		{			
			if(Stars[r][c].type!="filled")
			{
				Diag1Full=false;
				break;
			}
		}
		if((i==cells-1 && j==0) || (i==0 && j==cells-1)) //only one star in corner, not diagonal
			Diag1Full=false;
		if(Diag1Full)
		{
			for(r=i-1, c=j-1; r>=0 && c>=0; c--, r--)
			{

			if(Stars[r][c].type!="filled")
			{
				Diag1Full=false;
				break;
			}
			}
		}
		
		var Diag2Full=true;
		if((i==cells-1 && j==cells-1) || (i==0 && j==0)) //only one star in corner, not diagonal
			Diag2Full=false;
			
		for( r=i+1, c=j-1; r<cells&& c>=0; r++, c--)
			if(Stars[r][c].type!="filled")
			{
				Diag2Full=false;
				break;
			}
		if(Diag2Full)
		{
			for( r=i-1, c=j+1; r>=0 && c<cells; r--, c++)			
			   if(Stars[r][c].type!="filled")
			   {
				   Diag2Full=false;
				   break;
		       }	    
		}
		var diag_score=0;  
		
		if(Diag1Full || Diag2Full)
		{
			ctx.beginPath();
			var w=canvas.width;
			ctx.strokeStyle="red";
			ctx.lineWidth=3;
			var cellw= w/cells;
			if(Diag1Full)  
			{
				for( r=i, c=j; r<cells && c<cells; c++, r++)
				{
					ctx.strokeRect(Stars[r][c].ct_x- cellw/2, Stars[r][c].ct_y - cellw/2,cellw,cellw);
					Stars[r][c]=new shape(Stars[r][c].ct_x, Stars[r][c].ct_y,"star");
					diag_score++;
				}
			
				for(r=i-1, c=j-1; r>=0 && c>=0;  c--, r--)
                {
					ctx.strokeRect(Stars[r][c].ct_x- cellw/2, Stars[r][c].ct_y - cellw/2,cellw,cellw);
					Stars[r][c]=new shape(Stars[r][c].ct_x, Stars[r][c].ct_y,"star");
					diag_score++;
				}
			
			}
			
			if(Diag2Full)  
			{
				for( r=i, c=j; r<cells && c>=0; r++, c--)
				{
					ctx.strokeRect(Stars[r][c].ct_x- cellw/2, Stars[r][c].ct_y - cellw/2,cellw,cellw);
					Stars[r][c]=new shape(Stars[r][c].ct_x, Stars[r][c].ct_y,"star");
					diag_score++;
				}
				
				for(r=i-1, c=j+1; r>=0 && c<cells; r--, c++)
				{
					ctx.strokeRect(Stars[r][c].ct_x- cellw/2, Stars[r][c].ct_y - cellw/2,cellw,cellw);
					Stars[r][c]=new shape(Stars[r][c].ct_x, Stars[r][c].ct_y,"star");
					diag_score++;
				}
			}
		}
			
		 if(Diag2Full && Diag1Full)  //bonus score for 2 diagonals
			 diag_score+=15;
	 
         if(Diag2Full && Diag1Full)
			 TwoDiagonalsFilledSound.play();
		 else if(Diag2Full || Diag1Full)
			 DiagonalFilledSound.play();
		 
		 var DiagonalFilled=false;
		 if(Diag2Full || Diag1Full)  //redraw
		 {
                         DiagonalFilled=true;
		//	 setTimeout(function(){draw();}, 1200);
		    setTimeout(draw, 800);  //stay with red diagonals
			setTimeout(function(){MovingScore("+"+diag_score, Stars[targeti][targetj].ct_x, Stars[targeti][targetj].ct_y,0);}, 800);
	     }
		 else
		    MovingScore("+1", Stars[targeti][targetj].ct_x, Stars[targeti][targetj].ct_y,0);
		 score+=diag_score;
		 document.getElementById('score-container').innerHTML=score;	 
	     if(score > best)
	     {
	        best=score;
	        document.getElementById('best-container').innerHTML= best;
			window.localStorage.setItem(Cookie, best);
		 }
		
               return DiagonalFilled;
	}

function MovingScore(txt, x, y, moves )
{
	if(moves>=30)
	{
		draw();
		return;
	}
   moves++;	
   draw();
   ctx.font = "24px Arial";
   ctx.fillStyle="black";
   ctx.fillText(txt,x,y-moves*2);
   setTimeout( function(){MovingScore(txt, x, y, moves)}, 20);
}	

function ActivateSounds()
{
      StarFilledSound.play();
	  StarFilledSound.stop();
	  TwoDiagonalsFilledSound.play();
	  TwoDiagonalsFilledSound.stop();
	  EndOfGameSound.play();
	  EndOfGameSound.stop();  
	  DiagonalFilledSound.play(); 
	  DiagonalFilledSound.stop(); 
}

/*function ShareScore()
   {
	var tweet = document.getElementById("share-twitter");
    var text = "https://twitter.com/intent/tweet?text="+"I've scored " + this.score +" of Fill Stars. Can you beat me? http://shapesmania.com/";
    tweet.href=text;
	var facebook = document.getElementById("share-facebook");
	text="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fshapesmania.com%2F&picture=http%3A%2F%2Fshapesmania.com%2Fstatic%2Fstars.png&title=Shapes+Mania&caption=ShapesMania.com&quote=I%27ve+scored+"+this.score+"of Fill Stars"+"%21+Can+you+beat+me%3F&description=puzzle+games";
	facebook.href=text;
	var google = document.getElementById("share-google");
	text="https://plus.google.com/share?url=http://shapesmania.com/share/stars/" +this.score+"/"+this.level;
	google.href=text;
   }  */
   
function RemoveMessage()
{
		
	  messageContainer = document.querySelector(".game-message");
	  messageContainer.classList.remove("game-over");
      messageContainer.classList.remove("game-continue");  
		
}

	function ToggleSound()
	{
		PlaySounds=!PlaySounds;
		if(PlaySounds)
		{
			ActivateSounds();
			document.getElementById("sound-button").src="res/sound_mute.png";
		}
		else
			document.getElementById("sound-button").src="res/sound.png";
	}
function sound(src)
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
		if(PlaySounds)
		{
		  this.sound.pause();
          this.sound.currentTime = 0;
          this.sound.play();
		}
    }
    this.stop = function(){
        this.sound.pause();
    }
}
