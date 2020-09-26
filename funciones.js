var pausa              =     0;
var Velocity           =    15;
var Sonidos            = [261,277,293,311,329,349,369,392,415,440,466,493];
var context = new (window.AudioContext || window.webkitAudioContext)();
var mute               =     1;
var hability           =     1;
var direccionMars  = 1;

function Sonido(nota,time){
    //creamos oscilador
   var osc = context.createOscillator();

   // admite: sine, square, sawtooth, triangle
   osc.type = 'sine'; 

   osc.frequency.value=Sonidos[nota];

   //asignamos el destino para el sonido
   osc.connect(context.destination);
   //iniciamos la nota
   if(mute==1 && pausa==0){
   osc.start();
   //detenemos la nota medio segundo despues
   osc.stop(context.currentTime + time/ Sonidos[nota]);
   };

};

var html2 = document.getElementById("Score").innerHTML;



var teclado={
    teclas: new Array(),
    iniciar: function(){
        document.onkeydown=teclado.guardarTecla;
        document.onkeyup  = teclado.borrarTecla;
    },
    guardarTecla: function(e){
        if (teclado.teclas.indexOf(e.key) == -1){
            teclado.teclas.push(e.key);
        };
    },
    borrarTecla: function(e){
        var posicion = teclado.teclas.indexOf(e.key);
        if(posicion !== -1){
            teclado.teclas.splice(posicion, 1);
        };
    },
    teclaPulsada: function(codigoTecla){
        return (teclado.teclas.indexOf(codigoTecla) !== -1) ? true : false;
    }//,
    //reiniciar: function(){
    //    teclado.teclas = new Array;
    //}
}

teclado.iniciar();



//------------------------
function screenfun(tilesX,tilesY, crear){
    var dimensiones = {
        ancho: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        alto: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        };
    
    if ( dimensiones.ancho/tilesX < dimensiones.alto/tilesY) {
            escala= dimensiones.ancho/tilesX;
    } else {
            escala= dimensiones.alto/tilesY;
    };

    

    if(crear == 1){
    var html = document.getElementById("juego").innerHTML;
    var div= "<canvas id= screen></canvas>";
    document.getElementById("juego").innerHTML = html + div;
    };
    

    var margenGrosor = 1;

    document.getElementById("screen").style.width  = (Math.floor(escala * tilesX * 0.9)+ "px");
    document.getElementById("screen").style.height = (Math.floor(escala* tilesY * 0.9)+ "px");
    document.getElementById("screen").style.border = margenGrosor + "px solid #000000";
    //console.log(dimensiones.alto);                                     console.log
    //-----------------Centrar
    document.getElementById("juego").style.position = "absolute";
    document.getElementById("juego").style.left = Math.floor((dimensiones.ancho - (escala * tilesX) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles
    document.getElementById("juego").style.top  = Math.floor((dimensiones.alto  - (escala * tilesY) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles
    //----------------/Centrar

};
    //----------------/Matriz con las tiles

   

/////// Lo de bucle principal viste? me parece obvio
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,
    fps: 0,
    CPA: 0,
    iterar: function(registroTemporal) {
        buclePrincipal.idEjecucion = window.requestAnimationFrame(buclePrincipal.iterar);

        buclePrincipal.actualizar(registroTemporal);
        buclePrincipal.dibujar();
        screenfun(20,12,0);

        if(registroTemporal - buclePrincipal.ultimoRegistro > 999) {
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: " + buclePrincipal.aps + "/ FPS: " + buclePrincipal.fps);
            buclePrincipal.fps = 0;
            buclePrincipal.aps = 0;
            buclePrincipal.CPA=0;
        }
    },
    detener: function() {

    },
    actualizar: function(registroTemporal) {
        //console.log(teclado.teclas[0]);

        /*var arriba   =  ( teclado.teclas=="ArrowUp"||teclado.teclas=="w");
        var abajo    =  (teclado.teclas=="ArrowDown"||teclado.teclas=="s");
        var izquierda =  (teclado.teclas=="ArrowLeft"||teclado.teclas=="a");
        var derecha  =  (teclado.teclas=="ArrowRight"||teclado.teclas=="d");*/

        //direccion = direccion + ((arriba||abajo) && ultimaDrieccion!=1) * (1-direccion)+ ((izquierda||derecha) && ultimaDrieccion!=0) * (0-direccion);
        //sentido   = sentido   + ((arriba && ultimaDrieccion!=1) || (izquierda && ultimaDrieccion!=0)) * (1-sentido) + ((abajo && ultimaDrieccion!=1) || (derecha && ultimaDrieccion!=0)) * (0-sentido);

        //Moverse

        var izquierda =      (teclado.teclas.indexOf("ArrowLeft") !== -1  ||  teclado.teclas.indexOf("a") !== -1);
        var derecha   =      (teclado.teclas.indexOf("ArrowRight")!== -1  ||  teclado.teclas.indexOf("d") !== -1);

        var direccion =  derecha - izquierda;

        player[0] += direccion;
        //---------

        //El Winse

        if(Marcians.length == 0){
            restart();
        };

        //Movimiento de Marcianos
        
        var avanceVertical = 0;

        for(i=0;i<Marcians.length;i++){
            var original = direccionMars;
            direccionMars = direccionMars - (direccionMars==1 && Marcians[i][1] > 270) * (1+direccionMars) + (direccionMars== -1 && Marcians[i][1] < 30) * (1-direccionMars);
            avanceVertical = avanceVertical + (original!==direccionMars) * (1+avanceVertical);
        };

        for(i=0;i<Marcians.length;i++){
            Marcians[i][1] += direccionMars/4;
            Marcians[i][2] += avanceVertical;
        }

        //-----------------------

        //Colision de Disparos
        var disparoLength = disparo.length;
        var MarsLength    = Marcians.length;

        for(i=0,k=0; i+k < disparoLength;i++){
            for(j=0,l=0; j+l < MarsLength;j++){
                //Coincide horzontalmente
                var colision = (((disparo[i][1] > Marcians[j][1]) ^ (disparo[i][1] > Marcians[j][1]+tamMars)) || ((disparo[i][1]+3 > Marcians[j][1]) ^ (disparo[i][1]+3 > Marcians[j][1]+tamMars)))&&  ((disparo[i][2] > Marcians[j][2]) ^ (disparo[i][2] > Marcians[j][2]+tamMars*3/4));
                //if (colision==true){console.log("Colisionowo")};
                if (colision==true){
                    Marcians.splice(j,1);
                    disparo.splice(i,1);
                    j--;
                    l++;
                    i--;
                    k++;
                };
            };
        };

        //Recibir disparo
        for(i=0;i < disparo.length; i++){
            var colision = (disparo[i][2] > player[1]) && (((disparo[i][1] > player[0]) ^ (disparo[i][1] > player[0]+tamMars)) || ((disparo[i][1]+3 > player[0]) ^ (disparo[i][1]+3 > player[0]+tamMars)));
            if(colision==true){
                restart();
            }
        };

        //---------

        //Mover Disparos

        disparoLength = disparo.length;

        for(i=0, j=0; i + j< disparoLength;i++){
            disparo[i][2] += disparo[i][0];

            if(disparo[i][2] > 140 || disparo[i][2] < 0){
                disparo.splice(i,1);
                i--;
                j++;
            };
        };

        //-----------
        //Disparar

        if (hability==1 && teclado.teclas.indexOf(" ") !== -1){
            hability=0;
            //console.log("dispara");
            //Dispara
            var i = [];
            i[0] = -1;              //El priemr dato del disparo es la direccion
            i[1] = player[0] + tamMars/2-3/2;       //El segundo dato es su X
            i[2] = player[1] -10;    //El tercero es su Y
            disparo.push(i);
        };

        hability = hability + (teclado.teclas.indexOf(" ") == -1) * (1-hability);

        //----------



        
        //teclado.reiniciar();
        buclePrincipal.aps++;
        buclePrincipal.CPA++;
  //    console.log(teclado.teclas);
  //    console.log(disparo);
        if(buclePrincipal.CPA >= Velocity+50*pausa){
            buclePrincipal.CPA=0;


            //Busco Cabeza
            
            
            

            

            

            
            //console.log(document.onkeydown);
            //console.log("Holawa"+Grilla[X+XDir][Y]);
        };
        //step();
    },
    dibujar: function(registroTemporal) {
        buclePrincipal.fps++;

        stk.fillStyle="black";
        stk.fillRect(0,0,300,300);


        //Marcians

        stk.fillStyle="white";

        for(i=0; i< Marcians.length; i++){
            stk.fillRect(Marcians[i][1],Marcians[i][2],tamMars,tamMars*3/4);
        };

        //Personaje

        stk.fillStyle="#55ff55";
        stk.fillRect(player[0],player[1],tamMars,tamMars*3/4);

        //Disparos

        stk.fillStyle="white";

        for(i=0; i< disparo.length; i++){
            stk.fillRect(disparo[i][1],disparo[i][2],3,tamMars*3/4);
        };

        

    },
}


screenfun(20,12,1);

//---------------------------------------------FRONTERAAAAAAAA


stk = document.querySelector("canvas").getContext("2d");
stk.fillStyle="black";
stk.fillRect(0,0,300,300);


//Creo una matriz con los aliens

var disparo = [];
var Marcians = [];
var CantDeMarsPColumna    =  15;
var CantColumnas          =  5;
var tamMars       = 10;
var espMars =  3;
var posIniX               = 20;
var posIniY               = 20;


for(i=0; i < CantDeMarsPColumna * CantColumnas; i++){
    //Establesco caracteristicas del marciano
    var newMarcian = [];
    newMarcian[0] = true;                            //El primer dato del marciano es si esta vivo
    newMarcian[1] = posIniX + i * (tamMars + espMars) - Math.floor(i/CantDeMarsPColumna) * (tamMars + espMars) * CantDeMarsPColumna;     //El segundo dato es su posicion en X
    newMarcian[2] = posIniY + Math.floor(i/CantDeMarsPColumna) * (tamMars + espMars);                               //El tercer dato es su posicion en Y
    newMarcian[3] = 0;                               //El cuarto dato es su skin
    //Inserto un nuevo marciano en la matriz
    Marcians.push(newMarcian);
};

var player = [];
player[0] = 150;
player[1] = 135;

/*console.log("A " + (true ^ true));
console.log("B " + (true ^ false));
console.log("C " + (false ^ true));
console.log("D " + (false ^ false));*/7

restart = function(){
    disparo = [];
    Marcians = [];
    for(i=0; i < CantDeMarsPColumna * CantColumnas; i++){
        //Establesco caracteristicas del marciano
        var newMarcian = [];
        newMarcian[0] = true;                            //El primer dato del marciano es si esta vivo
        newMarcian[1] = posIniX + i * (tamMars + espMars) - Math.floor(i/CantDeMarsPColumna) * (tamMars + espMars) * CantDeMarsPColumna;     //El segundo dato es su posicion en X
        newMarcian[2] = posIniY + Math.floor(i/CantDeMarsPColumna) * (tamMars + espMars);                               //El tercer dato es su posicion en Y
        newMarcian[3] = 0;                               //El cuarto dato es su skin
        //Inserto un nuevo marciano en la matriz
        Marcians.push(newMarcian);
    };
    player[0] = 150;
    player[1] = 135;

    
};

buclePrincipal.iterar();
