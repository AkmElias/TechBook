import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loginData = { username: '', password: '' };
  message = '';
  data: any;
  username;
  usernamepic;

  constructor(public userService: UserService, private router: Router) { }


  ngOnInit() {
    // Run username check.
    this.usernameCheck();
  }


  login() {
    this.userService.loginUser(this.loginData)
      .subscribe(resp => {
        this.data = resp;
        // Save response jwtToken.
        console.log(this.data);
        this.userService.saveJwtToken(this.data.token);
        this.router.navigate(['index']);

        // Check if user is logged in.
        if (this.userService.isLoggedIn) {

          // Get user details.
          const curUser = this.userService.getUserPayLoad();

          // Set logged in user as current user.
          this.userService.setCurrentUser(curUser);

          // Checks current username.
          this.usernameCheck();
        }
      }, err => {

        // Error message.
        this.message = err.error.msg;

        // if an error route to main login page.
        this.router.navigate(['login']);

      });
  }


  logout() {
    this.username = ''; // Set username to nothing.
    this.userService.logout(); // Logout user using userService.
    this.router.navigate(['index']); // Route user to index.
  }


  usernameCheck() {
    if (this.userService.isLoggedIn()) {
      this.userService.getUserData()
        .subscribe(res => {
          this.username = res; // Response from the server.
          this.getProfileData(res); // Get profile data from logged in user.
        }, err => {
          console.log(err);
          if (err.status === 401) {
            this.router.navigate(['login']);
          }
        });
    }
  }


  getProfileData(id: any) {
    this.userService.getProfile(id)
      .subscribe(data => {
        this.usernamepic = data[0].image; // Set user iamge as the image of the returned userdata.
      });
  }
}
