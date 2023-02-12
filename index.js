const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: './images/background.png',
});

const shop = new Sprite({
	position: {
		x: 600,
		y: 128,
	},
	imageSrc: './images/shop.png',
	scale: 2.75,
	framesMax: 6,
});

const player = new Fighter({
	position: {
		x: 0,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	imageSrc: './images/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 3,
	offset: {
		x: 150,
		y: 53,
	},
	sprites: {
		idle: {
			imageSrc: './images/samuraiMack/Idle.png',
			framesMax: 8,
		},
		run: {
			imageSrc: './images/samuraiMack/Run.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './images/samuraiMack/Jump.png',
			framesMax: 2,
		},
		attack1: {
			imageSrc: './images/samuraiMack/Attack1.png',
			framesMax: 6,
		},
		attack2: {
			imageSrc: './images/samuraiMack/Attack2.png',
			framesMax: 6,
		},
		death: {
			imageSrc: './images/samuraiMack/Death.png',
			framesMax: 6,
		},
		fall: {
			imageSrc: './images/samuraiMack/Fall.png',
			framesMax: 2,
		},
		takeHit: {
			imageSrc: './images/samuraiMack/TackHitWhite.png',
			framesMax: 4,
		},
	},
	attackBox: {
		offset: {
			x: 200,
			y: 70,
		},
		width: 200,
		height: 50,
	},
});

const enemy = new Fighter({
	position: {
		x: 600,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	color: 'blue',
	imageSrc: './images/kenji/Idle.png',
	framesMax: 4,
	scale: 2.86,
	offset: {
		x: 150,
		y: 55,
	},
	sprites: {
		idle: {
			imageSrc: './images/kenji/Idle.png',
			framesMax: 4,
		},
		run: {
			imageSrc: './images/kenji/Run.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './images/kenji/Jump.png',
			framesMax: 2,
		},
		attack1: {
			imageSrc: './images/kenji/Attack1.png',
			framesMax: 4,
		},
		attack2: {
			imageSrc: './images/kenji/Attack2.png',
			framesMax: 4,
		},
		death: {
			imageSrc: './images/kenji/Death.png',
			framesMax: 7,
		},
		fall: {
			imageSrc: './images/kenji/Fall.png',
			framesMax: 2,
		},
		takeHit: {
			imageSrc: './images/kenji/TakeHit.png',
			framesMax: 3,
		},
	},
	attackBox: {
		offset: {
			x: -90,
			y: 70,
		},
		width: 200,
		height: 50,
	},
});

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
}

const f = decreaseTimer();
let intervalId = setInterval(f, 1000);

function animate() {
	window.requestAnimationFrame(animate);

	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);

	background.update();
	c.fillStyle = 'rgba(255,255,255,.3)';
	c.fillRect(0, 0, canvas.width, canvas.height - 97);
	shop.update();
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// player movement
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5;
		player.switchSprites('run');
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5;
		player.switchSprites('run');
	} else {
		player.switchSprites('idle');
	}

	// player jumping
	if (player.velocity.y < 0) {
		player.switchSprites('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprites('fall');
	}

	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5;
		enemy.switchSprites('run');
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
		enemy.switchSprites('run');
	} else {
		enemy.switchSprites('idle');
	}

	// enemy jumping
	if (enemy.velocity.y < 0) {
		enemy.switchSprites('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprites('fall');
	}

	// players collision
	if (rectangularCollision({
		rectangle1: player,
		rectangle2: enemy,
	}) && player.isAttacking && player.framesCurrent === 4 ) {
		player.isAttacking = false;
		enemy.takeHit();
		// document.getElementById('').style.width = `${enemy.health}%`;
		gsap.to('#enemyHealth', {
			width: `${enemy.health}%`,
		});
	}

	// if player misses
	if (player.isAttacking && player.framesCurrent === 4 ) {
		player.isAttacking = false;
	}

	if (rectangularCollision({
		rectangle1: enemy,
		rectangle2: player,
	}) && enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
		player.takeHit();
		document.getElementById('playerHealth').style.width = `${player.health}%`;
	}

	// if enemy misses
	if (enemy.isAttacking && enemy.framesCurrent === 2 ) {
		enemy.isAttacking = false;
	}

	// fight results
	if (player.health <= 0) {
		setResult('Player 2 wins');
		clearInterval(intervalId);
	}
	if (enemy.health <= 0) {
		setResult('Player 1 wins');
		clearInterval(intervalId);
	}
}

animate();

window.addEventListener('keydown', (event) => {
	// player keyboard
	switch (event.key) {
		case 'd':
			keys.d.pressed = true;
			player.lastKey = 'd';
			break;
		case 'a':
			keys.a.pressed = true;
			player.lastKey = 'a';
			break;
		case 'w':
			player.velocity.y = -18;
			break;
		case ' ':
			player.attack();
			break;
	}

	// enemy keyboard
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			enemy.lastKey = 'ArrowRight';
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			enemy.lastKey = 'ArrowLeft';
			break;
		case 'ArrowUp':
			enemy.velocity.y = -18;
			break;
		case 'ArrowDown':
			enemy.attack();
			break;
	}
});

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
	}

	// enemy
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
	}
});









