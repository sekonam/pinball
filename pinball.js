window.onload=function(){
	/**
	*Create class names abbreviations
	*/
	var	b2Vec2 = Box2D.Common.Math.b2Vec2
	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
	,	b2Body = Box2D.Dynamics.b2Body
	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	,	b2Fixture = Box2D.Dynamics.b2Fixture
	,	b2World = Box2D.Dynamics.b2World
	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	;
	/**
	*Initialize canvas height/width values
	*/
	var FIELD_SIZE = {
			WIDTH:400,
			HEIGHT:600
		},
		PIX_PER_M = 10.0,
		STEP_AMOUNT=1/60;
	var canvas = document.getElementById("b2dCanvas");
	canvas.setAttribute('width',FIELD_SIZE.WIDTH);
	canvas.setAttribute('height',FIELD_SIZE.HEIGHT);
	/**
	*Create physic world object
	*/
	var world = new b2World(
		new Box2D.Common.Math.b2Vec2(0,10),
		false
	);
	/**
	*Fixture definition object - definition factory
	*/
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0;
	fixDef.restitution = 0.85;
	/**
	*Body definition object - body factory
	*/
	var bodyDef = new b2BodyDef;
	
	/**
	*Initialize base board constants
	*/
	var	w=FIELD_SIZE.WIDTH/PIX_PER_M,
		l=w/3.5,
		dh=5,
		a=Math.PI/6,
		h=FIELD_SIZE.HEIGHT/PIX_PER_M-dh-l*Math.sin(a),
		d=2,
		r=1,
		hr=h*0.75,
		l_triangle=h*0.17;

	/**
	*Initialization board borders 
	*/
	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(d/2,h/2);
	bodyDef.position.Set(0,h/2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(w,h/2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(w/2,d/2);
	bodyDef.position.Set(w/2,0);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(d/4,hr/2);
	bodyDef.position.Set(w-d*3/4-2*r,h-hr/2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(r+d/2,d/4);
	bodyDef.position.Set(w-d*3/4-r/2,h);
	var tinyBorder=world.CreateBody(bodyDef);
	tinyBorder.CreateFixture(fixDef);
	bodyDef.position.Set(0,h);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2((d/2)*Math.sin(a),-(d/2)*Math.cos(a)),
			new b2Vec2((d/2)*Math.sin(a)+l*Math.cos(a),-(d/2)*Math.cos(a)+l*Math.sin(a)),
			new b2Vec2(l*Math.cos(a),l*Math.sin(a)),
			new b2Vec2(0,0)
		], 4
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(w-2*r-d/2,h);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2(0,0),
			new b2Vec2(-l*Math.cos(a),l*Math.sin(a)),
			new b2Vec2(-l*Math.cos(a)-(d/2)*Math.sin(a),l*Math.sin(a)-(d/2)*Math.cos(a)),
			new b2Vec2(-(d/2)*Math.sin(a),-(d/2)*Math.cos(a))
		], 4
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	/**
	*Initialization static figures on the board
	*/
	bodyDef.position.Set(d/2,d/2);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2(0,0),
			new b2Vec2(l_triangle,0),
			new b2Vec2(0,l_triangle),
		], 3
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(w-d/2,d/2);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2(0,0),
			new b2Vec2(0,l_triangle),
			new b2Vec2(-l_triangle-d,0),
		], 3
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	var	s_trap=h*0.35,
		h_trap=w*0.15,
		l_trap=h*0.1,
		d_trap=h*0.1;
	bodyDef.position.Set(d/2,s_trap);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2(0,0),
			new b2Vec2(h_trap,l_trap),
			new b2Vec2(h_trap,l_trap+d_trap),
			new b2Vec2(0,2*l_trap+d_trap),
		], 4
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	var	
		l1_trio=0.1*h,
		l2_trio=0.11*h,
		h_trio=0.2*w;
	bodyDef.position.Set(d/2+3*r,h-2*r);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2(0,-l1_trio),
			new b2Vec2(h_trio,l2_trio),
			new b2Vec2(0,0),
		], 3
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(w-d-2*r-3*r,h-2*r);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2(-h_trio,l2_trio),
			new b2Vec2(0,-l1_trio),
			new b2Vec2(0,0),
		], 3
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	var	h_trap=w*0.2,
		l_trap=h*0.25,
		d_trap=h*0.1,
		p_trap=0.05*w;
	bodyDef.position.Set(w-d-2*r,h-hr);
	fixDef.shape.SetAsArray(
		[
			new b2Vec2(0,0),
			new b2Vec2(0,l_trap+d_trap),
			new b2Vec2(-h_trap+p_trap,l_trap+d_trap),
			new b2Vec2(-h_trap,l_trap+d_trap-p_trap),
			new b2Vec2(-h_trap,l_trap),
		], 5
	);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	
	/**
	*Initialization circles in the top part of the board
	*/
	var r_circle=3.5;
	fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(r_circle);
	bodyDef.position.Set(d/2+w*0.33,d/2+h*0.15);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(d/2+w*0.6,d/2+h*0.21);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(d/2+w*0.4,d/2+h*0.35);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	
	/**
	*Launcher initialization
	*/
	var Launcher = function(width,height) {
		this.width=width;
		this.height=height;
		this.defaultPosition = new b2Vec2(w-d/2-r,h-d/4-this.height/2-hr/2);
		this.goingBack=false;
		this.shift=0;
		this.deltaShift=0.3;
		this.gookK = 10;
		this.distJoint=null;
		
		bodyDef.type = b2Body.b2_dynamicBody;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(this.width/2,this.height/2);
		bodyDef.position.Set(this.defaultPosition.x,this.defaultPosition.y);
		this.body = world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
	}
	Launcher.prototype.checkJoint = function() {
		if(!this.distJoint){
			var ball=null;
			world.QueryPoint(
				function (fixture) {
					ball=fixture.GetBody();
				},
				new b2Vec2(this.body.GetPosition().x,this.body.GetPosition().y-this.height/2-r)
			);
			if(ball && balls.indexOf(ball)!=-1){
				var def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
				def.Initialize(this.body,ball,this.body.GetWorldCenter(),ball.GetWorldCenter());
				this.distJoint = world.CreateJoint(def);
			}
		}
	}
	Launcher.prototype.keyDown = function(event) {
		if(event.keyCode==17 && this.goingBack==false && this.defaultPosition.y+this.shift+this.deltaShift<=h-d/4-this.height/2){
			this.shift+=this.deltaShift;
		}
	}
	Launcher.prototype.keyUp = function(event) {
		if(event.keyCode==17 && this.shift>0 ) {
			if(this.shift>this.deltaShift){
				this.goingBack = true;
			}else{
				this.shift=0;
			}
		}
	}
	Launcher.prototype.update = function(){
		if(this.goingBack){
			if(this.body.GetPosition().y>=this.defaultPosition.y){
				this.body.ApplyImpulse(
					new b2Vec2(0,this.gookK * (this.defaultPosition.y - this.body.GetPosition().y)),
					this.body.GetWorldCenter()
				);
			}else{
				if(this.distJoint){
					world.DestroyJoint(this.distJoint);
					this.distJoint=null;
				}
				this.body.SetPosition(this.defaultPosition);
				this.body.SetLinearVelocity(new b2Vec2(0,0));
				this.goingBack=false;
				this.shift=0;
			}
		}else if(this.shift>=0){
			this.body.SetPosition(
				new b2Vec2(
					this.body.GetPosition().x,
					this.defaultPosition.y+this.shift
				)
			);
			this.body.SetLinearVelocity(new b2Vec2(0,0));
		}
	}
	var launcher = new Launcher(2*r,h*0.15);
	
	/**
	*Collision listener creation.
	*Callback returns launcher to the start position and
	*makes score calculations
	*/
	var listener = new Box2D.Dynamics.b2ContactListener();
	var score=0;
	function scoreUp(){	
		score +=10;
		document.getElementById('score').innerHTML=score;
		return score;
	}
	listener.EndContact = function (contact, impulse) {
		var bodyA = contact.GetFixtureA().GetBody(),
			bodyB = contact.GetFixtureB().GetBody();
		var	ball=null,
			other=null;
		if(balls.indexOf(bodyA)>=0){
			ball=bodyA;
			other=bodyB;
		}else if(balls.indexOf(bodyB)>=0){
			ball=bodyB;
			other=bodyA;
		}
		if(other==launcher.body){
			ball.SetLinearVelocity(new b2Vec2(0,0));
			ball.SetPosition(
				new b2Vec2(
					ball.GetPosition().x,
					launcher.defaultPosition.y-launcher.height/2-r
				)
			);
			launcher.checkJoint();
		}else{
			scoreUp();
		}
	}
	world.SetContactListener(listener);
	
	/**
	*function to create new ball
	*/
	function newBall(pos) {
		bodyDef.type = b2Body.b2_dynamicBody;
		fixDef.shape = new b2CircleShape(r);
		bodyDef.position.Set(pos.x,pos.y);
		var ball=world.CreateBody(bodyDef);
		ball.CreateFixture(fixDef);
		return ball;
	} 
	/**
	*Balls array declaration and initialization
	*/
	var balls = [];
	function initBall(){
		if(!balls.length && !launcher.goingBack ){
			balls.push(newBall(new b2Vec2(w-d/2-r,h-d/4-launcher.height-hr/2-r)));
			launcher.checkJoint();
			return true;
		}
		return false;
	} initBall();
	
	/**
	*Function to create arms and
	*Arms declaration and creation
	*/
	var armLen=7.2,
		armRadius=1.3,
		l_arm=CreateArm(armLen,new b2Vec2(l*Math.cos(a)+armRadius,h+l*Math.sin(a)+r)),
		r_arm=CreateArm(-armLen,new b2Vec2(w-d/2-2*r-l*Math.cos(a)-armRadius,h+l*Math.sin(a)+r));
	function CreateArm(len,pos) {
		var arm;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(pos.x,pos.y);
		arm=world.CreateBody(bodyDef);
		fixDef.shape = new b2CircleShape(armRadius);
		arm.CreateFixture(fixDef);
		fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
		fixDef.shape.SetAsArray(
			[
				new b2Vec2(0,0),
				new b2Vec2(armRadius*armRadius/len,-1*armRadius*Math.sqrt(len*len-armRadius*armRadius)/len),
				new b2Vec2(len,0),
				new b2Vec2(armRadius*armRadius/len,armRadius*Math.sqrt(len*len-armRadius*armRadius)/len),
			],4
		);
		arm.CreateFixture(fixDef);
	
		var tmpBody=null;
		bodyDef.type = b2Body.b2_staticBody;
		tmpBody=world.CreateBody(bodyDef);
		fixDef.shape = new b2CircleShape(0);
		tmpBody.CreateFixture(fixDef);
	
		var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		jointDef.Initialize(arm,tmpBody,pos);
		world.CreateJoint(jointDef);
		
		return arm;
	}
	
	/**
	*JavaScript KeyDown listener creation.
	*Listener turns off attract mode if any key is pressed and
	*implements control launcher and arms use cursor keys
	*/
	window.addEventListener('keydown',function(event){launcher.keyDown(event);});
	window.addEventListener('keyup',function(event){launcher.keyUp(event);});
	window.addEventListener(
		'keydown',
		function(event){
			showtime=false;
			switch(event.keyCode){
				case 37:
					var center=l_arm.GetWorldCenter();
					l_arm.ApplyImpulse(new b2Vec2(0,-150),new b2Vec2(center.x+armLen*3/4,center.y));
					break;
				case 39:
					var center=r_arm.GetWorldCenter();
					r_arm.ApplyImpulse(new b2Vec2(0,-150),new b2Vec2(center.x-armLen*3/4,center.y));
					break;
			}
		}
	);
	
	/**
	*Debug draw mode initialization
	*/
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("b2dCanvas").getContext("2d"));
	debugDraw.SetDrawScale(PIX_PER_M);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);
	
	var showtime=1;
	/**
	*physic world step-by-step calculation 
	*/
	window.setInterval(update, 1000 * STEP_AMOUNT);
	/**
	*Function update calls each calculation step
	*/
	function update() {
		/*world step calculations*/
		world.Step(STEP_AMOUNT, 10, 10);
		/*Put launcher back to the start position*/
		launcher.update();
		/*Arms angle limitation*/
		if(l_arm.GetAngle()>Math.PI/6){
			l_arm.SetAngle(Math.PI/6);
			l_arm.SetAngularVelocity(0);
		}
		if(l_arm.GetAngle()<-Math.PI/6){
			l_arm.SetAngle(-Math.PI/6);
			l_arm.SetAngularVelocity(0);
		}
		if(r_arm.GetAngle()>Math.PI/6){
			r_arm.SetAngle(Math.PI/6);
			r_arm.SetAngularVelocity(0);
		}
		if(r_arm.GetAngle()<-Math.PI/6){
			r_arm.SetAngle(-Math.PI/6);
			r_arm.SetAngularVelocity(0);
		}
		/*Delete ball if it moves out the board*/
		for(var i=0;i<balls.length;i++){
			if(balls[i].GetPosition().y+r>=h+l*Math.sin(a)+dh){
				var ball = balls[i];
				balls.splice(i--,1);
				world.DestroyBody(ball);
			}
		}
		/*Put new ball in the start position if there is no ball on the board*/
		initBall();

		if(showtime){
			/*Iterate each ball*/
			for(var i=0;i<balls.length;i++){
				/*If ball falls to the start position it pushes them out*/
				if(launcher.distJoint){
					if(Math.random()<0.96){
						launcher.keyDown({keyCode:17});
						showtime++;
					}else if(showtime>10){
						launcher.keyUp({keyCode:17});
					}
				}
				/*Checking have arms kick ball or not*/
				function IsInCircle(pos,center,radius){
					return Math.pow(center.x-pos.x,2)+Math.pow(center.y-pos.y,2)<=Math.pow(radius,2);
				}
				var pos=balls[i].GetPosition();
				if(pos.y>h+l*Math.sin(a)){
				/*left arm*/
				if(IsInCircle(pos,l_arm.GetPosition(),armLen+r) && pos.x>d/2+4*r+h_trio){
					var center=l_arm.GetWorldCenter();
					l_arm.ApplyImpulse(new b2Vec2(0,-50),new b2Vec2(center.x+armLen*3/4,center.y));
				}
				/*right arm*/
				if(IsInCircle(pos,r_arm.GetPosition(),armLen+r) && pos.x<w-d-6*r-h_trio){
					var center=r_arm.GetWorldCenter();
					r_arm.ApplyImpulse(new b2Vec2(0,-50),new b2Vec2(center.x-armLen*3/4,center.y));
				}
				}
			}
		}
		
		world.DrawDebugData();
		world.ClearForces();
	}
} 