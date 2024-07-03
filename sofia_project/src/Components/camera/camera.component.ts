import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {IaService} from "../../services/ia.service";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, AfterViewInit {

  @Input() dataCollection: any[] = []
  @Input() typeLetter: any[] = []
  //@ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  context!: CanvasRenderingContext2D;

  title = '';
  resultTitle = '';
  resultContent = '';
  resultAccuracy = '';

  ngAfterViewInit(): void {
    this.setupWebRTC();
    this.updateTitle();
  }

  ngOnInit(): void {
    console.log('this.da', this.dataCollection);
    //this.startCamera()
    this.setupWebRTC();
  }

  constructor(
    private readonly iaService: IaService
  ) {
  }

  /*startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play();
        })
        .catch(err => {
          console.error("Error accessing the camera: ", err);
        });
    } else {
      alert("Sorry, your browser does not support the camera access.");
    }
  }

  stopCamera() {
    let stream = this.videoElement.nativeElement.srcObject;
    if (stream) {
      if ("getTracks" in stream) {
        let tracks = stream.getTracks();
        tracks.forEach((track: any) => track.stop());
        this.videoElement.nativeElement.srcObject = null;
      }
    }
  }*/

  updateTitle() {
    if (window.location.href.includes('expression')) {
      this.title = 'Módulo de expresión';
    } else {
      this.title = 'Módulo de comprensión';
    }
  }

  setupWebRTC() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(stream => {
        this.localVideo.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error('Error en la configuración de WebRTC:', error);
      });
  }

  captureAndProcessImage() {
    const video = this.localVideo.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL('image/jpeg');
    const expressions = '0';

    this.iaService.processImage(imgData, expressions).subscribe(
      (data: any) => {
        const accuracyPercentage = data.accuracy ? `Precisión: ${data.accuracy.toFixed(2)}%` : '';
        if (data.accuracy > 60) {
          document.getElementById("title_result")!.innerText = "Interpretación del signo";
          document.getElementById("content_result")!.innerText = `${data.sign}`;
          document.getElementById("accuracy_result")!.innerText = accuracyPercentage;
        }
      },
      error => {
        console.log('error', error);
        document.getElementById("title_result")!.innerText = "Interpretación del signo";
        document.getElementById("content_result")!.innerText = '-';
        document.getElementById("accuracy_result")!.innerText = `${error.message}`;
      }
    );
  }
}
