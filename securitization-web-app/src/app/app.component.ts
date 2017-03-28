import {Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'app works!';
  userData:any;
  userDataQuery;
  response = null;
  subscriber = [];
  counter = 0;
  getUsersQuery = gql`
    query {
    getUsers{
      name
      password
      }
    }
  `;
  updatePasswordMutation = gql`
    mutation updateUserPassword($newPassword: String){
      updateUserPassword(userName: "test1",password: $newPassword)
      {
        name password
      }
    }
  `;
  addUserMutation = gql`
    mutation addUser($userName: String, $password: String){
      addUser(userName: $userName,password: $password){
    name password}}
  `;
  passwordUpdatedSubscription = gql`
    subscription root{passwordUpdated{name password}}
  `;

  constructor(private apollo:Apollo, private ref:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.userDataQuery = this.apollo.watchQuery({
      query: this.getUsersQuery
    });
    this.subscriber.push(this.userDataQuery.subscribe(({data}:any) => {
      console.log('userDataQuery', data);
      this.userData = data.getUsers;
      //this.userData = data.getUsers.map(user=> {return {name: user.name, password:user.password}});
      this.title = "Data Loaded ";
      this.ref.detectChanges();

    }));

    //Apollo Subscription
    this.apollo.subscribe({
      query: this.passwordUpdatedSubscription
    }).subscribe(({passwordUpdated}:any) => {
      return this.userDataQuery.updateQuery((previousResult) => {
        console.log(previousResult);
        this.title = "Subscription Triggered ";
        let userIndex = previousResult.getUsers.findIndex(user => user.name === passwordUpdated.name);
        let updatedUsers;
        if (userIndex === -1) {
          updatedUsers = [].concat(previousResult.getUsers).concat([passwordUpdated]);
          return Object.assign({}, previousResult, {
            getUsers: updatedUsers,
          });
        }

      });

    });

    // subscription.subscribe(
    //   {
    //     next(data) {
    //       this.userDataQuery.updateQuery((previousResult) => {
    //         console.log(previousResult);
    //         console.log(data);
    //         previousResult.filter(user => {user.name === data.passwordUpdated.name}).forEach(user => user.password = data.passwordUpdated.password);
    //       });
    //     },
    //     error(err) {
    //       console.error('err', err);
    //     },
    //   }
    // );
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log(changes);
  }

  ngOnDestroy() {
    this.subscriber.forEach((sub)=> {
      console.log(sub);
    })
  }

  refresh() {
    //this.apollo.getClient().resetStore();
    this.apollo.query({
      query: this.getUsersQuery
    }).toPromise().then(({data}:any) => {
      this.counter++;
      console.log(data);
      this.title = "Soft refreshed";
    });
  }

  refetch() {
    this.userDataQuery.refetch();
  }

  updatePassword(password:String) {
    console.log(password);
    this.apollo.mutate({
      mutation: this.updatePasswordMutation,
      variables: {
        newPassword: password
      },
      // optimisticResponse: {
      //   __typename: 'Mutation',
      //   updateUserPassword: {
      //     name: 'test1',
      //     password: '12350800',
      //   },
      // },

    }).subscribe(({data}) => {
      console.log('updatedPassword');
      this.response = JSON.stringify(data);
    });
  }

  addUser(name:String, password:String) {
    this.apollo.mutate({
      mutation: this.addUserMutation,
      variables: {
        password: password,
        userName: name
      },
      // optimisticResponse: {
      //   __typename: 'Mutation',
      //   updateUserPassword: {
      //     name: 'test1',
      //     password: '12350800',
      //   },
      // },

    }).subscribe(({data}) => {
      console.log('addUser');
      this.response = JSON.stringify(data);
    });
  }
}
