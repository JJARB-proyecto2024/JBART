import { Component, ElementRef, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, Input, SimpleChanges, OnChanges, inject } from '@angular/core';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IProduct } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-tridimentional-design',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tridimentional-design.component.html',
  styleUrl: './tridimentional-design.component.scss'
})
export class TridimentionalDesignComponent {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @Input() product: IProduct = {};
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private productModel!: THREE.Group;
  public productService: ProductService = inject(ProductService);

  ngOnInit(): void {
    this.initScene();
    this.animate();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.loadProduct();
    }
  }

  private initScene(): void {
    if (!this.rendererContainer) {
      console.error('Renderer container is not available.');
      return;
    }

    this.scene = new THREE.Scene();

    // Configuración de la cámara
    this.camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight);

    this.camera.position.set(0, 1.2, 5); // Ajustar la posición de la cámara

    // Configuración del renderizador
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);
    this.renderer.setClearColor(0xFFFFFF); // Fondo negro
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

  private loadProduct(): void {
    const loader = new GLTFLoader();
    if (this.product.model) {
      loader.load(this.product.model, (gltf) => {
        this.productModel = gltf.scene as THREE.Group;
        // Ajustar la escala si es necesario, ancho centro largo, grosor manga
        this.productModel.scale.set(0.5, 0.5, 0.5);

        // Ajustar la posición de la camisa sobre el cuerpo
        this.productModel.position.set(0, 0, 0.1); // Ajustar la posición lados, arriba, atras
        // Ajustar la rotación de la camisa
        // Inclinar la camisa ligeramente hacia abajo en el eje X
        this.productModel.rotation.set(Math.PI / 40, 0, 0); // Ajusta el valor del ángulo en el eje X
        this.scene.add(this.productModel);
        this.centerModel(this.productModel);
        // Configurar la visibilidad y el material de la camisa
        this.productModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.Material).side = THREE.FrontSide;
          }
        });

        // Zoom out the product
        const boundingBox = new THREE.Box3().setFromObject(this.productModel);
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const distance = maxDimension * 1;
        this.camera.position.z = distance;
      }, undefined, (error) => {
        console.error('Error loading shirt model:', error);
      });
    }
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
    if (this.camera && this.renderer && this.rendererContainer) {
      this.camera.aspect = this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);
    }
  }

  public deleteScene(): void {
    // Traverse the scene and dispose of materials, geometries, and textures
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        } else if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        }
      }
    });

    // Remove all objects from the scene
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    // Dispose of the renderer
    this.renderer.dispose();

    // Remove the renderer's DOM element
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
