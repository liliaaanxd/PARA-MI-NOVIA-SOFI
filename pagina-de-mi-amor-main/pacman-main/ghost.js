// Variable global para alternar modo debug
let showRanges = false;

// Detectar tecla D para activar/desactivar modo debug
document.addEventListener("keydown", function (event) {
    if (event.key === "v" || event.key === "v") {
        showRanges = !showRanges;
        console.log("Modo debug:", showRanges ? "Activado" : "Desactivado");
    }
});

class Ghost {
    constructor(
        x,
        y,
        width,
        height,
        speed,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        range
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }

    isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
    }

    changeRandomDirection() {
        this.randomTargetIndex = (this.randomTargetIndex + 1) % 4;
    }

    moveProcess() {
        if (this.isInRange()) {
            this.target = pacman;
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case 4: this.x -= this.speed; break;
            case 3: this.y += this.speed; break;
            case 2: this.x += this.speed; break;
            case 1: this.y -= this.speed; break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case 4: this.x += this.speed; break;
            case 3: this.y -= this.speed; break;
            case 2: this.x -= this.speed; break;
            case 1: this.y += this.speed; break;
        }
    }

    checkCollisions() {
        return (
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize + 0.9999)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize + 0.9999)] == 1
        );
    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (this.getMapY() != this.getMapYRightSide() &&
            (this.direction == DIRECTION_LEFT || this.direction == DIRECTION_RIGHT)) {
            this.direction = DIRECTION_UP;
        }
        if (this.getMapX() != this.getMapXRightSide() &&
            this.direction == DIRECTION_UP) {
            this.direction = DIRECTION_LEFT;
        }
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    calculateNewDirection(map, destX, destY) {
        let mp = map.map(row => row.slice());
        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            rightX: this.getMapXRightSide(),
            rightY: this.getMapYRightSide(),
            moves: [],
        }];

        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                queue.push(...neighborList);
            }
        }

        return 1;
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (poped.x - 1 >= 0 && mp[poped.y][poped.x - 1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (poped.x + 1 < numOfRows && mp[poped.y][poped.x + 1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (poped.y - 1 >= 0 && mp[poped.y - 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (poped.y + 1 < numOfColumns && mp[poped.y + 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }

    getMapXRightSide() {
        return parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
    }

    getMapYRightSide() {
        return parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
    }

    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();

        // Mostrar círculo solo en modo debug
        if (showRanges) {
            canvasContext.beginPath();
            canvasContext.strokeStyle = "red";
            canvasContext.arc(
                this.x + oneBlockSize / 2,
                this.y + oneBlockSize / 2,
                this.range * oneBlockSize,
                0,
                2 * Math.PI
            );
            canvasContext.stroke();
        }
    }
}

// Actualizar y dibujar fantasmas
let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }

    // Mostrar texto en pantalla si modo debug está activo
    if (showRanges) {
        canvasContext.font = "16px Arial";
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Modo debug activado", 10, 20);
    }
};

