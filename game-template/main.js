const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

const player = { x: 50, y: 0, width: 30, height: 50, vx: 0, vy: 0, onGround: false };
const gravity = 0.5;
const groundY = 550;
const obstacles = [
  { x: 300, y: 510, w: 40, h: 40 },
  { x: 500, y: 470, w: 40, h: 80 },
  { x: 800, y: 510, w: 40, h: 40 }
];

let cameraX = 0;
let lastTime = 0;

function gameLoop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  update(delta);
  render();
  requestAnimationFrame(gameLoop);
}

function update(delta) {
  if (keys['ArrowLeft']) player.vx = -3;
  else if (keys['ArrowRight']) player.vx = 3;
  else player.vx = 0;

  if ((keys['ArrowUp'] || keys[' ']) && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  player.x += player.vx;
  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.vy = 0;
    player.onGround = true;
  }

  obstacles.forEach(ob => {
    if (
      player.x < ob.x + ob.w &&
      player.x + player.width > ob.x &&
      player.y + player.height <= ob.y &&
      player.y + player.height + player.vy >= ob.y
    ) {
      player.y = ob.y - player.height;
      player.vy = 0;
      player.onGround = true;
    }
  });

  cameraX = player.x - 100;
  if (cameraX < 0) cameraX = 0;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-cameraX, 0);

  ctx.fillStyle = '#654321';
  ctx.fillRect(-1000, groundY, 5000, canvas.height - groundY);

  ctx.fillStyle = '#888';
  obstacles.forEach(ob => {
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
  });

  ctx.fillStyle = '#ff0000';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.restore();
}

requestAnimationFrame(gameLoop);

