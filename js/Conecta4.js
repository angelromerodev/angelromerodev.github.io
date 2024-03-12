const ROWS = 6;
        const COLS = 7;
        const CELL_SIZE = 100;
        const PLAYER_1_COLOR = 0xff0000;
        const PLAYER_2_COLOR = 0x0000ff;

        let currentPlayer = 1;
        let board = [];
        let scene, camera, renderer;

        init();
        animate();

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            for (let i = 0; i < COLS; i++) {
                board[i] = [];
                for (let j = 0; j < ROWS; j++) {
                    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set((i - COLS / 2) * CELL_SIZE, (j - ROWS / 2) * CELL_SIZE, 0);
                    scene.add(cube);
                    board[i][j] = cube;
                }
            }

            document.addEventListener('click', onClick);
        }

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        function onClick(event) {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object;
                const column = Math.round((intersectedObject.position.x + COLS * CELL_SIZE / 2) / CELL_SIZE);
                dropToken(column);
            }
        }

        function dropToken(column) {
            for (let row = ROWS - 1; row >= 0; row--) {
                if (!board[column][row].userData.player) {
                    board[column][row].userData.player = currentPlayer;
                    board[column][row].material.color.set(currentPlayer === 1 ? PLAYER_1_COLOR : PLAYER_2_COLOR);
                    checkWin(column, row);
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    break;
                }
            }
        }

        function checkWin(column, row) {
            const directions = [[1, 0], [0, 1], [1, 1], [-1, 1]];
            for (const [dx, dy] of directions) {
                let count = 1;
                for (let dir = -1; dir <= 1; dir += 2) {
                    let nx = column + dir * dx;
                    let ny = row + dir * dy;
                    while (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && board[nx][ny].userData.player === currentPlayer) {
                        count++;
                        nx += dir * dx;
                        ny += dir * dy;
                    }
                }
                if (count >= 4) {
                    alert(`Player ${currentPlayer} wins!`);
                    resetBoard();
                    return;
                }
            }
        }

        function resetBoard() {
            for (let i = 0; i < COLS; i++) {
                for (let j = 0; j < ROWS; j++) {
                    board[i][j].userData.player = undefined;
                    board[i][j].material.color.set(0xffffff);
                }
            }
        }