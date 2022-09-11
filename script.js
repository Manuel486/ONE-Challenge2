let principal = document.querySelector('#principal');
let agregar_palabra= document.querySelector('#agregar_palabra');
let texto = document.querySelector('#texto');
let ahorcado = document.querySelector('#ahorcado');
let contenido = document.querySelector('#contenido');
let erroneo = document.querySelector('#erroneo');
let canvas = document.querySelector("#canvas");
let pincel = canvas.getContext("2d"); 
let sonidoCorrecto = new Audio('./musica/correcto.mp3');
let sonidoIncorrecto = new Audio('./musica/incorrecto.mp3');
let sonidoConfeti = new Audio('./musica/confeti.mp3');

// Parámetros del juego
let palabras = ['HTML','CSS','REACT','JAVA','PYTHON','PASCAL','RUBY','PROLOG','SQL','PHP'];
let letrasEncontradas = [];
let letrasErradas = [];
let palabra = "";
let intentos = 0;
let jugando = false;

// Iniciar juego
document.querySelector('#jugar').addEventListener("click",function(){
    ahorcado.style.display = "flex";
    principal.style.display = "none";
    reiniciarJuego();
    jugando = true;
    inicioJuego();
});

// Agregar palabra
document.querySelector('#agregar').addEventListener("click",function(){
    agregar_palabra.style.display = "flex";
    principal.style.display = "none";
});

// Consultar palabras existentes
document.querySelector('#consultar').addEventListener("click",function(){
    Swal.fire({
        heightAuto: false,
        title : 'Las palabras son: ',
        text : palabras,
        confirmButtonText: 'Regresar',
        confirmButtonColor: 'darkblue',
        allowOutsideClick: false,
    })
});

// Guardar palabra ingresada
document.querySelector('#guardar').addEventListener("click",function(){
    validarPalabra();
});

// Cancelar guardar palabra
document.querySelector('#cancelar').addEventListener("click",function(){
    principal.style.display = "flex";
    agregar_palabra.style.display = "none";
    texto.value = "";
});

// Nuevo juego -> nueva palabra
document.querySelector('#nuevoJuego').addEventListener("click",function(){
    reiniciarJuego();
    jugando = true;
    inicioJuego();
});

// Desistir -> regresar a la ventana principal
document.querySelector('#desistir').addEventListener("click",function(){
    Swal.fire({
        heightAuto: false,
        title: '😞 Perdiste 😞',
        text: 'La palabra secreta era :  "'+palabra+'".',
        imageUrl: './imagenes/perder.png',
        imageWidth: '130px',
        imageHeight: '80px',
        confirmButtonText: 'Regresar',
        confirmButtonColor: 'darkblue',
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            reiniciarJuego();
            jugando = false;
            principal.style.display = "flex";
            ahorcado.style.display = "none";
        } 
    });
})

function inicioJuego(){
    palabraAleatoria();
    crearEstructura();
    generarCamposVacios();
}

function palabraAleatoria(){
    let random = Math.floor(Math.random()*palabras.length);
    palabra = palabras[random];
}

function crearEstructura(){
    //soporte 
    pincel.fillStyle = "#0A3871";
    pincel.fillRect(10,250,210,6); 

    // columna
    pincel.fillStyle = "#0A3871";
    pincel.fillRect(50,20,6,230);
}

function generarCamposVacios(){
    for(let i of palabra){
        const span = document.createElement("span");
        span.textContent = "";
        span.classList.add("color");
        contenido.appendChild(span);
    }
}

function reiniciarJuego(){
    contenido.innerHTML = "";
    erroneo.innerHTML = "";
    canvas.width = canvas.width;
    document.getElementById('desistir').disabled = false;
    letrasEncontradas = [];
    letrasErradas = [];
    intentos = 0;
    palabra = "";
}

function agregarPalabra(texto){
    if(palabras.includes(texto)){
        error('warning','Advertencia','La palabra ya esta registrada en el juego.');
    } else{
        palabras.push(texto);
        ahorcado.style.display = "flex";
        agregar_palabra.style.display = "none";
        jugando = true;
        texto.value = "";
        inicioJuego();
    }
}

function validarPalabra(){
    let expregular = new RegExp('^[a-zñA-ZÑ]+$','i');
    if ((texto.value.search(' ')) == -1 && texto.value.length<=8 && expregular.test(texto.value)){
        let input = texto.value;
        input = input.toUpperCase();
        agregarPalabra(input);
    } else{
        error('error','Error al ingresar la palabra','La palabra debe contener 8 carácteres como máximo, '+
        'sin espacios en blanco y solo debe incluar letras.');
    }
}

// Ingresar letras
document.addEventListener("keyup", function(e) {
    let letra = e.key;
    letra = letra.toUpperCase();

    if(jugando && !letrasErradas.includes(letra) && !letrasEncontradas.includes(letra)){
        let indices = [];
        let idx = [...palabra].indexOf(letra);

        while(idx != -1){
            indices.push(idx);
            idx = [...palabra].indexOf(letra,idx+1);
        }

        if (indices.length>0) {
            for (let i = 0; i < indices.length; i++) {
                contenido.children[indices[i]].classList.add("correcto");
                contenido.children[indices[i]].textContent = letra;
                letrasEncontradas.push(letra);
            }

            if(letrasEncontradas.length == palabra.length){
                sonidoConfeti.play();
                alerta('🎉 Ganaste 🎉','./imagenes/victoria.png','150px','150px','Lograste encontrar la palabra secreta  "'+palabra+'".')
                document.getElementById('desistir').disabled = true;
                return;
            }
            sonidoCorrecto.play();

        } else if (letra.length==1 && /^[A-ZÑ]/.test(letra)) {
            sonidoIncorrecto.play();
            letrasErradas.push(letra);
            const span = document.createElement("span");
            span.textContent = letra;
            span.classList.add("incorrecto");
            erroneo.appendChild(span);
            intentos++;
            evaluarIntento(intentos);
            if(intentos == 6){
                alerta('😞 Perdiste 😞','./imagenes/perder.png','130px','80px','La palabra secreta era : "'+palabra+'".');
                return ;
            }
        } 
    }
});

function evaluarIntento(intentos){
    switch (intentos) {
        case 1:
            // palo superior
            pincel.fillStyle = "#0A3871";
            pincel.fillRect(50,14,120,6); 
            break;
        case 2:
            // palo inferior
            pincel.fillStyle = "#0A3871";
            pincel.fillRect(170,14,6,50);
            break;

        case 3:
            // cabeza
            pincel.beginPath();
            pincel.arc(173,84,20,0,2*3.14);
            pincel.strokeStyle = "#0A3871";
            pincel.lineWidth = 4;
            pincel.stroke();
            break;
        case 4:
            // cuerpo
            pincel.fillStyle = "#0A3871";
            pincel.fillRect(170,104,6,50);
            break;
        case 5:
            // pierna derecha
            pincel.fillStyle = "#0A3871";
            pincel.beginPath(); 
            pincel.moveTo(173,154);
            pincel.lineTo(160,190);
            pincel.lineWidth = 6;
            pincel.stroke();

            // pierna izquierda
            pincel.beginPath(); 
            pincel.moveTo(173,154);
            pincel.lineTo(186,190);
            pincel.lineWidth = 6;
            pincel.stroke();

            break;
        case 6:
            // brazo derecho
            pincel.fillStyle = "#0A3871";
            pincel.beginPath(); 
            pincel.moveTo(173,125);
            pincel.lineTo(150,141);
            pincel.lineWidth = 6;
            pincel.stroke();

            // brazo izquierdo
            pincel.beginPath(); 
            pincel.moveTo(173,125);
            pincel.lineTo(196,141);
            pincel.lineWidth = 6;
            pincel.stroke();

            break;
        default:
            break;
    }
}

function error(icono,titulo,texto){
    Swal.fire({
        heightAuto: false,
        icon : icono,
        title : titulo,
        text : texto,
        confirmButtonText: 'Regresar',
        confirmButtonColor: 'darkblue',
        allowOutsideClick: false,
    })
}

function alerta(titulo,imagen,widthImagen,heightImange,texto){
    Swal.fire({
        heightAuto: false,
        title: titulo,
        text: texto,
        imageUrl: imagen,
        imageWidth: widthImagen,
        imageHeight: heightImange,
        confirmButtonText: 'Nuevo Juego',
        confirmButtonColor: 'darkblue',
        showDenyButton: true,
        denyButtonText: 'Salir del Juego',
        denyButtonColor: 'gray',
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            reiniciarJuego();
            jugando = true;
            inicioJuego();
        } else if(result.isDenied){
            reiniciarJuego();
            jugando = false;
            principal.style.display = "flex";
            ahorcado.style.display = "none";
        }
    })
}