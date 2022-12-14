import { useEffect, useRef, useState } from "react";

import "../../App.css";

export default function SwipebleViewTile({ isRoom, isTeachers, subjects }) {
    const tileRef = useRef(null);

    const [currentSlide, setCurrentSlide] = useState(0);

//     let childs = null;
//     let rect = null;
//     let timer = null;
// //     const [isScrolled, setIsScrolled] = useState(false);
// const isScrolled = useRef(false)

//     const scrollHandler2 = () => {
      
//         const scrollLeft = tileRef.current.scrollLeft;
//         console.log(scrollLeft)
//         //if (childs?.length > 1) {
//         let pos = scrollLeft / rect.width;
//         console.log(scrollLeft)
//         setCurrentSlide(pos);
//         tileRef.current.scrollLeft = scrollLeft;
//         //}
//     };

//     const scrollHandler = () => {
//         if (timer !== null) {
//             clearTimeout(timer);
//         }
//         timer = setTimeout(function () {
//             // do something
//             // setIsScrolled(true)
//             isScrolled.current = true
//         }, 550);
//     };

//     useEffect(() => {
//       childs = tileRef.current.children;
//         rect = tileRef.current.getBoundingClientRect();
//       const scrollLeft = tileRef.current.scrollLeft;
//         //if (childs?.length > 1) {
//         let pos = tileRef.current.scrollLeft / tileRef.current.getBoundingClientRect().width;
//         setCurrentSlide(pos)
//         console.log(scrollLeft)
//         setIsScrolled(false)
//     }, [isScrolled])

//     useEffect(() => {
//         childs = tileRef.current.children;
//         rect = tileRef.current.getBoundingClientRect();
//         //   document.addEventListener("touchstart", handleTouchStart, false);
//         //   document.addEventListener("touchmove", handleTouchMove, false);
//         //   document.addEventListener(
//         //       "scroll",
//         //       function (e) {
//         //             if (isContainerScrolling)
//         //                   e.preventDefault();
//         //           console.log("document scrolling");
//         //       },
//         //       false
//         //   );
//     });

    return (
        <>
            <div
                className={
                    "subject-tile-container" +
                    (subjects?.length > 1 ? " scrollable" : "")
                }
                key={
                    new Date() +
                    (subjects &&
                        subjects[0]["????????????????????????"] + subjects[0]["????????????"])
                }
            //     ref={tileRef}
                // onScroll={scrollHandler}
            //     onScroll={scrollHandler}
            >
                {subjects?.map((subject) => (
                    <SubjectTile isTeachers={isTeachers} isRoom={isRoom} subject={subject} />
                ))}
            </div>
            <DotIndicator currentSlide={currentSlide} subjects={subjects} />
        </>
    );
}

function DotIndicator({ currentSlide, subjects }) {
//     useEffect(() => {
//         console.log(Math.round(currentSlide, 1));
//     }, []);
    return (
        <div className="dot-indicator">
            {subjects?.length > 1 &&
                subjects.map((subject, index) => (
                    <div
                        className={
                            "" +
                            (Math.round(currentSlide, 1) === index
                                ? "current"
                                : "")
                        }
                    />
                ))}
        </div>
    );
}

function SubjectTile({ isRoom, isTeachers, subject }) {
    const types = [
        { name: "?????????????? ??????????????", color: "#fff" },
        { name: "??????", color: "#E4E9FF" },
        { name: "??????", color: "#DBFFE7" },
        { name: "????.", color: "#FFE2E7" },
        { name: "????", color: "#FFF8E1" },
        { name: "??????", color: "#AADAFF" },
        { name: "??????", color: "#F2BAA6" },
        { name: "??????", color: "#F2BAA6" },
    ];

    const getStyle = (name) => {
        for (let i = 0; i < types.length; i++)
            if (name.split(" ")[0].includes(types[i].name))
                return types[i].color;
        return "";
    };

    return (
        <div className="subject-tile" key={subject["??????"]}>
            <div
                className="subject-tile-left"
                style={{
                    background: getStyle(subject["????????????????????"]),
                }}
            >
                <h1>{subject["????????????????????????"]}</h1>
                <h4 className="time-h">
                    ?? <span className="time-span">{subject["????????????"]}</span>
                </h4>
                <h4 className="time-h">
                    ???? <span className="time-span">{subject["??????????"]}</span>
                </h4>
            </div>

            <div className="subject-tile-right">
                <h3>{subject["????????????????????"]}</h3>
                {isRoom || isTeachers && <p>???????????? {subject["????????????"]}</p>}
                <p>?????????????????? {subject["??????????????????"]}</p>
                <p>{subject["??????????????????????????"]}</p>
            </div>
        </div>
    );
}

// let timer = null;
//     let isContainerScrolling = false;

//     let xDown = null;
//     let yDown = null;

//     const getTouches = (evt) => {
//         return (
//             evt.touches || // browser API
//             evt.originalEvent.touches
//         ); // jQuery
//     };

//     const handleTouchStart = (evt) => {
//         const firstTouch = getTouches(evt)[0];
//         xDown = firstTouch.clientX;
//         yDown = firstTouch.clientY;

//         const rect = tileRef.current.getBoundingClientRect();
//         if (
//             !(
//                 xDown >= rect.left &&
//                 xDown <= rect.right &&
//                 yDown <= rect.bottom &&
//                 yDown >= rect.top
//             )
//         ) {
//             /* reset values */
//             xDown = null;
//             yDown = null;
//         }
//     };

//     const handleTouchMove = (evt) => {
//         if (!xDown || !yDown) {
//             return;
//         }

//         let xUp = evt.touches[0].clientX;
//         let yUp = evt.touches[0].clientY;

//         let xDiff = xDown - xUp;
//         let yDiff = yDown - yUp;

//         const rect = tileRef.current.getBoundingClientRect();

//         console.log(xDiff, yDiff);

//         if (Math.abs(xDiff) > Math.abs(yDiff)) {
//             /*most significant*/
//             if (xDiff > 0) {
//                 /* right swipe */
//                 console.log("RIGHT");
//                 //tileRef.current.style.transform = 'translateX(' + rect.width +'px)'
//                 // tileRef.current.scrollLeft = rect.width
//             } else {
//                 /* left swipe */
//             }
//         } else {
//             if (yDiff > 0) {
//                 /* down swipe */
//             } else {
//                 /* up swipe */
//             }
//         }
//         /* reset values */
//         xDown = null;
//         yDown = null;
//     };

//     const scrollHandler = () => {
//         //   const rect = tileRef.current.getBoundingClientRect();
//         //   console.log(tileRef.current.scrollLeft);
//         //   if (tileRef.current.scrollLeft > rect.width / 2) {
//         //       tileRef.current.style.left = rect.width;
//         //   }
//         console.log("tile scrolling");
//         isContainerScrolling = true;
//         if (timer !== null) {
//             clearTimeout(timer);
//         }
//         timer = setTimeout(function () {
//             // do something
//             console.log("tile stop scrolling");
//             isContainerScrolling = false;
//         }, 150);
//     };
