var express=require('express');
var init = require('readline-sync');
var app=express();
var server=require('http').createServer(app);
var session=require('express-session');
var io=require('socket.io').listen(server);
var file=require('fs'),temp = require('temp').track(),zipper=require('adm-zip'),storage=require('sqlite3').verbose();

console.log("\n\n\n SSSSSS   EEEEEE  N      N   DDDDDD  M      M   EEEEEE   PPPPPP   RRRRRR   OOOOOO\nS      S E        N      N  D      D  M\n\n\n");
//var zip=new zipper();
//var db_storage=new storage.Database('rev/beta.srv');
var pr=[];
var public_msg=[];
//console.log("\n\n   ---- El servidor requiere de tu cooperacion para continuar, descuida solo tomara unos segundos ----\n\n");
//var filename=init.question("Archivo de configuracion en especial? [Default value:'dbconf'] ");

//var ti=init.question("Tiempo de actualizacion de datos predeterminada? [Default value:180] ");


app.use(express.static("client"));
app.get("/",function(req,res){
	res.status(200).send("System ready!, Waiting instructions...");
});
io.sockets.on("connection",function(sos){
	console.log("NUEVA CONEXION DETECTADA");
	sos.emit("recibir-mensaje",public_msg);
	sos.on("new-info",function(){
		io.sockets.emit("feedback",{"regla":"una sola"});
	});
	//ENVIAR Y RECIBIR MENSAJE LOCAL
	sos.on("nuevo-mensaje",function(msg){
		//public_msg.push(msg);
		public_msg.push({"generic_msg":msg.generic_msg,"sended":sos.handshake.address,"name":msg.name});
		console.log("RUTINA: "+msg.generic_msg);
		io.sockets.emit("recibir-mensaje",public_msg);
	});
	//GENERADOR DE NUEVA SESION
	sos.on("nuevo-nombre",function(nombre){
		var date=new Date();
		var newuser ={"name":nombre.nombre,"prioridad":nombre.prio,"fecha":date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear(),"mensaje":[{"name":nombre.nombre,"msg":"Hola! estoy ahora conectado"}]};
		pr.push(newuser);
		console.log("NUEVO USUARIO INGRESADO "+pr[pr.length-1].name);
		sos.emit("poner-nombre",pr[pr.length-1].mensaje);
		io.sockets.emit("actualizacion-de-nombres",pr);
	});
});

server.listen(process.env.PORT || 8080,function(){
	console.log("\nSENDMEPRO FEEDBACK --- RECORDAD CTRL+C PARA DETENER EL PROCESO, EXITO EN TODO\n\nSERVIDOR EN LINEA - ESPERANDO CONEXIONES...\n");
});

function update_ondatabase(){
	var db_mode,db_host,db_user;
	console.log("COMENZANDO GUARDADO EN LA BASE DE DATOS\n");
	var lineReader = require('readline').createInterface({
  		input: file.createReadStream(filename)
	});
	lineReader.on('line', function (line) {
  		if(db_mode==null){
  			db_mode=line;
  		}
  		else if(db_host==null){
  			db_host=line;
  		}
  		else if(db_user==null && db_mode!=0){
  			db_user=line;
  		}
	});
	switch(db_mode){
		case 0:
		var zip=new zipper();
		var db_storage=new storage.Database(db_host);

		break;
		case 1:
		break;
		case 2:
		break;
		default:
		console.log("ERROR DE GENERO - PODRIAS VOLVER A CONFIGURAR EL ARCHIVO DE REGISTRO UBICADO EN ["+filename+"]\n\nDebe estar escrito de esta manera\n\nDBA:NUMBER - Tipo de base de datos a usar [SQLITE3:0,MYSQL:1,PGSQL:2]\nDBA:HOSTNAME - Ruta o ubicacion del archivo o almacen de datos existente\nDBA:USER - Usuario principal\n\nEjemplo\n\n0\ndba/beta.sq\nNULL\n\n");
		break;
	}
}
function update_onlocaldatabase(){
	var zip=new zipper();
	var db_storage=new storage.Database('rev/beta.srv');
	
}
function update_onremotedatabase(){

}

//setInterval(update_onremotedatabase,180000);