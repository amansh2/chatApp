import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SigninComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private router: Router){

  }
  ngOnInit(): void {
    this.loadPhoneEmailScript().then(() => {
      (window as any).phoneEmailListener = (userObj: any) => {
        const userJsonUrl = userObj.user_json_url;
        console.log('✅ Phone verification successful');
        console.log('📎 user_json_url:', userJsonUrl);

        // Handle it here or pass to service
        this.verifyUser(userJsonUrl);
      };
    });
  }

  ngOnDestroy(): void {
    delete (window as any).phoneEmailListener;
  }

  verifyUser(userJsonUrl: string): void {
    let obj={
      userJsonUrl: userJsonUrl
    }
    this.userService.authenticateUser(obj).subscribe((data:any) => {
      localStorage.setItem('currentUser', JSON.stringify(data))
      this.router.navigate(['/']);
    },(error)=>{
      console.log(error);
    })
  }

  private loadPhoneEmailScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://www.phone.email/sign_in_button_v1.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.phone.email/sign_in_button_v1.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  }
}
