import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";
import {UserServiceService} from "../../services/user-service.service";
import Swal from "sweetalert2";
import {User} from 'src/app/models/user';
import {EncryptionService} from "../../services/encryption-service.service";

@Component({
  selector: 'app-frameboard',
  templateUrl: './frameboard.component.html',
  styleUrls: ['./frameboard.component.scss']
})
export class FrameboardComponent implements OnInit, AfterViewInit {
  @Input() hasSon: boolean = false
  userProfile: User;
  currentHour = '';

  constructor(
    private _router: Router,
    private _userService: UserServiceService,
    private encryptionService: EncryptionService) {
    this.userProfile = new User('', '', '', '', '', '', '', '', '');
  }

  @HostListener('window:resize', ['$event'])
  changeNavHeight() {
    const header = document.getElementById('header')
    const navbar = document.getElementById('navbar')
    const content = document.getElementById('content')
    const contentSon = document.getElementById('contentSon')
    if (header && navbar) {
      navbar.style.height = window.innerHeight - header.offsetHeight + 'px'
    }
    if (header && content) {
      content.style.height = window.innerHeight - header.offsetHeight + 'px'
    }
    if (header && contentSon) {
      contentSon.style.height = window.innerHeight - header.offsetHeight + 'px'
    }
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const idDecrypt = this.decrypt(userId)
    this.loadDetail(idDecrypt)
    this.updateCurrentHour();
    setInterval(() => {
      this.updateCurrentHour();
    }, 1000);
  }

  private updateCurrentHour(): void {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convierte 0 a 12 en el formato de 12 horas
    this.currentHour = `${this.formatNumber(formattedHours)}:${this.formatNumber(minutes)} ${ampm}`;
  }

  private formatNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }


  ngAfterViewInit(): void {
    const header = document.getElementById('header')
    const navbar = document.getElementById('navbar')
    const content = document.getElementById('content')
    const contentSon = document.getElementById('contentSon')
    if (header && navbar) {
      navbar.style.height = window.innerHeight - header.offsetHeight + 'px'
    }
    if (header && content) {
      const height = window.innerHeight - header.offsetHeight
      content.style.height = height + 'px'
    }
    if (header && contentSon) {
      const height = window.innerHeight - header.offsetHeight
      contentSon.style.height = height + 'px'
    }
  }

  getNavBar(module: string) {
    return document.location.href.includes(module)
  }


  toggleWithGreeting(popover: any, greeting: string, language: string) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({greeting, language});
    }
  }

  loadDetail(id: any) {
    this._userService.getUser(id).subscribe((res: any) => {
      if (res.state == 1) {
        this.userProfile = res.response
      }
    }, (error: HttpErrorResponse) => {
      Swal.close();
      if (error.error.state == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message,
          confirmButtonColor: '#ff3600',
        });
      }
    })
  }

  get getSystemName() {
    if (window.innerWidth > 1250) {
      return 'Sistema de Orientación para el Fomento e Integración del Aprendizaje en Señas (SOFIA)'
    } else {
      return 'Sistema de Orientación... (SOFIA)'
    }
  }

  decrypt(id: any) {
    return this.encryptionService.decryptData(id);
  }

  deleteID() {
    Swal.fire({
      title: '<strong>Cerrar sesión</strong>',
      html: '¿Estás seguro de cerrar la sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#11e38a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.showLoading()
        localStorage.removeItem('userId')
        this._router.navigate(['/account'])
        Swal.close()
      }
    })
  }

}
