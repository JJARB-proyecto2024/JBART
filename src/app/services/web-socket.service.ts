import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Suponiendo que tienes este servicio para obtener el usuario

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;

  constructor() {
    this.socket = new WebSocket(`http://localhost:8080/ws/notifications`);
  }

  public connect(): Observable<any> {
    return new Observable(observer => {
      this.socket.onmessage = (event) => observer.next(event.data);
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  public sendMessage(message: string): void {
    this.socket.send(message);
  }
}
