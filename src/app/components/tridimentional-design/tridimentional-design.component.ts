import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, Input, SimpleChanges, inject } from '@angular/core';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IBuyerUser, ICart, IDesign, IProduct } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { DesignService } from '../../services/design.service';
import { CartService } from '../../services/cart.service';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare const cloudinary: any;
@Component({
  selector: 'app-tridimentional-design',
  standalone: true,
  imports: [CommonModule, ColorPickerModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tridimentional-design.component.html',
  styleUrl: './tridimentional-design.component.scss'
})


export class TridimentionalDesignComponent {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @Input() product: IProduct = {};
  @Input() design: IDesign = {
    color: "#ffffff"
  };
  @Input() cart: ICart = {};
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private productModel!: THREE.Group;
  public productService: ProductService = inject(ProductService);
  public authService: AuthService = inject(AuthService);
  public designService: DesignService = inject(DesignService);
  public cartService: CartService = inject(CartService);
  public router: Router = inject(Router);

  ngOnInit(): void {
    this.initScene();
    this.animate();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.design.product = this.product;
      if (!this.design.selectedSize && this.product.size) {
        const sizes = this.product.size.split(', ');
        this.design.selectedSize = sizes[0];
        console.log('Initial size set to:', this.design.selectedSize);
      }

      this.loadProduct();
    }
  }
  handleColorPickerChange(color: string): void {
    this.design.color = color;
    this.changeProductModelColor(color);
  }

  handleCreateDesign(): void {
    this.exportModelToGLB().then((glbBlob) => {
      this.uploadGLBToCloudinary(glbBlob).then((cloudinaryUrl) => {
        this.design.modifiedModel = cloudinaryUrl;
        this.saveDesignAndCart();
      }).catch((error) => {
        console.error('Error uploading GLB to Cloudinary:', error);
      });
    }).catch((error) => {
      console.error('Error exporting model to GLB:', error);
    });
  }

  private exportModelToGLB(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.productModel) {
        return reject('No model loaded to export.');
      }
      const exporter = new GLTFExporter();
      const options = {
        binary: true
      };

      exporter.parse(
        this.productModel,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            resolve(blob);
          } else {
            reject('Failed to export model to GLB.');
          }
        },
        (error) => {
          reject('Error occurred during GLB export: ' + error);
        },
        options 
      );
    });
  }

  private uploadGLBToCloudinary(glbBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', glbBlob, 'model.glb');
      formData.append('upload_preset', 'ml_default');

      fetch(`https://api.cloudinary.com/v1_1/drlznypvr/auto/upload`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(result => {
          if (result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject('Failed to upload GLB to Cloudinary.');
          }
        })
        .catch(reject);
    });
  }

  private saveDesignAndCart(): void {
    const userBuyer = this.authService.getUser() as IBuyerUser;
    const userBrand = this.product.userBrand;

    this.design.userBuyer = {
      id: userBuyer.id,
      name: userBuyer.name,
      lastname: userBuyer.lastname,
      role: userBuyer.role
    };

    if (this.design.product) {
      this.design.product.userBrand = {
        id: userBrand?.id,
        brandName: userBrand?.brandName,
        role: userBrand?.role,
      };
    }

    this.designService.save(this.design).subscribe({
      next: (designResponse: any) => {
        console.log('Design created successfully:', designResponse);

        designResponse.userBuyer = this.design.userBuyer;
        designResponse.product.userBrand = this.design.product?.userBrand;

        this.cart = {
          ...this.cart,
          design: designResponse,
          userBuyer: this.design.userBuyer
        };

        this.cartService.save(this.cart).subscribe({
          next: (cartResponse: any) => {
            Swal.fire({
              title: 'Diseño agregado al carrito',
              text: 'Tu diseño ha sido creado y añadido al carrito.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (cartError: any) => {
            console.error('Error creating cart item:', cartError);
          }
        });
      },
      error: (designError: any) => {
        console.error('Error creating design:', designError);
      }
    });
  }


  handleSizeChange(size: string): void {
    this.design.selectedSize = size;
    console.log('Selected size changed:', this.design.selectedSize);
  }

  private initScene(): void {
    if (!this.rendererContainer) {
      console.error('Renderer container is not available.');
      return;
    }
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight);
    this.camera.position.set(0, 1.2, 5); 
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);
    this.renderer.setClearColor(0xFFFFFF); 
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
    this.scene.add(ambientLight);
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemisphereLight.position.set(0, 1, 0);
    this.scene.add(hemisphereLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadProduct(): void {
    const loader = new GLTFLoader();
    if (this.productModel) {
      this.scene.remove(this.productModel);
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
      this.productModel = null!;
      this.renderer.renderLists.dispose();
    }
    setTimeout(() => {
      if (this.product.model) {
        loader.load(this.product.model, (gltf) => {
          this.productModel = gltf.scene as THREE.Group;
          this.productModel.scale.set(0.5, 0.5, 0.5);
          this.productModel.position.set(0, 0, 0.1);
          this.productModel.rotation.set(Math.PI / 40, 0, 0);
          this.scene.add(this.productModel);
          this.centerModel(this.productModel);
          this.changeProductModelColor(this.design.color ?? '#ffffff');
          this.productModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              (child.material as THREE.Material).side = THREE.FrontSide;
            }
          });
          const boundingBox = new THREE.Box3().setFromObject(this.productModel);
          const size = boundingBox.getSize(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z);
          const distance = maxDimension * 1;
          this.camera.position.z = distance;
          console.log('Model loaded:', this.productModel);
        }, undefined, (error) => {
          console.error('Error loading product model:', error);
        });
      }
    }, 100); 
  }

  getDesign(): IDesign {
    return this.design;
  }

  private centerModel(model: THREE.Group): void {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center); 
  }

  private changeProductModelColor(color: string): void {
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

  openCloudinaryWidget() {
    cloudinary.openUploadWidget({
      cloudName: 'drlznypvr',
      uploadPreset: 'ml_default'
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        console.log('File uploaded successfully to Cloudinary');
        this.design.picture = result.info.secure_url;
        this.attachImageToProductModel(result.info.secure_url);
      }
    });
  }

  private attachImageToProductModel(imageUrl: string): void {
    if (this.productModel) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(imageUrl);
      this.productModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const meshMaterial = child.material as THREE.MeshBasicMaterial;
          meshMaterial.map = texture;
          meshMaterial.needsUpdate = true;
        }
      });
    }
  }

  handleRemovePicture() {
    this.design.picture = '';
    this.removeImageFromProductModel();
  }

  private removeImageFromProductModel(): void {
    if (this.productModel) {
      this.productModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const meshMaterial = child.material as THREE.MeshBasicMaterial;
          meshMaterial.map = null;
          meshMaterial.needsUpdate = true;
        }
      });
    }
  }

  viewBrandProducts(id: number) {
    this.router.navigateByUrl('app/products-recommended-brands/' + id);
  }

}
