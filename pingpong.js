// seleccionamos el canvas llamado pong en html
const canvas = document.getElementById("micanvas");

// propiedades para dibujar y hacer muchas cosas en el lienzo
const ctx = canvas.getContext('2d');

// cargamos el sonido con let, Podemos poner cualquier sonido
let cpuPuntos = new Audio();
let golpe = new Audio();
let choquepared = new Audio();
let puntosJugador = new Audio();


golpe.src = "sonidos/golpe.mp3";
choquepared.src = "sonidos/choquepared.mp3";
cpuPuntos.src = "sonidos/cpuPuntos.mp3";
puntosJugador.src = "sonidos/puntosJugador.mp3";

// Objeto de pelota
const pelota = {
    x : canvas.width/2,
    y : canvas.height/2,
    radio : 15,
    velocidadX : 5,
    velocidadY : 5,
    velocidad : 7,
    color : "Green"   //Color de la pelota
}

// Paleta de Jugador
const jugador = {
    x : 0, 
    y : (canvas.height - 100)/2, // -100 the altura de la paleta
    width : 10,
    height : 100,
    puntos : 0,              //puntos
    color : "blue"                  //Color de la paleta sera azul
}

// Paleta de Cpu
const com = {
    x : canvas.width - 10, // ancho de la paleta
    y : (canvas.height - 100)/2, // -100 para largo de la paleta
    width : 10,
    height : 100,
    puntos : 0,          //Puntos del Cpu
    color : "red"       //Color de la paleta del cpu sera rojo
}

// Linea de division de la mesa 
const linea = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "coral"
}

// dibujamos el rectangulo asi como en clase con los atributos necesarios 
function dibujarRectangulo(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// funcion para la pelota con esto dibujaremos la pelota para que se vaya borrando
function dibujarBolita(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// mover raton se investigo
canvas.addEventListener("mousemove", moverMouse);

function moverMouse(evt){   
    let rect = canvas.getBoundingClientRect();
    
    jugador.y = evt.clientY - rect.top - jugador.height/2;
}

//cuando el jugador o cpu anote un gol, se resetaria la pelota
function restarPelotita(){
    pelota.x = canvas.width/2;
    pelota.y = canvas.height/2;
    pelota.velocidadX = -pelota.velocidadX;
    pelota.velocidad = 7;
}

// dibujar la linea color coral
function dibujarLinea(){
    for(let i = 0; i <= canvas.height; i+=15){
        dibujarRectangulo(linea.x, linea.y + i, linea.width, linea.height, linea.color);
    }
}

// dibujar texto de marcador teniendo como parametros text,x,y
function dibujarTexto(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// detencion de colision con el borde para puntos
function colisionPelotita(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radio;
    b.bottom = b.y + b.radio;
    b.left = b.x - b.radio;
    b.right = b.x + b.radio;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// función de actualización, esta función es la que hace todos los calculos
function actualizacion(){
    
    //aqui podemos ver si la pelota va hacia la izquierda "pelota.x <0" gana el cpu, en caso contrario si "pelota.x> " gana el jugador
    if( pelota.x - pelota.radio < 0 ){
        com.puntos++;
        cpuPuntos.play();
        restarPelotita();
    }else if( pelota.x + pelota.radio > canvas.width){
        jugador.puntos++;
        puntosJugador.play();
        restarPelotita();
    }
    
    // velocidad de pelota
    pelota.x += pelota.velocidadX;
    pelota.y += pelota.velocidadY;
    
    //Juego de cpu
    com.y += ((pelota.y - (com.y + com.height/2)))*0.1;
    
    // cambia la velocidad de pelota para cpu
    if(pelota.y - pelota.radio < 0 || pelota.y + pelota.radio > canvas.height){
        pelota.velocidadY = -pelota.velocidadY;
        choquepared.play();
    }
    
    // esto verifica el golpe con paleta
    let player = (pelota.x + pelota.radio < canvas.width/2) ? jugador : com;
    
    // Si la pelota golpea la paleta entonces 
    if(colisionPelotita(pelota,player)){
        
        golpe.play();   // reproduce el sonido
        // comprobamos
        let puntoColision = (pelota.y - (player.y + player.height/2));
     
        puntoColision = puntoColision / (player.height/2);
        let Angulo = (Math.PI/4) * puntoColision;
        
        // change the X and Y velocity direction
        let direction = (pelota.x + pelota.radio < canvas.width/2) ? 1 : -1;
        pelota.velocidadX = direction * pelota.velocidad * Math.cos(Angulo);
        pelota.velocidadY = pelota.velocidad * Math.sin(Angulo);
        
        // velocidad cada vezque golpea la pelota
        pelota.velocidad += 0.1;
    }
}

//esta funcion manda a llamar todas las funciones de dibujo
//suele ocuparse para llamar varias veces a las funciones   
//En mi caso ocupo varias cosas para dibujar y se me es mas comodo
//mandar a llamarlas con render
function render(){
    
    // limpiar EL Rectangulo
    dibujarRectangulo(0, 0, canvas.width, canvas.height, "#000");
    
    // dibujamos el jugador con sus puntos a la izq.
    dibujarTexto(jugador.puntos,canvas.width/4,canvas.height/5);
    
    // dibujamos al cpu con sus puntos a la derecha
    dibujarTexto(com.puntos,3*canvas.width/4,canvas.height/5);
    
    // dibujamos la linea color coral
    dibujarLinea();
    
    // dibujamos la paleta del jugador
    dibujarRectangulo(jugador.x, jugador.y, jugador.width, jugador.height, jugador.color);
    
    // la paleta del cpu dibujamos
    dibujarRectangulo(com.x, com.y, com.width, com.height, com.color);
    
    // dibujamos la pelotita o bolita
    dibujarBolita(pelota.x, pelota.y, pelota.radio, pelota.color);
}
//Esta funcion nos permita llamar todo lo que tenga actualizacion
//Y lo demas que tiene render dentro de ella misma 
function juegoCompleto(){
    actualizacion();
    render();
}
// aqui podemos acelerar la velocidad con la que queremos que la bola vaya 
//Esta es la dificultad
let CuadrosXs = 100;

//llamamos la funcion del juegoCompleto cada segundo para que se vea fluido 
let loop = setInterval(juegoCompleto,1000/CuadrosXs);
