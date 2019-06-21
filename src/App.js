import React, { Component } from 'react';
import TodoItems from './components/TodoItems/TodoItems'
import AddItem from './components/AddItem/AddItem'
class App extends Component {
  state = {
    users: [
      { id: 1, firstname: "Hamza", lastname: "ouni" }
    ],
    firstname: '',
    lastname: '',
  }

  deleteUser = (index) => {
    let users = this.state.users;
    users.splice(index, 1)
    this.setState({ users })

    // let items = this.state.items.filter(item =>{
    //   return item.id !==id
    // });
    // this.setState({items})
  }


  addUser = (event) => {
    event.preventDefault();
    let users = this.state.users;
    let firstname = this.state.firstname;
    let lastname = this.state.lastname;
    if (event.target.firstname.value === '' && event.target.lastname.value === '' || event.target.lastname.value === '' || event.target.firstname.value === '') {
      return false
    } else {
      users.push({ firstname: firstname, lastname: lastname });
      this.setState({ users: users, firstname: '', lastname: '' })
    }
  }

  updateUser = (event) => {

    this.setState({
      [event.target.name]: event.target.value
    })

  }

  editUser = (index, valueFirst, valueLast) => {
    let users = this.state.users;
    let user = users[index];
    user['firstname'] = valueFirst;
    user['lastname'] = valueLast;
    this.setState(users)
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
