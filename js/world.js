var WorldStructureList = {
    pyramid:    {display:'Pyramid', symbol: '^', danger: 4, chance: 0.005},
    cave:       {display:'Cave',    symbol: 'o', danger: 1, chance: 0.01},
};
var ClutterList = [
];
[ '.', ',', '\'', '`' ].forEach( function( symbol ) {
    [ '#862', '#531' ].forEach( function( style ) {
        ClutterList.push( { symbol: symbol, style: style } );
    } );
} );

var WORLD_SIZE = 32;
var HALF_WORLD_SIZE = WORLD_SIZE / 2;

function lerp( a, b, n ) {
    return ( a * ( 1 - n ) ) + ( b * n );
}

var world = {
    worldStructures: {},
    sprites: {},

    camX: 0,
    camY: 0,
    destX: 0,
    destY: 0,

    calculateDanger: function( x, y ) {
        return Math.floor( Math.sqrt( x * x + y * y ) / 6 );
    },

    build: function() {
        for ( var y = 0; y < WORLD_SIZE; y++ ) {
            for ( var x = 0; x < WORLD_SIZE; x++ ) {
                var danger = this.calculateDanger( x - HALF_WORLD_SIZE, y - HALF_WORLD_SIZE );

                var isFilled = false;
                for ( var slug in WorldStructureList ) {
                    var structure = WorldStructureList[ slug ];

                    var dangerDiff = 0;
                    if ( structure.danger ) dangerDiff = Math.abs( danger - structure.danger );

                    var chance = structure.chance * Math.pow( 1.3, dangerDiff );

                    if ( Math.random() < chance ) {
                        this.worldStructures[ x + '_' + y ] = structure;
                        isFilled = true;
                        break;
                    }
                }

                if ( !isFilled ) {
                    if ( Math.random() < 0.05 ) {
                        var clutter = ClutterList[ Math.floor( Math.random() * ClutterList.length ) ];
                        this.worldStructures[ x + '_' + y ] = clutter;
                    }
                }
            }
        }

    },

    init: function() {
        this.build();
        this.canvas = $('#world-div')[0];
        this.context = this.canvas.getContext('2d');

        this.blitCanvas = $('<canvas width="512" height="512" style="position: absolute; left: -5000px;"></canvas>');
        $(document.body).append( this.blitCanvas );
        this.blitCanvas = this.blitCanvas[0];
        this.blitContext = this.blitCanvas.getContext('2d');

        this.renderBg();
        this.render( 0, 0 );
    },

    renderBg: function() {
        var bl = this.blitContext;

        bl.fontStyle = '16px monospace'

        bl.fillStyle = '#000';
        bl.fillRect( 0, 0, this.blitCanvas.width, this.blitCanvas.height );

        bl.fillStyle = '#fff';
        for ( var _pos in this.worldStructures ) {
            var pos = _pos.split('_');

            var struct = this.worldStructures[_pos];

            if ( struct.style )
                bl.fillStyle = struct.style;
            else
                bl.fillStyle = '#fff';

            if ( struct.symbol )
                struct = struct.symbol;

            bl.fillText( struct, pos[0] * 16, pos[1] * 16 );
        }

    },

    render: function() {
        this.context.fillStyle = '#000';
        this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
        console.log( this.camX, this.camY );
        this.context.drawImage( this.blitCanvas, this.camX * 16, this.camY * 16 );

        this.context.fillStyle = '#2B5';
        this.context.fillText( '@', 320, 240 );
    },

    move: function( relX, relY ) {
        if ( this.isMoving )
            return;

        var startX = this.camX;
        var startY = this.camY;
        var _world = this;

        this.isMoving = true;

        this.start = new Date().getTime();
        this.timeEnd = this.start + 1000;

        this.interp = ( function( t ) {
            this.camX = startX + t * relX;
            this.camY = startY + t * relY;
        } ).bind( this );

        window.requestAnimationFrame( this.moveStep.bind( this ) );
    },

    moveStep: function() {
        var curTime = new Date().getTime();
        var t = ( ( curTime - this.start ) / ( this.timeEnd - this.start ) ) * 4;

        if ( t > 1 ) {
            t = 1;
        }

        this.interp( t );

        this.render();

        if ( t < 1 ) {
            window.requestAnimationFrame( this.moveStep.bind( this ) );
        } else {
            this.isMoving = false;
            this.interp = undefined;
            this.start = undefined;
            this.timeEnd = undefined;
        }
    }
};

