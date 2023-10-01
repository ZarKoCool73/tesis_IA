import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LearningServiceService} from "../../services/learning-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserServiceService} from "../../services/user-service.service";
import Swal from "sweetalert2";
import {User} from 'src/app/models/user';

@Component({
  selector: 'app-frameboard',
  templateUrl: './frameboard.component.html',
  styleUrls: ['./frameboard.component.scss']
})
export class FrameboardComponent implements OnInit, AfterViewInit {
  name = 'World';
  @Input() hasSon: boolean = false
  userProfile: User;
  currentHour = '';

  constructor(private http: HttpClient,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private elementRef: ElementRef,
              private _userService: UserServiceService,
              private learningServices: LearningServiceService) {
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
    /* this._activatedRoute.params.subscribe((link) => {

     })*/
    const userId = localStorage.getItem('userId');
    this.loadDetail(userId)
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

  obtenerData() {
    this.learningServices.isVentanaEmergenteAbierta().subscribe((ventanaAbierta) => {
      if (!ventanaAbierta) {
        // La ventana emergente se ha cerrado, realiza las acciones que necesites
        this.learningServices.detenerServicioDeVideo();
        console.log('La ventana emergente se ha cerrado.');
      }
    });
  }

  obtenerVideo(): void {
    this.learningServices.abrirVentanaEmergente();
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
    this.obtenerData()
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
        this.userProfile = res.user
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
    if(window.innerWidth > 1250) {
      return 'Sistema de Orientación para el Fomento e Integración del Aprendizaje en Señas (SOFIA)'
    } else {
      return  'Sistema de Orientación... (SOFIA)'
    }
  }
}
