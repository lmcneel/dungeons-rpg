const characters = {
    berzerker: {
        health: Math.floor(Math.random() * 100) + 1,
        attack: Math.floor(Math.random() * 12) + 1,
        card: `
            <div class="bg-danger card mx-2 text-center border border-light shadow" data-class="bezerker">
                <div class="card-img-top p-3">
                    <i class="fad fa-axe-battle fa-7x"></i>
                </div>
                <h3 class="card-title border-top border-light p-3">Berzerker</h3>
            </div>
        `,
    },
    necromancer: {
        health: Math.floor(Math.random() * 100) + 1,
        attack: Math.floor(Math.random() * 12) + 1,
        card: `
            <div class="bg-dark card mx-2 text-center border border-light shadow" data-class="necromancer">
                <div class="card-img-top p-3">
                    <i class="fad fa-book-dead fa-7x"></i>
                </div>
                <h3 class="card-title border-top border-light p-3">Necromancer</h3>
            </div>
        `
    },
    assassin: {
        health: Math.floor(Math.random() * 100) + 1,
        attack: Math.floor(Math.random() * 12) + 1,
        card: `
        <div class="bg-warning card mx-2 text-center border border-light shadow text-dark" data-class="assassin">
            <div class="card-img-top p-3">
                <i class="fad fa-dagger fa-7x card-img-top"></i>
            </div>
            <h3 class="card-title border-top border-light p-3">Assassin</h3>
        </div>
    `
    },
    wizard: {
        health: Math.floor(Math.random() * 100) + 1,
        attack: Math.floor(Math.random() * 12) + 1,
        card: `
            <div class="bg-primary card mx-2 text-center border border-light shadow" data-class="wizard">
                <div class="card-img-top p-3">
                    <i class="fad fa-book-spells fa-7x card-img-top"></i>
                </div>
                <h3 class="card-title border-top border-light p-3">Wizard</h3>
            </div>
        `
    },
};

const views = {
    start: {
        title: `Waiting for players to join...`,
        content:  `
            <button id="join-game" class="btn btn-outline-warning">Join Game</button>
        `,
    },
    characterSelection: {
        title: 'Please select your character',
        content: `
            ${characters.berzerker.card}
            ${characters.necromancer.card}
            ${characters.assassin.card}
            ${characters.wizard.card}
        `
    },
    gamePlay: {
        title: 'Game Play',
        content: `
            <div id="player1">
            </div>
            <div id="game-area">
                ...
            </div>
            <div class="player2">
            </div>
        `
    }
};

const game = {
    numberOfConnections: 0,
    playerNum: 0,
    player1: {
        isConnected: false,
        health: 0,
        attack: 0,
        name: '',
        card: '',
    },
    player2: {
        isConnected: false,
        health: 0,
        attack: 0,
        name: '',
        card: '',
    },
    start() {
        $('#game-view [data-bind]').each(function() {
            $(this).html(views.start[`${$(this).data('bind')}`]);
        });
    },
}

console.log(game);

const database = firebase.database();

const playersRef = database.ref('/players');
const chatRef = database.ref('/chat');

const connectedRef = database.ref('.info/connected');

connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      game.numberOfConnections++;
      $('.chat').append(`${moment().fromNow()}: A new person connected... <br /> ${game.numberOfConnections} people connected <br />`);
    } else {
      game.numberOfConnections--;
      $('.chat').append(`${moment().fromNow()}: A new person connected... <br /> ${game.numberOfConnections} people connected <br />å`);
    }
  })

game.start();


$(document).on('click', '#join-game', function() {
    console.log('DID I CLICK ANYTHING?');
    if(!game.player1.isConnected || !game.player2.isConnected) {
        game.playerNum = (game.player1.isConnected) ? 2 : 1 ;
        
        const playerRef = database.ref('/players/' + game.playerNum);
        playerRef.set({
            name: `Player ${game.playerNum}`
        });

        if(game.playerNum === 1) game.player1.isConnected = true;
        else game.player2.isConnected = true;

        playerRef.onDisconnect().remove();
        $('#game-view [data-bind]').each(function() {
            $(this).html(views.characterSelection[`${$(this).data('bind')}`]);
        });
        console.log(game);
    } else {
        // Two are already playing the game...
        // Show the waiting screen
    }

});

playersRef.on("value", function(snapshot) {
    // Check how many entries have so we can change the game object....
    game.numberOfConnections = snapshot.numChildren();

    game.player1.isConnected = snapshot.child(1).exists();
    game.player2.isConnected = snapshot.child(2).exists();
})
