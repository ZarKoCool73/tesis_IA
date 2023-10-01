import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LearningServiceService} from "../../services/learning-service.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-frameboard',
  templateUrl: './frameboard.component.html',
  styleUrls: ['./frameboard.component.scss']
})
export class FrameboardComponent implements OnInit, AfterViewInit {
  name = 'World';
  @Input() hasSon: boolean = false


  constructor(private http: HttpClient,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private elementRef: ElementRef,
              private learningServices: LearningServiceService) {
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
      content.style.height = window.innerHeight - header.offsetHeight - 21 + 'px'
    }
    if (header && contentSon) {
      contentSon.style.height = window.innerHeight - header.offsetHeight + 'px'
    }
  }

  ngOnInit(): void {
   /* this._activatedRoute.params.subscribe((link) => {

    })*/
  }

  obtenerData() {
    this.learningServices.isVentanaEmergenteAbierta().subscribe((ventanaAbierta) => {
      if (!ventanaAbierta) {
        // La ventana emergente se ha cerrado, realiza las acciones que necesites
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
      navbar.style.height = window.innerHeight - header.offsetHeight - 11 + 'px'
    }
    if (header && content) {
      const height = window.innerHeight - header.offsetHeight - 11
      content.style.height = height + 'px'
    }
    if (header && contentSon) {
      const height = window.innerHeight - header.offsetHeight - 11
      contentSon.style.height = height + 'px'
    }
    this.obtenerData()
  }

  getNavBar(module: string) {
    return document.location.href.includes(module)
  }
}
