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
  
    // Verificar y eliminar el modelo anterior si existe
    if (this.productModel) {
      this.scene.remove(this.productModel);
  
      // Recorrer y liberar la geometría y materiales del modelo anterior
      this.productModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
  
      // Forzar la eliminación de la referencia del modelo
      this.productModel = null!;
  
      // Limpiar las listas de renderizado
      this.renderer.renderLists.dispose();
    }
  
    // Solo cargar el nuevo modelo después de asegurarnos de que el anterior ha sido removido
    setTimeout(() => {
      if (this.product.model) {
        loader.load(this.product.model, (gltf) => {
          this.productModel = gltf.scene as THREE.Group;
  
          // Ajustar la escala y posición si es necesario
          this.productModel.scale.set(0.5, 0.5, 0.5);
          this.productModel.position.set(0, 0, 0.1);
          this.productModel.rotation.set(Math.PI / 40, 0, 0);
  
          this.scene.add(this.productModel);
          this.centerModel(this.productModel);
          this.changeProductModelColor(0x2889e9);
          this.productModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              (child.material as THREE.Material).side = THREE.FrontSide;
            }
          });
  
          // Ajustar la cámara para el nuevo modelo
          const boundingBox = new THREE.Box3().setFromObject(this.productModel);
          const size = boundingBox.getSize(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z);
          const distance = maxDimension * 1;
          this.camera.position.z = distance;
        }, undefined, (error) => {
          console.error('Error loading product model:', error);
        });
      }
    }, 100); // Esperar un pequeño intervalo para asegurarse de que el modelo anterior se elimine
  }
  
  

  private centerModel(model: THREE.Group): void {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center); // Centrar el modelo en la escena
  }

  private changeProductModelColor(color: number): void {
    if (this.productModel) {
      this.productModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const meshMaterial = child.material as THREE.MeshBasicMaterial;
          meshMaterial.color.set(color);
        }
      });
    }
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
}
