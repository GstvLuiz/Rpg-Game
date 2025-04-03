let player;
let enemy;
let playerName = "";
let gameText = document.getElementById("game-text");
let startBtn = document.getElementById("start-btn");
let playerNameInput = document.getElementById("player-name");
let actionButtons = document.querySelectorAll(".action-btn");
let battleDiv = document.getElementById("battle");
let choicesDiv = document.getElementById("choices");
let gameContainer = document.getElementById("game-container"); 

startBtn.addEventListener("click", startGame);

function startGame() {
    playerName = playerNameInput.value || "Herói";
    player = new Player(playerName);
    gameText.textContent = `Bem-vindo, ${playerName}! Você está em uma encruzilhada. Para onde deseja ir?`;
    playerNameInput.style.display = 'none';
    startBtn.style.display = 'none';
    choicesDiv.style.display = 'block';
}

function choosePath(choice) {
    choicesDiv.style.display = 'none';
    if (choice === 1) {
        gameText.textContent = "Você segue em frente e encontra uma floresta densa. Deseja entrar?";
        let enterForest = confirm("Deseja entrar na floresta?");
        if (enterForest) {
            gameText.textContent = "Você decide seguir o caminho pela floresta...";
            setTimeout(() => {
                gameText.textContent = "Você passa pela floresta e segue em frente, mas nada de especial acontece.";
                choicesDiv.style.display = 'block';
            }, 2000); 
        } else {
            gameText.textContent = "Você decide voltar e tentar outro caminho.";
            choicesDiv.style.display = 'block';
        }
    } else if (choice === 2) {
        gameText.textContent = "Você vira à esquerda e encontra um inimigo!";
        startBattle();
    } else if (choice === 3) {
        gameText.textContent = "Você vira à direita e encontra um baú trancado!";
        setTimeout(() => {
            let openChest = confirm("Deseja abrir o baú?");
            if (openChest) {
                gameText.textContent = "Você encontrou uma poção de cura!";
                player.health += 10;
                setTimeout(() => {
                    gameText.textContent = "Você engole a poção de cura e se sente mais forte!";
                    setTimeout(() => {
                        gameText.textContent = " * Sua vida foi restaurada em 10 pontos *.";
                        setTimeout(() => {
                            gameText.textContent = "Você decide seguir em frente.";
                            choicesDiv.style.display = 'block';
                        }, 2000);
                    }, 2000); 
                }, 2000); 
            } else {
                gameText.textContent = "Você decide ignorar o baú e seguir em frente.";
                choicesDiv.style.display = 'block';
            }
        }, 1000); 
    }
}

function startBattle() {
    enemy = new Enemy("Goblin", 30, 5);
    battleDiv.style.display = 'block';
    gameText.textContent = "Um inimigo apareceu! Prepare-se para a batalha!";
    updateBattleText();
}

function attack() {
    player.attack(enemy);
    triggerShakeEffect(); 
    if (enemy.isAlive()) {
        enemy.attack(player);
        if (player.health <= 0) {
            gameOver(); 
        } else {
            updateBattleText();
        }
    } else {
        gameText.textContent = `Você derrotou o ${enemy.getName()}!`;
        battleDiv.style.display = 'none';
        choicesDiv.style.display = 'block';
    }
}

function defend() {
    player.defend();
    enemy.attack(player);
    if (player.health <= 0) {
        gameOver(); 
    } else {
        updateBattleText();
    }
}

function flee() {
    gameText.textContent = "Você fugiu da batalha!";
    setTimeout(() => {
        gameText.textContent = "O que deseja fazer agora?";
        choicesDiv.style.display = 'block';
    }, 2000);
    battleDiv.style.display = 'none';
   
}

function updateBattleText() {
    gameText.textContent = `${player.getName()} tem ${player.health} de vida. O ${enemy.getName()} tem ${enemy.health} de vida.`;
}

function triggerShakeEffect() {
    battleDiv.classList.add('shake');
    gameContainer.classList.add('shake'); 

   
    setTimeout(() => {
        battleDiv.classList.remove('shake');
        gameContainer.classList.remove('shake'); 
    }, 500);
}

function gameOver() {
    gameText.textContent = `Você foi derrotado, ${player.getName()}!`;
    setTimeout(() => {
        gameText.textContent = "O jogo terminou. Você voltou ao menu.";
        setTimeout(() => {
            // Limpar dados de batalha
            enemy = null;
            player = null;
            
            // Voltar ao menu inicial
            choicesDiv.style.display = 'none'; // Esconde as opções de jogo
            battleDiv.style.display = 'none';  // Esconde a batalha
            startBtn.style.display = 'block';  // Exibe o botão "Começar"
            playerNameInput.style.display = 'block'; // Exibe o campo para digitar o nome
            playerNameInput.value = '';  // Limpa o campo de nome
            gameText.textContent = "Bem-vindo Jogador(a)! Insira seu nome:"; // Reinicia o texto

            // Resetando o layout para manter o alinhamento
            gameContainer.classList.add('reset-layout'); // Adiciona a classe de reset
            setTimeout(() => {
                gameContainer.classList.remove('reset-layout'); // Remove a classe após um pequeno delay
            }, 500); // Ajuste o tempo se necessário
        }, 2000); // Tempo para mostrar a mensagem de derrota
    }, 2000); // Tempo para transição
}



class Character {
    constructor(name, health, attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
        this.defending = false;
    }

    isAlive() {
        return this.health > 0;
    }

    takeDamage(damage) {
        if (this.defending) {
            damage /= 2;
            this.defending = false;
        }
        this.health -= damage;
    }
}

class Player extends Character {
    constructor(name) {
        super(name, 50, 10);
    }

    attack(enemy) {
        enemy.takeDamage(this.attackPower);
    }

    defend() {
        this.defending = true;
    }

    getName() {
        return this.name;
    }
}

class Enemy extends Character {
    constructor(name, health, attackPower) {
        super(name, health, attackPower);
    }

    attack(player) {
        player.takeDamage(this.attackPower);
    }

    getName() {
        return this.name;
    }
}

// Event listeners para os botões de ações do jogador
document.getElementById("action-1").addEventListener("click", () => choosePath(1));
document.getElementById("action-2").addEventListener("click", () => choosePath(2));
document.getElementById("action-3").addEventListener("click", () => choosePath(3));

document.getElementById("attack-btn").addEventListener("click", attack);
document.getElementById("defend-btn").addEventListener("click", defend);
document.getElementById("flee-btn").addEventListener("click", flee);
