import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket!: Socket;
    private readonly URL = 'http://localhost:3000';

    constructor() {
        // Socket connection will be established after login
    }

    connect(userId: string): void {
        if (this.socket && this.socket.connected) {
            return;
        }

        this.socket = io(this.URL, {
            withCredentials: true,
            autoConnect: true,
            query: {
                userId: userId
            }
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    // Listen for an event
    on(eventName: string): Observable<any> {
        return new Observable(observer => {
            if (!this.socket) {
                console.warn('Socket not initialized. Cannot listen for event:', eventName);
                return;
            }
            this.socket.on(eventName, (data) => {
                observer.next(data);
            });

            // Cleanup listener when unsubscribed
            return () => {
                if (this.socket) {
                    this.socket.off(eventName);
                }
            };
        });
    }

    // Emit an event (if needed later)
    emit(eventName: string, data: any): void {
        if (!this.socket) {
            console.warn('Socket not initialized. Cannot emit event:', eventName);
            return;
        }
        this.socket.emit(eventName, data);
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
