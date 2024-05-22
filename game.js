const gameState = {};

const config = {
	type: Phaser.WEBGL,
	width: 600,
	height: 600,
	backgroundColor: '000000',
	physics: {
		default: 'arcade',
		arcade: {
		  enableBody: true,
		}
	},
	scene: [GameScene]
  };
  
  const game = new Phaser.Game(config);