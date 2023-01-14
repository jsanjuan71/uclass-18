// lo que requiero
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// valores iniciales o por defecto
dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;
const listaPlatillos = [
    {
        id : 1,
        nombre : "spaguetti",
        precio : 50 ,
        descripcion : "pasta con crema",
        categoria : "pastas"
    },
    {
        id : 2,
        nombre : "hamburguesa",
        precio : 70 ,
        descripcion : "hamburguesa de res con papas",
        categoria : "snacks"
    }
];

var lastId = 2;

// proceso o estructura

function findById(id){
    var found = null;
    for (const platillo of listaPlatillos) {
        if( platillo["id"] == id ) {
            found = platillo;
            break;
        }
    }
    return found;
}

// 0 false null ---> false

function findPositionById(id){
    var index = 0;
    var found = null;
    for (const platillo of listaPlatillos) {
        if( platillo["id"] == id ) {
            found = index;
            break;
        }
        index++;
    }
    if(found != null)
        return found;
    return -1;
}

//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/status", (req, res) => {
    res.status(200)
        .json({
            "done": true,
            "api" : {
                "name" : "ucamp-express",
                "version": "0.1.0",
                "owner" : "UCamp",
                "developer": "julio Sanjuan"
            },
            "services": {
                "database" : "error de conexion"
            }
        });
});

/**  Protocolo HTTP
 * Què recurso?                             platillo 
 * Qué método?                              GET
 * Qué datos de entrada requiere?           N/A
 * Qué debe responder?                      Lista con todos los platillos del menú
 */

//GET /platiilos 

app.get("/platillos", (request, response)=>{
    response.json({
        quantity : listaPlatillos.length,
        items : listaPlatillos
    });
});

/**  Protocolo HTTP
 * Què recurso?                             platillo 
 * Qué método?                              GET
 * Qué datos de entrada requiere?           id (path)
 * Qué debe responder?                      Obtener un platillo por id
 */ 
// GET /platillo/:id

app.get("/platillos/:identificador", (request, response)=>{
    /*
    request.query  //    GET /platillo?categoria=snack    -> query param
    request.params //    GET /platillo/2                  -> path param
    request.body //      POST /platillo/                  -> data param 
    */

    var id = request.params.identificador;

    /*array.forEach(listaPlatillos => {
        No se puede detener
    });*/

    var found = null;
    for (const platillo of listaPlatillos) {
        if( platillo["id"] == id ) {

            found = platillo;
            break;
        }
    }
    response.json({
        done : ! (found == null),
        item: found
    });
});

app.post("/platillos", (req, res)=>{
    var info = req.body;
    lastId++;
    
    nuevoPlatillo = {
        id : lastId,
        nombre : info.nombre ,
        precio : info.precio ,
        descripcion : info.descripcion,
        categoria : info.categoria
    };
    listaPlatillos.push(nuevoPlatillo);
    res.json({
        done: true,
        creado: nuevoPlatillo
    });
});


app.put("/platillos/:id", (req, res)=> {
    var platillo = findById( req.params.id );
    if(platillo) {
        platillo["precio"] = req.body.precio;
    }
    res.json({
        done : ! (platillo == null),
        id: req.params.id,
        data: req.body
    });
});

app.delete("/platillos/:id", (req, res)=> {
    var position = findPositionById( req.params.id );
    var positionIndex =  listaPlatillos.findIndex( platillo => platillo.id == req.params.id );
    console.log(position, positionIndex);
    var deleted = false;
    if(position != -1) {
        //slice -> rebanar
        listaPlatillos.splice(position, 1);
        deleted = true;
    }
    res.json({
        done : deleted,
        id: req.params.id
    });
});

//consumo

app.listen( port, () => {
    console.log(`Running server on http://localhost:${port}`)
} );