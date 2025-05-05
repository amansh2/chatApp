import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private socket:any;
  private url ='https://chatapp-v9pa.onrender.com';

  constructor(private http: HttpClient) { 
    this.socket = io(this.url, {transports:['websocket', 'polling', 'flashsocket']});
  }

  joinRoom(data){
    this.socket.emit('join', data)
  }

  sendMessage(data){
    this.socket.emit('message', data)
  }

  getMessage(): Observable<any>{
    return new Observable(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data)
      });

      return ()=>{
        this.socket.disconnect();
      }
    })
  }

  getChatsForRoom(roomId: any){
    return this.http.post('https://chatapp-v9pa.onrender.com/api/getChatsForRoom',{roomId: roomId});
  }

  getStorage(){
    const storage: string = localStorage.getItem('chats')
    return storage? JSON.parse(storage) : []
  }

  setStorage(data){
    localStorage.setItem('chats', JSON.stringify(data))
  }

  

}
