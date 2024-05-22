let screenCenterX;
let screenCenterY;

const snakeSpeed = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('snake', 'assets/player-img.png');
    this.load.image('target', 'assets/target-img.png');
  }

  create() {
    // Calculate screen center
    screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    var xCoord = Phaser.Math.Between(1, 23) * 25;
    var yCoord = Phaser.Math.Between(1, 23) * 25;

    // Add an array to store the body parts of the snake
    gameState.body = [];

    // adding player to the scene
    gameState.snakeHead = this.physics.add.sprite(xCoord, yCoord, 'snake');
    gameState.body.push(gameState.snakeHead);

    // Giving the head starting body parts
    const bodyPartCount = 8;
    for (let i = 0; i < bodyPartCount; i++) {
      this.addBodyPart();
    }

    //Adding targets
    const targets = this.physics.add.group();
    function generateTarget() {
      var x = Phaser.Math.Between(1, 23) * 25;
      var y = Phaser.Math.Between(1, 23) * 25;
      targets.create(x, y, 'target');
    }
    generateTarget();

    // Adding collider between target and snake
    this.physics.add.collider(targets, gameState.snakeHead, (snakeHead, target) => {
      target.destroy();
      generateTarget();

      // Add new body part
      this.addBodyPart();
    }, null, this);

    // Create cursor object 
    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Check if the player is out of the screen, if so show a Game Over
    if (gameState.snakeHead.x < 12 || gameState.snakeHead.x > 588 || gameState.snakeHead.y < 12 || gameState.snakeHead.y > 588) {
      gameState.gameover = this.add.text(screenCenterX, screenCenterY, 'Outside border \nClick to restart', {
        fontSize: '20px', fill: '#FFFFFF'
      });

      gameState.gameover.setOrigin(.5);

      this.physics.pause();

      this.input.on('pointerup', () => {
        gameState.score = 0;
        this.scene.restart();
      })
    }

    // cursor movement
    if (gameState.cursors.left.isDown) {
      gameState.snakeHead.setVelocity(-snakeSpeed, 0);

      // Prevent opposite cursor from being used
      gameState.cursors.right.enabled = false;
      gameState.cursors.up.enabled = true;
      gameState.cursors.down.enabled = true;

    } else if (gameState.cursors.right.isDown) {
      gameState.snakeHead.setVelocity(snakeSpeed, 0);

      // Prevent opposite cursor from being used
      gameState.cursors.left.enabled = false;
      gameState.cursors.up.enabled = true;
      gameState.cursors.down.enabled = true;

    } else if (gameState.cursors.down.isDown) {
      gameState.snakeHead.setVelocity(0, snakeSpeed);

      // Prevent opposite cursor from being used
      gameState.cursors.up.enabled = false;
      gameState.cursors.left.enabled = true;
      gameState.cursors.right.enabled = true;

    } else if (gameState.cursors.up.isDown) {
      gameState.snakeHead.setVelocity(0, -snakeSpeed);

      // Prevent opposite cursor from being used
      gameState.cursors.down.enabled = false;
      gameState.cursors.left.enabled = true;
      gameState.cursors.right.enabled = true;
    }

    // Update body parts position
    for (let i = gameState.body.length - 1; i > 0; i--) {
      gameState.body[i].x = gameState.body[i - 1].x;
      gameState.body[i].y = gameState.body[i - 1].y;
    }
  }

  addBodyPart() {
    const newBodyPart = this.physics.add.sprite(gameState.snakeHead.x, gameState.snakeHead.y, 'snake');
    gameState.body.push(newBodyPart);

    console.log(`length of the body: ${gameState.body}`);
  }
}