import React, { Component } from 'react';
import TodoItems from './components/TodoItems/TodoItems'
import AddItem from './components/AddItem/AddItem'
const axios = require('axios');
class App extends Component {
  state = {
    users: [],
    firstname: '',
    lastname: '',
  }

  componentDidMount(){
    this.getUsers();
  }
/************************************************** Select All User Function************************************************* */
  getUsers =() =>{
    fetch('http://localhost:3300/getUsers')
    .then(response => response.json())
    .then(response =>this.setState({ users : response.result}) )
    .catch(err=>console.error(err))
  }
/************************************************** Delete User Function******************************************************** */
  deleteUser = (index) => {
    console.log(index);   
    var self = this;
    fetch(`http://localhost:3300/deleteUser/${index}`)
    .then(function(response){
      self.state.users.splice(response[index],1)
      self.setState({"users" :self.state.users}) 
    } )
    .then()
    .catch(err=>console.error(err))
  }
/**************************************************Insert User Function******************************************************** */

  addUser = (event) => {
    event.preventDefault();
    let {users} = this.state;
    var self = this;
    let user = {
      firstname : this.state.firstname,
      lastname  : this.state.lastname
    }
    if (!event.target.firstname.value || !event.target.lastname.value ) {
          return false
   } else {
    axios.post( 'http://localhost:3300/adduser',user)
      .then(function(response){

        users.push(response.data.user)
        self.setState({"users" :users}) 
      })
      .then()
      .catch(err=>console.error(err))
  }
   this.setState({  firstname: '', lastname: '' })
}
/********************************************************Update User Functions*************************************************** */
  updateUser = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  editUser = (index, valueFirst, valueLast) => {
    let user = {
      firstname : valueFirst,
      lastname  : valueLast
    }
    axios.post( `http://localhost:3300/updateUser/${index}`,user)
    .then(response => console.log(response)
    )
    .then(this.getUsers)
    .catch(err=>console.error(err))
  }



  render() {
    const { users } = this.state;  
    const usersList = users.map((user, index) => {
      return <TodoItems  users={users} details={user} key={index} index={index} deleteUser={this.deleteUser} updateUser={this.updateUser} editUser={this.editUser} />
    }) 
    return (
      <div className="App container">
        <h1 className='text-center'> Todolist App</h1>
        <AddItem addUser={this.addUser} updateUser={this.updateUser} firstname={this.state.firstname} lastname={this.state.lastname} />
        <ul>{usersList}</ul>
      </div>
    );
  }

}

export default App;
