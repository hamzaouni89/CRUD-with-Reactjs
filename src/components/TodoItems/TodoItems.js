import React, { Component, Fragment } from 'react'
import './TodoItems.css'
class TodoItems extends Component {

    state={
        isEdit : false
    }
    renderUsers = () => {
        return(
            <li>
                <span className="firstname"> {this.props.details.firstname} </span>
                <span className="lastname"> {this.props.details.lastname} </span>
                <button  type ='submit' className="action icon" onClick={()=>{this.toggleState()}}> Edit User</button>
                <button  type ='submit' className="action icon" onClick={()=>{this.props.deleteUser(this.props.index)}}> Delete User </button>
            </li>     
        )   
    }

    updateUserItem  =(event) => {
        event.preventDefault();
        this.props.editUser(this.props.index,this.inputfirstname.value , this.inputlastname.value )
        this.toggleState();
    }
    toggleState =() => {
        let {isEdit} = this.state;
        this.setState({
            isEdit: !isEdit
        })
    }
    renderUpdateForm = () =>{
        return (
            <form onSubmit={this.updateUserItem}>
                <input type='text' ref={(val) =>{this.inputfirstname= val}} defaultValue ={this.props.details.firstname} />
                <input type='text' ref={(val) =>{this.inputlastname= val}} defaultValue= {this.props.details.lastname}/>
                <button>Update User</button>
            </form>
        )

    }
    render() {
        let {isEdit} = this.state;
        return (   
            <Fragment>    
                {isEdit ? this.renderUpdateForm() :  this.renderUsers()}
            </Fragment>      
        )
    }
}


export default TodoItems