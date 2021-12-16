import {
  Component,
  OnInit,
  NgZone,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChatService } from '../ChatService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  txtMessage = '';
  uniqueID: string='';
  clients: any[]=[];
  currentChatClient: any = {
    connectionId: '',
    userId: '',
    userType: 0,
    supportConenctionId: '',
    isWaiting: false,
    isHandled: false,
    isInProcess: false,
    city: '',
    name: '',
    phone: '',
    languageId: 1,
  };
  @ViewChild('scrollbody', { static: false })
  private myScrollContainer!: ElementRef;
  hasSupportConnection = false;

  messageList: any[] = [];

  constructor(private chatService: ChatService, private ngZone: NgZone) {
  
  }

  ngOnInit() {
    if (this.hasSupportConnection === false) {
      this.hasSupportConnection = true;
      this.chatService.createConnection();
      this.chatService.registerOnServerEvents();
      this.chatService.startConnection();
      this.subscribeToEvents();
      this.openHubConnection();
      this.getChatClients();
    }
  }

  subscribeToEvents() {
    this.chatService.messageReceived.subscribe((message: any) => {
      this.ngZone.run(() => {
        if (message.clientId !== this.uniqueID) {
          if (
            this.messageList.filter(
              (m) => m.date === message.date && m.message === message.message
            ).length === 0
          ) {
            message.type = 'Receive';
            this.messageList.push(message);
            this.scrollMessage();
          }
        }
      });
    });
    this.chatService.connectedUser.subscribe((data: Array<any>) => {
      this.ngZone.run(() => {
        if (data !== null) {
          this.clients = data;
        }
      });
    });
  }

  openHubConnection() {
    this.chatService.getHubConnection().on('ConnectionId', (id: string) => {
      this.uniqueID = id;
    });
  }

  getChatClients() {
    this.chatService
      .getHubConnection()
      .on('ConnectedClients', (data: Array<any>) => {
        this.clients = data;
        const currentUser = this.clients.filter(
          (x) => x.userId === this.currentChatClient.userId
        )[0];
        if (currentUser !== undefined && currentUser !== null) {
          this.currentChatClient = currentUser;
        }
        // console.log(data);
      });
    this.scrollMessage();
  }

  viewChatMessages(client: any) {
    // console.log(client);
    // console.log(this.uniqueID);

    const currentScope = this;
    this.currentChatClient = client;
    this.chatService
      .getHubConnection()
      .invoke(
        'GetClientConversation',
        this.uniqueID,
        this.currentChatClient.connectionId
      )
      .then(function (msgs: any[]) {
        currentScope.messageList = msgs;
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, 100);
  }

  startChatWithCLient() {
    this.chatService.linkSupportToClient(
      this.uniqueID,
      this.currentChatClient.connectionId
    );

    const c = this.clients.filter(
      (m) => m.connectionId === this.currentChatClient.connectionId
    );
    if (c !== null && c.length > 0) {
      c[0].isInProcess = true;
    }

    this.currentChatClient.isInProcess = true;
  }

  closeChat() {
    this.chatService.closeChat(this.currentChatClient.connectionId);

    const c = this.clients.filter(
      (m) => m.connectionId === this.currentChatClient.connectionId
    );
    if (c !== null && c.length > 0) {
      c[0].isHandled = true;
    }
    this.currentChatClient.isHandled = true;
  }

  sendMessage() {
    if (this.txtMessage) {
      const msg: any = {
        clientId: this.currentChatClient.connectionId,
        date: new Date(),
        processId: 0,
        type: 'Receive',
        message: this.txtMessage,
        isFinished: false,
      };

      this.chatService.sendMessage(msg);
      msg.type = 'Send';
      this.messageList.push(msg);
      this.txtMessage = '';
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }, 100);
    }
  }

  scrollMessage() {
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, 100);
  }
}
