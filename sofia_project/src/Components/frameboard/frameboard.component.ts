import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-frameboard',
  templateUrl: './frameboard.component.html',
  styleUrls: ['./frameboard.component.scss']
})
export class FrameboardComponent implements OnInit, AfterViewInit {
  name = 'World';
  @Input() hasSon: boolean = false
  constructor() { }

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
      contentSon.style.height = window.innerHeight - header.offsetHeight  + 'px'
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const header = document.getElementById('header')
    const navbar = document.getElementById('navbar')
    const content = document.getElementById('content')
    const contentSon = document.getElementById('contentSon')
    if (header && navbar) {
      navbar.style.height = window.innerHeight - header.offsetHeight -11 + 'px'
    }
    if (header && content) {
      const height =  window.innerHeight - header.offsetHeight - 11
      content.style.height = height + 'px'
    }
    if (header && contentSon) {
      const height =  window.innerHeight - header.offsetHeight  -11
      contentSon.style.height = height + 'px'
    }
  }

}
