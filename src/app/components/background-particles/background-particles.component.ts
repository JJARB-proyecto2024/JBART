import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-background-particles',
  templateUrl: './background-particles.component.html',
  styleUrls: ['./background-particles.component.scss']
})
export class BackgroundParticlesComponent implements AfterViewInit, OnDestroy {
  private animationFrameId: number | undefined;
  private particles: { x: number, y: number, vx: number, vy: number, radius: number, opacity: number }[] = [];
  private mouseX: number | null = null;
  private mouseY: number | null = null;
  private attractionDistance: number = 150; // Distancia de atracción del cursor
  private attractionForce: number = 0.01; // Fuerza de atracción

  ngAfterViewInit(): void {
    this.createParticles();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  @HostListener('mouseout')
  onMouseOut(): void {
    this.mouseX = null;
    this.mouseY = null;
  }

   // Función principal para crear y animar las partículas
  createParticles(): void {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Failed to get canvas context');
      return;
    }

    const numParticles = 100; // Cantidad de partículas 
    const moveSpeed = 1.7; // Velocidad de movimiento de las partículas
    const particleRadiusMin = 4; // Tamaño mínimo del radio de las partículas
    const particleRadiusMax = 8; // Tamaño máximo del radio de las partículas
    const particleOpacity = 0.3; // Nivel de opacidad de las partículas
    const linkDistance = 250; // Distancia máxima para conectar partículas
    const linkOpacity = 0.3; // Opacidad de las líneas de conexión
    const linkWidth = 2.0; // Ancho de las líneas de conexión

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Crea partículas con propiedades aleatorias dentro de los rangos definidos
    for (let i = 0; i < numParticles; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() * 2 - 1) * moveSpeed,
        vy: (Math.random() * 2 - 1) * moveSpeed,
        opacity: particleOpacity,
        radius: Math.random() * (particleRadiusMax - particleRadiusMin) + particleRadiusMin 
      });
    }

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Actualiza la posición de cada partícula y dibuja en el lienzo
      this.particles.forEach(particle => {

         // Aplica la atracción del cursor
         if (this.mouseX !== null && this.mouseY !== null) {
          const dx = this.mouseX - particle.x;
          const dy = this.mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.attractionDistance) {
            const angle = Math.atan2(dy, dx);
            particle.vx += Math.cos(angle) * this.attractionForce;
            particle.vy += Math.sin(angle) * this.attractionForce;
          }
        }


        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebotar partículas al chocar con los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
        context.fillStyle = `rgba(166, 206, 56, 0.70)`;
        context.fill();
      });

      // Conectar partículas dentro de la distancia especificada
      this.connectParticles(context, canvas, linkDistance, linkOpacity, linkWidth);

      this.animationFrameId = requestAnimationFrame(animate);
    }

    animate();
  }

  connectParticles(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, linkDistance: number, linkOpacity: number, linkWidth: number): void {
    //const maxDistance = 400; // Ajusta la distancia máxima para conectar partículas

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Dibujar líneas entre partículas si están dentro de la distancia de enlace
        if (distance < linkDistance) {
          context.beginPath();
          context.moveTo(this.particles[i].x, this.particles[i].y);
          context.lineTo(this.particles[j].x, this.particles[j].y);
          context.strokeStyle = `rgba(255, 255, 255, 0.20)`;
          context.lineWidth = linkWidth;
          context.stroke();
          context.closePath();
        }
      }
    }
  }
}