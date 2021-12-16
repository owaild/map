import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export interface ChatClient {
  connectionId: string;
  userId: string;
  userType: number;
  supportConenctionId: string;
  isWaiting: boolean;
  isInProcess: boolean;
  isHandled: boolean;
  name: string;
  phone: string;
  city: string;
  languageId:number;
}

export interface ChatMessage {
  clientId: string;
  date: Date;
  processId: number;
  type: string;
  message: string;
  isFinished: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private connectionIsEstablished = false;
  private hubConnection!: HubConnection;
  messageReceived = new EventEmitter<ChatMessage>();
  connectedUser = new EventEmitter<Array<ChatClient>>();
  connectionEstablished = new EventEmitter<boolean>();

  constructor(
    
  ) {
  }

  sendMessage(message: ChatMessage) {
    this.hubConnection.invoke('PrivateMessage', message);
  }

  closeChat(clientid: string) {
    this.hubConnection.invoke('CloseChat', clientid);
  }

  linkSupportToClient(supportConnectionid: string, clientConnectionid: string) {
    this.hubConnection.invoke(
      'LinkSupportToClient',
      supportConnectionid,
      clientConnectionid
    );
  }

  getAvailableClients() {
    this.hubConnection.invoke('GetClients', 1);
  }

  getHubConnection() {
    return this.hubConnection;
  }

  createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('this.configuration$.ChatHubConenction')
      .build();
  }

  registerOnServerEvents() {
    this.hubConnection.on('Receive', (data :any) => {
      this.messageReceived.emit(data);
    });
    this.hubConnection.on('ConnectedClients', (data: Array<ChatClient>) => {
      this.connectedUser.emit(data);
    });
  }

  startConnection() {
    this.registerOnServerEvents();
    const userId = localStorage.getItem('userId');
    const languageId = 'ar'
    // if (userId === null) {
    this.hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        this.hubConnection
          .invoke('RegisterUser', 1, userId, languageId)
          .then(function (ChatClient :any) {
            // sessionStorage.setItem('userId', connectionId);
            localStorage.setItem('userId', ChatClient.userId);
          })
          .catch((err:any) => console.error(err.toString()));
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch((err:any) => {
        console.log('Error while establishing connection, retrying...');
      });
  }
}
