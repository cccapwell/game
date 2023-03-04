const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
let gameOver = false;

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: './images/bg.png',
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
	name: 'Kanfort',
	position: {
		x: 0,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	imageSrc: './images/samuraiMack/idle.png',
	framesMax: 9,
	framesHold: 12,
	scale: 1.5,
	offset: {
		x: -150,
		y: 20,
	},
	limits: {
		left: -150,
		right: 760,
	},
	sprites: {
		idle: {
			imageSrc: './images/kanfort/idle.png',
			framesMax: 9,
		},
		run: {
			imageSrc: './images/kanfort/walk.png',
			framesMax: 9,
		},
		jump: {
			imageSrc: './images/kanfort/jump.png',
			framesMax: 9,
		},
		attack1: {
			imageSrc: './images/kanfort/attack1.png',
			framesMax: 10,
		},
		victory: {
			imageSrc: './images/kanfort/victory.png',
			framesMax: 10,
		},
		// attack2: {
		// 	imageSrc: './images/kanfort/victory.png',
		// 	framesMax: 10,
		// },
		death: {
			imageSrc: './images/kanfort/death.png',
			framesMax: 7,
		},
		fall: {
			imageSrc: './images/kanfort/jump.png',
			framesMax: 9,
		},
		takeHit: {
			imageSrc: './images/kanfort/takeHit.png',
			framesMax: 6,
		},
	},
	attackBox: {
		offset: {
			x: -30,
			y: 70,
		},
		width: 200,
		height: 50,
	},
	gapAfterHit: -50,
});

const enemy = new Fighter({
	name: 'Sindel',
	position: {
		x: 600,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},

	limits: {
		left: -140,
		right: 770,
	},
	color: 'blue',
	imageSrc: './images/sindel/idle.png',
	framesMax: 9,
	scale: 1.6,
	offset: {
		x: -140,
		y: 40,
	},
	sprites: {
		idle: {
			imageSrc: './images/sindel/idle.png',
			framesMax: 9,
		},
		run: {
			imageSrc: './images/sindel/walk.png',
			framesMax: 9,
		},
		jump: {
			imageSrc: './images/sindel/jump.png',
			framesMax: 3,
		},
		attack1: {
			imageSrc: './images/sindel/attack1.png',
			framesMax: 7,
		},
		// attack2: {
		// 	imageSrc: './images/sindel/idle.png',
		// 	framesMax: 9,
		// },
		death: {
			imageSrc: './images/sindel/death.png',
			framesMax: 8,
		},
		victory: {
			imageSrc: './images/sindel/victory.png',
			framesMax: 7,
		},
		fall: {
			imageSrc: './images/sindel/jump.png',
			framesMax: 3,
		},
		takeHit: {
			imageSrc: './images/sindel/takeHit.png',
			framesMax: 7,
		},
	},
	attackBox: {
		offset: {
			x: -70,
			y: 50,
		},
		width: 170,
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
	// shop.update();

	c.fillStyle = 'rgba(255,255,255, .15)';
	c.fillRect(0, 0, canvas.width, canvas.height - 165);

	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// player movement
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5;
		player.switchSprite('run');
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5;
		player.switchSprite('run');
	} else {
		player.switchSprite('idle');
	}

	// player jumping
	if (player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5;
		enemy.switchSprite('run');
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
		enemy.switchSprite('run');
	} else {
		enemy.switchSprite('idle');
	}

	// enemy jumping
	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}

	// players collision
	if (rectangularCollision({
		rectangle1: player,
		rectangle2: enemy,
	}) && player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
		enemy.takeHit();

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
		gsap.to('#playerHealth', {
		  width: player.health + '%'
		});
	}

	// if enemy misses
	if (enemy.isAttacking && enemy.framesCurrent === 2 ) {
		enemy.isAttacking = false;
	}

	// fight results
	if (player.health <= 0) {
		setResult(`${enemy.name} wins`);
		clearInterval(intervalId);
	}
	if (enemy.health <= 0) {
		setResult(`${player.name} wins`);
		clearInterval(intervalId);
	}
}

animate();

window.addEventListener('keydown', (event) => {
	// player keyboard
	if (!player.dead) {
    switch (event.key) {
      case 'd':
      case 'в':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
      case 'ф':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
      case 'ц':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

	// enemy keyboard
	if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
});

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
		case 'в':
			keys.d.pressed = false;
			break;
		case 'a':
		case 'ф':
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









