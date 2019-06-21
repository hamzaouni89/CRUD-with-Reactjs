import React from 'react';
import './AddItem.css'
const AddItem =(props) => {
        return (
            <div>
                <form onSubmit={props.addUser}>
                    <input type="text" placeholder="Enter firstname ..." name="firstname" onChange={props.updateUser}  value={props.firstname}/>
                    <input type="text" placeholder="Enter lastname ..." name="lastname" onChange={props.updateUser} value={props.lastname}/>
                    <input type="submit" value="Add" />
                </form>

            </div>
        );
}

export default AddItem;