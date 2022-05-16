import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import NewActivity from "./NewActivity/NewActivity";

export default function ActivityMapperModal(props) {
	const [users, setUsers] = React.useState([]);
	const getUsers = () => {
		axios
			.get("https://calm-beyond-84616.herokuapp.com/Users")
			.then((res) => setUsers(res.data))
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getUsers();
	}, []);
	return (
		<div>
			<Modal
				show={props.show}
				fullscreen={true}
				onHide={() => props.Callbacks()}>
				<Modal.Header closeButton>
					<Modal.Title>Modal</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<NewActivity data={users} />
				</Modal.Body>
			</Modal>
		</div>
	);
}
