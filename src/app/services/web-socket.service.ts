import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Suponiendo que tienes este servicio para obtener el usuario

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;

  public createWebSocket(user: any): void {
    this.socket = new WebSocket(`ws://localhost:8080/ws/notifications?userId=${user?.id}`);
    console.log('WebSocketService created');
  }

  public connect(): Observable<any> {
    console.log('Connecting...');
    return new Observable(observer => {
      this.socket.onmessage = (event) => {
        observer.next(event.data);
        console.log("Event Data:", event.data);
      }
      this.socket.onerror = (event) => {
        observer.error(event);
        console.log("Event Error:", event);
      }
      this.socket.onclose = () => {
        observer.complete();

      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      console.log('Disconnecting...');
    }
    console.log('Disconnecting outside if...');
  }
}