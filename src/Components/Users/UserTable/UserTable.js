import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../Redux/IsLoading";
import { Modal, Spinner } from "react-bootstrap";
import "./UserTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
	UilCheckCircle,
	UilTimesCircle,
	UilPlusCircle,
} from "@iconscout/react-unicons";
import Adduser from "../../Adduser/Adduser";

export default function UserTable() {
	const [users, setUsers] = useState([]);
	const [heightLoading, setHeightLoading] = useState(true);
	const [show, setShow] = React.useState(false);
	const { loading } = useSelector((state) => state.loading);

	const dispatch = useDispatch();
	const callforData = () => {
		dispatch(setLoading(true));
		axios
			.get("https://calm-beyond-84616.herokuapp.com/Users")
			.then((res) => {
				console.log(res.data);
				setUsers(res.data);
				dispatch(setLoading(false));
				dynamicHeight();
			})
			.catch((err) => console.log(err));
	};
	const handleStatus = (id, status) => {
		axios
			.put(`https://calm-beyond-84616.herokuapp.com/Users/${id}`, {
				isAdmin: !status,
			})
			.then((res) => callforData())
			.catch((err) => console.log(err));
	};
	const getInnerHeight = (elm) => {
		var computed = getComputedStyle(elm),
			padding =
				parseInt(computed.paddingTop) +
				parseInt(computed.paddingBottom);

		return elm.clientHeight - padding;
	};
	const ListItemHeight = () => {
		const parent = document.querySelector(".listWrapper");
		const parentHeight = getInnerHeight(parent);
		const header = document.querySelector(".listWrapper .tableHead");
		const target = document.querySelector(".listWrapper .listItems");
		target.style.height = parentHeight - header.clientHeight + "px";
		setHeightLoading(false);
	};
	const ListWrapperHeight = () => {
		const parent = document.querySelector(".users");
		const parentHeight = getInnerHeight(parent);
		const header = document.querySelector(".users .secHeader");
		const target = document.querySelector(".listWrapper");
		target.style.height = parentHeight - header.clientHeight + "px";
		ListItemHeight();
	};
	const dynamicHeight = () => {
		const parent = document.querySelector("body");
		const hearder = document.querySelector(".Users .header");
		const computedHeight = parent.clientHeight - hearder.clientHeight;
		const target = document.querySelector(".Users .users");
		target.style.height = computedHeight + "px";
		ListWrapperHeight();
	};
	useEffect(() => {
		callforData();
	}, []);
	if (loading) {
		return (
			<div className='w-100 h-50  d-flex align-items-center justify-content-center'>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Loading...</span>
				</Spinner>
			</div>
		);
	}
	const callback = () => {
		setShow(false);
		callforData();
	};
	const ActivityModalShow = () => {
		setShow(true);
	};

	return (
		<div className='users '>
			<Adduser show={show} Callbacks={callback} />
			<div className='secHeader mb-3'>
				<div className='secTitle d-flex align-item-center justify-content-between'>
					<span>Users</span>
					<div
						className='d-inline-block ms-3'
						style={{ cursor: "pointer" }}
						onClick={ActivityModalShow}>
						<UilPlusCircle size='25' color='green' />
					</div>
				</div>
				<div className='filter '>
					<span className='me-3'>View All</span>
					<span>
						<span className='me-3'>Sort by</span>
						<FontAwesomeIcon icon={faAngleDown} />
					</span>
				</div>
			</div>

			<div className='listWrapper '>
				<div className='d-flex tableHead pb-2'>
					<div className='col-4 d-flex align-items-center '>
						Email
					</div>
					<div className='col-4 d-flex align-items-center justify-content-center'>
						Name
					</div>
					<div className='col-4 d-flex align-items-center justify-content-center'>
						Admin
					</div>
					{/* <div className='col-3 d-flex align-items-center justify-content-center'>
						Actions
					</div> */}
				</div>
				<div className='listItems'>
					{!heightLoading &&
						users.map((item, ind) => {
							return (
								<div className='d-flex flex-wrap tableItems'>
									<div className='col-4 d-flex align-items-center '>
										<span>{item.data.email}</span>
									</div>
									<div className='col-4 foldername d-flex align-items-center justify-content-center'>
										{item.data.name}
									</div>

									<div className='col-4 lastview d-flex align-items-center justify-content-center'>
										{item.data.isAdmin ? (
											<UilCheckCircle
												onClick={() =>
													handleStatus(
														item.docId,
														item.data.isAdmin
													)
												}
												size='20'
												color='green'
											/>
										) : (
											<UilTimesCircle
												onClick={() =>
													handleStatus(
														item.docId,
														item.data.isAdmin
													)
												}
												size='20'
												color='red'
											/>
										)}
									</div>
									{/* <div className='col-3   d-flex align-items-center justify-content-center'>
										{item.data.isAdmin ? (
											<span
												onClick={() =>
													handleStatus(
														item.docId,
														item.data.isAdmin
													)
												}
												className='btn btn-danger'>
												Delete Admin
											</span>
										) : (
											<span
												onClick={() =>
													handleStatus(
														item.docId,
														item.data.isAdmin
													)
												}
												className='btn btn-success'>
												Make admin
											</span>
										)}
									</div> */}
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}
