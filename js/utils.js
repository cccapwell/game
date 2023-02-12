function setResult (text) {
	document.getElementById('resultFight').innerText = text;
}

function decreaseTimer() {
	let timer = 100;

	return function () {
		if (timer > 0) {
			timer--;
			document.getElementById('timer').innerText = timer;
		} else {
			clearInterval(intervalId);

			if (player.health === enemy.health) setResult('Tie');
			if (player.health > enemy.health) setResult('Player 1 win');
			if (enemy.health > player.health) setResult('Player 2 win');
		}
	}
}

function rectangularCollision({rectangle1, rectangle2}) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.x + rectangle2.height
	)
}