import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    private readonly URL = 'http://localhost:3000';

    constructor() {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        this.socket = io(this.URL, {
            withCredentials: true,
            autoConnect: true,
            query: {
                userId: user?.id
            }
        });
    }

    // Listen for an event
    on(eventName: string): Observable<any> {
        return new Observable(observer => {
            this.socket.on(eventName, (data) => {
                observer.next(data);
            });

            // Cleanup listener when unsubscribed
            return () => {
                this.socket.off(eventName);
            };
        });
    }

    // Emit an event (if needed later)
    emit(eventName: string, data: any): void {
        this.socket.emit(eventName, data);
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
