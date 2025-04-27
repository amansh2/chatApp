import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  @ViewChild('popup', {static: false}) popup: any;

  public roomId: string;
  public messageText: string;
  public messageArray: { user: string, message: string }[] = [];
  private storageArray = [];

  public showScreen = true;
  public phone: string;
  public currentUser;
  public selectedUser;

  public userList ;


  constructor(
    private modalService: NgbModal,
    private chatService: ChatService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userService.getAllUsers().subscribe((data: any) => {
      this.userList = data.filter((user) => user.phone != this.currentUser.phone);
      this.selectUserHandler(this.userList[0].phone);
    })
    this.chatService.getMessage()
      .subscribe((data) => {
        if(data.roomId == this.roomId){
          this.messageArray.push({user: data.user, message: data.message});
        }
      });
  }

  ngAfterViewInit(): void {
    // this.openPopup(this.popup);
  }


  selectUserHandler(phone: number): void {

    this.selectedUser = this.userList.find(user => user.phone === phone);
    if(phone > this.currentUser.phone){
      this.roomId = phone + '-' + this.currentUser.phone
    }else {
      this.roomId = this.currentUser.phone + '-' + phone
    }
    this.chatService.getChatsForRoom(this.roomId).subscribe((data: any) => {
      this.join(this.currentUser.phone, this.roomId);
      this.messageArray = data.chatsArray 
    })
  }

  join(phone: Number, roomId: string): void {
    this.chatService.joinRoom({user: phone, room: roomId});
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.phone,
      room: this.roomId,
      message: this.messageText
    });
    this.messageText= '';
  }

}
