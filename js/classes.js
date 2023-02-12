class Sprite {
	constructor({
		            position,
		            imageSrc,
		            scale = 1,
		            framesMax = 1,
		            offset = {x: 0, y: 0},
	            }) {
		this.position = position;
		this.width = 50;
		this.height = 150;
		this.image = new Image();
		this.image.src = imageSrc;
		this.scale = scale;
		this.framesMax = framesMax;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 14;
		this.offset = offset;
	}

	draw() {
		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			this.offset.y,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale,
		);
	}

	animateFrames() {
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else this.framesCurrent = 0;
		}
	}

	update() {
		this.draw();
		this.animateFrames();
	}
}

class Fighter extends Sprite {
	constructor({
		            position,
		            velocity,
		            color = 'red',
		            health = 100,
		            imageSrc,
		            scale = 1,
		            framesMax = 1,
		            offset = {x: 0, y: 0},
		            sprites,
		            attackBox = {
			            offset: {},
			            width: null,
			            height: null,
		            }
	            }) {

		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset,
		});
		this.velocity = velocity;
		this.width = 50;
		this.height = 150;
		this.lastKey;
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height,
		};
		this.color = color;
		this.isAttacking;
		this.health = health;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 10;
		this.sprites = sprites;
		this.dead = false;

		for (const sprite in this.sprites) {
			this.sprites[sprite].image = new Image();
			this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
		}
	}

	update() {
		this.draw();

		if (this.dead) {
			return
		}

		this.animateFrames();

		// дебаг области атаки
		// c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);


		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// gravity function
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 100) {
			this.velocity.y = 0;
			this.position.y = 326;
		} else this.velocity.y += gravity;
	}

	attack() {
		this.isAttacking = true;
		this.switchSprites('attack1');
	}

	takeHit() {
		this.health -= 20;

		if (this.health <= 0) {
			this.switchSprites('death');
		} else {
			this.switchSprites('takeHit');
		}
	}

	switchSprites(spriteName) {
		// when death
		if (this.image === this.sprites.death.image) {
			if (this.framesCurrent === this.sprites.death.framesMax - 1) {
				this.dead = true;
			}
			return;
		}

		// overrides all another animation except attack
		if (
			this.image === this.sprites.attack1.image &&
			this.framesCurrent < this.sprites.attack1.framesMax - 1
		)
			return;

		// take hit
		if (
			this.image === this.sprites.takeHit.image &&
			this.framesCurrent < this.sprites.takeHit.framesMax - 1
		)
			return;

		switch(spriteName) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image;
					this.framesMax = this.sprites.fall.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'attack1':
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image;
					this.framesMax = this.sprites.attack1.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image;
					this.framesMax = this.sprites.takeHit.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'death':
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image;
					this.framesMax = this.sprites.death.framesMax;
					this.framesCurrent = 0;
				}
			break;
		}
	}
}