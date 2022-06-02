import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import ReactSignatureCanvas from "react-signature-canvas";
import TitleBar from "../Dashboard/TitleBar/TitleBar";
import { UilAngleLeftB } from "@iconscout/react-unicons";

import "./Pdfview.css";
import { useHistory } from "react-router-dom";
import { Container } from "react-bootstrap";
function Pdfview() {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [sign, setSign] = useState(false);
	const [canvasWidth, setCanvasWidth] = useState(null);
	const [canvasHeight, setCanvasHeight] = useState(null);
	const [baseUrl, setBaseUrl] = useState("");
	const [refer, setRefer] = useState([]);
	let refs = [];
	const history = useHistory();
	const handlePdfviewerHeight = () => {
		const whole = document.querySelector(".Pdfview");
		const head = document.querySelector(".header");
		const viewer = document.querySelector(".wrapperCanvas");
		viewer.style.height = whole.offsetHeight - head.offsetHeight + "px";
	};
	React.useEffect(() => {
		handlePdfviewerHeight();
	}, []);
	const handleHistoryBack = () => {
		history.goBack();
	};
	function onDocumentLoadSuccess({ numPages }) {
		// alert("asfd");
		setNumPages(numPages);
		setPageNumber(1);
		setTimeout(() => {
			const canvas = document.querySelector(".react-pdf__Page__canvas");
			const signature = document.querySelector(".sigCanvas");
			// console.log(signature);
			setCanvasWidth(canvas.width);
			setCanvasHeight(canvas.height);
		}, 1000);
	}

	function changePage(offSet) {
		setPageNumber((prevPageNumber) => prevPageNumber + offSet);
	}

	function changePageBack() {
		changePage(-1);
	}

	function changePageNext() {
		changePage(+1);
	}
	let bbox_rect;
	let painting = false;

	const handleSign = () => {
		const status = !sign;
		console.log(refer, status);
		const signature = document.querySelectorAll(".sigCanvas");
		refs.forEach((item, ind) => {
			if (!status) item.off();
			else item.on();
		});
		setSign(status);
		// if (!status) {
		// 	signature.forEach((item, ind) => {
		// 		const context = item.getContext("2d");

		// 		context.clearRect(0, 0, item.width, item.height);
		// 	});
		// }
	};
	function encodeImageFileAsURL(element) {
		var file = element.target.files[0];
		var reader = new FileReader();
		reader.onloadend = function () {
			console.log("RESULT", reader.result);
			localStorage.setItem("baseUrl", reader.result);
			setBaseUrl(reader.result);
			// let text = reader.readAsText(file);
			// let url = reader.readAsDataURL(file);
			// console.log(text, url);
		};
		reader.readAsDataURL(file);
	}
	var active = false;
	var currentX;
	var currentY;
	var initialX;
	var initialY;
	var xOffset = 0;
	var yOffset = 0;
	var dragItem;
	const handleSignatureDrop = (e) => {
		e.preventDefault();
		console.log(e);
		const image = document.createElement("img");
		image.src = e.dataTransfer.getData("base64String");
		image.draggable = false;
		image.id = "signImg";
		image.style.width = "40px";
		image.style.height = "40px";
		image.style.position = "absolute";
		e.currentTarget.append(image);
		dragItem = image;
		const Container = document.querySelector(".wrapperCanvas");

		Container.addEventListener("touchstart", dragStart, false);
		Container.addEventListener("touchend", dragEnd, false);
		Container.addEventListener("touchmove", drag, false);

		Container.addEventListener("mousedown", dragStart, false);
		Container.addEventListener("mouseup", dragEnd, false);
		Container.addEventListener("mousemove", drag, false);
	};

	function allowDrop(ev) {
		ev.preventDefault();
	}
	function dragging(ev) {
		ev.dataTransfer.setData("base64String", ev.target.getAttribute("src"));
	}

	function dragStart(e) {
		if (e.type === "touchstart") {
			initialX = e.touches[0].clientX - xOffset;
			initialY = e.touches[0].clientY - yOffset;
		} else {
			initialX = e.clientX - xOffset;
			initialY = e.clientY - yOffset;
		}

		if (e.target === dragItem) {
			active = true;
		}
	}

	function dragEnd(e) {
		initialX = currentX;
		initialY = currentY;

		active = false;
	}

	function drag(e) {
		if (active) {
			e.preventDefault();

			if (e.type === "touchmove") {
				currentX = e.touches[0].clientX - initialX;
				currentY = e.touches[0].clientY - initialY;
			} else {
				currentX = e.clientX - initialX;
				currentY = e.clientY - initialY;
			}

			xOffset = currentX;
			yOffset = currentY;

			setTranslate(currentX, currentY, dragItem);
		}
	}

	function setTranslate(xPos, yPos, el) {
		el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
	}
	return (
		<div className='Pdfview vh-100'>
			<div className='header'>
				<div className='d-flex'>
					<span
						className=''
						onClick={handleHistoryBack}
						style={{ cursor: "pointer" }}>
						<UilAngleLeftB size='30' />
					</span>
					<TitleBar title={"PDF View"} />
				</div>
				<div className='userProfile'>
					<img
						onDragStart={dragging}
						draggable={true}
						style={{ width: "30px" }}
						src={baseUrl}
						alt=''
						srcset=''
					/>
					<input
						type='file'
						onChange={(e) => encodeImageFileAsURL(e)}
					/>
					<span className='btn btn-info me-3' onClick={handleSign}>
						{sign ? "Normal" : "Sign"}
					</span>
					{/* <img
						src='/assets/images/user.JPG'
						alt=''
						className='userImage img-fluid me-3'
					/>
					<FontAwesomeIcon icon={faAngleDown} /> */}
				</div>
			</div>
			{/* <header className='Pdfview-header'>
				<Document
					file='/assets/Resume.pdf'
					onLoadSuccess={onDocumentLoadSuccess}>
					<Page height='600' pageNumber={pageNumber} />
				</Document>
				<p>
					{" "}
					Page {pageNumber} of {numPages}
				</p>
				{pageNumber > 1 && (
					<button onClick={changePageBack}>Previous Page</button>
				)}
				{pageNumber < numPages && (
					<button onClick={changePageNext}>Next Page</button>
				)}
			</header> */}

			<div
				onDragOver={allowDrop}
				onDrop={(e) => handleSignatureDrop(e)}
				className=' wrapperCanvas py-3 d-flex justify-content-center'
				style={{ overflowY: "scroll", background: "#dbd8d0" }}>
				<Document
					file='/assets/Resume.pdf'
					onLoadSuccess={onDocumentLoadSuccess}>
					{Array.from(new Array(numPages), (el, index) => (
						<div className=''>
							<Page
								size='A4'
								className='position-relative pdfmbl'
								key={`page_${index + 1}`}
								pageNumber={index + 1}>
								<ReactSignatureCanvas
									ref={(ref) => {
										if (ref != null) {
											refs.push(ref);
										}
									}}
									penColor='black'
									canvasProps={{
										width:
											canvasWidth != null
												? canvasWidth
												: 100,
										height:
											canvasHeight != null
												? canvasHeight
												: 100,
										className: `sigCanvas position-absolute `,
									}}
								/>
							</Page>
						</div>
					))}
				</Document>
			</div>
		</div>
	);
}

export default Pdfview;
