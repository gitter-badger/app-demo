import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  userId: string;
  constructor(public afAuth: AngularFireAuth,
    private db: AngularFireDatabase) {
    this.user = this.afAuth.authState;
    this.afAuth.authState
      .do(user => {
        if (user) {
          this.userId = user.uid;
          this.updateOnConnect()
          this.updateOnDisconnect() // <-- new line added

        }
      }).subscribe();
  }

  private updateStatus(status: string) {

    if (!this.userId) return
    this.db.object(`users/` + this.userId).update({ status: status })
  }

  private updateOnConnect() {
    return this.db.object('.info/connected')
      .do(connected => {
        let status = connected.$value ? 'online' : 'offline'
        this.updateStatus(status)
      })
      .subscribe()
  }

  private updateOnDisconnect() {
    firebase.database().ref().child('users/' + this.userId)
      .onDisconnect()
      .update({ status: 'offline' })
  }
  signUpWithEmailAndPass(email: string, pass: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass);
  }

  signInWithEmailAndPass(email: string, pass: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }

  signOut(): void {
    this.updateStatus('offline');
    this.afAuth.auth.signOut();
  }

  sendPasswordResetEmail(email: string) {
    return firebase.auth().sendPasswordResetEmail(email)
  }

}
