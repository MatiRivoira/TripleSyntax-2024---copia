import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pipe, take } from 'rxjs';

import { AuthService } from 'src/app/servicios/auth.service';
import { ChatService } from 'src/app/servicios/chat.service';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  popup: boolean = false;
  mensajePopup: string = "";
  mensajes: any[] = [];
  usuario: any;
  mesa: any;
  usuarioAnonimo: any;
  nuevoMensaje: string = "";

  constructor(
    private firestore: FirebaseService,
    private auth: AuthService,
    private chat: ChatService,
    private router: Router,
    private fcmService: FirebaseCloudMessagingService
  ) { }

  ngOnInit(): void {
    this.mesa = this.obtenerMesaDelCliente();
    this.usuario = this.firestore.obtenerClienteAnonimo();

    if(!this.usuario) {
      let usuario = {
        perfil: "mozo",
        nombre: "mozo",
      }

      this.usuario = usuario;
    }

    console.log("USUARIO ACTUAL: ", this.usuario)

    this.chat.obtenerMensajes().subscribe((data) => {
      this.mensajes = data;
      if(data) {
        this.mensajes = data.sort((a: any, b: any) => {
          const dateA = this.convertToDate(a.time);
          const dateB = this.convertToDate(b.time);
          return dateA.getTime() - dateB.getTime();
        });
      }
      console.log("MENSAJES DE LA BD: ",data);
    });
  }

  convertToDate(dateString: string): Date {
    const [day, month, year, hour, minute, second] = dateString.split(/[\s/:]/);
    return new Date(+year, +month - 1, +day, +hour, +minute, +second);
  }

  enviarMensaje() {
    console.log("Contenido: ", this.nuevoMensaje);
    console.log("MESA DEL CLIENTE: ", this.obtenerMesaDelCliente())

    if(this.nuevoMensaje.trim() != "") {
      let mensaje;
      if(this.usuario.perfil == "anonimo") {
        mensaje = {
          contenido: this.nuevoMensaje,
          time: this.formatearFecha(),
          usuario: this.usuario.perfil,
          perfil: this.usuario.perfil,
          mesa: 1,
        };
      } else {
        mensaje = {
          contenido: this.nuevoMensaje,
          time: this.formatearFecha(),
          usuario: this.usuario.perfil,
          perfil: this.usuario.perfil,
        };
      }


      console.log("Mensaje a guardar: ", mensaje)

      this.chat.crearMensaje(mensaje);
      this.deslizarPantallaHaciaAbajo();
      this.nuevoMensaje = "";

      if (this.usuario.perfil === 'cliente' || this.usuario.perfil === 'anónimo') {
        // enviar push notification mensaje consulta
        this.fcmService.nuevoMensajePushNotification(this.usuario.nombre + " " + this.usuario.apellido, mensaje.contenido, 'mozo');
      }
      else {
        // enviar push notification mensaje respuesta chat
        this.fcmService.nuevoMensajePushNotification('Soporte', mensaje.contenido, '');
      }
    } else {
      this.mensajePopup = "No puede enviar mensajes vacíos";
      this.popup = true;
      return;
    }
  }

  obtenerMesaDelCliente() {
    this.firestore.obtenerColeccion("mesas").pipe(take(1)).subscribe((mesas) => {
      this.firestore.obtenerColeccion("usuarios-aceptados").pipe(take(1)).subscribe((usuarios) => {
        for (let mesa of mesas) {
          console.log("MESA: ", mesa.cliente.id);
          for (let usuario of usuarios) {
            console.log("usuario a comparar: ", usuario.id);
            if (mesa.cliente.id == usuario.id) {
              console.log("MESA ENCONTRADA: ", mesa);
              return mesa.id;
            }
          }
        }
      });
    });
  }

  formatearFecha() {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let year = now.getFullYear();
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let seconds = ("0" + now.getSeconds()).slice(-2);

    const fechaFormateada = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return fechaFormateada;
  }

  deslizarPantallaHaciaAbajo() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const contenedorMensajes = document.querySelector('pantalla');
    let toppos: any = [];
    if (lastElement != null) {
      toppos = lastElement.offsetTop;
    }
    if (contenedorMensajes != null) {
      contenedorMensajes.scrollTop = toppos;
    }
  }

  // verificarPerfil() {
  //   if (this.usuario.perfil == "mozo") {
  //     this.router.navigateByUrl("/mozo");
  //   }
  //   else {
  //     this.router.navigateByUrl("/inicio-cliente/mesa");
  //   }

  // }

}
