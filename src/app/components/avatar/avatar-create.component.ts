import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-avatar-create',
  standalone: true,
  templateUrl: './avatar-create.component.html',
  styleUrls: ['./avatar-create.component.scss']
})
export class AvatarCreateComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private bodyModel!: THREE.Group;
  private shirtModel!: THREE.Group;

  private readonly bodyPath = 'assets/avatar/male_body.glb'; // Ruta al modelo GLB del cuerpo
  private readonly shirtPath = 'assets/avatar/hoodie.glb'; // Ruta al modelo GLB de la camisa

  constructor() { }

  ngOnInit(): void {
    this.initScene();
    this.loadBody();
    this.loadShirt();
    this.animate();
  }

  private initScene(): void {
    if (!this.rendererContainer) {
      console.error('Renderer container is not available.');
      return;
    }

    this.scene = new THREE.Scene();

    // Configuración de la cámara
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.5, 4); // Ajustar la posición de la cámara

    // Configuración del renderizador
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000); // Fondo negro
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Controles de órbita
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Ajustar el tamaño de la ventana
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadBody(): void {
    const loader = new GLTFLoader();

    loader.load(this.bodyPath, (gltf) => {
      this.bodyModel = gltf.scene as THREE.Group;
      this.bodyModel.position.set(0, 0, 0);
      this.bodyModel.scale.set(1, 1, 1);

      this.scene.add(this.bodyModel);

      // Cambiar el color del cuerpo a un color inicial (por ejemplo, blanco)
      this.changeBodyColor(0xff69b4);

      // Centrar el modelo
      this.centerModel(this.bodyModel);
    }, undefined, (error) => {
      console.error('Error loading body model:', error);
    });
  }

  private changeBodyColor(color: number): void {
    if (this.bodyModel) {
      this.bodyModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial;
          material.color.set(color);
        }
      });
    }
  }

  private loadShirt(): void {
    const loader = new GLTFLoader();

    loader.load(this.shirtPath, (gltf) => {
      this.shirtModel = gltf.scene as THREE.Group;
      this.shirtModel.position.set(0, 0, 0);
      this.shirtModel.scale.set(0, 0, 0);

      if (this.bodyModel) {
        this.bodyModel.add(this.shirtModel);

        // Ajustar la posición de la camisa sobre el cuerpo
        this.shirtModel.position.set(-0.1, 2.1, -1.2); // Ajustar la posición lados, arriba, atras
        this.shirtModel.scale.set(0.8, 0.73, 1.2); // Ajustar la escala si es necesario, ancho centro largo, grosor manga
        // Ajustar la rotación de la camisa
        // Inclinar la camisa ligeramente hacia abajo en el eje X
        this.shirtModel.rotation.set(Math.PI / 40, 0, 0); // Ajusta el valor del ángulo en el eje X

        // Configurar la visibilidad y el material de la camisa
        this.shirtModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.Material).side = THREE.FrontSide;
          }
        });
      }
    }, undefined, (error) => {
      console.error('Error loading shirt model:', error);
    });
  }

  private centerModel(model: THREE.Group): void {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center); // Centrar el modelo en la escena
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  
}